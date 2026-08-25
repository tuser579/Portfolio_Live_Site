'use client';

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Award } from 'lucide-react';
import { certifications } from "../../data/portfolio";

const BADGE_COLORS = ["#00d4ff", "#a78bfa"];

export default function CertificationsSection() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="certifications" className="section-padding" ref={ref}>
      <div className="site-container">

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <h2 className="section-title">Certifications & <span className="text-gradient">Competitions</span></h2>
          <div className="section-line" />
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "1.1rem" }}>
          {certifications.map((cert, i) => {
            const color = BADGE_COLORS[i % BADGE_COLORS.length];
            return (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 25 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                style={{
                  background: "var(--glass-bg)", backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)", border: `1px solid ${color}30`,
                  borderRadius: 18, padding: "1.5rem",
                  position: "relative", overflow: "hidden",
                  transition: "all 0.35s",
                  boxShadow: "var(--glow-card)",
                }}
                whileHover={{ y: -4, borderColor: `${color}60`, boxShadow: `0 12px 40px ${color}20` }}
              >
                {/* Top bar */}
                <div style={{ height: 2, position: "absolute", top: 0, left: 0, right: 0, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "0.9rem" }}>
                  {/* Badge icon */}
                  <div style={{
                    flexShrink: 0, width: 48, height: 48, borderRadius: 14,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: `${color}14`, border: `1px solid ${color}35`,
                    boxShadow: `0 0 20px ${color}20`,
                  }}>
                    <Award size={22} style={{ color }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", flexWrap: "wrap" }}>
                      <h4 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: "var(--text-primary)", fontSize: "0.92rem", lineHeight: 1.4, flex: 1 }}>{cert.title}</h4>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{cert.date}</span>
                    </div>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", color, fontSize: "0.72rem", marginTop: "0.25rem", fontWeight: 600 }}>{cert.issuer}</p>
                  </div>
                </div>

                <p style={{ color: "var(--text-secondary)", fontSize: "0.83rem", lineHeight: 1.65 }}>{cert.description}</p>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "0.3rem",
                      marginTop: "0.9rem", fontSize: "0.73rem", color,
                      textDecoration: "none", fontFamily: "'JetBrains Mono',monospace",
                      background: `${color}0f`, border: `1px solid ${color}25`,
                      padding: "0.3rem 0.75rem", borderRadius: 9999, transition: "all 0.25s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${color}18`; e.currentTarget.style.borderColor = `${color}50`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${color}0f`; e.currentTarget.style.borderColor = `${color}25`; }}
                  >
                    View Credential <ExternalLink size={11} />
                  </a>
                )}

                {/* Corner glow */}
                <div style={{ position: "absolute", bottom: -15, right: -15, width: 70, height: 70, background: `radial-gradient(circle, ${color}20, transparent 70%)`, pointerEvents: "none" }} />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}