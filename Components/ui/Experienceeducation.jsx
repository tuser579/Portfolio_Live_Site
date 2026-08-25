"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap } from "lucide-react";
import { education } from "../../data/portfolio";

export default function ExperienceEducation() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="education" className="section-padding" ref={ref}>
      <div className="site-container">

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <h2 className="section-title">My <span className="text-gradient">Education</span></h2>
          <div className="section-line" />
        </motion.div>

        {/* Timeline */}
        <div style={{ position: "relative", paddingLeft: "3rem" }}>
          {/* Vertical line */}
          <div style={{ position: "absolute", left: "1.1rem", top: 0, bottom: 0, width: 2, background: "linear-gradient(180deg, #00d4ff, #7c3aed, transparent)", boxShadow: "0 0 8px rgba(0,212,255,0.4)", borderRadius: 9999 }} />

          {education.map((edu, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.15 + 0.2, duration: 0.6 }}
              style={{ position: "relative", marginBottom: "2rem" }}
            >
              {/* Node dot */}
              <div style={{
                position: "absolute", left: "-2.35rem", top: "1.4rem",
                width: 18, height: 18, borderRadius: "50%",
                background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
                boxShadow: "0 0 0 4px rgba(0,212,255,0.15), 0 0 16px rgba(0,212,255,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <GraduationCap size={9} style={{ color: "#fff" }} />
              </div>

              {/* Card */}
              <div style={{
                background: "var(--glass-bg)", backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)", border: "1px solid var(--glass-border)",
                borderLeft: "3px solid var(--cyan)", borderRadius: "0 16px 16px 0",
                padding: "1.25rem 1.5rem",
                transition: "all 0.3s", boxShadow: "var(--glow-card)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.5rem" }}>
                  <h4 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem" }}>{edu.degree}</h4>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem", color: "var(--cyan)", background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.3)", padding: "0.2rem 0.65rem", borderRadius: 9999, fontWeight: 600 }}>{edu.duration}</span>
                </div>
                <p style={{ color: "var(--violet)", fontFamily: "'Inter',sans-serif", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>{edu.institution}</p>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", lineHeight: 1.65 }}>{edu.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}