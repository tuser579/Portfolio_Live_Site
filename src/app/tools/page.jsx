"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Youtube,
  Facebook,
  Download,
  Music,
  Video,
  Sparkles,
  Copy,
  Check,
  Smartphone,
  Laptop,
  Apple,
  RefreshCw,
  Info,
  ImageIcon,
  Moon,
  Sun,
  HardDrive,
  CheckCircle,
  Film,
} from "lucide-react";
import toast from "react-hot-toast";

export default function VideoToolsPage() {
  const [activePlatform, setActivePlatform] = useState("auto"); // "auto" | "youtube" | "facebook"
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState("1080p");
  const [activeDeviceTab, setActiveDeviceTab] = useState("pc");
  const [isDark, setIsDark] = useState(true);

  // Sync theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio-theme");
    const isLightTheme = savedTheme === "light";
    setIsDark(!isLightTheme);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("portfolio-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("portfolio-theme", "light");
    }
  };

  const isFacebookUrl = (testUrl) =>
    /(?:facebook\.com|fb\.watch|fb\.gg|fb\.me)/i.test(testUrl);

  const isYouTubeUrl = (testUrl) =>
    /(?:youtube\.com|youtu\.be)/i.test(testUrl);

  const handlePasteFromClipboard = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          const trimmed = text.trim();
          setUrl(trimmed);
          toast.success("URL pasted from clipboard!");

          // Auto switch platform if helpful
          if (isFacebookUrl(trimmed)) {
            setActivePlatform("facebook");
          } else if (isYouTubeUrl(trimmed)) {
            setActivePlatform("youtube");
          }

          fetchVideoInfo(trimmed);
        }
      } else {
        toast.error("Clipboard access not supported in your browser.");
      }
    } catch (err) {
      toast.error("Could not read clipboard. Please paste manually.");
    }
  };

  const fetchVideoInfo = async (videoUrlToFetch) => {
    const targetUrl = (videoUrlToFetch || url).trim();
    if (!targetUrl) {
      toast.error("Please enter or paste a video URL!");
      return;
    }

    // Determine platform
    const isFb = isFacebookUrl(targetUrl);
    const isYt = isYouTubeUrl(targetUrl);

    if (!isFb && !isYt && activePlatform === "auto") {
      toast.error("Please provide a valid YouTube or Facebook video URL.");
      return;
    }

    const platformToUse =
      activePlatform === "facebook" || isFb
        ? "facebook"
        : activePlatform === "youtube" || isYt
        ? "youtube"
        : isFb
        ? "facebook"
        : "youtube";

    // Auto-update active tab if in auto mode
    if (activePlatform === "auto") {
      if (isFb) setActivePlatform("facebook");
      else if (isYt) setActivePlatform("youtube");
    }

    setLoading(true);
    setVideoData(null);

    try {
      const endpoint =
        platformToUse === "facebook"
          ? "/api/tools/facebook-info"
          : "/api/tools/youtube-info";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to inspect video information");
      }

      const receivedData = {
        ...json.data,
        platform: json.data.platform || platformToUse,
      };

      setVideoData(receivedData);
      if (receivedData.qualityOptions?.length > 0) {
        setSelectedQuality(receivedData.qualityOptions[0].quality);
      }

      const brand = receivedData.platform === "facebook" ? "Facebook" : "YouTube";
      toast.success(`${brand} video resolved! Ready for direct download.`);
    } catch (error) {
      toast.error(error.message || "Failed to fetch video details");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (text) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          toast.success("Link copied to clipboard!");
          setTimeout(() => setCopied(false), 2000);
        });
      }
    } catch (e) {
      toast.error("Could not copy link.");
    }
  };

  // 100% REAL IN-APP STREAM DOWNLOAD DIRECTLY INTO STORAGE
  const handleInternalDownload = (qualityOverride) => {
    if (!videoData) return;

    const q = qualityOverride || selectedQuality;
    const isAudio = q === "audio";
    const ext = isAudio ? "mp3" : "mp4";
    const isFb = videoData.platform === "facebook";
    const cleanTitle =
      videoData.title
        .replace(/[^a-zA-Z0-9_\-\s]/g, "")
        .trim()
        .replace(/\s+/g, "_") || (isFb ? "facebook_video" : "youtube_video");
    const filename = `${cleanTitle}.${ext}`;
    const brand = isFb ? "Facebook" : "YouTube";

    setDownloading(true);
    const toastId = toast.loading(
      `Connecting to internal stream for ${brand} ${isAudio ? "MP3 Audio" : `${q} Video`}... Download will begin shortly.`,
      { duration: 25000 }
    );

    let streamEndpoint = "";
    if (isFb) {
      const opt = videoData.qualityOptions?.find((o) => o.quality === q);
      const targetParam =
        opt?.directUrl ||
        videoData.directHdUrl ||
        videoData.directSdUrl ||
        videoData.targetDownloadUrl ||
        videoData.canonicalUrl;
      const canonicalPageUrl = videoData.canonicalUrl || videoData.url || "";
      streamEndpoint = `/api/tools/download?url=${encodeURIComponent(
        targetParam
      )}&pageUrl=${encodeURIComponent(
        canonicalPageUrl
      )}&platform=facebook&quality=${q}&title=${encodeURIComponent(cleanTitle)}`;
    } else {
      streamEndpoint = `/api/tools/download?id=${videoData.videoId}&platform=youtube&quality=${q}&title=${encodeURIComponent(
        cleanTitle
      )}`;
    }

    try {
      // Trigger native browser attachment download directly in user gesture event loop
      const link = document.createElement("a");
      link.href = streamEndpoint;
      link.setAttribute("download", filename);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        try {
          document.body.removeChild(link);
        } catch (e) {}
      }, 5000);

      toast.success(
        `${brand} video download started! Check your browser's Downloads folder.`,
        { id: toastId, duration: 6000 }
      );
    } catch (err) {
      toast.error(
        err.message || "Failed to start download. Please try again.",
        { id: toastId, duration: 5000 }
      );
    } finally {
      setTimeout(() => {
        setDownloading(false);
      }, 3000);
    }
  };

  // Direct thumbnail download into computer / mobile device storage
  const handleDownloadThumbnail = async () => {
    if (!videoData) return;
    const toastId = toast.loading("Saving HD cover to device...");
    try {
      const imgUrl = videoData.thumbnail;
      const res = await fetch(imgUrl);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${videoData.title.replace(/[^a-zA-Z0-9_-]/g, "_")}_cover.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("HD Cover saved to device storage!", { id: toastId });
    } catch (e) {
      if (typeof window !== "undefined") {
        window.open(videoData.thumbnail, "_blank");
      }
      toast.success("Cover opened. Long-press or right-click to save!", { id: toastId });
    }
  };

  return (
    <main className="min-h-screen bg-deep text-text-primary selection:bg-cyan selection:text-black">
      {/* ── Background Ambient Glows ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[140px] opacity-25"
          style={{
            background:
              activePlatform === "facebook"
                ? "radial-gradient(circle, #1877f2 0%, #7c3aed 70%, transparent 100%)"
                : "radial-gradient(circle, #00d4ff 0%, #7c3aed 70%, transparent 100%)",
          }}
        />
        <div
          className="absolute top-1/2 -right-40 w-[450px] h-[450px] rounded-full blur-[160px] opacity-20"
          style={{
            background:
              activePlatform === "facebook"
                ? "radial-gradient(circle, #00bfff 0%, #1877f2 80%, transparent 100%)"
                : "radial-gradient(circle, #f0abfc 0%, #7c3aed 80%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-glass-border bg-deep/80 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-text-secondary hover:text-cyan transition-colors text-sm font-medium px-3 py-1.5 rounded-lg border border-glass-border hover:border-cyan/40 bg-surface/40"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portfolio</span>
            </Link>

            <span className="hidden sm:inline-block text-xs font-mono px-2.5 py-1 rounded-full bg-cyan/10 text-cyan border border-cyan/30">
              ⚡ Own Internal Video Engine
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-text-muted font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>In-App Direct Storage Enabled</span>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-glass-border bg-surface/50 text-text-secondary hover:text-text-primary hover:border-cyan/40 transition-colors cursor-pointer"
              title="Toggle Dark/Light Mode"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-violet-500" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Container ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Title & Intro ── */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-gradient-to-r from-cyan/10 to-violet/10 text-cyan border border-cyan/25 mb-4"
          >
            <HardDrive className="w-4 h-4 text-cyan" />
            <span>Own In-App Downloading System (No External Redirect)</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 font-['Outfit']"
          >
            {activePlatform === "facebook" ? (
              <>
                Direct Facebook <span className="text-blue-500">Downloader</span>
              </>
            ) : activePlatform === "youtube" ? (
              <>
                Direct YouTube <span className="gradient-text">Downloader</span>
              </>
            ) : (
              <>
                Direct Video <span className="gradient-text">Downloader</span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-text-secondary text-sm sm:text-base leading-relaxed"
          >
            Paste any <strong>Facebook video, Reel, Watch link</strong> or{" "}
            <strong>YouTube video</strong> to download it{" "}
            <strong>directly to your computer or phone storage</strong> without redirecting to
            other websites.
          </motion.p>
        </div>

        {/* ── Platform Mode Switcher ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex p-1 rounded-2xl bg-surface/80 border border-glass-border shadow-lg backdrop-blur-md">
            <button
              onClick={() => setActivePlatform("auto")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activePlatform === "auto"
                  ? isDark
                    ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white shadow-md font-bold"
                    : "bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 text-black shadow-md font-bold border border-cyan-400"
                  : isDark
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-600 hover:text-black"
              }`}
            >
              <Sparkles className={`w-4 h-4 ${activePlatform === "auto" ? (isDark ? "text-white" : "text-black") : ""}`} />
              <span className={activePlatform === "auto" ? (isDark ? "text-white" : "text-black") : ""}>
                Smart Auto-Detect
              </span>
            </button>

            <button
              onClick={() => setActivePlatform("facebook")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activePlatform === "facebook"
                  ? isDark
                    ? "bg-blue-600 text-white shadow-md font-bold"
                    : "bg-blue-300 text-black shadow-md font-bold border border-blue-400"
                  : isDark
                  ? "text-slate-300 hover:text-blue-400"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              <Facebook className={`w-4 h-4 ${activePlatform === "facebook" ? (isDark ? "text-white" : "text-black") : "text-blue-400 group-hover:text-blue-300"}`} />
              <span className={activePlatform === "facebook" ? (isDark ? "text-white" : "text-black") : ""}>Facebook (Videos & Reels)</span>
            </button>

            <button
              onClick={() => setActivePlatform("youtube")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activePlatform === "youtube"
                  ? isDark
                    ? "bg-red-600 text-white shadow-md font-bold"
                    : "bg-red-300 text-black shadow-md font-bold border border-red-400"
                  : isDark
                  ? "text-slate-300 hover:text-red-400"
                  : "text-slate-600 hover:text-red-600"
              }`}
            >
              <Youtube className={`w-4 h-4 ${activePlatform === "youtube" ? (isDark ? "text-white" : "text-black") : "text-red-500"}`} />
              <span className={activePlatform === "youtube" ? (isDark ? "text-white" : "text-black") : ""}>YouTube (Videos & Shorts)</span>
            </button>
          </div>
        </motion.div>

        {/* ── Input Box Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-4 sm:p-6 border border-glass-border mb-8 shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                {activePlatform === "facebook" || isFacebookUrl(url) ? (
                  <Facebook className="w-5 h-5 text-blue-500" />
                ) : activePlatform === "youtube" || isYouTubeUrl(url) ? (
                  <Youtube className="w-5 h-5 text-red-500" />
                ) : (
                  <Film className="w-5 h-5 text-cyan" />
                )}
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  const val = e.target.value;
                  setUrl(val);
                  if (activePlatform === "auto") {
                    if (isFacebookUrl(val)) setActivePlatform("facebook");
                    else if (isYouTubeUrl(val)) setActivePlatform("youtube");
                  }
                }}
                onKeyDown={(e) => e.key === "Enter" && fetchVideoInfo()}
                placeholder={
                  activePlatform === "facebook"
                    ? "Paste Facebook link (e.g. https://www.facebook.com/watch/?v=... or fb.watch or reels)"
                    : activePlatform === "youtube"
                    ? "Paste YouTube link (e.g. https://www.youtube.com/watch?v=... or shorts)"
                    : "Paste any Facebook video, Reel, Watch link or YouTube URL..."
                }
                className="w-full pl-11 pr-24 py-3.5 rounded-xl bg-surface/70 border border-glass-border text-text-primary placeholder:text-text-muted text-sm font-sans focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all"
              />

              {/* Paste button inside input */}
              <button
                type="button"
                onClick={handlePasteFromClipboard}
                className="absolute inset-y-1.5 right-1.5 px-3 py-1 text-xs font-mono font-medium rounded-lg bg-surface hover:bg-surface/90 text-cyan border border-glass-border hover:border-cyan/40 transition-all flex items-center gap-1 cursor-pointer"
                title="Paste from clipboard"
              >
                <ClipboardIcon className="w-3.5 h-3.5" />
                <span>Paste</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => fetchVideoInfo()}
              disabled={loading || !url.trim()}
              className="px-6 py-3.5 rounded-xl font-semibold text-sm text-primary-foreground flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg hover:shadow-cyan/25"
              style={{
                backgroundImage:
                  activePlatform === "facebook"
                    ? "linear-gradient(135deg, #1877F2 0%, #00d4ff 100%)"
                    : "var(--grad-primary)",
              }}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Inspecting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Inspect & Prepare</span>
                </>
              )}
            </button>
          </div>

          {/* Quick sample chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-text-muted">
            <span className="font-mono text-text-secondary">Quick Test:</span>
            <button
              onClick={() => {
                const sample = "https://www.facebook.com/watch/?v=10153231379946729";
                setUrl(sample);
                setActivePlatform("facebook");
                fetchVideoInfo(sample);
              }}
              className="px-2.5 py-1 rounded-md bg-surface/50 hover:bg-blue-500/15 hover:text-blue-400 border border-glass-border transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Facebook className="w-3 h-3 text-blue-500" />
              <span>Facebook Guide Sample</span>
            </button>
            <button
              onClick={() => {
                const sample = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
                setUrl(sample);
                setActivePlatform("youtube");
                fetchVideoInfo(sample);
              }}
              className="px-2.5 py-1 rounded-md bg-surface/50 hover:bg-red-500/15 hover:text-red-400 border border-glass-border transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Youtube className="w-3 h-3 text-red-500" />
              <span>Rick Astley (YouTube 4K)</span>
            </button>
            <button
              onClick={() => {
                const sample = "https://www.youtube.com/watch?v=jfKfPfyJRdk";
                setUrl(sample);
                setActivePlatform("youtube");
                fetchVideoInfo(sample);
              }}
              className="px-2.5 py-1 rounded-md bg-surface/50 hover:bg-cyan/10 hover:text-cyan border border-glass-border transition-colors cursor-pointer flex items-center gap-1.5"
            >
              ☕ <span>Lofi Girl (YouTube Chill)</span>
            </button>
            <span className="hidden sm:inline-block ml-auto text-[11px] font-mono text-text-muted">
              Supports: Facebook Videos, Watch, Reels & YouTube Shorts
            </span>
          </div>
        </motion.div>

        {/* ── Resolved Video Card ── */}
        <AnimatePresence>
          {videoData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className={`glass-card rounded-2xl border p-5 sm:p-7 mb-10 shadow-2xl relative overflow-hidden ${
                videoData.platform === "facebook"
                  ? "border-blue-500/40"
                  : "border-cyan/30"
              }`}
            >
              <div
                className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
                  videoData.platform === "facebook" ? "bg-blue-600/15" : "bg-cyan/10"
                }`}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Thumbnail Preview */}
                <div className="lg:col-span-5 relative group rounded-xl overflow-hidden border border-glass-border bg-black/40 aspect-video flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={videoData.thumbnail || videoData.fallbackThumbnail}
                    alt={videoData.title}
                    onError={(e) => {
                      if (e.currentTarget.src !== videoData.fallbackThumbnail) {
                        e.currentTarget.src = videoData.fallbackThumbnail;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                    <div className="flex items-center justify-between text-xs text-white/90">
                      {videoData.platform === "facebook" ? (
                        <span className="bg-blue-600/90 px-2 py-0.5 rounded font-mono font-bold text-[10px] tracking-wider uppercase flex items-center gap-1">
                          <Facebook className="w-2.5 h-2.5" />
                          <span>Facebook Video</span>
                        </span>
                      ) : (
                        <span className="bg-red-600/90 px-2 py-0.5 rounded font-mono font-bold text-[10px] tracking-wider uppercase flex items-center gap-1">
                          <Youtube className="w-2.5 h-2.5" />
                          <span>YouTube HD</span>
                        </span>
                      )}
                      <button
                        onClick={handleDownloadThumbnail}
                        className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-md px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer"
                        title="Save Cover JPG to storage"
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>Save Cover JPG</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Metadata & Quality / Action Hub */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded border ${
                          videoData.platform === "facebook"
                            ? "text-blue-400 bg-blue-500/10 border-blue-500/25"
                            : "text-cyan bg-cyan/10 border-cyan/25"
                        }`}
                      >
                        {videoData.platform === "facebook" ? "Facebook" : "YouTube"} ID:{" "}
                        {videoData.videoId}
                      </span>
                      {videoData.duration && (
                        <span className="text-xs font-mono text-text-muted bg-surface/60 px-2 py-0.5 rounded border border-glass-border">
                          ⏱ {videoData.duration}
                        </span>
                      )}
                      {videoData.authorName && (
                        <span className="text-xs text-text-muted flex items-center gap-1 font-medium truncate">
                          by{" "}
                          <span className="text-text-secondary truncate">
                            {videoData.authorName}
                          </span>
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-text-primary line-clamp-2 mb-3 leading-snug">
                      {videoData.title}
                    </h2>

                    {/* Resolution selector buttons */}
                    <div className="mb-4">
                      <label className="text-xs font-mono text-text-secondary block mb-2">
                        SELECT DOWNLOAD RESOLUTION:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {videoData.qualityOptions?.map((opt) => (
                          <button
                            key={opt.quality}
                            onClick={() => setSelectedQuality(opt.quality)}
                            className={`p-2 rounded-xl text-left border transition-all text-xs cursor-pointer ${
                              selectedQuality === opt.quality
                                ? videoData.platform === "facebook"
                                  ? isDark
                                    ? "border-blue-500 bg-blue-500/25 text-white shadow-[0_0_15px_rgba(24,119,242,0.25)] font-bold"
                                    : "border-blue-600 bg-blue-100 text-black shadow-sm font-bold"
                                  : isDark
                                  ? "border-cyan bg-cyan/25 text-white shadow-[0_0_15px_rgba(0,212,255,0.25)] font-bold"
                                  : "border-cyan-600 bg-cyan-100 text-black shadow-sm font-bold"
                                : "border-glass-border bg-surface/50 text-text-secondary hover:border-glass-border-hover hover:bg-surface/80"
                            }`}
                          >
                            <div className={`font-bold flex items-center gap-1.5 ${selectedQuality === opt.quality ? (isDark ? "text-white" : "text-black") : ""}`}>
                              {opt.icon === "music" ? (
                                <Music className="w-3.5 h-3.5 text-magenta" />
                              ) : (
                                <Video
                                  className={`w-3.5 h-3.5 ${
                                    selectedQuality === opt.quality
                                      ? isDark ? "text-white" : "text-black"
                                      : videoData.platform === "facebook"
                                      ? "text-blue-400"
                                      : "text-cyan"
                                  }`}
                                />
                              )}
                              <span>{opt.label}</span>
                            </div>
                            <span className={`text-[10px] block mt-0.5 ${selectedQuality === opt.quality ? (isDark ? "text-slate-200" : "text-slate-800 font-medium") : "text-text-muted"}`}>
                              {opt.note}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* In-App Direct Notice */}
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 mb-4 flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="text-xs text-emerald-300">
                        <strong>Native In-App Stream:</strong> Downloads straight from your
                        backend into device storage with zero third-party redirects.
                      </div>
                    </div>
                  </div>

                  {/* ── Primary Action Row (100% INTERNAL NATIVE DOWNLOAD) ── */}
                  <div className="pt-3 border-t border-glass-border flex flex-wrap gap-2.5 items-center">
                    <button
                      onClick={() => handleInternalDownload(selectedQuality)}
                      disabled={downloading}
                      className={`flex-1 min-w-[220px] px-5 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-cyan/30 cursor-pointer disabled:opacity-50 ${
                        isDark ? "text-white" : "text-black"
                      }`}
                      style={{
                        backgroundImage:
                          videoData.platform === "facebook"
                            ? "linear-gradient(135deg, #1877F2 0%, #00d4ff 100%)"
                            : "var(--grad-primary)",
                      }}
                    >
                      {downloading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Streaming to Storage...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>
                            Download{" "}
                            {selectedQuality === "audio"
                              ? "Audio (MP3)"
                              : `${selectedQuality} MP4 Video`}
                          </span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleInternalDownload("audio")}
                      className="px-3.5 py-3.5 rounded-xl border border-glass-border hover:border-magenta/50 bg-surface/60 text-magenta hover:bg-magenta/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Direct Audio Only Download"
                    >
                      <Music className="w-4 h-4" />
                      <span>MP3 / Audio</span>
                    </button>

                    <button
                      onClick={() => handleCopyLink(videoData.canonicalUrl)}
                      className="px-3.5 py-3.5 rounded-xl border border-glass-border hover:border-cyan/40 bg-surface/60 text-text-secondary hover:text-text-primary text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Copy canonical link"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span>{copied ? "Copied" : "Copy Link"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Device Storage Guide (Tabs for PC, Android, iPhone) ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 sm:p-8 border border-glass-border mb-10 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-text-primary font-['Outfit'] flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-cyan" />
                <span>How Your Device Saves the Video to Storage</span>
              </h2>
              <p className="text-xs sm:text-sm text-text-muted mt-1">
                The video stream downloads directly from your site into your device&apos;s physical
                offline storage.
              </p>
            </div>

            {/* Device selector tabs */}
            <div className="flex items-center p-1 rounded-xl bg-surface/70 border border-glass-border">
              <button
                onClick={() => setActiveDeviceTab("pc")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeDeviceTab === "pc"
                    ? isDark
                      ? "bg-cyan-600 text-white shadow-md font-bold"
                      : "bg-cyan-300 text-black shadow-md font-bold border border-cyan-400"
                    : isDark
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-600 hover:text-black"
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Computer (PC/Mac)</span>
              </button>
              <button
                onClick={() => setActiveDeviceTab("android")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeDeviceTab === "android"
                    ? isDark
                      ? "bg-cyan-600 text-white shadow-md font-bold"
                      : "bg-cyan-300 text-black shadow-md font-bold border border-cyan-400"
                    : isDark
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-600 hover:text-black"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>
              <button
                onClick={() => setActiveDeviceTab("ios")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeDeviceTab === "ios"
                    ? isDark
                      ? "bg-cyan-600 text-white shadow-md font-bold"
                      : "bg-cyan-300 text-black shadow-md font-bold border border-cyan-400"
                    : isDark
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-600 hover:text-black"
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                <span>iPhone / iPad</span>
              </button>
            </div>
          </div>

          {/* Tab contents */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeDeviceTab === "pc" && (
              <>
                <div className="p-4 rounded-xl bg-surface/40 border border-glass-border">
                  <div className="w-8 h-8 rounded-lg bg-cyan/10 text-cyan font-bold font-mono flex items-center justify-center mb-3">
                    01
                  </div>
                  <h4 className="font-bold text-sm text-text-primary mb-1">Click Download</h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Click the primary download button. The browser starts downloading the video
                    immediately without leaving the page.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-surface/40 border border-glass-border">
                  <div className="w-8 h-8 rounded-lg bg-cyan/10 text-cyan font-bold font-mono flex items-center justify-center mb-3">
                    02
                  </div>
                  <h4 className="font-bold text-sm text-text-primary mb-1">Saved in Downloads</h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    The <code className="text-cyan">.mp4</code> or{" "}
                    <code className="text-cyan">.mp3</code> file is written directly into your
                    computer&apos;s <code className="text-cyan">Downloads</code> directory.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-surface/40 border border-glass-border">
                  <div className="w-8 h-8 rounded-lg bg-cyan/10 text-cyan font-bold font-mono flex items-center justify-center mb-3">
                    03
                  </div>
                  <h4 className="font-bold text-sm text-text-primary mb-1">Offline Playback</h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Double-click the file to play offline in VLC, Windows Media Player, QuickTime,
                    or import into CapCut or Premiere.
                  </p>
                </div>
              </>
            )}

            {activeDeviceTab === "android" && (
              <>
                <div className="p-4 rounded-xl bg-surface/40 border border-glass-border">
                  <div className="w-8 h-8 rounded-lg bg-cyan/10 text-cyan font-bold font-mono flex items-center justify-center mb-3">
                    01
                  </div>
                  <h4 className="font-bold text-sm text-text-primary mb-1">Tap Download</h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Tap the download button on Chrome, Samsung Internet, or Firefox.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-surface/40 border border-glass-border">
                  <div className="w-8 h-8 rounded-lg bg-cyan/10 text-cyan font-bold font-mono flex items-center justify-center mb-3">
                    02
                  </div>
                  <h4 className="font-bold text-sm text-text-primary mb-1">Internal Storage</h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Android prompts: &quot;Download file?&quot; Once confirmed, the file saves to{" "}
                    <code className="text-cyan">Internal Storage / Download</code>.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-surface/40 border border-glass-border">
                  <div className="w-8 h-8 rounded-lg bg-cyan/10 text-cyan font-bold font-mono flex items-center justify-center mb-3">
                    03
                  </div>
                  <h4 className="font-bold text-sm text-text-primary mb-1">Gallery & Files</h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Open your phone&apos;s <strong>Gallery</strong>, <strong>Google Photos</strong>,
                    or <strong>Files app</strong> to watch the Facebook video or Reel without any
                    internet!
                  </p>
                </div>
              </>
            )}

            {activeDeviceTab === "ios" && (
              <>
                <div className="p-4 rounded-xl bg-surface/40 border border-glass-border">
                  <div className="w-8 h-8 rounded-lg bg-cyan/10 text-cyan font-bold font-mono flex items-center justify-center mb-3">
                    01
                  </div>
                  <h4 className="font-bold text-sm text-text-primary mb-1">
                    Safari Download Prompt
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    In iOS Safari, tap Download. Safari displays: &quot;Do you want to download
                    [video].mp4?&quot; &rarr; Tap <strong>Download</strong>.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-surface/40 border border-glass-border">
                  <div className="w-8 h-8 rounded-lg bg-cyan/10 text-cyan font-bold font-mono flex items-center justify-center mb-3">
                    02
                  </div>
                  <h4 className="font-bold text-sm text-text-primary mb-1">Check Files App</h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Tap the blue download arrow in Safari, or open the built-in{" "}
                    <strong>Files</strong> app &gt; <strong>Downloads</strong>.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-surface/40 border border-glass-border">
                  <div className="w-8 h-8 rounded-lg bg-cyan/10 text-cyan font-bold font-mono flex items-center justify-center mb-3">
                    03
                  </div>
                  <h4 className="font-bold text-sm text-text-primary mb-1">
                    Save to Photos / Camera Roll
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Tap the video in Files, tap <strong>Share</strong>, and select{" "}
                    <strong>&quot;Save Video&quot;</strong> to move it into your Apple Photos camera
                    roll!
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.section>

        {/* ── Technical Deep-Dive ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card rounded-2xl p-6 sm:p-8 border border-glass-border"
        >
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-cyan" />
            <h3 className="text-lg font-bold text-text-primary font-['Outfit']">
              How Your Own Internal Download System Works
            </h3>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
            <p>
              <strong className="text-text-primary">1. Zero External Redirects:</strong> Unlike
              public download websites that spam popups and redirect you through third-party ad
              networks, your portfolio hosts its own internal video resolution and streaming engine
              at <code className="text-cyan">/api/tools/download</code>.
            </p>
            <p>
              <strong className="text-text-primary">2. Real-Time Muxing & Streaming:</strong> When
              you click download, your backend extracts the Facebook or YouTube audio and video
              streams, muxes them using static FFmpeg with universal AAC audio encoding, and
              immediately streams the binary chunks directly to your browser as an attachment.
            </p>
            <p>
              <strong className="text-text-primary">3. Direct Storage Saving:</strong> Because the
              stream is marked with{" "}
              <code className="text-cyan">Content-Disposition: attachment</code>, your browser saves
              the video directly to your computer or phone local storage without leaving the page.
            </p>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

function ClipboardIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}
