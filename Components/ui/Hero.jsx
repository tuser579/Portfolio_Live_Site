"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Download, Eye, Github, Linkedin, Twitter, Facebook,
  X, FileText, ExternalLink, Loader2, MapPin, Mail, Phone
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import profilePhoto from "../../public/lustro-Gemini_Generated_Image_kkbq5akkbq5akkbq.png";
import { projects } from "../../data/portfolio";
import { certifications } from "../../data/portfolio";

// ─────────────────────────────────────────────────────────────
//  PDF GENERATOR (unchanged)
// ─────────────────────────────────────────────────────────────
async function generateAndDownloadPDF() {
  const { default: jsPDF } = await import("jspdf");

  const W = 210;
  const H = 297;
  const MARGIN = 18;
  const CW = W - MARGIN * 2;

  const BLACK = [15, 23, 42];
  const MUTED = [100, 116, 139];
  const LINK = [14, 116, 144];

  // GAP: exact equal space between Section Title text and underline, AND between underline and Section Content
  const GAP = 1.3;

  function renderResumeContent(doc, startY) {
    let y = startY;

    const addLink = (text, url, x, linkY, fontSize) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(fontSize);
      doc.setTextColor(...LINK);
      doc.text(text, x, linkY);
      const tw = doc.getTextWidth(text);
      doc.setDrawColor(...LINK);
      doc.setLineWidth(0.15);
      doc.line(x, linkY + 0.5, x + tw, linkY + 0.5);
      doc.link(x, linkY - fontSize * 0.35, tw, fontSize * 0.35 + 1, { url });
      return tw;
    };

    const sectionTitle = (title) => {
      y += 7.8; // space above section title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...BLACK);
      doc.text(title.toUpperCase(), MARGIN, y);

      const lineY = y + GAP;
      doc.setDrawColor(180, 190, 205);
      doc.setLineWidth(0.25);
      doc.line(MARGIN, lineY, W - MARGIN, lineY);

      // Distance from line to top of content letters = GAP
      // Content font size ~9.5pt (cap height ~2.3mm) -> baseline = lineY + GAP + 2.3mm
      y = lineY + GAP + 2.3;
    };

    const bullet = (text, indent = 3) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.2);
      doc.setTextColor(...BLACK);
      doc.text("\u2022", MARGIN + indent, y);
      const lines = doc.splitTextToSize(text, CW - indent - 4);
      doc.text(lines, MARGIN + indent + 3.5, y);
      y += (lines.length - 1) * 3.8 + 3.9;
    };

    // ── Header ──────────────────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...BLACK);
    doc.text("MD. MUTTAKIUL ISLAM TUSER", W / 2, y, { align: "center" });
    y += 5.8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);
    doc.text("Full-Stack Web Developer | MERN Stack | Frontend Focused", W / 2, y, { align: "center" });
    y += 4.8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.2);
    doc.setTextColor(71, 85, 105);
    doc.text("tusermon720@gmail.com  |  +880 1760-049326  |  DSC, Asulia, Birulia, Dhaka-1216, Bangladesh", W / 2, y, { align: "center" });
    y += 4.6;

    const socials = [
      { label: "Portfolio", url: "https://portfolio-live-site.vercel.app/" },
      { label: "GitHub",    url: "https://github.com/tuser579" },
      { label: "LinkedIn",  url: "https://www.linkedin.com/in/md-muttakiul-islam-tuser-36b104388" },
    ];
    const sep = "  |  ";
    doc.setFontSize(9.2);
    const sepW  = doc.getTextWidth(sep);
    const lWs   = socials.map(s => doc.getTextWidth(s.label));
    const totW  = lWs.reduce((a,b) => a+b, 0) + sepW * (socials.length - 1);
    let sx = (W - totW) / 2;
    socials.forEach((s, i) => {
      addLink(s.label, s.url, sx, y, 9.2);
      sx += lWs[i];
      if (i < socials.length - 1) {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...MUTED);
        doc.text(sep, sx, y);
        sx += sepW;
      }
    });

    // ── Career Objective ────────────────────────────────────────────────
    sectionTitle("Career Objective");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.2);
    doc.setTextColor(...BLACK);
    const summary = "A MERN-Stack Developer by passion, I started my coding journey with HTML, CSS, and JavaScript before diving deep into React, Next.js, Node.js, Express.js, and MongoDB. Through car rental booking systems, community skill-sharing platforms, cityfix issue solving systems, and e-commerce applications, I have honed my ability to solve real-world problems. Proficient in responsive UI development with Tailwind CSS and deployment workflows using Vercel, Netlify, and Firebase. My goal is simple: build applications that are practical, meaningful, and delightful for users.";
    const sumLines = doc.splitTextToSize(summary, CW);
    doc.text(sumLines, MARGIN, y, { align: "justify", maxWidth: CW });
    y += (sumLines.length - 1) * 3.8;

    // ── Technical Skills ────────────────────────────────────────────────
    sectionTitle("Technical Skills");
    const skillGroups = [
      ["Frontend Development", "HTML5, CSS3, Tailwind CSS, JavaScript (ES6+), TypeScript, React.js, Next.js"],
      ["Backend Development",  "Node.js, Express.js"],
      ["Database",             "MongoDB, MySQL"],
      ["Version Control & Deploy", "Git, GitHub, Netlify, Cloudflare, Firebase, Vercel, Railway, Render"],
      ["Languages",            "C, C++"],
      ["Soft Skills",          "Team Collaboration, Problem-Solving, Adaptability"],
    ];
    skillGroups.forEach(([label, value], idx) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.2);
      doc.setTextColor(...BLACK);
      const lt = label + ":  ";
      const lw = doc.getTextWidth(lt);
      doc.text(lt, MARGIN + 2, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...BLACK);
      const vl = doc.splitTextToSize(value, CW - 2 - lw);
      doc.text(vl, MARGIN + 2 + lw, y);
      if (idx < skillGroups.length - 1) {
        y += (vl.length - 1) * 3.8 + 4.5;
      } else {
        y += (vl.length - 1) * 3.8;
      }
    });

    // ── Projects ────────────────────────────────────────────────────────
    sectionTitle("Projects");
    const projectList = projects.slice(0, 3);
    projectList.forEach((p, pIdx) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.8);
      doc.setTextColor(...BLACK);
      const tl = "Title: ";
      const tlw = doc.getTextWidth(tl);
      doc.text(tl, MARGIN, y);
      doc.text(p.name, MARGIN + tlw, y);

      const liveLabel = "Live Demo";
      const separator = "   |   ";
      const repoLabel = "GitHub";
      doc.setFontSize(9.2);
      const liveTW = doc.getTextWidth(liveLabel);
      const sepTW  = doc.getTextWidth(separator);
      const repoTW = doc.getTextWidth(repoLabel);
      let rx = W - MARGIN - liveTW - sepTW - repoTW;
      addLink(liveLabel, p.liveLink, rx, y, 9.2);
      rx += liveTW;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...MUTED);
      doc.text(separator, rx, y);
      rx += sepTW;
      addLink(repoLabel, p.githubLink, rx, y, 9.2);
      y += 4.2;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.2);
      doc.setTextColor(...BLACK);
      const ol = "Overview: ";
      const olw = doc.getTextWidth(ol);
      doc.text(ol, MARGIN, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...BLACK);
      const ovLines = doc.splitTextToSize(p.shortDescription, CW - olw);
      doc.text(ovLines, MARGIN + olw, y);
      y += (ovLines.length - 1) * 3.8 + 3.8;

      if (p.highlights && Array.isArray(p.highlights)) {
        p.highlights.slice(0, 3).forEach(h => bullet(h));
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.2);
      doc.setTextColor(...BLACK);
      const techLbl = "Technologies:  ";
      const tlbw = doc.getTextWidth(techLbl);
      doc.text(techLbl, MARGIN + 3, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...BLACK);
      const techL = doc.splitTextToSize(p.techStack.join(", "), CW - 3 - tlbw);
      doc.text(techL, MARGIN + 3 + tlbw, y);

      if (pIdx < projectList.length - 1) {
        y += (techL.length - 1) * 3.8 + 5.6;
      } else {
        y += (techL.length - 1) * 3.8;
      }
    });

    // ── Problem Solving ─────────────────────────────────────────────────
    sectionTitle("Problem Solving");
    const psData = [
      { platform: "Codeforces", count: "500 Solved", url: "https://codeforces.com/profile/Tu.ser" },
      { platform: "CodeChef",   count: "508 Solved", url: "https://www.codechef.com/users/tuser579" },
      { platform: "LeetCode",   count: "131 Solved", url: "https://leetcode.com/u/tuser579/" },
      { platform: "Beecrowd",   count: "164 Solved", url: "https://judge.beecrowd.com/en/profile/948665" },
    ];
    psData.forEach((item, i) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.2);
      doc.setTextColor(...BLACK);
      const pl = item.platform + ": ";
      doc.text(pl, MARGIN, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...BLACK);
      doc.text(item.count, MARGIN + doc.getTextWidth(pl), y);
      const ll = "Profile Link";
      addLink(ll, item.url, W - MARGIN - doc.getTextWidth(ll), y, 9.2);
      if (i < psData.length - 1) {
        y += 4.5;
      }
    });

    // ── Education ───────────────────────────────────────────────────────
    sectionTitle("Education");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.2);
    doc.setTextColor(...BLACK);
    doc.text("B.Sc in Computer Science and Engineering", MARGIN, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...BLACK);
    doc.text("2024 \u2013 Present", W - MARGIN, y, { align: "right" });
    y += 4.5;
    doc.text("Daffodil International University (DIU), Dhaka", MARGIN, y);

    // ── Certifications ──────────────────────────────────────────────────
    sectionTitle("Certifications");
    certifications.slice(0, 2).forEach((cert, idx) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.2);
      doc.setTextColor(...BLACK);
      const iss = cert.issuer + ":   ";
      doc.text(iss, MARGIN, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...BLACK);
      const dL = doc.splitTextToSize(cert.description, CW - doc.getTextWidth(iss) - 18);
      doc.text(dL, MARGIN + doc.getTextWidth(iss), y);
      if (cert.credentialUrl) {
        const lbl = "View";
        addLink(lbl, cert.credentialUrl, W - MARGIN - doc.getTextWidth(lbl), y, 9.2);
      }
      if (idx < certifications.length - 1) {
        y += (dL.length - 1) * 3.8 + 4.6;
      } else {
        y += (dL.length - 1) * 3.8;
      }
    });

    // ── Languages ───────────────────────────────────────────────────────
    sectionTitle("Languages");
    bullet("Bengali (Native)", 2);
    bullet("English (Intermediate)", 2);

    return y;
  }

  // Pass 1: Measure total content height
  const measureDoc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const totalContentHeight = renderResumeContent(measureDoc, 0);

  // Calculate EXACT equal margin for top and bottom
  const equalMargin = Math.round(((H - totalContentHeight) / 2) * 100) / 100;

  // Pass 2: Render final PDF with exact equal top and bottom margins
  const finalDoc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  renderResumeContent(finalDoc, equalMargin);

  finalDoc.save("MD_Muttakiul_Islam_Tuser_Resume.pdf");
}

