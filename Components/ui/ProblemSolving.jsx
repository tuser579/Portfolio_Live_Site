'use client';

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink } from 'lucide-react';

const platforms = [
  { name: "Codeforces", icon: "⚡", solved: "500+", rating: "1026", contests: "20+",  link: "https://codeforces.com/profile/Tu.ser",            color: "#3b82f6", bg: "rgba(59,130,246,0.08)"  },
  { name: "CodeChef",   icon: "🍴", solved: "508+", rating: "1353", contests: "31+",  link: "https://www.codechef.com/users/tuser579",            color: "#f59e0b", bg: "rgba(245,158,11,0.08)"  },
  { name: "LeetCode",   icon: "💻", solved: "131+", rating: "64.9% Acc.", contests: "20+ Med", link: "https://leetcode.com/u/tuser579/",            color: "#f97316", bg: "rgba(249,115,22,0.08)"  },
  { name: "Beecrowd",   icon: "🐝", solved: "164+", rating: "Top 10%", contests: "C++", link: "https://judge.beecrowd.com/en/profile/948665",     color: "#10b981", bg: "rgba(16,185,129,0.08)"  },
];

export default function ProblemSolving() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const total  = platforms.reduce((s, p) => s + parseInt(p.solved), 0);

  return (
    <section id="problem-solving" className="section-padding" ref={ref}>
      <div className="site-container">

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ textAlign: "center", marginBottom: "1rem" }}>
          <h2 className="section-title">Problem <span className="text-gradient">Solving</span></h2>
          <div className="section-line" style={{ marginBottom: "1rem" }} />
          <p className="section-subtitle">Competitive programmer with <span style={{ color: "#00d4ff", fontWeight: 700 }}>{total}+</span> problems solved across multiple platforms</p>
        </motion.div>

        {/* Platform grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
          {platforms.map((p, i) => (
            <motion.a
              key={p.name}
              href={p.link} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                display: "block", textDecoration: "none",
                background: "var(--glass-bg)",
                backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${p.color}35`,
                borderRadius: 18, padding: "1.5rem 1.25rem",
                position: "relative", overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                boxShadow: "var(--glow-card)",
              }}
              whileHover={{ y: -5, boxShadow: `0 16px 50px ${p.color}25`, borderColor: `${p.color}60` }}
            >
              {/* Top accent */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${p.color}, transparent)` }} />

              {/* Icon + name */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ fontSize: 26 }}>{p.icon}</span>
                  <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: p.color, fontSize: "1rem" }}>{p.name}</h3>
                </div>
                <ExternalLink size={14} style={{ color: `${p.color}90`, marginTop: 2 }} />
              </div>

              {/* Big solved count */}
              <div style={{ marginBottom: "0.85rem" }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: "2rem", color: "var(--text-primary)", lineHeight: 1 }}>{p.solved}</span>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.75rem", color: "var(--text-secondary)", marginLeft: "0.4rem", fontWeight: 500 }}>solved</span>
              </div>

              {/* Meta */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                {[`Rating: ${p.rating}`, `Contests: ${p.contests}`].map((txt) => (
                  <div key={txt} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ color: p.color, fontSize: "0.6rem" }}>▹</span>
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.75rem", color: "var(--text-secondary)" }}>{txt}</span>
                  </div>
                ))}
              </div>

              {/* Bottom glow */}
              <div style={{ position: "absolute", bottom: -20, right: -20, width: 80, height: 80, background: `radial-gradient(circle, ${p.color}20, transparent 70%)`, pointerEvents: "none" }} />
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
}