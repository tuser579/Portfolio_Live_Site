"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Github, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { projects } from "../../data/portfolio";

const CARD_GLOWS = ["#00d4ff", "#7c3aed", "#f0abfc", "#10b981"];
const ITEMS_PER_PAGE = 3;

function ProjectCard({ project, index, inView }) {
  const glow = CARD_GLOWS[index % CARD_GLOWS.length];
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.6 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: "var(--glass-bg)",
        backdropFilter: "blur(28px) saturate(180%)",
        WebkitBackdropFilter: "blur(28px) saturate(180%)",
        borderRadius: 20,
        overflow: "hidden",
        border: hovered ? `1px solid ${glow}55` : "1px solid var(--glass-border)",
        boxShadow: hovered
          ? `0 20px 60px ${glow}25, 0 0 0 1px ${glow}20`
          : "var(--glow-card)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Top gradient bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${glow}, transparent)`, opacity: hovered ? 1 : 0.4, transition: "opacity 0.3s" }} />

      {/* Thumbnail */}
      <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          style={{
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
            filter: hovered ? "brightness(1)" : "brightness(0.92)",
          }}
        />
        {/* Shimmer overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: hovered
            ? `linear-gradient(135deg, ${glow}15, transparent 60%)`
            : "transparent",
          transition: "background 0.4s",
          pointerEvents: "none",
        }} />
      </div>

      {/* Card body */}
      <div style={{ padding: "1.1rem 1.2rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: hovered ? glow : "var(--text-primary)", fontSize: "1rem", lineHeight: 1.3, transition: "color 0.3s" }}>
          {project.name}
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", lineHeight: 1.65, flex: 1 }}>
          {project.shortDescription}
        </p>

        {/* Tech badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {project.techStack.slice(0, 4).map((tech) => (
            <span key={tech} style={{
              fontSize: "0.65rem", padding: "0.18rem 0.55rem", borderRadius: 9999,
              background: `${glow}12`, border: `1px solid ${glow}35`,
              color: glow, fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.03em",
            }}>
              {tech}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "auto" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <a href={project.liveLink} target="_blank" rel="noopener noreferrer"
              style={{
                flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "0.5rem 0.75rem", borderRadius: 10, fontSize: "0.78rem", fontWeight: 600,
                background: `linear-gradient(135deg, ${glow}, ${glow === "#00d4ff" ? "#7c3aed" : glow}bb)`,
                color: "#fff", textDecoration: "none", transition: "all 0.25s",
                boxShadow: `0 4px 14px ${glow}30`,
              }}>
              <ExternalLink size={13} /> Live
            </a>
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
              style={{
                flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "0.5rem 0.75rem", borderRadius: 10, fontSize: "0.78rem", fontWeight: 600,
                background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
                color: "var(--text-primary)", textDecoration: "none", transition: "all 0.25s",
              }}>
              <Github size={13} /> GitHub
            </a>
          </div>
          <Link href={`/project/${project.id}`}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "0.55rem", borderRadius: 10, fontSize: "0.78rem", fontWeight: 600,
              border: `1px solid ${glow}40`, color: glow, textDecoration: "none",
              transition: "all 0.25s", background: "transparent",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${glow}12`; e.currentTarget.style.borderColor = `${glow}70`; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = `${glow}40`; }}
          >
            View Details <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const paginated  = projects.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const goTo = (p) => {
    setPage(p);
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="projects" className="section-padding" ref={ref}>
      <div className="site-container">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <h2 className="section-title">
            My <span className="text-gradient">Projects</span>
          </h2>
          <div className="section-line" />
          <p className="section-subtitle">Real-world applications built with modern full-stack technologies</p>
        </motion.div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {paginated.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} inView={inView} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginTop: "2.5rem" }}
          >
            <button onClick={() => goTo(page - 1)} disabled={page === 1}
              style={{ padding: "0.5rem", borderRadius: 10, border: "1px solid var(--glass-border)", background: "var(--glass-bg)", color: "var(--text-secondary)", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.3 : 1, display: "flex", transition: "all 0.2s" }}>
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => goTo(p)}
                style={{
                  width: 36, height: 36, borderRadius: 10, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", transition: "all 0.25s",
                  background: p === page ? "var(--grad-cyan-vio)" : "var(--glass-bg)",
                  border: p === page ? "none" : "1px solid var(--glass-border)",
                  color: p === page ? "#fff" : "var(--text-secondary)",
                  boxShadow: p === page ? "0 4px 14px rgba(0,212,255,0.3)" : "var(--glow-card)",
                }}>
                {p}
              </button>
            ))}
            <button onClick={() => goTo(page + 1)} disabled={page === totalPages}
              style={{ padding: "0.5rem", borderRadius: 10, border: "1px solid var(--glass-border)", background: "var(--glass-bg)", color: "var(--text-secondary)", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.3 : 1, display: "flex", transition: "all 0.2s" }}>
              <ChevronRight size={16} />
            </button>
          </motion.div>
        )}

        {totalPages > 1 && (
          <p style={{ textAlign: "center", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.75rem", fontFamily: "'JetBrains Mono',monospace", fontWeight: 500 }}>
            Page {page} of {totalPages} · {projects.length} projects
          </p>
        )}

      </div>
    </section>
  );
}