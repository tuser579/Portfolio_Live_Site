"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal as TerminalIcon, X, Maximize2, Minimize2,
  CornerDownLeft, Sparkles, Download, Check, ExternalLink
} from "lucide-react";
import { projects, skills, certifications } from "../../data/portfolio";
import toast from "react-hot-toast";

const COMMAND_LIST = [
  { cmd: "help", desc: "List all available terminal commands" },
  { cmd: "whoami", desc: "Display developer bio & background" },
  { cmd: "skills", desc: "List technical stack & proficiencies" },
  { cmd: "projects", desc: "View real-world projects & live links" },
  { cmd: "experience", desc: "View education & developer journey" },
  { cmd: "problem-solving", desc: "Show competitive programming statistics" },
  { cmd: "contact", desc: "Display email, phone, location & socials" },
  { cmd: "cat resume.txt", desc: "Print full ASCII resume in terminal" },
  { cmd: "download resume", desc: "Generate & download official PDF resume" },
  { cmd: "theme <dark|light>", desc: "Switch website theme (e.g. 'theme light')" },
  { cmd: "sudo hire-tuser", desc: "Unlock priority hiring pass & Easter Egg" },
  { cmd: "clear", desc: "Clear terminal console output" },
  { cmd: "exit", desc: "Close the developer terminal" },
];

const SUGGESTIONS = ["help", "skills", "projects", "sudo hire-tuser", "download resume", "clear"];

