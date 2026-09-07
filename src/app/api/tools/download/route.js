import { execFile } from "child_process";
import path from "path";
import fs from "fs";
import { Readable } from "stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getFfmpegPath() {
  const binaryName = process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg";
  const directPath = path.join(process.cwd(), "node_modules", "ffmpeg-static", binaryName);
  if (fs.existsSync(directPath)) {
    return directPath;
  }
  return "ffmpeg";
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
      /(?:facebook\.com|fb\.watch|fb\.gg|fb\.me)/i.test(targetMediaUrl);

    const cleanTitle =
      rawTitle
        .replace(/[^a-zA-Z0-9_\-\s]/g, "")
        .trim()
        .replace(/\s+/g, "_") || (isFacebook ? "facebook_video" : "video");

    const isAudio = quality === "audio";
    const ext = isAudio ? "mp3" : "mp4";
    const contentType = isAudio ? "audio/mpeg" : "video/mp4";
    const filename = `${cleanTitle}.${ext}`;

    // Dedicated workspace temp directory
    const tempDir = path.join(process.cwd(), ".temp_downloads");
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
      // High quality 320k MP3 audio extraction
      args = [
        "-m",
        "yt_dlp",
        "--ffmpeg-location",
        resolvedFfmpeg,
        "--js-runtimes",
        "node",
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
      // Facebook Video with guaranteed universal AAC audio
      let formatFilter = "bestvideo+bestaudio/best";
      if (quality === "1080p" || quality === "hd") {
        formatFilter = "bestvideo[height<=1080]+bestaudio/best[height<=1080]/bestvideo+bestaudio/best";
      } else if (quality === "720p") {
        formatFilter = "bestvideo[height<=720]+bestaudio/best[height<=720]/bestvideo+bestaudio/best";
      } else if (quality === "480p" || quality === "sd") {
        formatFilter = "bestvideo[height<=480]+bestaudio/best[height<=480]/best";
      } else if (quality === "360p") {
        formatFilter = "bestvideo[height<=360]+bestaudio/best[height<=360]/best";
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
      // YouTube Video with AVC/MP4 priority & universal AAC muxing
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
      } else if (quality === "360p") {
        formatFilter =
          "bestvideo[height<=360][vcodec^=avc]+bestaudio[acodec^=mp4a]/bestvideo[height<=360][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=360]+bestaudio/best";
      }

      args = [
        "-m",
        "yt_dlp",
        "--ffmpeg-location",
        resolvedFfmpeg,
        "--js-runtimes",
        "node",
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

    // Execute yt-dlp to download and mux audio + video together
    await runYtDlp(args);

    if (!fs.existsSync(tempFilePath)) {
      throw new Error("Muxed media file was not found on server.");
    }

    const stat = fs.statSync(tempFilePath);
    const nodeStream = fs.createReadStream(tempFilePath);

    const cleanup = () => {
      try {
        if (tempFilePath && fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      } catch (e) {}
      try {
        if (tempFilePath) {
          const dir = path.dirname(tempFilePath);
          const base = path.basename(tempFilePath, path.extname(tempFilePath));
          if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir).filter((f) => f.startsWith(base));
            for (const f of files) {
              try {
                fs.unlinkSync(path.join(dir, f));
              } catch (_) {}
            }
          }
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
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
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
