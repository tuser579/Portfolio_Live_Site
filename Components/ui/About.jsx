"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Coffee, Gamepad2, Sprout } from "lucide-react";

const HOBBIES = [
  { icon: Code2,    label: "Problem Solver",    desc: "Love untangling complex challenges", color: "#00d4ff", glow: "rgba(0,212,255,0.2)"   },
  { icon: Coffee,   label: "Code Enthusiast",   desc: "Building things that matter",        color: "#f59e0b", glow: "rgba(245,158,11,0.2)"  },
  { icon: Sprout,   label: "Farming",           desc: "Growing things offline too",         color: "#10b981", glow: "rgba(16,185,129,0.2)"  },
  { icon: Gamepad2, label: "Cricket Player",    desc: "Strategy & teamwork IRL",           color: "#a78bfa", glow: "rgba(167,139,250,0.2)"  },
];

export default function About() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding" ref={ref}>
      <div className="site-container">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <h2 className="section-title">
            About <span className="text-gradient">Me</span>
          </h2>
          <div className="section-line" />
        </motion.div>

        {/* Glass card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            border: "1px solid var(--glass-border)",
            borderRadius: 24,
            padding: "clamp(1.5rem,4vw,3rem)",
            boxShadow: "var(--glow-card)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Corner glow */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, background: "radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)", pointerEvents: "none" }} />

          {/* Bio text */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem" }}>
            <p style={{ color: "var(--text-primary)", lineHeight: 1.8, fontSize: "clamp(0.9rem,1.8vw,1.05rem)" }}>
              I&apos;m a passionate{" "}
              <span style={{ color: "var(--cyan)", fontWeight: 600 }}>MERN Stack Developer</span>{" "}
              who loves solving complex problems through code. What started as curiosity about how websites work evolved into a deep passion for building things on the internet — from debugging tricky issues to architecting scalable solutions.
            </p>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "clamp(0.85rem,1.6vw,0.98rem)" }}>
              I specialize in full-stack applications with React, Next.js, Node.js, Express, and MongoDB. I thrive on thinking critically about problems and crafting elegant, efficient code. Those{" "}
              <span style={{ color: "var(--violet)", fontWeight: 600 }}>&quot;aha!&quot; moments</span>
              {" "}when everything clicks? That&apos;s what drives me.
            </p>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "clamp(0.85rem,1.6vw,0.98rem)" }}>
              Outside coding, you&apos;ll find me farming — there&apos;s something grounding about watching things grow — or on the cricket field, where strategy and teamwork mirror the problem-solving I love.
            </p>
          </div>

          {/* Hobby tiles */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.85rem" }}>
            {HOBBIES.map(({ icon: Icon, label, desc, color, glow }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
                  padding: "1.25rem 0.85rem",
                  background: "var(--glass-bg)",
                  border: `1px solid ${color}35`,
                  borderRadius: 16,
                  cursor: "default",
                  transition: "all 0.3s",
                  boxShadow: "var(--glow-card)",
                }}
                whileHover={{ scale: 1.04, boxShadow: `0 8px 30px ${glow}` }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, marginBottom: "0.65rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: `${color}14`, border: `1px solid ${color}30`,
                  boxShadow: `0 0 16px ${glow}`,
                }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: "var(--text-primary)", fontSize: "0.85rem", marginBottom: "0.3rem" }}>{label}</span>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.72rem", lineHeight: 1.4 }}>{desc}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