export default function TerminalModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    {
      type: "system",
      content: (
        <div>
          <p className="text-cyan-400 font-bold">
            ⚡ MD. MUTTAKIUL ISLAM TUSER — DEVELOPER TERMINAL v2.5.0
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Type <span className="text-emerald-400 font-semibold">&apos;help&apos;</span> to see all commands or press <span className="text-fuchsia-400 font-semibold">TAB</span> for auto-complete.
          </p>
        </div>
      ),
    },
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  // Global Keyboard Shortcut: Ctrl+K or Cmd+K or `~`
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Auto-focus input & scroll to bottom
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, history]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Handle PDF Download
  const handleDownloadPDF = async () => {
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = 210; const MARGIN = 18; const CW = W - MARGIN * 2; let y = 20;
      doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.text("MD. MUTTAKIUL ISLAM TUSER", W / 2, y, { align: "center" }); y += 6;
      doc.setFontSize(11); doc.text("Full-Stack Web Developer | MERN Stack", W / 2, y, { align: "center" }); y += 6;
      doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.text("tusermon720@gmail.com | +8801760049326 | Dhaka, Bangladesh", W / 2, y, { align: "center" }); y += 8;
      doc.save("MD_Muttakiul_Islam_Tuser_Resume.pdf");
      toast.success("Resume downloaded successfully!");
    } catch {
      toast.error("Failed to generate PDF");
    }
  };

  const handleCommand = (rawInput) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    // Add to history list
    const newCmdHistory = [...commandHistory, trimmed];
    setCommandHistory(newCmdHistory);
    setHistoryIndex(newCmdHistory.length);

    const parts = trimmed.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ").toLowerCase();

    // User input echo
    const userEcho = {
      type: "user",
      content: (
        <div className="flex items-center gap-2 text-slate-300">
          <span className="text-emerald-400 font-mono">tuser@portfolio:~$</span>
          <span className="text-white font-mono font-medium">{trimmed}</span>
        </div>
      ),
    };

    let response = null;

    switch (command) {
      case "help":
      case "?":
        response = (
          <div className="space-y-1.5 py-1">
            <p className="text-cyan-400 font-semibold mb-2">Available Commands:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
              {COMMAND_LIST.map((c) => (
                <div key={c.cmd} className="flex items-baseline gap-2">
                  <span
                    onClick={() => handleCommand(c.cmd)}
                    className="text-fuchsia-400 font-mono font-bold cursor-pointer hover:underline"
                  >
                    {c.cmd}
                  </span>
                  <span className="text-slate-400">- {c.desc}</span>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case "whoami":
        response = (
          <div className="space-y-2 text-xs text-slate-300 py-1">
            <p className="text-emerald-400 font-bold text-sm">MD. MUTTAKIUL ISLAM TUSER</p>
            <p className="text-cyan-300">Full-Stack MERN Developer · Frontend Focused · Competitive Programmer</p>
            <p className="text-slate-300 leading-relaxed">
              Studying B.Sc in CSE at Daffodil International University (DIU), Dhaka. Passionate about building highly responsive, visually stunning web applications with React, Next.js 15, Node.js, Express & MongoDB. Solved 1300+ algorithmic problems across Codeforces, CodeChef, and LeetCode.
            </p>
          </div>
        );
        break;

      case "skills":
        response = (
          <div className="space-y-2 text-xs py-1">
            <p className="text-cyan-400 font-semibold">Technical Arsenal:</p>
            <div className="space-y-1.5">
              <div>
                <span className="text-fuchsia-400 font-bold font-mono">Frontend: </span>
                <span className="text-slate-300">HTML5, CSS3, Tailwind CSS, JavaScript (ES6+), TypeScript, React.js, Next.js 15, Framer Motion, GSAP</span>
              </div>
              <div>
                <span className="text-emerald-400 font-bold font-mono">Backend & APIs: </span>
                <span className="text-slate-300">Node.js, Express.js, RESTful APIs, JWT Authorization</span>
              </div>
              <div>
                <span className="text-sky-400 font-bold font-mono">Databases: </span>
                <span className="text-slate-300">MongoDB, Mongoose, MySQL, Firebase Firestore</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold font-mono">Tools & Cloud: </span>
                <span className="text-slate-300">Git, GitHub, Vercel, Netlify, Firebase, Cloudflare, Postman, VS Code</span>
              </div>
            </div>
          </div>
        );
        break;

      case "projects":
        response = (
          <div className="space-y-3 text-xs py-1">
            <p className="text-cyan-400 font-semibold">Real-World Featured Projects:</p>
            <div className="space-y-2.5">
              {projects.map((p, i) => (
                <div key={p.id} className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold font-mono">0{i + 1}. {p.name}</span>
                    <div className="flex items-center gap-2">
                      <a href={p.liveLink} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1 font-mono">
                        Live <ExternalLink size={11} />
                      </a>
                      <span className="text-slate-500">|</span>
                      <a href={p.githubLink} target="_blank" rel="noopener noreferrer" className="text-fuchsia-400 hover:underline flex items-center gap-1 font-mono">
                        Code <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                  <p className="text-slate-300">{p.shortDescription}</p>
                  <p className="text-emerald-400 font-mono text-[11px]">Stack: {p.techStack.join(", ")}</p>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case "experience":
      case "education":
        response = (
          <div className="space-y-2 text-xs py-1 text-slate-300">
            <p className="text-cyan-400 font-semibold">Education & Career Path:</p>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white font-bold">B.Sc in Computer Science and Engineering</p>
              <p className="text-fuchsia-400 font-mono">Daffodil International University (DIU), Dhaka · 2024 – Present</p>
              <p className="text-slate-400 text-xs mt-1">Focus on Algorithms, Data Structures, Database Systems & Full-Stack Web Engineering.</p>
            </div>
          </div>
        );
        break;

      case "problem-solving":
        response = (
          <div className="space-y-2 text-xs py-1">
            <p className="text-cyan-400 font-semibold">Competitive Programming Milestones (1303+ Solved):</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <a href="https://codeforces.com/profile/Tu.ser" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-cyan-500/30 text-center hover:border-cyan-400">
                <p className="text-cyan-400 font-bold font-mono">Codeforces</p>
                <p className="text-white text-sm font-extrabold mt-0.5">500 Solved</p>
              </a>
              <a href="https://www.codechef.com/users/tuser579" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-amber-500/30 text-center hover:border-amber-400">
                <p className="text-amber-400 font-bold font-mono">CodeChef</p>
                <p className="text-white text-sm font-extrabold mt-0.5">508 Solved</p>
              </a>
              <a href="https://leetcode.com/u/tuser579/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-emerald-500/30 text-center hover:border-emerald-400">
                <p className="text-emerald-400 font-bold font-mono">LeetCode</p>
                <p className="text-white text-sm font-extrabold mt-0.5">131 Solved</p>
              </a>
              <a href="https://judge.beecrowd.com/en/profile/948665" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-fuchsia-500/30 text-center hover:border-fuchsia-400">
                <p className="text-fuchsia-400 font-bold font-mono">Beecrowd</p>
                <p className="text-white text-sm font-extrabold mt-0.5">164 Solved</p>
              </a>
            </div>
          </div>
        );
        break;

      case "contact":
        response = (
          <div className="space-y-1.5 text-xs py-1 text-slate-300">
            <p className="text-cyan-400 font-semibold mb-1">Get In Touch:</p>
            <p>📧 Email: <a href="mailto:tusermon720@gmail.com" className="text-cyan-400 hover:underline">tusermon720@gmail.com</a></p>
            <p>📱 Phone / WhatsApp: <a href="https://wa.me/8801760049326" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">+880 1760-049326</a></p>
            <p>📍 Location: <span className="text-slate-300">DSC, Asulia, Birulia, Dhaka-1216, Bangladesh</span></p>
            <p>🌐 GitHub: <a href="https://github.com/tuser579" target="_blank" rel="noopener noreferrer" className="text-fuchsia-400 hover:underline">github.com/tuser579</a></p>
            <p>💼 LinkedIn: <a href="https://www.linkedin.com/in/md-muttakiul-islam-tuser-36b104388" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">linkedin.com/in/md-muttakiul-islam-tuser</a></p>
          </div>
        );
        break;

      case "cat":
        if (args.includes("resume")) {
          response = (
            <div className="p-3 rounded-xl bg-black/40 border border-cyan-500/30 font-mono text-[11px] text-slate-300 space-y-1.5">
              <p className="text-emerald-400 font-bold">===================================================</p>
              <p className="text-center font-bold text-white text-xs">MD. MUTTAKIUL ISLAM TUSER · RESUME</p>
              <p className="text-center text-cyan-400">Full-Stack MERN Developer · B.Sc in CSE at DIU</p>
              <p className="text-emerald-400 font-bold">===================================================</p>
              <p className="text-amber-400 font-bold mt-2">[SUMMARY]</p>
              <p>MERN stack developer building high-performance, accessible, and scalable web applications with React, Next.js 15, Node.js, Express & MongoDB.</p>
              <p className="text-amber-400 font-bold mt-2">[KEY PROJECTS]</p>
              <p>• CityFix: Full-stack Civic Issue Reporting Platform (MERN + Leaflet + Firebase)</p>
              <p>• Volt Store: Premium Electronics E-Commerce (Next.js 15 + NextAuth + GSAP)</p>
              <p>• RentWheels: Car Rental Management Platform (MERN + Stripe + JWT)</p>
              <p>• SkillSwap: Community Skill Exchange (React + Tailwind + Firebase)</p>
              <p className="text-cyan-400 font-bold mt-3">👉 Type &apos;download resume&apos; to download the official PDF file.</p>
            </div>
          );
        } else {
          response = <p className="text-red-400">File not found. Try typing: <span className="text-white font-mono">cat resume.txt</span></p>;
        }
        break;

      case "download":
        if (args.includes("resume") || args.includes("pdf")) {
          handleDownloadPDF();
          response = (
            <p className="text-emerald-400 flex items-center gap-1.5">
              <Check size={14} /> Generating & downloading MD_Muttakiul_Islam_Tuser_Resume.pdf...
            </p>
          );
        } else {
          response = <p className="text-yellow-400">Usage: download resume</p>;
        }
        break;

      case "theme":
        if (args === "light") {
          document.documentElement.classList.remove("dark");
          document.documentElement.classList.add("light");
          document.documentElement.setAttribute("data-theme", "light");
          localStorage.setItem("portfolio-theme", "light");
          response = <p className="text-cyan-400">Switched to Light Theme ☀️</p>;
        } else if (args === "dark") {
          document.documentElement.classList.remove("light");
          document.documentElement.classList.add("dark");
          document.documentElement.setAttribute("data-theme", "dark");
          localStorage.setItem("portfolio-theme", "dark");
          response = <p className="text-fuchsia-400">Switched to Dark Theme 🌙</p>;
        } else {
          response = <p className="text-yellow-400">Usage: theme &lt;dark|light&gt; (e.g. &apos;theme light&apos; or &apos;theme dark&apos;)</p>;
        }
        break;

      case "sudo":
        if (args.includes("hire") || args.includes("hire-tuser")) {
          toast.success("🎉 Access Granted! Priority Interview Request Initiated!");
          window.location.href = "#contact";
          response = (
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-400/50 text-xs space-y-1.5">
              <p className="text-emerald-400 font-bold text-sm">🚀 [ROOT ACCESS GRANTED] HIRING PIPELINE UNLOCKED!</p>
              <p className="text-slate-200">
                MD. Muttakiul Islam Tuser is available for Full-Stack / Frontend Developer opportunities (Full-time, Contract, Remote).
              </p>
              <p className="text-cyan-300 font-semibold">
                Direct Email: <a href="mailto:tusermon720@gmail.com" className="underline">tusermon720@gmail.com</a> | WhatsApp: <a href="https://wa.me/8801760049326" className="underline">+8801760049326</a>
              </p>
            </div>
          );
        } else {
          response = <p className="text-red-400">Permission denied. Try: <span className="text-emerald-400 font-mono">sudo hire-tuser</span></p>;
        }
        break;

      case "clear":
      case "cls":
        setHistory([]);
        return;

      case "exit":
      case "quit":
        setIsOpen(false);
        return;

      default:
        response = (
          <p className="text-red-400 text-xs">
            Command not recognized: &apos;{trimmed}&apos;. Type <span className="text-cyan-400 font-semibold cursor-pointer underline" onClick={() => handleCommand("help")}>help</span> to see all commands.
          </p>
        );
        break;
    }

    setHistory((prev) => [...prev, userEcho, { type: "system", content: response }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex > 0 ? historyIndex - 1 : 0;
        setHistoryIndex(nextIdx);
        setInput(commandHistory[nextIdx] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInput(commandHistory[nextIdx]);
      } else {
        setHistoryIndex(commandHistory.length);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = COMMAND_LIST.find((c) => c.cmd.startsWith(input.toLowerCase().trim()));
      if (match) {
        setInput(match.cmd);
      }
    }
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
        aria-label="Open Developer Terminal"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          padding: "0.55rem 1rem",
          borderRadius: 9999,
          background: "var(--glass-bg)",
          backdropFilter: "blur(20px)",
          border: "1px solid var(--glass-border)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(0,212,255,0.15)",
          color: "var(--text-primary)",
          cursor: "pointer",
          transition: "all 0.25s",
        }}
        className="group"
      >
        <span style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--cyan)",
          boxShadow: "0 0 10px var(--cyan)",
          animation: "dot-pulse 1.5s ease-in-out infinite",
        }} />
        <TerminalIcon size={16} style={{ color: "var(--cyan)" }} />
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.78rem",
          fontWeight: 700,
          color: "var(--text-primary)",
        }}>
          CLI Terminal
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.65rem",
          padding: "0.15rem 0.45rem",
          borderRadius: 6,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid var(--glass-border)",
          color: "var(--text-muted)",
        }} className="hidden sm:inline-block">
          Ctrl+K
        </span>
      </motion.button>

      {/* ── Interactive CLI Modal ── */}
      <AnimatePresence>
        {isOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              background: "rgba(2, 8, 24, 0.75)",
              backdropFilter: "blur(16px)",
            }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: isMaximized ? "94vw" : "740px",
                height: isMaximized ? "90vh" : "540px",
                background: "rgba(4, 13, 36, 0.94)",
                backdropFilter: "blur(36px)",
                border: "1px solid rgba(0, 212, 255, 0.35)",
                borderRadius: 20,
                boxShadow: "0 25px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 212, 255, 0.15)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {/* Window Header */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.75rem 1rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(2, 8, 24, 0.8)",
              }}>
                {/* Traffic lights */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Close Terminal"
                    style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444", border: "none", cursor: "pointer" }}
                  />
                  <button
                    onClick={() => setIsMaximized(false)}
                    aria-label="Minimize Terminal"
                    style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b", border: "none", cursor: "pointer" }}
                  />
                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    aria-label="Maximize Terminal"
                    style={{ width: 12, height: 12, borderRadius: "50%", background: "#10b981", border: "none", cursor: "pointer" }}
                  />
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.7)",
                    marginLeft: "0.5rem",
                    fontWeight: 600,
                  }}>
                    tuser@portfolio-terminal: ~
                  </span>
                </div>

                {/* Header Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", display: "flex" }}
                  >
                    {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", display: "flex" }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Quick Suggestion Chips */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 1rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                background: "rgba(255, 255, 255, 0.02)",
                overflowX: "auto",
              }}>
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap" }}>
                  Quick:
                </span>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleCommand(s)}
                    style={{
                      padding: "0.2rem 0.55rem",
                      borderRadius: 6,
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      color: "var(--cyan)",
                      fontSize: "0.7rem",
                      fontFamily: "'JetBrains Mono', monospace",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,212,255,0.15)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Terminal Log Console */}
              <div
                ref={scrollRef}
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "1rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.82rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {history.map((h, i) => (
                  <div key={i}>{h.content}</div>
                ))}
              </div>

              {/* Terminal Input Line */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(2, 8, 24, 0.8)",
              }}>
                <span style={{ color: "#10b981", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "0.85rem" }}>
                  tuser@portfolio:~$
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="type a command (e.g. 'help', 'skills', 'projects', 'sudo hire-tuser')..."
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#ffffff",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.85rem",
                  }}
                  autoFocus
                />
                <button
                  onClick={() => {
                    handleCommand(input);
                    setInput("");
                  }}
                  style={{
                    background: "rgba(0, 212, 255, 0.15)",
                    border: "1px solid rgba(0, 212, 255, 0.3)",
                    color: "var(--cyan)",
                    borderRadius: 8,
                    padding: "0.3rem 0.5rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <CornerDownLeft size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
