import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;

function extractVideoId(url) {
  if (!url) return null;
  const clean = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;
  const match = clean.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i
  );
  return match ? match[1] : null;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const progressUrl = searchParams.get("progress_url");
    const idParam = searchParams.get("id");
    const urlParam = searchParams.get("url");
    const quality = searchParams.get("quality") || "720p";

    // ── CASE 1: Client polling an already-initiated stream ──
    if (progressUrl) {
      const decodedProgressUrl = decodeURIComponent(progressUrl);
      const progRes = await fetch(decodedProgressUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
        signal: AbortSignal.timeout(6000),
      });

      if (!progRes.ok) {
        return NextResponse.json(
          { error: "Could not fetch stream status from conversion worker." },
          { status: 502 }
        );
      }

      const prog = await progRes.json();
      if (prog.success === 1 && prog.download_url) {
        return NextResponse.json({
          success: true,
          done: true,
          downloadUrl: prog.download_url,
          progress: 1000,
          text: "Stream ready for download",
        });
      }

      return NextResponse.json({
        success: true,
        done: false,
        progress: prog.progress || 50,
        text: prog.text || "Preparing streaming download...",
        progressUrl: decodedProgressUrl,
      });
    }

    // ── CASE 2: Initiating a new stream preparation ──
    const videoId = idParam || extractVideoId(urlParam);
    if (!videoId) {
      return NextResponse.json(
        { error: "Missing YouTube video ID or URL parameter." },
        { status: 400 }
      );
    }

    let formatCode = "720";
    if (quality === "1080p" || quality === "1080") formatCode = "1080";
    else if (quality === "480p" || quality === "480") formatCode = "480";
    else if (quality === "360p" || quality === "360") formatCode = "360";
    else if (quality === "audio" || quality === "mp3") formatCode = "mp3";

    const targetUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const initUrl = `https://loader.to/ajax/download.php?button=1&start=1&end=1&format=${formatCode}&url=${encodeURIComponent(targetUrl)}`;

    const initRes = await fetch(initUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!initRes.ok) {
      return NextResponse.json(
        { error: "Failed to connect to stream resolver." },
        { status: 502 }
      );
    }

    const init = await initRes.json();

    // If stream is already cached / ready immediately
    if (init.download_url) {
      return NextResponse.json({
        success: true,
        done: true,
        downloadUrl: init.download_url,
        title: init.title || "video",
        progress: 1000,
        text: "Ready immediately",
      });
    }

    if (init.progress_url) {
      return NextResponse.json({
        success: true,
        done: false,
        progressUrl: init.progress_url,
        title: init.title || "video",
        progress: 50,
        text: init.text || "Preparing streaming download...",
      });
    }

    return NextResponse.json(
      { error: "Stream resolver did not return a valid stream or progress endpoint." },
      { status: 500 }
    );
  } catch (err) {
    console.error("youtube-stream API error:", err.message);
    return NextResponse.json(
      { error: err.message || "Internal server error resolving stream." },
      { status: 500 }
    );
  }
}
