"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Download, Github, Linkedin, Twitter, Facebook,
    X, FileText, ExternalLink, Loader2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import profilePhoto from "../../public/Gemini_Generated_Image_kkbq5akkbq5akkbq.png";
import { projects } from "../../data/portfolio";

// ─────────────────────────────────────────────────────────────
//  PDF GENERATOR — all links are clickable via doc.link()
// ─────────────────────────────────────────────────────────────
async function generateAndDownloadPDF() {
    const { default: jsPDF } = await import("jspdf");

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const W        = 210;
    const MARGIN   = 18;
    const CW       = W - MARGIN * 2;   // content width
    let   y        = 14;

    // colours
    const PRIMARY  = [14,  165, 233];
    const DARK     = [15,  23,  42];
    const MID      = [51,  65,  85];
    const MUTED    = [100, 116, 139];
    const LIGHT_BG = [240, 249, 255];
    const BORDER   = [186, 230, 253];

    // ── helpers ───────────────────────────────────────────────
    const checkPage = (need = 10) => {
        if (y + need > 280) { doc.addPage(); y = 14; }
    };

    const hLine = (color = BORDER, thick = 0.3) => {
        doc.setDrawColor(...color);
        doc.setLineWidth(thick);
        doc.line(MARGIN, y, W - MARGIN, y);
        y += 3;
    };

    const sectionTitle = (title) => {
        checkPage(12);
        y += 4;
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...PRIMARY);
        doc.text(title, MARGIN, y);
        y += 1.5;
        hLine(PRIMARY, 0.6);
    };

    // ── clickable link helper ─────────────────────────────────
    // Draws underlined coloured text AND registers a PDF hyperlink
    const addLink = (text, url, x, linkY, fontSize, align = "left") => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...PRIMARY);

        let tx = x;
        if (align === "center") {
            const tw = doc.getTextWidth(text);
            tx = x - tw / 2;
        } else if (align === "right") {
            const tw = doc.getTextWidth(text);
            tx = x - tw;
        }

        doc.text(text, tx, linkY, { align });

        // underline
        const tw = doc.getTextWidth(text);
        doc.setDrawColor(...PRIMARY);
        doc.setLineWidth(0.2);
        doc.line(tx, linkY + 0.6, tx + tw, linkY + 0.6);

        // PDF hyperlink annotation (height ≈ fontSize * 0.35mm)
        const lh = fontSize * 0.35;
        doc.link(tx, linkY - lh, tw, lh + 1, { url });
    };

    // ── HEADER ────────────────────────────────────────────────
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    doc.text("MD. MUTTAKIUL ISLAM TUSER", W / 2, y, { align: "center" });
    y += 7;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PRIMARY);
    doc.text("MERN Stack Developer", W / 2, y, { align: "center" });
    y += 5;

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text(
        "tuser720@gmail.com  ·  +8801760049326  ·  DSC, Asulia, Birulia, Dhaka-1216, Bangladesh",
        W / 2, y, { align: "center" }
    );
    y += 5;

    // social links row — each link clickable
    const socials = [
        { label: "GitHub",   url: "https://github.com/tuser579" },
        { label: "LinkedIn", url: "https://www.linkedin.com/in/md-muttakiul-islam-tuser-36b104388" },
        { label: "Twitter",  url: "https://x.com/md_57990667" },
        { label: "Facebook", url: "https://www.facebook.com/mohammad.osman.98622" },
    ];

    // measure total width to centre the row
    doc.setFontSize(8.5);
    const sep = "  ·  ";
    const sepW = doc.getTextWidth(sep);
    const labelWidths = socials.map(s => doc.getTextWidth(s.label));
    const totalW = labelWidths.reduce((a, b) => a + b, 0) + sepW * (socials.length - 1);
    let sx = (W - totalW) / 2;

    socials.forEach((s, i) => {
        addLink(s.label, s.url, sx, y, 8.5);
        sx += labelWidths[i];
        if (i < socials.length - 1) {
            doc.setTextColor(...MUTED);
            doc.text(sep, sx, y);
            sx += sepW;
        }
    });
    y += 5;

    // thick divider
    doc.setDrawColor(...PRIMARY);
    doc.setLineWidth(1.5);
    doc.line(MARGIN, y, W - MARGIN, y);
    y += 5;

    // ── CAREER OBJECTIVE ──────────────────────────────────────
    sectionTitle("CAREER OBJECTIVE");
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MID);
    const objLines = doc.splitTextToSize(
        "A MERN-Stack Developer by passion, I started my coding journey with HTML, CSS, and JavaScript " +
        "before diving deep into React, Node.js, Express.js, and MongoDB. Through building booking systems, " +
        "e-commerce solutions, and community skill-sharing platforms, I have honed my ability to solve " +
        "problems and design robust APIs. My goal is simple: build applications that are practical, " +
        "meaningful, and genuinely delightful for users.", CW);
    doc.text(objLines, MARGIN, y);
    y += objLines.length * 5 + 2;

    // ── SKILLS ────────────────────────────────────────────────
    sectionTitle("SKILLS");
    const skills = [
        ["Frontend",                 "HTML, CSS, Tailwind CSS, JavaScript (ES6+), React.js, Next.js"],
        ["Backend",                  "Node.js, Express.js"],
        ["Database",                 "MongoDB"],
        ["Version Control & Deploy", "Git, GitHub, Firebase, Vercel, Netlify"],
        ["Soft Skills",              "Team collaboration, problem-solving, adaptability"],
    ];
    const colW = CW / 2;
    for (let i = 0; i < skills.length; i += 2) {
        const pair = skills.slice(i, i + 2);
        const cellH = 12;
        checkPage(cellH + 2);
        pair.forEach((sk, j) => {
            const cx = MARGIN + j * colW;
            doc.setFillColor(...LIGHT_BG);
            doc.setDrawColor(...BORDER);
            doc.setLineWidth(0.3);
            doc.rect(cx, y, colW, cellH, "FD");
            doc.setFontSize(7);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...MUTED);
            doc.text(sk[0].toUpperCase(), cx + 4, y + 4.5);
            doc.setFontSize(8.5);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...DARK);
            const lines = doc.splitTextToSize(sk[1], colW - 8);
            doc.text(lines, cx + 4, y + 8);
        });
        y += cellH + 1;
    }
    y += 2;

    // ── PROJECTS ──────────────────────────────────────────────
    sectionTitle("PROJECTS");
    const projData = [0, 1, 2].map(i => ({
        name:   projects[i].name,
        desc:   projects[i].shortDescription,
        tech:   projects[i].techStack.slice(0, 5),
        live:   projects[i].liveLink,
        github: projects[i].githubLink,
    }));

    projData.forEach((p) => {
        checkPage(30);

        // project name (plain, dark)
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...DARK);
        doc.text(p.name, MARGIN, y);

        // "Live" clickable link
        const liveLabel   = "Live";
        const sepLabel    = "  ·  ";
        const githubLabel = "GitHub";
        doc.setFontSize(8.5);
        const liveW   = doc.getTextWidth(liveLabel);
        const sepW2   = doc.getTextWidth(sepLabel);
        const githubW = doc.getTextWidth(githubLabel);
        const rowW    = liveW + sepW2 + githubW;
        let rx        = W - MARGIN - rowW;

        addLink(liveLabel, p.live, rx, y, 8.5);
        rx += liveW;
        doc.setTextColor(...MUTED);
        doc.setFontSize(8.5);
        doc.text(sepLabel, rx, y);
        rx += sepW2;
        addLink(githubLabel, p.github, rx, y, 8.5);

        y += 5;

        // description
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...MID);
        const descLines = doc.splitTextToSize(p.desc, CW);
        doc.text(descLines, MARGIN, y);
        y += descLines.length * 4.5 + 2;

        // tech tags
        doc.setFontSize(8);
        doc.setTextColor(...PRIMARY);
        doc.text(p.tech.map(t => `[ ${t} ]`).join("  "), MARGIN, y);
        y += 7;
    });

    // ── EDUCATION ─────────────────────────────────────────────
    sectionTitle("EDUCATION");
    checkPage(20);

    doc.setFillColor(...PRIMARY);
    doc.rect(MARGIN, y, 2.5, 16, "F");
    doc.setFillColor(...LIGHT_BG);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.3);
    doc.rect(MARGIN + 2.5, y, CW - 2.5, 16, "FD");

    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    doc.text("B.Sc. in Computer Science and Engineering (CSE)", MARGIN + 7, y + 5);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text("Daffodil International University (DIU)", MARGIN + 7, y + 10);

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PRIMARY);
    doc.text("2024 – Present", W - MARGIN - 2, y + 5, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text("DSC, Asulia, Birulia, Dhaka-1216", W - MARGIN - 2, y + 10, { align: "right" });
    y += 20;

    // ── LANGUAGES ─────────────────────────────────────────────
    sectionTitle("LANGUAGES");
    checkPage(16);
    const langW = CW / 2;
    [["Bengali", "Native"], ["English", "Intermediate"]].forEach(([lang, level], i) => {
        const cx = MARGIN + i * langW;
        doc.setFillColor(...LIGHT_BG);
        doc.setDrawColor(...BORDER);
        doc.setLineWidth(0.3);
        doc.rect(cx, y, langW, 14, "FD");
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...DARK);
        doc.text(lang, cx + langW / 2, y + 5.5, { align: "center" });
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...MUTED);
        doc.text(level, cx + langW / 2, y + 10, { align: "center" });
    });

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
// ─────────────────────────────────────────────────────────────
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
                        <p className="text-primary font-mono text-sm font-semibold mb-2">MERN Stack Developer</p>
                        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span>tuser720@gmail.com</span>
                            <span>+8801760049326</span>
                            <span>DSC, Asulia, Birulia, Dhaka-1216, Bangladesh</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                            {[
                                { label: "GitHub",   href: "https://github.com/tuser579" },
                                { label: "LinkedIn", href: "https://www.linkedin.com/in/md-muttakiul-islam-tuser-36b104388" },
                                { label: "Twitter",  href: "https://x.com/md_57990667" },
                                { label: "Facebook", href: "https://www.facebook.com/mohammad.osman.98622" },
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
                            A MERN-Stack Developer by passion, I started my coding journey with HTML, CSS, and JavaScript before
                            diving deep into React, Node.js, Express.js, and MongoDB. Through building booking systems, e-commerce
                            solutions, and community skill-sharing platforms, I have honed my ability to solve problems and design
                            robust APIs. My goal is simple: build applications that are practical, meaningful, and genuinely delightful for users.
                        </p>
                    </div>

                    {/* Skills */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 font-mono">Skills</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {[
                                { label: "Frontend",                 value: "HTML, CSS, Tailwind CSS, JavaScript (ES6+), React.js, Next.js" },
                                { label: "Backend",                  value: "Node.js, Express.js" },
                                { label: "Database",                 value: "MongoDB" },
                                { label: "Version Control & Deploy", value: "Git, GitHub, Firebase, Vercel, Netlify" },
                                { label: "Soft Skills",              value: "Team collaboration, problem-solving, adaptability" },
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
                                name:   projects[i].name,
                                desc:   projects[i].shortDescription,
                                tech:   projects[i].techStack.slice(0, 5),
                                link:   projects[i].liveLink,
                                github: projects[i].githubLink,
                            })).map(({ name, desc, tech, link, github }) => (
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
                                    <p className="text-foreground/70 text-xs leading-relaxed mb-3 line-clamp-2">{desc}</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {tech.map(t => (
                                            <span key={t} className="text-[10px] px-2 py-0.5 rounded-md border border-border text-primary font-mono bg-primary/5">{t}</span>
                                        ))}
                                    </div>
                                </div>
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
    </AnimatePresence>
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
                                MERN Stack Developer
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
                                    <Download className="w-4 h-4" />
                                    Download Resume
                                </button>
                                <Link href="#contact"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 w-full sm:w-auto">
                                    Contact Me
                                </Link>
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                                className="flex justify-center sm:justify-start gap-4">
                                {[
                                    { icon: Github,   href: "https://github.com/tuser579",                                    label: "GitHub"   },
                                    { icon: Linkedin, href: "https://www.linkedin.com/in/md-muttakiul-islam-tuser-36b104388", label: "LinkedIn" },
                                    { icon: Twitter,  href: "https://x.com/md_57990667",                                     label: "Twitter"  },
                                    { icon: Facebook, href: "https://www.facebook.com/mohammad.osman.98622",                  label: "Facebook" },
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