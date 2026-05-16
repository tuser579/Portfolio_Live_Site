"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Download, Eye, Github, Linkedin, Twitter, Facebook,
    X, FileText, ExternalLink, Loader2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import profilePhoto from "../../public/lustro-Gemini_Generated_Image_kkbq5akkbq5akkbq.png";
import { projects } from "../../data/portfolio";
import { certifications } from "../../data/portfolio";

// ─────────────────────────────────────────────────────────────
//  PDF GENERATOR — all links are clickable via doc.link()
// ─────────────────────────────────────────────────────────────

async function generateAndDownloadPDF() {
    const { default: jsPDF } = await import("jspdf");

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const W = 210;
    const MARGIN = 18; // Slightly tighter margin to gain vertical space
    const CW = W - MARGIN * 2;
    let y = 20;

    const BLACK = [0, 0, 0];
    const DARK = [30, 30, 30];
    const MID = [60, 60, 60];
    const MUTED = [110, 110, 110];
    const LINK = [10, 100, 200];

    const checkPage = (need = 10) => {
        if (y + need > 279) { doc.addPage(); y = 18; }
    };

    const hRule = () => {
        doc.setDrawColor(...MUTED);
        doc.setLineWidth(0.2);
        doc.line(MARGIN, y, W - MARGIN, y);
        y += 2.8; // Tightened from 4
    };

    const sectionTitle = (title) => {
        checkPage(12);
        y += 3.0; // Tightened from 5
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...BLACK);
        doc.text(title.toUpperCase(), MARGIN, y);
        y += 1.3;
        hRule();
    };

    const addLink = (text, url, x, linkY, fontSize) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(fontSize);
        doc.setTextColor(...LINK);
        doc.text(text, x, linkY);
        const tw = doc.getTextWidth(text);
        doc.setDrawColor(...LINK);
        doc.setLineWidth(0.15);
        doc.line(x, linkY + 0.6, x + tw, linkY + 0.6);
        const lh = fontSize * 0.35;
        doc.link(x, linkY - lh, tw, lh + 1, { url });
        return tw;
    };

    const bullet = (text, indent = 4) => {
        checkPage(6);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...BLACK);
        doc.text("\u2022", MARGIN + indent, y);
        const lines = doc.splitTextToSize(text, CW - indent - 5);
        doc.text(lines, MARGIN + indent + 4, y);
        y += lines.length * 3.4 + 0.5; // Tightened line height
    };

    // ── HEADER ──
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...BLACK);
    doc.text("MD. MUTTAKIUL ISLAM TUSER", W / 2, y, { align: "center" });
    y += 5.0;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...BLACK);
    doc.text("Full-Stack Web Developer | MERN Stack | Frontend Focused", W / 2, y, { align: "center" });
    y += 4.5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...BLACK);
    doc.text("tusermon720@gmail.com  |  +880 1760-049326  |  DSC, Asulia, Birulia, Dhaka-1216, Bangladesh", W / 2, y, { align: "center" });
    y += 4.5;

    const socials = [
        { label: "Portfolio", url: "https://portfolio-live-site.vercel.app/" },
        { label: "GitHub", url: "https://github.com/tuser579" },
        { label: "LinkedIn", url: "https://www.linkedin.com/in/md-muttakiul-islam-tuser-36b104388" },
    ];

    const sep = "  |  ";
    doc.setFontSize(9);
    const sepW = doc.getTextWidth(sep);
    const lWs = socials.map(s => doc.getTextWidth(s.label));
    const totalW = lWs.reduce((a, b) => a + b, 0) + sepW * (socials.length - 1);
    let sx = (W - totalW) / 2;

    socials.forEach((s, i) => {
        addLink(s.label, s.url, sx, y, 9);
        sx += lWs[i];
        if (i < socials.length - 1) {
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...MUTED);
            doc.text(sep, sx, y);
            sx += sepW;
        }
    });
    y += 5;

    // ── CAREER OBJECTIVE ──
    sectionTitle("Career Objective");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...BLACK);
    const summary =
        "A MERN-Stack Developer by passion, I started my coding journey with HTML, CSS, and JavaScript " +
        "before diving deep into React, Next.js Node.js, Express.js, and MongoDB. Through car rental   " +
        "booking systems, community skill-sharing platforms, cityfix issue solving systems, e-commerce " +
        "website applications. Proficient in responsive UI development with Tailwind CSS and deployment" +
        "workflows using Vercel, Netlify, and Firebase. I have honed my ability to solve problems. My  " +
        "goal is simple: build applications that are practical, meaningful, and delightful for users.";
    const sumLines = doc.splitTextToSize(summary, CW);
    doc.text(sumLines, MARGIN, y);
    y += sumLines.length * 3.5 + 2;

    // ── TECHNICAL SKILLS ──
    sectionTitle("Technical Skills");
    const skillGroups = [
        ["Frontend Development", "HTML5, CSS3, Tailwind CSS, JavaScript (ES6+), React.js, Next.js"],
        ["Backend Development", "Node.js, Express.js"],
        ["Database", "MongoDB"],
        ["Version Control & Deploy", "Git, GitHub, Netlify, Cloudflare, Surge, Firebase, Vercel, Railway, Render"],
        ["Languages", "C, C++"],
        ["Soft Skills", "Team Collaboration, Problem-Solving, Adaptability"],
    ];

    skillGroups.forEach(([label, value]) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...BLACK);
        const labelText = label + ":  ";
        const lw = doc.getTextWidth(labelText);
        doc.text(labelText, MARGIN + 2, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...BLACK);
        const valLines = doc.splitTextToSize(value, CW - 2 - lw);
        doc.text(valLines, MARGIN + 2 + lw, y);
        y += valLines.length * 4 + 0.5;
    });

    // ═══════════════════════════════════════════════════════════
    // PROJECTS
    // ═══════════════════════════════════════════════════════════

    sectionTitle("Projects");
    projects.slice(0, 3).forEach((p) => {
        checkPage(38);
        // ── Project name (left) + links (right) on same line ──
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(...BLACK);

        const titleLabel = "Title: ";
        const titleLabelWidth = doc.getTextWidth(titleLabel);

        // Draw the "Title: " label
        doc.text(titleLabel, MARGIN, y);
        // Draw the actual Project Name immediately after the label
        doc.setFont("helvetica", "bold"); // Keep bold or change to normal if preferred
        doc.text(p.name, MARGIN + titleLabelWidth, y);

        // Links logic...
        const liveLabel = "Live Demo";
        const separator = "   |   ";
        const repoLabel = "GitHub";
        doc.setFontSize(9.5);
        const repoTW = doc.getTextWidth(repoLabel);
        const sepTW = doc.getTextWidth(separator);
        const liveTW = doc.getTextWidth(liveLabel);
        const rowW = liveTW + sepTW + repoTW;
        let rx = W - MARGIN - rowW;

        addLink(liveLabel, p.liveLink, rx, y, 9.5);
        rx += liveTW;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...MUTED);
        doc.text(separator, rx, y);
        rx += sepTW;

        addLink(repoLabel, p.githubLink, rx, y, 9.5);

        // Move Y down after title/links
        y += 4;

        // ── Overview (Standard Text, No Bullet) ──
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...BLACK);
        const overviewLabel = "Overview: ";
        const oLabelW = doc.getTextWidth(overviewLabel);
        doc.text(overviewLabel, MARGIN, y);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(...BLACK);
        // Split description to ensure it doesn't overflow horizontally
        const overviewLines = doc.splitTextToSize(p.shortDescription, CW - oLabelW);
        doc.text(overviewLines, MARGIN + oLabelW, y);

        // Calculate space used by Overview and move Y down
        // (Line height is approx 4-5 units)
        y += (overviewLines.length * 3.3) + 1.5;

        // ── Highlights (Max 3) ──
        if (p.highlights && Array.isArray(p.highlights)) {
            // Reset character spacing to 0 to fix the stretching error in the screenshot
            doc.setCharSpace(0);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...BLACK);
            doc.setFontSize(9);

            p.highlights.slice(0, 3).forEach((highlight) => {
                checkPage(6);

                // Render the bullet
                bullet(highlight);

                // Force Y increment if your bullet function doesn't do it automatically
                // y += 4.5; 
            });

        }

        // Add a small gap before Tech stack if bullets didn't add one
        y += 2;

        // ── Tech stack ──
        checkPage(10);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...BLACK);

        const techLabel = "Technologies:  ";
        const tlw = doc.getTextWidth(techLabel);
        doc.text(techLabel, MARGIN + 4, y);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(...BLACK);
        const techStack = p.techStack.slice(0, 5).join(", ");
        const techLines = doc.splitTextToSize(techStack, CW - 4 - tlw);
        doc.text(techLines, MARGIN + 4 + tlw, y);

        y += (techLines.length * 5) + 2; // Move Y for the next project

    });


    // ── PROBLEM SOLVING ──
    sectionTitle("Problem Solving");
    const problemSolvingData = [
        { platform: "Codeforces", count: "  500 Solved", url: "https://codeforces.com/profile/Tu.ser" },
        { platform: "CodeChef", count: "  508 Solved", url: "https://www.codechef.com/users/tuser579" },
        { platform: "LeetCode", count: "  131 Solved", url: "https://leetcode.com/u/tuser579/" },
        { platform: "Beecrowd", count: "  164 Solved", url: "https://judge.beecrowd.com/en/profile/948665" }
    ];

    problemSolvingData.forEach((item) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...BLACK);
        const pLabel = `${item.platform}: `;
        doc.text(pLabel, MARGIN, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...BLACK);
        doc.text(item.count, MARGIN + doc.getTextWidth(pLabel), y);
        const linkLabel = "Profile Link";
        const lW = doc.getTextWidth(linkLabel);
        addLink(linkLabel, item.url, W - MARGIN - lW, y, 9);
        y += 4.5;
    });

    // ── EDUCATION ──
    sectionTitle("Education");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...BLACK);
    doc.text("B.Sc in Computer Science and Engineering", MARGIN, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...BLACK);
    doc.text("2024 – Present", W - MARGIN, y, { align: "right" });
    y += 4.5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...BLACK);
    doc.text("Daffodil International University (DIU), Dhaka", MARGIN, y);
    y += 5;

   // ── CERTIFICATIONS ──
    sectionTitle("Certifications");
    certifications.slice(0, 2).forEach((cert) => {
        // 1. RESET COLOR AT START OF EACH ROW
        doc.setTextColor(...BLACK); 
        
        doc.setFont("helvetica", "bold");
        const iss = `${cert.issuer}:   `;
        doc.text(iss, MARGIN, y);
        
        doc.setFont("helvetica", "normal");
        // Maintain the dark color for the description
        doc.setTextColor(...BLACK); 
        
        const dLines = doc.splitTextToSize(cert.description, CW - doc.getTextWidth(iss) - 25);
        doc.text(dLines, MARGIN + doc.getTextWidth(iss), y);
        
        // 2. ADD LINK (This changes the "pen" color to blue internally)
        if (cert.credentialUrl) {
            const linkLabel = "View";
            const linkW = doc.getTextWidth(linkLabel);
            addLink(linkLabel, cert.credentialUrl, W - MARGIN - linkW, y, 9);
        }
        
        y += dLines.length * 3.5 + 1.5;
    });

    sectionTitle("Languages");
    bullet("Bengali (Native)", 2);
    bullet("English (Intermediate)", 2);

    doc.save("MD_Muttakiul_Islam_Tuser_Resume.pdf");
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
//  RESUME MODAL
// ────────────────────────────────────────────────────────────

