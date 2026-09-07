import { execFile } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";
import { Readable } from "stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function getFfmpegPath() {
  const binaryName = process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg";
  const directPath = path.join(process.cwd(), "node_modules", "ffmpeg-static", binaryName);
  if (fs.existsSync(directPath)) {
    return directPath;
  }
  return "ffmpeg";
}

function checkPythonAvailable() {
  return new Promise((resolve) => {
    execFile("python", ["--version"], { timeout: 3000 }, (err) => {
      resolve(!err);
    });
  });
}

function runYtDlp(args) {
  return new Promise((resolve, reject) => {
    execFile(
      "python",
      args,
      { maxBuffer: 50 * 1024 * 1024, timeout: 300000 },
      (error, stdout, stderr) => {
        if (error) {
          console.error("yt-dlp error:", stderr || error.message);
          return reject(new Error(stderr || error.message));
        }
        resolve(stdout);
      }
    );
  });
}

// Pure Node.js direct Facebook stream extractor (works 100% on Vercel Serverless)
async function extractDirectFacebookCdn(targetUrl) {
  const candidates = [targetUrl];

  const reelMatch = targetUrl.match(/(?:reel\/|videos\/|\?v=)(\d+)/i);
  if (reelMatch && reelMatch[1]) {
    const videoId = reelMatch[1];
    candidates.push(`https://www.facebook.com/watch/?v=${videoId}`);
    candidates.push(`https://mbasic.facebook.com/watch/?v=${videoId}`);
  }

  for (const candidate of candidates) {
    try {
      const res = await fetch(candidate, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
      if (!res.ok) continue;
      const text = await res.text();
      const cleanText = text.replace(/\\\//g, "/").replace(/\\u0026/g, "&");

      const hdMatch =
        cleanText.match(/playable_url_quality_hd["']?\s*:\s*["']([^"']+)["']/i) ||
        cleanText.match(/browser_native_hd_url["']?\s*:\s*["']([^"']+)["']/i) ||
        cleanText.match(/hd_src_no_ratelimit["']?\s*:\s*["']([^"']+)["']/i) ||
        cleanText.match(/hd_src["']?\s*:\s*["']([^"']+)["']/i);

      const sdMatch =
        cleanText.match(/playable_url["']?\s*:\s*["']([^"']+)["']/i) ||
        cleanText.match(/browser_native_sd_url["']?\s*:\s*["']([^"']+)["']/i) ||
        cleanText.match(/sd_src_no_ratelimit["']?\s*:\s*["']([^"']+)["']/i) ||
        cleanText.match(/sd_src["']?\s*:\s*["']([^"']+)["']/i) ||
        cleanText.match(/<meta[^>]*property=["']og:video:secure_url["'][^>]*content=["']([^"']+)["']/i) ||
        cleanText.match(/<meta[^>]*property=["']og:video["'][^>]*content=["']([^"']+)["']/i);

      let hd = hdMatch ? hdMatch[1] : null;
      let sd = sdMatch ? sdMatch[1] : null;

      if (!hd && !sd) {
        const mp4Matches = cleanText.match(/https:\/\/[^"'<>\s]*fbcdn\.net\/[^"'<>\s]+\.mp4[^"'<>\s]*/gi) || [];
        for (const m of mp4Matches) {
          if (m.includes("tag=hd") || m.includes("1280.hd")) {
            hd = hd || m;
          } else {
            sd = sd || m;
          }
        }
      }

      if (hd || sd) {
        return { hd, sd };
      }
    } catch (e) {
      continue;
    }
  }

  return null;
}

function extractYoutubeId(url) {
  if (!url) return null;
  const clean = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;
  const match = clean.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i
  );
  return match ? match[1] : null;
}

// Pure Node.js direct YouTube stream resolver (100% Serverless / Vercel Friendly)
async function resolveYouTubeDirectStream(videoId, quality = "720p") {
  const targetUrl = `https://www.youtube.com/watch?v=${videoId}`;
  let formatCode = "720";
  if (quality === "1080p" || quality === "1080") formatCode = "1080";
  else if (quality === "480p" || quality === "480") formatCode = "480";
  else if (quality === "360p" || quality === "360") formatCode = "360";
  else if (quality === "audio" || quality === "mp3") formatCode = "mp3";

  const initUrl = `https://loader.to/ajax/download.php?button=1&start=1&end=1&format=${formatCode}&url=${encodeURIComponent(targetUrl)}`;
  try {
    const initRes = await fetch(initUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      signal: AbortSignal.timeout(10000),
    });
    if (!initRes.ok) return null;
    const init = await initRes.json();
    if (init.download_url) return init.download_url;
    if (!init.progress_url) return null;

    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      try {
        const progRes = await fetch(init.progress_url, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
          signal: AbortSignal.timeout(5000),
        });
        if (progRes.ok) {
          const prog = await progRes.json();
          if (prog.success === 1 && prog.download_url) {
            return prog.download_url;
          }
        }
      } catch (e) {}
    }
  } catch (err) {
    console.warn("YouTube stream resolution error:", err.message);
  }
  return null;
}

export async function GET(req) {
  let tempFilePath = null;

  try {
    const { searchParams } = new URL(req.url);
    const urlParam = searchParams.get("url");
    const videoId = searchParams.get("id");
    const quality = searchParams.get("quality") || "720p";
    const rawTitle = searchParams.get("title") || "video";
    const platformParam = searchParams.get("platform") || "";

    if (!urlParam && !videoId) {
      return new Response("Missing video URL or ID parameter.", { status: 400 });
    }

    // Determine target media URL
    let targetMediaUrl = "";
    if (urlParam) {
      targetMediaUrl = urlParam.trim();
    } else if (videoId) {
      targetMediaUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }

    const isFacebook =
      platformParam === "facebook" ||
      /(?:facebook\.com|fb\.watch|fb\.gg|fb\.me|fbcdn\.net)/i.test(targetMediaUrl);

    const cleanTitle =
      rawTitle
        .replace(/[^a-zA-Z0-9_\-\s]/g, "")
        .trim()
        .replace(/\s+/g, "_") || (isFacebook ? "facebook_video" : "video");

    const isAudio = quality === "audio";
    const ext = isAudio ? "mp3" : "mp4";
    const contentType = isAudio ? "audio/mpeg" : "video/mp4";
    const filename = `${cleanTitle}.${ext}`;

    // ── CASE 1: DIRECT STREAMING FOR FACEBOOK & YOUTUBE (100% Serverless / Vercel Friendly) ──
    const isDirectCdn =
      targetMediaUrl.includes("fbcdn.net") ||
      targetMediaUrl.includes("googlevideo.com") ||
      /\.(mp4|m4a|mp3)(\?|$)/i.test(targetMediaUrl);

    let streamUrlToFetch = isDirectCdn ? targetMediaUrl : null;

    if (!streamUrlToFetch && isFacebook) {
      // Resolve direct CDN stream from Facebook page
      const streams = await extractDirectFacebookCdn(targetMediaUrl);
      if (streams) {
        streamUrlToFetch = (quality === "1080p" || quality === "hd") ? (streams.hd || streams.sd) : (streams.sd || streams.hd);
      }
    } else if (!streamUrlToFetch && !isFacebook) {
      // Resolve direct stream from YouTube video
      const ytId = videoId || extractYoutubeId(targetMediaUrl);
      if (ytId) {
        streamUrlToFetch = await resolveYouTubeDirectStream(ytId, quality);
      }
    }

    if (streamUrlToFetch) {
      try {
        const cdnRes = await fetch(streamUrlToFetch, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "*/*",
          },
        });

        if (cdnRes.ok && cdnRes.body) {
          const headers = new Headers();
          headers.set("Content-Type", cdnRes.headers.get("content-type") || contentType);
          if (cdnRes.headers.get("content-length")) {
            headers.set("Content-Length", cdnRes.headers.get("content-length"));
          }
          headers.set("Content-Disposition", `attachment; filename="${filename}"`);
          headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
          headers.set("Access-Control-Allow-Origin", "*");
          headers.set("Access-Control-Expose-Headers", "Content-Length, Content-Disposition, Content-Type");

          return new Response(cdnRes.body, {
            status: 200,
            headers,
          });
        }
      } catch (streamErr) {
        console.warn("Direct CDN stream error, falling back:", streamErr.message);
      }
    }

    // ── CASE 2: LOCAL ENVIRONMENT / VPS WITH PYTHON + FFMPEG ──
    const hasPython = await checkPythonAvailable();

    if (hasPython) {
      // Always use os.tmpdir() to guarantee write permissions on any OS (including /tmp on Linux/Vercel)
      const tempDir = path.join(os.tmpdir(), "my_app_downloads");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const prefix = isFacebook ? "fb" : "yt";
      tempFilePath = path.join(
        tempDir,
        `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`
      );

      const resolvedFfmpeg = getFfmpegPath();
      let args = [];

      if (isAudio) {
        args = [
          "-m",
          "yt_dlp",
          "--ffmpeg-location",
          resolvedFfmpeg,
          "-x",
          "--audio-format",
          "mp3",
          "--audio-quality",
          "0",
          "--no-playlist",
          "-o",
          tempFilePath,
          targetMediaUrl,
        ];
      } else if (isFacebook) {
        let formatFilter = "bestvideo+bestaudio/best";
        if (quality === "1080p" || quality === "hd") {
          formatFilter = "bestvideo[height<=1080]+bestaudio/best[height<=1080]/bestvideo+bestaudio/best";
        } else if (quality === "720p") {
          formatFilter = "bestvideo[height<=720]+bestaudio/best[height<=720]/bestvideo+bestaudio/best";
        } else if (quality === "480p" || quality === "sd") {
          formatFilter = "bestvideo[height<=480]+bestaudio/best[height<=480]/best";
        }

        args = [
          "-m",
          "yt_dlp",
          "--ffmpeg-location",
          resolvedFfmpeg,
          "-f",
          formatFilter,
          "--merge-output-format",
          "mp4",
          "--postprocessor-args",
          "ffmpeg:-c:v copy -c:a aac -b:a 192k",
          "--no-playlist",
          "-o",
          tempFilePath,
          targetMediaUrl,
        ];
      } else {
        let formatFilter =
          "bestvideo[height<=720][vcodec^=avc]+bestaudio[acodec^=mp4a]/bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=720]+bestaudio/best";

        if (quality === "1080p") {
          formatFilter =
            "bestvideo[height<=1080][vcodec^=avc]+bestaudio[acodec^=mp4a]/bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=1080]+bestaudio/best";
        } else if (quality === "720p") {
          formatFilter =
            "bestvideo[height<=720][vcodec^=avc]+bestaudio[acodec^=mp4a]/bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=720]+bestaudio/best";
        } else if (quality === "480p") {
          formatFilter =
            "bestvideo[height<=480][vcodec^=avc]+bestaudio[acodec^=mp4a]/bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=480]+bestaudio/best";
        }

        args = [
          "-m",
          "yt_dlp",
          "--ffmpeg-location",
          resolvedFfmpeg,
          "-f",
          formatFilter,
          "--merge-output-format",
          "mp4",
          "--postprocessor-args",
          "ffmpeg:-c:v copy -c:a aac -b:a 192k",
          "--no-playlist",
          "-o",
          tempFilePath,
          targetMediaUrl,
        ];
      }

      await runYtDlp(args);

      if (fs.existsSync(tempFilePath)) {
        const stat = fs.statSync(tempFilePath);
        const nodeStream = fs.createReadStream(tempFilePath);

        const cleanup = () => {
          try {
            if (tempFilePath && fs.existsSync(tempFilePath)) {
              fs.unlinkSync(tempFilePath);
            }
          } catch (e) {}
        };

        nodeStream.on("close", cleanup);
        nodeStream.on("error", cleanup);

        const webStream = Readable.toWeb(nodeStream);

        return new Response(webStream, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Content-Length": stat.size.toString(),
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Expose-Headers": "Content-Length, Content-Disposition, Content-Type",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
          },
        });
      }
    }

    // ── CASE 3: ERROR HANDLING WHEN STREAM CANNOT BE LOADED ──
    return new Response(
      "Direct video stream could not be loaded. Please ensure the video is public and accessible.",
      { status: 400 }
    );
  } catch (error) {
    console.error("Native download stream error:", error);
    try {
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    } catch (e) {}

    return new Response(`Download error: ${error.message}`, { status: 500 });
  }
}

export async function HEAD(req) {
  return GET(req);
}