// ─────────────────────────────────────────────────────────────
//  DOWNLOAD BUTTON
// ─────────────────────────────────────────────────────────────
const DownloadButton = ({ className, iconSize = "w-3.5 h-3.5", label = "Download", style }) => {
  const [downloading, setDownloading] = useState(false);
  const handleClick = async (e) => {
    e.stopPropagation();
    setDownloading(true);
    try { await generateAndDownloadPDF(); }
    finally { setDownloading(false); }
  };
  return (
    <button onClick={handleClick} disabled={downloading} className={className} style={style}>
      {downloading ? <Loader2 className={`${iconSize} animate-spin`} /> : <Download className={iconSize} />}
      {downloading ? "Generating..." : label}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────
//  RESUME MODAL — Liquid Glass redesign
// ─────────────────────────────────────────────────────────────
const ResumeModal = ({ onClose }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: "var(--bg-layer)",
          backdropFilter: "blur(32px)",
          border: "1px solid var(--glass-border-hover)",
          boxShadow: "var(--glow-card)",
        }}
      >
        {/* Top bar */}
        <div style={{ borderBottom: "1px solid var(--glass-border)", padding: "0.75rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }} className="sm:px-6 sm:py-3.5">
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div style={{ padding: "0.45rem", borderRadius: 10, background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.3)", flexShrink: 0 }}>
              <FileText size={16} style={{ color: "var(--cyan)" }} />
            </div>
            {/* Name and subtitle hidden on mobile and tablet devices, visible only on desktop */}
            <div className="hidden lg:block">
              <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: "var(--text-primary)", fontSize: "0.88rem", lineHeight: 1.2 }}>
                MD. MUTTAKIUL ISLAM TUSER
              </p>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", color: "var(--cyan)", fontSize: "0.65rem", marginTop: 2, fontWeight: 600 }}>
                MERN Stack Developer · Resume
              </p>
            </div>
            {/* Simple concise label on mobile and tablet */}
            <span className="lg:hidden font-bold text-xs sm:text-sm text-[var(--text-primary)]" style={{ fontFamily: "'Outfit',sans-serif" }}>
              Resume Preview
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexShrink: 0 }}>
            <DownloadButton
              label="Download" iconSize="w-3.5 h-3.5"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold text-white transition-all btn-primary"
            />
            <button onClick={onClose} aria-label="Close modal" style={{ padding: "0.45rem", borderRadius: 9999, border: "1px solid var(--glass-border)", color: "var(--text-secondary)", cursor: "pointer", background: "transparent", display: "flex", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--cyan)"; e.currentTarget.style.color = "var(--cyan)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--glass-border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-7 space-y-6 sm:space-y-7">
          {/* Header */}
          <div style={{ textAlign: "center", paddingBottom: "1.25rem", borderBottom: "1px solid var(--glass-border)" }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "clamp(1.1rem, 3.5vw, 1.5rem)", color: "var(--text-primary)", marginBottom: "0.35rem", lineHeight: 1.2 }}>
              MD. MUTTAKIUL ISLAM TUSER
            </h2>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", color: "var(--cyan)", fontSize: "clamp(0.7rem, 2vw, 0.8rem)", fontWeight: 600, marginBottom: "0.65rem", lineHeight: 1.4 }}>
              Full-Stack Web Developer | MERN Stack | Frontend Focused
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.35rem 0.85rem", fontSize: "0.74rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              <span>tusermon720@gmail.com</span>
              <span className="hidden sm:inline">·</span>
              <span>+8801760049326</span>
              <span className="hidden sm:inline">·</span>
              <span>DSC, Asulia, Birulia, Dhaka-1216</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.75rem", marginTop: "0.6rem" }}>
              {[{ label: "GitHub", href: "https://github.com/tuser579" }, { label: "LinkedIn", href: "https://www.linkedin.com/in/md-muttakiul-islam-tuser-36b104388" }].map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", color: "var(--cyan)", textDecoration: "none", fontWeight: 600 }}>
                  {label} <ExternalLink size={11} />
                </a>
              ))}
            </div>
          </div>

          {/* Career Objective */}
          <div>
            <h3 style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--cyan)", marginBottom: "0.6rem" }}>Career Objective</h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.85rem" }}>A MERN-Stack Developer by passion, I started my coding journey with HTML, CSS, and JavaScript before diving deep into React, Next.js, Node.js, Express.js, and MongoDB. Proficient in responsive UI development with Tailwind CSS and deployment workflows using Vercel, Netlify, and Firebase. My goal: build applications that are practical, meaningful, and delightful.</p>
          </div>

          {/* Skills */}
          <div>
            <h3 style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--cyan)", marginBottom: "0.75rem" }}>Skills</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "0.6rem" }}>
              {[
                { label: "Frontend", value: "HTML, CSS, Tailwind CSS, JS, React.js, Next.js" },
                { label: "Backend", value: "Node.js, Express.js" },
                { label: "Database", value: "MongoDB, MySQL, Firebase" },
                { label: "Deploy", value: "Git, GitHub, Vercel, Netlify" },
                { label: "Languages", value: "C, C++" },
                { label: "Soft Skills", value: "Team collaboration, Problem-solving" },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 10, padding: "0.65rem 0.85rem", boxShadow: "var(--glow-card)" }}>
                  <p style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--cyan)", marginBottom: "0.3rem", fontFamily: "'JetBrains Mono',monospace" }}>{label}</p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.78rem", lineHeight: 1.5 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div>
            <h3 style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--cyan)", marginBottom: "0.75rem" }}>Projects</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {[0, 1, 2].map(i => ({ name: projects[i].name, desc: projects[i].shortDescription, highlights: projects[i].highlights, tech: projects[i].techStack.slice(0, 5), link: projects[i].liveLink, github: projects[i].githubLink })).map(({ name, desc, highlights, tech, link, github }) => (
                <div key={name} style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 12, padding: "1rem", boxShadow: "var(--glow-card)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <h4 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9rem" }}>{name}</h4>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <a href={github} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-secondary)", transition: "color 0.2s" }}><svg width={15} height={15} fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg></a>
                      <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-secondary)" }}><ExternalLink size={14} /></a>
                    </div>
                  </div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.78rem", lineHeight: 1.6, marginBottom: "0.5rem" }}><span style={{ color: "var(--violet)", fontWeight: 600 }}>Overview: </span>{desc}</p>
                  <div style={{ marginBottom: "0.5rem" }}>
                    {highlights && highlights.map((h, idx) => (
                      <div key={idx} style={{ display: "flex", gap: "0.4rem", alignItems: "flex-start", marginBottom: "0.2rem" }}>
                        <span style={{ color: "var(--cyan)", fontSize: "0.6rem", marginTop: 3 }}>▹</span>
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.73rem", lineHeight: 1.5 }}>{h}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                    {tech.map(t => <span key={t} style={{ fontSize: "0.65rem", padding: "0.15rem 0.55rem", borderRadius: 9999, border: "1px solid var(--glass-border)", color: "var(--cyan)", fontFamily: "'JetBrains Mono',monospace", background: "rgba(0,212,255,0.08)" }}>{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Problem Solving */}
          <div>
            <h3 style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--cyan)", marginBottom: "0.75rem" }}>Problem Solving</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                { platform: "Codeforces", count: 500, profile: "https://codeforces.com/profile/Tu.ser", color: "#3b82f6" },
                { platform: "CodeChef",  count: 508, profile: "https://www.codechef.com/users/tuser579", color: "#f59e0b" },
                { platform: "LeetCode",  count: 131, profile: "https://leetcode.com/u/tuser579/",       color: "#f97316" },
                { platform: "Beecrowd",  count: 164, profile: "https://judge.beecrowd.com/en/profile/948665", color: "#10b981" },
              ].map(({ platform, count, profile, color }) => (
                <a key={platform} href={profile} target="_blank" rel="noopener noreferrer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.65rem 1rem", borderRadius: 10, background: "var(--glass-bg)", border: `1px solid ${color}35`, textDecoration: "none", transition: "all 0.2s", boxShadow: "var(--glow-card)" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}60`; e.currentTarget.style.background = `${color}10`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}35`; e.currentTarget.style.background = "var(--glass-bg)"; }}>
                  <span style={{ color, fontWeight: 700, fontFamily: "'Outfit',sans-serif", fontSize: "0.9rem" }}>{platform}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, color: "var(--text-primary)", fontSize: "1rem" }}>{count}</span>
                    <ExternalLink size={13} style={{ color }} />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--cyan)", marginBottom: "0.75rem" }}>Education</h3>
            <div style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderLeft: "3px solid var(--cyan)", borderRadius: 12, padding: "1rem", boxShadow: "var(--glow-card)" }}>
              <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9rem" }}>B.Sc. in Computer Science & Engineering</p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginTop: 3 }}>Daffodil International University (DIU)</p>
              <p style={{ color: "var(--cyan)", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.72rem", marginTop: 4, fontWeight: 600 }}>2024 – Present · DSC, Asulia, Birulia, Dhaka</p>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--cyan)", marginBottom: "0.75rem" }}>Certifications & Competitions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {certifications.map((cert) => (
                <div key={cert.title} style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 12, padding: "0.9rem", boxShadow: "var(--glow-card)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.85rem", lineHeight: 1.4 }}>{cert.title}</p>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", color: "var(--text-secondary)", whiteSpace: "nowrap", marginLeft: "0.5rem" }}>{cert.date}</span>
                  </div>
                  <p style={{ color: "var(--violet)", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem", marginTop: 3, fontWeight: 600 }}>{cert.issuer}</p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.78rem", marginTop: 5, lineHeight: 1.5 }}>{cert.description}</p>
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", marginTop: 7, fontSize: "0.7rem", color: "var(--cyan)", textDecoration: "none", fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>
                      View Credential <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h3 style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--cyan)", marginBottom: "0.6rem" }}>Languages</h3>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {[{ lang: "Bengali", level: "Native" }, { lang: "English", level: "Intermediate" }].map(({ lang, level }) => (
                <div key={lang} style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 10, padding: "0.5rem 1rem", textAlign: "center", boxShadow: "var(--glow-card)" }}>
                  <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.82rem" }}>{lang}</p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.7rem" }}>{level}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid var(--glass-border)", padding: "0.9rem 1.25rem", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem", color: "var(--text-secondary)" }} className="hidden sm:block">All links are clickable in the PDF</p>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button onClick={onClose} style={{ padding: "0.6rem 1.2rem", borderRadius: 9999, border: "1px solid var(--glass-border)", color: "var(--text-secondary)", background: "transparent", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, transition: "all 0.2s", fontFamily: "'Outfit',sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--cyan)"; e.currentTarget.style.color = "var(--cyan)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--glass-border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
              Close
            </button>
            <DownloadButton label="Download PDF" iconSize="w-4 h-4" className="btn-primary text-sm" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

// ─────────────────────────────────────────────────────────────
//  HERO
// ─────────────────────────────────────────────────────────────
const SOCIALS = [
  { icon: Github,   href: "https://github.com/tuser579",                                           label: "GitHub",   color: "#94a3b8" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/md-muttakiul-islam-tuser-36b104388",         label: "LinkedIn", color: "#0ea5e9" },
  { icon: Twitter,  href: "https://x.com/md_57990667",                                             label: "Twitter",  color: "#38bdf8" },
  { icon: Facebook, href: "https://www.facebook.com/mohammad.osman.98622",                         label: "Facebook", color: "#60a5fa" },
];

const STATS = [
  { value: "4+",    label: "Projects"      },
  { value: "1303+", label: "Problems Solved"},
  { value: "MERN",  label: "Stack"          },
];

const Hero = () => {
  const [showResume, setShowResume] = useState(false);

  return (
    <>
      {showResume && <ResumeModal onClose={() => setShowResume(false)} />}

      <section
        id="home"
        className="min-h-screen flex items-center pt-28 pb-16 w-full px-4 sm:px-6 lg:px-8"
      >
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center w-full">

            {/* ── Left: Text ── */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="order-2 lg:order-1 lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left w-full"
            >
              {/* Tag */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.78rem", color: "var(--cyan)", letterSpacing: "0.12em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--cyan)", boxShadow: "0 0 8px var(--cyan)", animation: "dot-pulse 1.5s ease-in-out infinite" }} />
                  Hello, I&apos;m
                </span>
              </motion.div>

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7 }}
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(2.4rem, 5.5vw, 4rem)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.03em",
                  marginTop: "0.65rem",
                  marginBottom: "0.5rem",
                  color: "var(--text-primary)",
                }}
              >
                MD.MUTTAKIUL
                <br />
                ISLAM{" "}
                <span style={{ background: "linear-gradient(135deg,#00d4ff,#a78bfa,#f0abfc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  TUSER
                </span>
              </motion.h1>

              {/* Role */}
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                style={{ fontFamily: "'JetBrains Mono',monospace", color: "var(--cyan)", fontSize: "0.95rem", marginBottom: "0.85rem", fontWeight: 600 }}>
                Full MERN Stack Developer · Frontend Focused
              </motion.p>

              {/* Bio */}
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: 500, marginBottom: "1.5rem" }}
                className="mx-auto lg:mx-0"
              >
                I craft pixel-perfect, scalable web applications with React, Next.js, Node.js, Express &amp; MongoDB — driven by clean code and delightful UX.
              </motion.p>

              {/* Stats pills */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                className="flex flex-wrap justify-center lg:justify-start gap-2.5 mb-7 w-full">
                {STATS.map(({ value, label }) => (
                  <div key={label} style={{
                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                    padding: "0.35rem 0.9rem", borderRadius: 9999,
                    background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "var(--glow-card)",
                  }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: "var(--cyan)", fontSize: "0.82rem" }}>{value}</span>
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem", fontWeight: 500 }}>{label}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                className="flex flex-wrap justify-center lg:justify-start gap-3.5 mb-8 w-full">
                <button
                  onClick={() => setShowResume(true)}
                  className="btn-primary"
                  style={{ fontSize: "0.9rem" }}
                >
                  <Eye size={16} /> View Resume
                </button>
                <Link href="#contact" className="btn-ghost" style={{ fontSize: "0.9rem" }}>
                  Hire Me →
                </Link>
              </motion.div>

              {/* Social icons */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                className="flex justify-center lg:justify-start gap-3 w-full">
                {SOCIALS.map(({ icon: Icon, href, label, color }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    style={{
                      width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: 9999, background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
                      color: "var(--text-secondary)", textDecoration: "none", transition: "all 0.3s",
                      boxShadow: "var(--glow-card)",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = color; e.currentTarget.style.borderColor = `${color}50`; e.currentTarget.style.background = `${color}12`; e.currentTarget.style.boxShadow = `0 0 16px ${color}30`; e.currentTarget.style.transform = "translateY(-3px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--glass-border)"; e.currentTarget.style.background = "var(--glass-bg)"; e.currentTarget.style.boxShadow = "var(--glow-card)"; e.currentTarget.style.transform = "none"; }}
                  >
                    <Icon size={17} />
                  </a>
                ))}
              </motion.div>
            </motion.div>

            {/* ── Right: 3D Profile Frame ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="order-1 lg:order-2 lg:col-span-5 flex justify-center lg:justify-end items-center w-full"
            >
              <div style={{ position: "relative", width: "100%", maxWidth: 360, display: "flex", justifyContent: "center" }} className="lg:justify-end">
                <div style={{ position: "relative", width: "100%", maxWidth: 330 }}>
                  {/* Outer glow ring */}
                  <div style={{
                    position: "absolute", inset: -15, borderRadius: 28,
                    background: "conic-gradient(from 0deg, #00d4ff, #7c3aed, #f0abfc, #00d4ff)",
                    filter: "blur(20px)", opacity: 0.35, animation: "spin-slow 12s linear infinite",
                    zIndex: 0,
                  }} />

                  {/* Prism border frame */}
                  <div className="glass-prism animate-float-slow"
                    style={{ position: "relative", zIndex: 1, borderRadius: 24, padding: 4, width: "100%" }}>
                    <div style={{
                      width: "100%",
                      aspectRatio: "1 / 1",
                      borderRadius: 20,
                      overflow: "hidden",
                      position: "relative",
                    }}>
                      <Image
                        src={profilePhoto}
                        alt="MD. Muttakiul Islam Tuser"
                        fill
                        className="object-cover"
                        priority
                        style={{ filter: "brightness(0.95) saturate(1.05)" }}
                      />
                      {/* Shine overlay */}
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)",
                        pointerEvents: "none",
                      }} />
                    </div>
                  </div>

                  {/* Floating badge — bottom left */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      position: "absolute", bottom: -12, left: -14, zIndex: 2,
                      background: "var(--bg-layer)", backdropFilter: "blur(16px)",
                      border: "1px solid var(--glass-border-hover)", borderRadius: 12,
                      padding: "0.45rem 0.85rem", display: "flex", alignItems: "center", gap: "0.4rem",
                      boxShadow: "var(--glow-card)",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>⚡</span>
                    <div>
                      <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: "var(--text-primary)", fontSize: "0.75rem", lineHeight: 1 }}>MERN Stack</p>
                      <p style={{ fontFamily: "'JetBrains Mono',monospace", color: "var(--cyan)", fontSize: "0.6rem", fontWeight: 600 }}>Full-Stack Dev</p>
                    </div>
                  </motion.div>

                  {/* Floating badge — top right */}
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    style={{
                      position: "absolute", top: -12, right: -12, zIndex: 2,
                      background: "var(--bg-layer)", backdropFilter: "blur(16px)",
                      border: "1px solid var(--glass-border-hover)", borderRadius: 12,
                      padding: "0.4rem 0.75rem", display: "flex", alignItems: "center", gap: "0.35rem",
                      boxShadow: "var(--glow-card)",
                    }}
                  >
                    <span style={{ fontSize: 14 }}>🏆</span>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: "var(--violet)", fontSize: "0.68rem" }}>1303+ Solved</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}
        >
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.1em", fontWeight: 600 }}>SCROLL</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 2, height: 28, background: "linear-gradient(var(--cyan), transparent)", borderRadius: 9999 }}
          />
        </motion.div>
      </section>
    </>
  );
};

export default Hero;