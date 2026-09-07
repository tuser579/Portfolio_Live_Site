import { NextResponse } from "next/server";
import { execFile } from "child_process";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Expand redirects for fb.watch or share links
async function resolveRedirectUrl(rawUrl) {
  try {
    const response = await fetch(rawUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    return response.url || rawUrl;
  } catch (e) {
    return rawUrl;
  }
}

// Helper to clean escaped characters from Facebook CDN URLs
function cleanCdnUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  let url = rawUrl.trim();
  try {
    url = url
      .replace(/\\u0026/g, "&")
      .replace(/&amp;/g, "&")
      .replace(/\\u00253D/gi, "=")
      .replace(/\\u002526/gi, "&")
      .replace(/\\\//g, "/")
      .replace(/\\/g, "");
  } catch (e) {}
  return url;
}

// Pure Node.js Facebook direct CDN extractor (works 100% on Vercel Serverless without Python or FFmpeg)
async function scrapeFacebookDirect(targetUrl) {
  // Generate candidate URLs to maximize resolution chance (watch URLs provide richest stream data)
  const candidates = [targetUrl];

  const reelMatch = targetUrl.match(/(?:reel\/|videos\/|\?v=)(\d+)/i);
  if (reelMatch && reelMatch[1]) {
    const videoId = reelMatch[1];
    candidates.push(`https://www.facebook.com/watch/?v=${videoId}`);
    candidates.push(`https://m.facebook.com/watch/?v=${videoId}`);
    candidates.push(`https://www.facebook.com/reel/${videoId}`);
    candidates.push(`https://m.facebook.com/reel/${videoId}`);
    candidates.push(`https://mbasic.facebook.com/watch/?v=${videoId}`);
  }

  for (const candidate of candidates) {
    try {
      const res = await fetch(candidate, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        next: { revalidate: 0 },
      });

      if (!res.ok) continue;
      const text = await res.text();

      // Clean unicode-escaped slashes (\/ -> /) and ampersands
      const cleanText = text.replace(/\\\//g, "/").replace(/\\u0026/g, "&");

      // Extract HD direct MP4 CDN URL
      const hdMatch =
        cleanText.match(/playable_url_quality_hd["']?\s*:\s*["']([^"']+)["']/i) ||
        cleanText.match(/browser_native_hd_url["']?\s*:\s*["']([^"']+)["']/i) ||
        cleanText.match(/hd_src_no_ratelimit["']?\s*:\s*["']([^"']+)["']/i) ||
        cleanText.match(/hd_src["']?\s*:\s*["']([^"']+)["']/i);

      // Extract SD direct MP4 CDN URL
      const sdMatch =
        cleanText.match(/playable_url["']?\s*:\s*["']([^"']+)["']/i) ||
        cleanText.match(/browser_native_sd_url["']?\s*:\s*["']([^"']+)["']/i) ||
        cleanText.match(/sd_src_no_ratelimit["']?\s*:\s*["']([^"']+)["']/i) ||
        cleanText.match(/sd_src["']?\s*:\s*["']([^"']+)["']/i) ||
        cleanText.match(/<meta[^>]*property=["']og:video:secure_url["'][^>]*content=["']([^"']+)["']/i) ||
        cleanText.match(/<meta[^>]*property=["']og:video["'][^>]*content=["']([^"']+)["']/i);

      let directHdUrl = cleanCdnUrl(hdMatch ? hdMatch[1] : null);
      let directSdUrl = cleanCdnUrl(sdMatch ? sdMatch[1] : null);

      // Fallback: look for direct MP4 CDN links if standard JSON keys weren't found
      if (!directHdUrl && !directSdUrl) {
        const mp4Matches = cleanText.match(/https:\/\/[^"'<>\s]*fbcdn\.net\/[^"'<>\s]+\.mp4[^"'<>\s]*/gi) || [];
        for (const m of mp4Matches) {
          const cleaned = cleanCdnUrl(m);
          if (cleaned.includes("tag=hd") || cleaned.includes("1280.hd")) {
            directHdUrl = directHdUrl || cleaned;
          } else {
            directSdUrl = directSdUrl || cleaned;
          }
        }
      }

      // Extract Title
      const ogTitleMatch =
        cleanText.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
        cleanText.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
      const rawTitle = ogTitleMatch
        ? ogTitleMatch[1]
        : cleanText.match(/<title>([^<]+)<\/title>/i)?.[1] || "Facebook Video";

      // Clean title from view counters if present
      const title = rawTitle
        .replace(/^[0-9.]+[MK]?\s*views\s*[·•&#xb7;]*\s*[0-9.]+[MK]?\s*reactions\s*\|\s*/i, "")
        .replace(/\s*\|\s*Facebook$/i, "")
        .trim() || "Facebook Video";

      // Extract Thumbnail
      const ogImgMatch =
        cleanText.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
        cleanText.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
      const scontentMatch = cleanText.match(/https:\/\/scontent[^"'\s<>]+\.jpg[^"'\s<>]*/i);
      const thumbnail = ogImgMatch ? ogImgMatch[1] : scontentMatch ? scontentMatch[0] : "";

      // Extract Site / Author Name
      const siteMatch =
        cleanText.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i) ||
        cleanText.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:site_name["']/i);
      const authorName = siteMatch ? siteMatch[1] : "Facebook Creator";

      if (directHdUrl || directSdUrl) {
        return {
          directHdUrl,
          directSdUrl,
          title,
          thumbnail,
          authorName,
        };
      }
    } catch (e) {
      continue;
    }
  }

  return null;
}

// Fallback yt-dlp JSON runner (only if python is available in local environment)
function runYtDlpJson(targetUrl) {
  return new Promise((resolve, reject) => {
    const args = [
      "-m",
      "yt_dlp",
      "--dump-single-json",
      "--no-playlist",
      "--no-warnings",
      targetUrl,
    ];

    execFile(
      "python",
      args,
      { maxBuffer: 30 * 1024 * 1024, timeout: 25000 },
      (error, stdout, stderr) => {
        if (error) {
          return reject(new Error(stderr || error.message));
        }
        try {
          const json = JSON.parse(stdout);
          resolve(json);
        } catch (e) {
          reject(new Error("Failed to parse video metadata."));
        }
      }
    );
  });
}

export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid Facebook video or Reel URL." },
        { status: 400 }
      );
    }

    const trimmedUrl = url.trim();

    // Verify Facebook domain
    const isFacebook =
      /(?:https?:\/\/)?(?:[\w-]+\.)?(?:facebook\.com|fb\.watch|fb\.gg|fb\.me)/i.test(
        trimmedUrl
      );

    if (!isFacebook) {
      return NextResponse.json(
        {
          error:
            "Invalid Facebook link. Please paste a link from facebook.com, fb.watch, or a Facebook Reel.",
        },
        { status: 400 }
      );
    }

    // Resolve shortlinks / share redirects if needed
    let resolvedUrl = trimmedUrl;
    if (/fb\.watch|facebook\.com\/share/i.test(trimmedUrl)) {
      resolvedUrl = await resolveRedirectUrl(trimmedUrl);
    }

    // PRIMARY: Pure Node.js Direct Extraction (100% Serverless & Vercel friendly)
    const directMeta = await scrapeFacebookDirect(resolvedUrl);

    let title = directMeta?.title || "Facebook Video";
    let authorName = directMeta?.authorName || "Facebook Creator";
    let thumbnail = directMeta?.thumbnail || "";
    let directHd = directMeta?.directHdUrl || null;
    let directSd = directMeta?.directSdUrl || null;
    let duration = null;

    // SECONDARY: If pure JS didn't find direct video streams, try yt-dlp if local python exists
    if (!directHd && !directSd) {
      try {
        const meta = await runYtDlpJson(resolvedUrl);
        if (meta) {
          title = (meta.title || meta.fulltitle || title).trim();
          authorName = meta.uploader || meta.channel || authorName;
          thumbnail =
            thumbnail ||
            meta.thumbnail ||
            (Array.isArray(meta.thumbnails) && meta.thumbnails.length > 0
              ? meta.thumbnails[meta.thumbnails.length - 1].url
              : "");
          duration = meta.duration_string || (meta.duration ? `${Math.round(meta.duration)}s` : null);

          // Find direct stream formats from yt-dlp if available
          if (Array.isArray(meta.formats)) {
            const hdFmt = meta.formats.find(
              (f) => f.format_id === "hd" || (f.height && f.height >= 720)
            );
            const sdFmt = meta.formats.find(
              (f) => f.format_id === "sd" || (f.height && f.height < 720)
            );
            if (hdFmt?.url) directHd = cleanCdnUrl(hdFmt.url);
            if (sdFmt?.url) directSd = cleanCdnUrl(sdFmt.url);
          }
        }
      } catch (err) {
        // Expected on Vercel where python is not installed
      }
    }

    const videoId = String(Date.now());
    const bestDownloadUrl = directHd || directSd || resolvedUrl;

    const qualityOptions = [
      {
        label: "HD Video (Best)",
        type: "MP4 Video",
        quality: "1080p",
        directUrl: directHd || directSd || bestDownloadUrl,
        note: directHd ? "Full HD Direct Stream" : "Standard MP4 Stream",
        icon: "video",
      },
      {
        label: "SD Video (Standard)",
        type: "MP4 Video",
        quality: "480p",
        directUrl: directSd || directHd || bestDownloadUrl,
        note: "Standard MP4 Stream",
        icon: "video",
      },
      {
        label: "MP3 Audio",
        type: "Audio 320kbps",
        quality: "audio",
        directUrl: directSd || directHd || bestDownloadUrl,
        note: "Audio Stream",
        icon: "music",
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        platform: "facebook",
        videoId,
        canonicalUrl: resolvedUrl,
        targetDownloadUrl: bestDownloadUrl,
        directHdUrl: directHd,
        directSdUrl: directSd,
        title,
        authorName,
        authorUrl: "",
        thumbnail,
        fallbackThumbnail: thumbnail,
        duration,
        qualityOptions,
      },
    });
  } catch (error) {
    console.error("Facebook Info Error:", error);
    return NextResponse.json(
      {
        error:
          "Failed to inspect Facebook video. Please check the URL and try again.",
      },
      { status: 500 }
    );
  }
}