const ResumeModal = ({ onClose }) => (
    <AnimatePresence>
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col glass-card rounded-2xl overflow-hidden border border-border/60"
                style={{ boxShadow: "0 0 60px hsl(198 93% 59% / 0.15)" }}
            >
                {/* Top bar */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10"><FileText className="w-4 h-4 text-primary" /></div>
                        <div>
                            <p className="font-semibold text-foreground text-sm">MD. MUTTAKIUL ISLAM TUSER</p>
                            <p className="text-xs text-muted-foreground font-mono">MERN Stack Developer · Resume</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <DownloadButton
                            label="Download" iconSize="w-3.5 h-3.5"
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary-foreground transition-all hover-lift glow disabled:opacity-60"
                            style={{ backgroundImage: "var(--gradient-primary)" }}
                        />
                        <button onClick={onClose} className="p-2 rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Scrollable content */}
                <div className="overflow-y-auto flex-1 p-5 sm:p-8 space-y-6">

                    {/* Header */}
                    <div className="text-center pb-4 border-b border-border/40">
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">MD. MUTTAKIUL ISLAM TUSER</h2>
                        <p className="text-primary font-mono text-sm font-semibold mb-2">Full-Stack Web Developer | MERN Stack | Frontend Focused</p>
                        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span>tusermon720@gmail.com</span>
                            <span>+8801760049326</span>
                            <span>DSC, Asulia, Birulia, Dhaka-1216, Bangladesh</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                            {[
                                { label: "GitHub", href: "https://github.com/tuser579" },
                                { label: "LinkedIn", href: "https://www.linkedin.com/in/md-muttakiul-islam-tuser-36b104388" },
                                // { label: "Twitter",  href: "https://x.com/md_57990667" },
                                // { label: "Facebook", href: "https://www.facebook.com/mohammad.osman.98622" },
                            ].map(({ label, href }) => (
                                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                                    {label} <ExternalLink className="w-3 h-3" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Career Objective */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 font-mono">Career Objective</h3>
                        <p className="text-foreground/80 leading-relaxed text-sm">
                            A MERN-Stack Developer by passion, I started my coding journey with HTML, CSS, and JavaScript before diving deep into React, Next.js Node.js, Express.js, and MongoDB. Through car rental booking systems, community skill-sharing platforms, cityfix issue solving systems, e-commerce website applications. Proficient in responsive UI development with Tailwind CSS and deployment workflows using Vercel, Netlify, and Firebase. I have honed my ability to solve problems. My goal is simple: build applications that are practical, meaningful, and delightful for users.
                        </p>
                    </div>

                    {/* Skills */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 font-mono">Skills</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {[
                                { label: "Frontend", value: "HTML, CSS, Tailwind CSS, JavaScript (ES6+), React.js, Next.js" },
                                { label: "Backend", value: "Node.js, Express.js" },
                                { label: "Database", value: "MongoDB" },
                                { label: "Version Control & Deploy", value: "Git, GitHub, Firebase, Vercel, Netlify" },
                                { label: "Languages", value: "C, C++" },
                                { label: "Soft Skills", value: "Team collaboration, Problem-solving, Adaptability" },
                            ].map(({ label, value }) => (
                                <div key={label} className="glass-card rounded-lg p-3 border border-border/40">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary/70 mb-1">{label}</p>
                                    <p className="text-foreground/80 text-xs leading-relaxed">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Projects */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 font-mono">Projects</h3>
                        <div className="space-y-4">
                            {[0, 1, 2].map(i => ({
                                name: projects[i].name,
                                desc: projects[i].shortDescription,
                                highlights: projects[i].highlights,
                                tech: projects[i].techStack.slice(0, 5),
                                link: projects[i].liveLink,
                                github: projects[i].githubLink,
                            })).map(({ name, desc, highlights, tech, link, github }) => (
                                <div key={name} className="glass-card rounded-xl p-4 border border-border/40 hover:border-primary/30 transition-all duration-300 group">
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{name}</h4>
                                        <div className="flex gap-2 shrink-0 ml-2">
                                            <a href={github} target="_blank" rel="noopener noreferrer" className="text-foreground/50 hover:text-primary transition-colors" aria-label="GitHub">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                                            </a>
                                            <a href={link} target="_blank" rel="noopener noreferrer" className="text-foreground/50 hover:text-primary transition-colors" aria-label="Live Demo">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                            </a>
                                        </div>
                                    </div>
                                    <p className="text-foreground/70 text-xs leading-relaxed mb-3 line-clamp-2"> <span className="text-blue-300 font-bold">Overview:</span> {desc}</p>

                                    {/* Highlights Section - 3 bullet points */}
                                    <div className="mb-3 space-y-1">
                                        {highlights && highlights.map((highlight, idx) => (
                                            <div key={idx} className="flex items-start gap-1.5">
                                                <span className="text-primary text-[10px] mt-0.5">▹</span>
                                                <span className="text-foreground/60 text-[10px] leading-relaxed">{highlight}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap gap-1.5">
                                        {tech.map(t => (
                                            <span key={t} className="text-[10px] px-2 py-0.5 rounded-md border border-border text-primary font-mono bg-primary/5">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Problem Solving */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 font-mono">Problem Solving</h3>
                        <div className="flex flex-col gap-3">
                            {[
                                {
                                    platform: "Codeforces",
                                    count: 500,
                                    label: "Problems Solved",
                                    profile: "https://codeforces.com/profile/Tu.ser",
                                    color: "text-blue-400",
                                    border: "border-blue-400/20 hover:border-blue-400/50",
                                    bg: "hover:bg-blue-400/5",
                                },
                                {
                                    platform: "CodeChef",
                                    count: 508,
                                    label: "Problems Solved",
                                    profile: "https://www.codechef.com/users/tuser579",
                                    color: "text-amber-400",
                                    border: "border-amber-400/20 hover:border-amber-400/50",
                                    bg: "hover:bg-amber-400/5",
                                },
                                {
                                    platform: "LeetCode",
                                    count: 131,
                                    label: "Problems Solved",
                                    profile: "https://leetcode.com/u/tuser579/",
                                    color: "text-orange-400",
                                    border: "border-orange-400/20 hover:border-orange-400/50",
                                    bg: "hover:bg-orange-400/5",
                                },
                                {
                                    platform: "Beecrowd",
                                    count: 164,
                                    label: "Problems Solved",
                                    profile: "https://judge.beecrowd.com/en/profile/948665",
                                    color: "text-green-400",
                                    border: "border-green-400/20 hover:border-green-400/50",
                                    bg: "hover:bg-green-400/5",
                                },
                            ].map(({ platform, count, label, profile, color, border, bg }) => (
                                <a
                                    key={platform}
                                    href={profile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`glass-card flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group ${border} ${bg}`}
                                >
                                    {/* Left Side: Platform & Label */}
                                    <div className="flex flex-col">
                                        <span className={`font-bold sm:text-base tracking-wide ${color}`}>{platform}</span>
                                        {/* <span className="text-xs text-muted-foreground mt-0.5">{label}</span> */}
                                    </div>

                                    {/* Right Side: Count & Arrow */}
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono text-xl sm:text-xl font-black text-foreground">{count}</span>
                                        <svg
                                            className={`w-4 h-4 ${color} opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Education */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 font-mono">Education</h3>
                        <div className="glass-card rounded-xl p-4 border border-border/40 border-l-2 border-l-primary">
                            <p className="font-bold text-foreground text-sm">B.Sc. in Computer Science and Engineering (CSE)</p>
                            <p className="text-muted-foreground text-xs mt-0.5">Daffodil International University (DIU)</p>
                            <p className="text-primary font-mono text-xs mt-1">2024 – Present · DSC, Asulia, Birulia, Dhaka-1216, Bangladesh</p>
                        </div>
                    </div>

                    {/* Certifications & Competitions */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 font-mono">Certifications & Competitions</h3>
                        <div className="space-y-3">
                            {certifications.map((cert) => (
                                <div key={cert.title} className="glass-card rounded-xl p-4 border border-border/40 hover:border-primary/30 transition-all duration-300 group">
                                    <div className="flex items-start justify-between mb-1">
                                        <p className="font-bold text-foreground text-sm group-hover:text-primary transition-colors leading-snug">
                                            {cert.title}
                                        </p>
                                        <span className="text-[10px] text-muted-foreground font-mono shrink-0 ml-2 mt-0.5">
                                            {cert.date}
                                        </span>
                                    </div>
                                    <p className="text-primary/70 text-[10px] font-mono mb-2">{cert.issuer}</p>
                                    <p className="text-foreground/70 text-xs leading-relaxed">{cert.description}</p>
                                    {cert.credentialUrl && (
                                        <a
                                            href={cert.credentialUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 mt-2 text-[10px] text-primary hover:underline font-mono"
                                        >
                                            View Credential <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Languages */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 font-mono">Languages</h3>
                        <div className="flex gap-3">
                            {[{ lang: "Bengali", level: "Native" }, { lang: "English", level: "Intermediate" }].map(({ lang, level }) => (
                                <div key={lang} className="glass-card rounded-lg px-4 py-2 border border-border/40 text-center">
                                    <p className="font-semibold text-foreground text-xs">{lang}</p>
                                    <p className="text-muted-foreground text-[10px]">{level}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="shrink-0 border-t border-border/50 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground font-mono hidden sm:block">All links are clickable in the PDF</p>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button onClick={onClose}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all">
                            Close
                        </button>
                        <DownloadButton
                            label="Download" iconSize="w-4 h-4"
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-primary-foreground transition-all hover-lift glow disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{ backgroundImage: "var(--gradient-primary)" }}
                        />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    </AnimatePresence >
);

// ─────────────────────────────────────────────────────────────
//  HERO
// ─────────────────────────────────────────────────────────────
const Hero = () => {
    const [showResume, setShowResume] = useState(false);

    return (
        <>
            {showResume && <ResumeModal onClose={() => setShowResume(false)} />}

            <section id="home" className="min-h-screen flex items-center section-padding pt-28">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex justify-center lg:justify-end order-first lg:order-last"
                        >
                            <div className="relative">
                                <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden glow animate-pulse-glow">
                                    <Image src={profilePhoto} alt="Profile photo" fill className="object-cover rounded" priority />
                                </div>
                                <div className="absolute -z-10 inset-0 rounded-2xl rotate-6 bg-primary/20" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }} className="order-last lg:order-first"
                        >
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                                className="font-mono text-primary mb-4 text-sm tracking-wider">
                                Hello, I&apos;m
                            </motion.p>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                                <span className="text-foreground">MD.MUTTAKIUL ISLAM</span>{" "}
                                <span className="text-gradient">TUSER</span>
                            </h1>

                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                                className="text-lg sm:text-xl text-muted-foreground mb-2 font-mono">
                                Full MERN Stack Developer | Fronted Focused
                            </motion.p>

                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                                className="text-muted-foreground max-w-lg mb-8 leading-relaxed">
                                I build web applications using React, Next.js, Node.js, Express, and MongoDB.
                                Passionate about clean code and pixel-perfect UIs.
                            </motion.p>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                                className="flex flex-col sm:flex-row gap-4 mb-8">
                                <button onClick={() => setShowResume(true)}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-primary-foreground transition-all duration-300 glow hover-lift w-full sm:w-auto"
                                    style={{ backgroundImage: "var(--gradient-primary)" }}>
                                    <Eye className="w-4 h-4" />
                                    Show Resume
                                </button>
                                <Link href="#contact"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 w-full sm:w-auto">
                                    Contact Me
                                </Link>
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                                className="flex justify-center sm:justify-start gap-4">
                                {[
                                    { icon: Github, href: "https://github.com/tuser579", label: "GitHub" },
                                    { icon: Linkedin, href: "https://www.linkedin.com/in/md-muttakiul-islam-tuser-36b104388", label: "LinkedIn" },
                                    { icon: Twitter, href: "https://x.com/md_57990667", label: "Twitter" },
                                    { icon: Facebook, href: "https://www.facebook.com/mohammad.osman.98622", label: "Facebook" },
                                ].map(({ icon: Icon, href, label }) => (
                                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                                        className="p-3 rounded-lg hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-300 hover-lift">
                                        <Icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </motion.div>
                        </motion.div>

                    </div>
                </div>
            </section>
        </>
    );
};

export default Hero;