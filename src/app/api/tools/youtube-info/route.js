import { NextResponse } from "next/server";

export const runtime = "nodejs";

function extractVideoId(url) {
  if (!url) return null;
  const clean = url.trim();
  // Direct 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;
  // Standard, shorts, embed, or youtu.be link
  const match = clean.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i);
  return match ? match[1] : null;
}

export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Please provide a valid YouTube URL or Video ID." }, { status: 400 });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: "Invalid YouTube URL format. Please paste a standard link, short link, or YouTube Shorts URL." }, { status: 400 });
    }

    const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // Query official YouTube oEmbed service for metadata
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(canonicalUrl)}&format=json`;
    const oembedRes = await fetch(oembedUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 3600 },
    });

    let title = "YouTube Video";
    let authorName = "YouTube Creator";
    let authorUrl = "";

    if (oembedRes.ok) {
      const oembedData = await oembedRes.json();
      title = oembedData.title || title;
      authorName = oembedData.author_name || authorName;
      authorUrl = oembedData.author_url || "";
    }

    // High quality thumbnail options
    const maxresThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const hqThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    const qualityOptions = [
      { label: "1080p Full HD", type: "MP4 Video", quality: "1080p", note: "1080p + Full Audio", icon: "video" },
      { label: "720p HD", type: "MP4 Video", quality: "720p", note: "720p + Full Audio", icon: "video" },
      { label: "480p SD", type: "MP4 Video", quality: "480p", note: "480p + Full Audio", icon: "video" },
      { label: "360p Low", type: "MP4 Video", quality: "360p", note: "360p + Full Audio", icon: "video" },
      { label: "MP3 Audio", type: "Audio 320kbps", quality: "audio", note: "Studio Quality 320k", icon: "music" },
    ];

    return NextResponse.json({
      success: true,
      data: {
        platform: "youtube",
        videoId,
        canonicalUrl,
        title,
        authorName,
        authorUrl,
        thumbnail: maxresThumbnail,
        fallbackThumbnail: hqThumbnail,
        qualityOptions,
      },
    });
  } catch (error) {
    console.error("YouTube Info Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch video information. Please check the URL and try again." },
      { status: 500 }
    );
  }
}
