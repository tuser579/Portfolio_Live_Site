"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { skills } from "../../data/portfolio";

const CATEGORIES = [
  { key: "all",      label: "All",      color: "#00d4ff" },
  { key: "frontend", label: "Frontend", color: "#00d4ff" },
  { key: "backend",  label: "Backend",  color: "#a78bfa" },
  { key: "database", label: "Database", color: "#10b981" },
  { key: "tools",    label: "Tools",    color: "#f59e0b" },
];

const SKILL_COLORS = {
  frontend: "#00d4ff",
  backend:  "#a78bfa",
  database: "#10b981",
  tools:    "#f59e0b",
};

export default function Skills() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState("all");

  const filtered = active === "all" ? skills : skills.filter((s) => s.category === active);

  return (
    <section id="skills" className="section-padding" ref={ref}>
      <div className="site-container">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <h2 className="section-title">
            Technical <span className="text-gradient">Skills</span>
          </h2>
          <div className="section-line" />
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.55rem", marginBottom: "2.5rem" }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = active === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActive(cat.key)}
                style={{
                  padding: "0.45rem 1.1rem",
                  borderRadius: 9999,
                  fontSize: "0.8rem",
                  fontFamily: "'Outfit',sans-serif",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.25s",
                  background: isActive ? `${cat.color}18` : "var(--glass-bg)",
                  border: isActive ? `1px solid ${cat.color}55` : "1px solid var(--glass-border)",
                  color: isActive ? cat.color : "var(--text-secondary)",
                  boxShadow: isActive ? `0 0 16px ${cat.color}25` : "var(--glow-card)",
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </motion.div>

        {/* Skills grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.85rem" }}>
          {filtered.map((skill, i) => {
            const color = SKILL_COLORS[skill.category] || "#00d4ff";
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.05, duration: 0.45 }}
                style={{
                  background: "var(--glass-bg)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: `1px solid var(--glass-border)`,
                  borderRadius: 14,
                  padding: "1rem 1.1rem",
                  transition: "all 0.3s",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "var(--glow-card)",
                }}
                whileHover={{
                  borderColor: `${color}45`,
                  boxShadow: `0 8px 24px ${color}20`,
                  y: -2,
                }}
              >
                {/* Left accent bar */}
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(180deg, ${color}, transparent)`, borderRadius: "14px 0 0 14px" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.65rem", paddingLeft: "0.5rem" }}>
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 600, color: "var(--text-primary)", fontSize: "0.88rem" }}>{skill.name}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color, fontSize: "0.8rem" }}>{skill.level}%</span>
                </div>

                {/* Neon progress bar */}
                <div style={{ height: 6, borderRadius: 9999, background: "rgba(148,163,184,0.2)", overflow: "hidden", position: "relative", marginLeft: "0.5rem" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                    transition={{ delay: i * 0.05 + 0.3, duration: 1, ease: "easeOut" }}
                    style={{
                      height: "100%",
                      borderRadius: 9999,
                      background: `linear-gradient(90deg, ${color}, ${color === "#00d4ff" ? "#7c3aed" : color}aa)`,
                      boxShadow: `0 0 10px ${color}60, 0 0 20px ${color}30`,
                      position: "relative",
                    }}
                  >
                    {/* Tip glow dot */}
                    <div style={{
                      position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
                      width: 7, height: 7, borderRadius: "50%", background: "#fff",
                      boxShadow: `0 0 6px ${color}`,
                    }} />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}