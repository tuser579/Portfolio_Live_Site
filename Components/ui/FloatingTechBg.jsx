'use client';
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const TECH_SYMBOLS = [
  { label: "</>" , x: "8%",  y: "12%", size: 13, d: 8,  delay: 0   },
  { label: "{ }" , x: "88%", y: "18%", size: 12, d: 9,  delay: 1.2 },
  { label: "API" , x: "18%", y: "78%", size: 11, d: 11, delay: 0.5 },
  { label: "DB"  , x: "82%", y: "72%", size: 12, d: 7,  delay: 2   },
  { label: "⚛"  , x: "50%", y: "6%",  size: 16, d: 10, delay: 0.3 },
  { label: "∞"  , x: "4%",  y: "48%", size: 15, d: 8,  delay: 1.8 },
  { label: "{ }" , x: "93%", y: "45%", size: 11, d: 12, delay: 0.9 },
  { label: "[ ]" , x: "62%", y: "88%", size: 11, d: 9,  delay: 1.5 },
  { label: "fn()", x: "30%", y: "94%", size: 10, d: 13, delay: 0.7 },
  { label: "npm" , x: "75%", y: "5%",  size: 10, d: 7,  delay: 2.4 },
];

const ORBS = [
  { color: "radial-gradient(circle, #00d4ff 0%, transparent 70%)", w: 600, h: 600, left: "-10%", top: "-10%",  dur: 18, delay: 0,   cls: "animate-aurora-1" },
  { color: "radial-gradient(circle, #7c3aed 0%, transparent 70%)", w: 700, h: 700, left: "60%",  top: "40%",   dur: 22, delay: 3,   cls: "animate-aurora-2" },
  { color: "radial-gradient(circle, #f0abfc 0%, transparent 70%)", w: 450, h: 450, left: "30%",  top: "60%",   dur: 14, delay: 1.5, cls: "animate-aurora-3" },
  { color: "radial-gradient(circle, #10b981 0%, transparent 70%)", w: 350, h: 350, left: "80%",  top: "-5%",   dur: 20, delay: 5,   cls: "animate-aurora-1" },
  { color: "radial-gradient(circle, #00d4ff 0%, transparent 70%)", w: 300, h: 300, left: "5%",   top: "70%",   dur: 16, delay: 8,   cls: "animate-aurora-2" },
];

export default function FloatingTechBg() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 dot-grid"
      aria-hidden="true"
    >
      {/* ── Aurora Orbs ── */}
      {ORBS.map((orb, i) => (
        <div
          key={i}
          className={orb.cls}
          style={{
            position: "absolute",
            left: orb.left,
            top: orb.top,
            width: orb.w,
            height: orb.h,
            background: orb.color,
            filter: "blur(90px)",
            opacity: 0.14,
            borderRadius: "50%",
            willChange: "transform, opacity",
          }}
        />
      ))}

      {/* ── Floating Tech Symbols ── */}
      {TECH_SYMBOLS.map((sym, i) => (
        <motion.div
          key={i}
          style={{ position: "absolute", left: sym.x, top: sym.y }}
          animate={{
            y: [0, -sym.d, sym.d / 2, -sym.d * 0.7, 0],
            opacity: [0, 0.25, 0.18, 0.25, 0],
            scale: [0.85, 1.05, 0.95, 1.02, 0.85],
          }}
          transition={{
            duration: sym.d,
            delay: sym.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span
            style={{
              fontSize: sym.size,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              color: "rgba(0,212,255,0.55)",
              letterSpacing: "0.05em",
              userSelect: "none",
              textShadow: "0 0 12px rgba(0,212,255,0.4)",
            }}
          >
            {sym.label}
          </span>
        </motion.div>
      ))}

      {/* ── Subtle grid lines at bottom ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: "linear-gradient(to top, rgba(0,212,255,0.02) 0%, transparent 100%)",
          maskImage: "linear-gradient(to top, black, transparent)",
          WebkitMaskImage: "linear-gradient(to top, black, transparent)",
        }}
      />
    </div>
  );
}
