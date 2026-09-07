import { NextResponse } from "next/server";
import { execFile } from "child_process";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
      { maxBuffer: 30 * 1024 * 1024, timeout: 35000 },
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

// Expand redirects for fb.watch or share links
async function resolveRedirectUrl(rawUrl) {
  try {
    const response = await fetch(rawUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    });
    return response.url || rawUrl;
  } catch (e) {
    return rawUrl;
  }
}

// Fast OpenGraph fallback for Facebook pages
async function scrapeFacebookMeta(targetUrl) {
  try {
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) return null;
    const html = await res.text();

    const getMeta = (prop) => {
      const match =
        html.match(new RegExp(`<meta[^>]*property=["']${prop}["'][^>]*content=["']([^"']+)["']`, "i")) ||
        html.match(new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${prop}["']`, "i"));
      return match ? match[1] : null;
    };

    const title = getMeta("og:title") || getMeta("twitter:title") || "Facebook Video";
    const image = getMeta("og:image") || getMeta("twitter:image") || "";
    const siteName = getMeta("og:site_name") || "Facebook";

    if (image || title !== "Facebook Video") {
      return { title, image, siteName };
    }
    return null;
  } catch (e) {
    return null;
  }
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

    let meta = null;
    let ytError = null;

    try {
      meta = await runYtDlpJson(resolvedUrl);
    } catch (err) {
      ytError = err;
      console.warn("yt-dlp Facebook inspect warning:", err.message);
    }

    // If yt-dlp succeeded
    if (meta) {
      const videoId = meta.id || String(Date.now());
      const title = (meta.title || meta.fulltitle || "Facebook Video").trim();
      const authorName = meta.uploader || meta.channel || "Facebook Creator";
      const authorUrl = meta.uploader_url || "";
      const canonicalUrl = meta.webpage_url || resolvedUrl;
      const thumbnail =
        meta.thumbnail ||
        (Array.isArray(meta.thumbnails) && meta.thumbnails.length > 0
          ? meta.thumbnails[meta.thumbnails.length - 1].url
          : "");

      // External backup portals for Facebook
      const downloadEngines = [
        {
          id: "snapsave",
          name: "SnapSave Pro (FB HD)",
          badge: "Recommended",
          status: "Online",
          desc: "Full HD 1080p, 2K & 4K Facebook Video & Reel downloader portal",
          url: `https://snapsave.app/#url=${encodeURIComponent(canonicalUrl)}`,
          direct: true,
        },
        {
          id: "fdown",
          name: "FDown Server 2",
          badge: "Fast SD & HD",
          status: "Online",
          desc: "Fast Facebook video stream converter with multi-resolution support",
          url: `https://fdown.net/download.php?url=${encodeURIComponent(canonicalUrl)}`,
          direct: true,
        },
        {
          id: "savefrom_fb",
          name: "SaveFrom Facebook Server 3",
          badge: "Global Classic",
          status: "Online",
          desc: "Worldwide reliable video & audio downloader portal",
          url: `https://en.savefrom.net/387-facebook-video-downloader-64.html?url=${encodeURIComponent(canonicalUrl)}`,
          direct: true,
        },
        {
          id: "cobalt_fb",
          name: "Cobalt Tools Server 4",
          badge: "Ad-Free",
          status: "Online",
          desc: "Open-source, tracker-free media extractor",
          url: "https://cobalt.tools/",
          direct: false,
        },
      ];

      const qualityOptions = [
        {
          label: "HD Video (Best)",
          type: "MP4 Video",
          quality: "1080p",
          note: "High Definition + Full Audio",
          icon: "video",
          engineIndex: 0,
        },
        {
          label: "SD Video (Standard)",
          type: "MP4 Video",
          quality: "480p",
          note: "Standard 480p/360p + Audio",
          icon: "video",
          engineIndex: 1,
        },
        {
          label: "MP3 Audio",
          type: "Audio 320kbps",
          quality: "audio",
          note: "Studio Quality 320k",
          icon: "music",
          engineIndex: 0,
        },
      ];

      return NextResponse.json({
        success: true,
        data: {
          platform: "facebook",
          videoId,
          canonicalUrl,
          targetDownloadUrl: canonicalUrl,
          title,
          authorName,
          authorUrl,
          thumbnail,
          fallbackThumbnail: thumbnail,
          duration: meta.duration_string || (meta.duration ? `${Math.round(meta.duration)}s` : null),
          qualityOptions,
          downloadEngines,
        },
      });
    }

    // Fallback: Scrape OpenGraph metadata
    const scraped = await scrapeFacebookMeta(resolvedUrl);
    if (scraped) {
      const videoId = String(Date.now());
      const qualityOptions = [
        {
          label: "HD Video (Best)",
          type: "MP4 Video",
          quality: "1080p",
          note: "High Definition + Full Audio",
          icon: "video",
          engineIndex: 0,
        },
        {
          label: "SD Video (Standard)",
          type: "MP4 Video",
          quality: "480p",
          note: "Standard 480p/360p + Audio",
          icon: "video",
          engineIndex: 1,
        },
        {
          label: "MP3 Audio",
          type: "Audio 320kbps",
          quality: "audio",
          note: "Studio Quality 320k",
          icon: "music",
          engineIndex: 0,
        },
      ];

      const downloadEngines = [
        {
          id: "snapsave",
          name: "SnapSave Pro (FB HD)",
          badge: "Recommended",
          status: "Online",
          desc: "Full HD 1080p, 2K & 4K Facebook Video & Reel downloader portal",
          url: `https://snapsave.app/#url=${encodeURIComponent(resolvedUrl)}`,
          direct: true,
        },
        {
          id: "fdown",
          name: "FDown Server 2",
          badge: "Fast SD & HD",
          status: "Online",
          desc: "Fast Facebook video stream converter with multi-resolution support",
          url: `https://fdown.net/download.php?url=${encodeURIComponent(resolvedUrl)}`,
          direct: true,
        },
      ];

      return NextResponse.json({
        success: true,
        data: {
          platform: "facebook",
          videoId,
          canonicalUrl: resolvedUrl,
          targetDownloadUrl: resolvedUrl,
          title: scraped.title,
          authorName: scraped.siteName,
          authorUrl: "",
          thumbnail: scraped.image,
          fallbackThumbnail: scraped.image,
          qualityOptions,
          downloadEngines,
        },
      });
    }

    return NextResponse.json(
      {
        error:
          "Could not inspect this Facebook video. Please verify the URL is public and accessible.",
      },
      { status: 400 }
    );
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
