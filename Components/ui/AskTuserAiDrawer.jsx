"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Bot, X, Send, RotateCcw, Copy, Check,
  ExternalLink, ChevronLeft, ChevronRight, User, Terminal, Compass,
  MessageSquareCode
} from "lucide-react";
import toast from "react-hot-toast";
import { safeCopyToClipboard } from "../../src/lib/clipboard.js";

const SUGGESTIONS = [
  { label: "Why should we hire Tuser?", query: "Why should we hire Tuser for our engineering team?" },
  { label: "Social & Connection Links", query: "Share your LinkedIn, Facebook, GitHub, and connection links." },
  { label: "CityFix Architecture", query: "Explain the architecture, tech stack, and challenges in the CityFix project." },
  { label: "Tech Stack & Skills", query: "What are Tuser's core frontend, backend, and database skills?" },
  { label: "Algorithm Contest Wins", query: "Tell me about his competitive programming contests and rankings." },
  { label: "Volt Store E-Commerce", query: "How is Volt Store built with Next.js 15 and NextAuth?" },
  { label: "Contact & Availability", query: "What is Tuser's work availability, location, and how can I contact him?" },
];

export default function AskTuserAiDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "welcome-msg",
      role: "assistant",
      content:
        "Hello! I am **Tuser AI** — the personal AI copilot for **MD. Muttakiul Islam Tuser**.\n\nI am grounded in his real-world portfolio data, projects, system architectures, and contest records. Ask me anything or select a prompt below to get started!",
      citations: [
        { id: "bio", title: "About Tuser", category: "Bio", sourceLink: "#about" },
        { id: "skills", title: "Tech Stack", category: "Skills", sourceLink: "#skills" },
      ],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // X-Axis Horizontal Scroll Controls for Suggestions
  const handleScrollLeft = () => {
    if (suggestionsRef.current) {
      suggestionsRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (suggestionsRef.current) {
      suggestionsRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const handleSuggestionsWheel = (e) => {
    if (suggestionsRef.current && e.deltaY !== 0) {
      e.preventDefault();
      suggestionsRef.current.scrollLeft += e.deltaY;
    }
  };

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  // Global Keyboard Shortcut: Ctrl+J or Cmd+J
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock background body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isOpen]);

  const handleCopy = async (text, id) => {
    const success = await safeCopyToClipboard(text);
    if (success) {
      setCopiedId(id);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      toast.error("Could not copy to clipboard");
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        content: "Chat cleared! How else can I help you explore Tuser's background?",
        citations: [],
      },
    ]);
    toast.success("Conversation history reset");
  };

  const sendMessage = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setInput("");

    const userMessageId = "user-" + Date.now();
    const assistantMessageId = "assistant-" + (Date.now() + 1);

    const updatedMessages = [
      ...messages,
      { id: userMessageId, role: "user", content: query },
    ];

    setMessages(updatedMessages);
    setIsLoading(true);

    // Placeholder for streaming assistant reply
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        citations: [],
        isStreaming: true,
      },
    ]);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamText = "";
      let citations = [];

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data:")) {
            const jsonStr = trimmed.replace(/^data:\s*/, "");
            try {
              const event = JSON.parse(jsonStr);
              if (event.type === "citations") {
                citations = event.citations || [];
              } else if (event.type === "chunk") {
                streamText += event.text;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: streamText, citations }
                      : msg
                  )
                );
              } else if (event.type === "done") {
                // Done
              }
            } catch {
              // Ignore line parse failure
            }
          }
        }
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, isStreaming: false, citations }
            : msg
        )
      );
    } catch (err) {
      console.error("Error communicating with AI endpoint:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content:
                  "I encountered a temporary connection issue. Please feel free to email Tuser directly at **tusermon720@gmail.com** or WhatsApp at **+8801760049326**!",
                isStreaming: false,
              }
            : msg
        )
      );
      toast.error("Network issue. Reconnecting...");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Helper to format basic markdown-style text (bold, lists, code)
  const renderFormattedText = (text) => {
    if (!text) return null;

    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Bullet list items
      if (line.trim().startsWith("• ") || line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const itemText = line.trim().substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-slate-300 text-xs sm:text-sm my-0.5 leading-relaxed">
            {formatInlineText(itemText)}
          </li>
        );
      }
      // Numbered list items
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <p key={idx} className="text-slate-300 text-xs sm:text-sm my-1 font-medium leading-relaxed">
            {formatInlineText(line)}
          </p>
        );
      }
      // Empty lines
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      // Standard line
      return (
        <p key={idx} className="text-slate-300 text-xs sm:text-sm my-0.5 leading-relaxed">
          {formatInlineText(line)}
        </p>
      );
    });
  };

  const formatInlineText = (str) => {
    // Regex splits on [label](url), **bold**, `code`, or bare URLs
    const parts = str.split(/(\[.*?\]\(https?:\/\/[^\s)]+\)|\[.*?\]\(mailto:[^\s)]+\)|\*\*.*?\*\*|`.*?`|https?:\/\/[^\s<)]+|mailto:[^\s<)]+)/g);
    return parts.map((part, i) => {
      if (!part) return null;
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="text-cyan-300 font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/20 font-mono text-xs"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      // Markdown link [Label](URL)
      const mdLinkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (mdLinkMatch) {
        return (
          <a
            key={i}
            href={mdLinkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline font-medium inline-flex items-center gap-0.5 transition-colors"
          >
            <span>{mdLinkMatch[1]}</span>
            <ExternalLink size={10} className="inline ml-0.5 opacity-80" />
          </a>
        );
      }
      // Bare URL or mailto
      if (part.startsWith("http://") || part.startsWith("https://") || part.startsWith("mailto:")) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline font-medium inline-flex items-center gap-0.5 transition-colors break-all"
          >
            <span>{part}</span>
            <ExternalLink size={10} className="inline ml-0.5 opacity-80" />
          </a>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* ── Floating Launcher Trigger Pill (Bottom Right) ── */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open Ask Tuser AI Copilot"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          gap: "0.55rem",
          padding: "0.55rem 1.05rem",
          borderRadius: 9999,
          background: "rgba(4, 13, 36, 0.92)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0, 212, 255, 0.35)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(0, 212, 255, 0.2)",
          color: "var(--text-primary)",
          cursor: "pointer",
          transition: "all 0.25s ease",
        }}
        className="group"
      >
        {/* Glowing Pulsing Status Dot */}
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#00d4ff",
            boxShadow: "0 0 10px #00d4ff",
            animation: "dot-pulse 1.5s ease-in-out infinite",
          }}
        />

        <Sparkles size={16} className="text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />

        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.82rem",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.02em",
          }}
        >
          Ask Tuser AI
        </span>

        <span
          style={{
            fontSize: "0.68rem",
            padding: "0.15rem 0.45rem",
            borderRadius: 6,
            background: "rgba(0, 212, 255, 0.15)",
            color: "#00d4ff",
            fontWeight: 700,
            border: "1px solid rgba(0, 212, 255, 0.25)",
          }}
          className="hidden sm:inline-block font-mono"
        >
          Ctrl+J
        </span>
      </motion.button>

      {/* ── Centered Liquid Glass AI Chat Modal / Drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(2, 8, 24, 0.78)",
              backdropFilter: "blur(18px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              overscrollBehavior: "contain",
            }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 25 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "640px",
                height: "85vh",
                maxHeight: "720px",
                background: "rgba(4, 13, 36, 0.96)",
                backdropFilter: "blur(40px)",
                border: "1px solid rgba(0, 212, 255, 0.3)",
                borderRadius: 24,
                boxShadow:
                  "0 25px 80px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 212, 255, 0.18)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                overscrollBehavior: "contain",
              }}
            >
              {/* ── Header ── */}
              <div
                style={{
                  padding: "1rem 1.25rem",
                  borderBottom: "1px solid rgba(0, 212, 255, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "rgba(2, 8, 24, 0.75)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, rgba(0,212,255,0.2) 0%, rgba(99,102,241,0.3) 100%)",
                        border: "2px solid rgba(0, 212, 255, 0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 15px rgba(0, 212, 255, 0.3)",
                      }}
                    >
                      <Bot size={22} className="text-cyan-400 animate-pulse" />
                    </div>
                    <span
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: 11,
                        height: 11,
                        borderRadius: "50%",
                        background: "#10b981",
                        border: "2px solid #020818",
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 800,
                          fontSize: "1.05rem",
                          color: "#ffffff",
                        }}
                      >
                        Tuser AI Copilot
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        RAG V2
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                      <Sparkles size={11} className="text-emerald-400" />
                      Online & Grounded in Portfolio Data
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearHistory}
                    title="Reset conversation"
                    className="p-2 rounded-full text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    title="Close drawer"
                    className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* ── Scrollable Chat Messages Thread ── */}
              <div
                className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(0, 212, 255, 0.2) transparent",
                }}
              >
                {messages.map((msg) => {
                  const isUser = msg.role === "user";
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      {!isUser && (
                        <div
                          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-sm"
                        >
                          <Bot size={16} />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-sm relative group ${
                          isUser
                            ? "bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-br-none shadow-lg shadow-cyan-900/30"
                            : "bg-slate-900/85 border border-slate-800 text-slate-200 rounded-bl-none shadow-md"
                        }`}
                      >
                        {isUser ? (
                          <p className="text-white text-xs sm:text-sm leading-relaxed font-medium">
                            {msg.content}
                          </p>
                        ) : (
                          <div>
                            {renderFormattedText(msg.content)}

                            {/* Streaming indicator */}
                            {msg.isStreaming && (
                              <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse align-middle" />
                            )}

                            {/* Citations & Source Attribution */}
                            {msg.citations && msg.citations.length > 0 && !msg.isStreaming && (
                              <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                                  <Compass size={11} className="text-cyan-400" /> Verified Sources:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {msg.citations.map((c, i) => (
                                    <a
                                      key={i}
                                      href={c.sourceLink || "#"}
                                      onClick={() => setIsOpen(false)}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/25 transition-colors"
                                    >
                                      <span>{c.title}</span>
                                      <ExternalLink size={9} />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Copy button */}
                            {!msg.isStreaming && msg.content && (
                              <button
                                onClick={() => handleCopy(msg.content, msg.id)}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white"
                                title="Copy answer"
                              >
                                {copiedId === msg.id ? (
                                  <Check size={12} className="text-emerald-400" />
                                ) : (
                                  <Copy size={12} />
                                )}
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {isUser && (
                        <div
                          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-cyan-600/30 border border-cyan-400 text-cyan-300 shadow-sm"
                        >
                          <User size={16} />
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                <div ref={messagesEndRef} />
              </div>

              {/* ── Quick Suggestion Chips (Horizontal X-Axis) ── */}
              <div
                style={{
                  borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                  background: "rgba(2, 8, 24, 0.45)",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 0.5rem",
                }}
              >
                {/* Left Scroll Arrow */}
                <button
                  onClick={handleScrollLeft}
                  title="Scroll suggestions left"
                  className="hidden sm:flex p-1 rounded-full text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition-colors flex-shrink-0 z-10 mr-1"
                >
                  <ChevronLeft size={15} />
                </button>

                <div
                  ref={suggestionsRef}
                  onWheel={handleSuggestionsWheel}
                  className="x-axis-scrollbar"
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    padding: "0.65rem 0.5rem 0.75rem 0.5rem",
                    scrollBehavior: "smooth",
                    width: "100%",
                  }}
                >
                  {SUGGESTIONS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(item.query)}
                      disabled={isLoading}
                      className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium text-slate-200 bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/50 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap shadow-sm"
                    >
                      <Sparkles size={11} className="text-cyan-400 flex-shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>

                {/* Right Scroll Arrow */}
                <button
                  onClick={handleScrollRight}
                  title="Scroll suggestions right"
                  className="hidden sm:flex p-1 rounded-full text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition-colors flex-shrink-0 z-10 ml-1"
                >
                  <ChevronRight size={15} />
                </button>
              </div>

              {/* ── Input Box & Send Bar ── */}
              <div
                style={{
                  padding: "0.9rem 1.15rem",
                  borderTop: "1px solid rgba(0, 212, 255, 0.15)",
                  background: "rgba(2, 8, 24, 0.8)",
                }}
              >
                <div
                  className="flex items-center gap-2 p-1.5 rounded-xl border transition-colors"
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    borderColor: "rgba(0, 212, 255, 0.25)",
                  }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything about Tuser's projects, stack, or experience..."
                    disabled={isLoading}
                    className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                  />

                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isLoading}
                    className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center gap-1.5 hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20"
                  >
                    {isLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="hidden sm:inline">Ask</span>
                        <Send size={13} />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-500 font-mono">
                  <span>Press <kbd className="text-slate-400 bg-slate-800 px-1 py-0.5 rounded text-[10px]">Enter</kbd> to send</span>
                  <span className="text-cyan-500/80">⚡ 100% Free RAG Engine</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
