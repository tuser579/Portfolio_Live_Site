"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import profilePhoto from "../../public/lustro-Gemini_Generated_Image_kkbq5akkbq5akkbq.png";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

function ScrambleText({ text, trigger }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!trigger) return;
    let frame = 0;
    const total = 18;
    const id = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (frame / total > i / text.length) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      frame++;
      if (frame > total) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
  }, [trigger, text]);

  return <span>{display}</span>;
}

const LoadingScreen = ({ onComplete }) => {
  const [progress,  setProgress]  = useState(0);
  const [phase,     setPhase]     = useState(0); // 0=loading, 1=reveal, 2=exit
  const [scramble,  setScramble]  = useState(false);
  const [linesDone, setLinesDone] = useState([false, false, false]);

  // Simulate loading progress
  useEffect(() => {
    const steps = [
      { target: 35,  delay: 150 },
      { target: 70,  delay: 350 },
      { target: 90,  delay: 300 },
      { target: 100, delay: 350 },
    ];

    let timeout;
    let current = 0;

    const run = (stepIdx) => {
      if (stepIdx >= steps.length) return;
      const { target, delay } = steps[stepIdx];
      timeout = setTimeout(() => {
        const increment = setInterval(() => {
          current++;
          setProgress(current);
          if (current >= target) {
            clearInterval(increment);
            if (target === 100) {
              setTimeout(() => {
                setPhase(1);
                setScramble(true);
                [0, 1, 2].forEach((i) =>
                  setTimeout(() => setLinesDone((p) => { const n = [...p]; n[i] = true; return n; }), i * 250)
                );
                setTimeout(() => setPhase(2), 1500);
                setTimeout(() => onComplete?.(), 2000);
              }, 250);
            } else {
              run(stepIdx + 1);
            }
          }
        }, 14);
      }, delay);
    };

    run(0);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  const lines = [
    { text: "WELCOME TO",   mono: true,  small: true  },
    { text: "MY PORTFOLIO", mono: false, small: false },
    { text: "SITE",         mono: false, small: false },
  ];

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#020818" }}
        >
          {/* ── Background radial glow ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(0, 212, 255, 0.12) 0%, rgba(124, 58, 237, 0.06) 45%, transparent 75%)",
            }}
          />

          {/* ── Scan line subtle overlay ── */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)",
              zIndex: 1,
            }}
          />

          {/* ── Corner tech brackets ── */}
          {[
            "top-6 left-6 border-t-2 border-l-2",
            "top-6 right-6 border-t-2 border-r-2",
            "bottom-6 left-6 border-b-2 border-l-2",
            "bottom-6 right-6 border-b-2 border-r-2",
          ].map((cls, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              className={`absolute w-7 h-7 border-cyan/40 ${cls}`}
              style={{ zIndex: 2 }}
            />
          ))}

          {/* ── Top status bar ── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] sm:text-xs tracking-[0.35em] text-cyan/70 uppercase font-semibold"
            style={{ zIndex: 2 }}
          >
            SYS_INIT · TUSER_PORTFOLIO
          </motion.div>

          {/* ── Main Center Content ── */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full max-w-3xl">

            {/* ── PHOTO IN CENTER (Always visible during loading) ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6 flex items-center justify-center"
            >
              {/* Outer rotating neon dash ring 1 */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-dashed border-cyan/40 pointer-events-none"
              />

              {/* Inner rotating gradient ring 2 */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-t-cyan border-r-violet-500 border-b-transparent border-l-transparent pointer-events-none"
                style={{ filter: "drop-shadow(0 0 12px rgba(0, 212, 255, 0.6))" }}
              />

              {/* Pulsing ambient glow behind photo */}
              <div
                className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(0, 212, 255, 0.45) 0%, rgba(124, 58, 237, 0.25) 60%, transparent 80%)",
                  filter: "blur(14px)",
                }}
              />

              {/* Centered User Photo Avatar */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-[3px] bg-gradient-to-tr from-cyan-400 via-violet-500 to-fuchsia-400 shadow-[0_0_35px_rgba(0,212,255,0.4)] overflow-hidden">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 relative">
                  <Image
                    src={profilePhoto}
                    alt="MD. Muttakiul Islam Tuser"
                    fill
                    priority
                    sizes="(max-width: 640px) 112px, 144px"
                    className="object-cover object-top scale-105"
                  />
                </div>
              </div>

              {/* Circular Percentage Pill */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-2.5 px-3 py-0.5 rounded-full bg-slate-900/90 border border-cyan/40 backdrop-blur-md shadow-lg shadow-cyan/20"
              >
                <span className="font-mono text-xs font-bold text-cyan tabular-nums tracking-wider">
                  {progress}%
                </span>
              </motion.div>
            </motion.div>

            {phase === 0 && (
              <motion.div
                key="loading-phase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-4 w-full max-w-xs"
              >
                {/* Progress bar */}
                <div className="w-full mt-2">
                  <div className="flex justify-between font-mono text-[10px] text-cyan/60 mb-1.5 tracking-widest uppercase">
                    <span>LOADING SYSTEM</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900/80 rounded-full border border-cyan/20 overflow-hidden relative">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        width: `${progress}%`,
                        backgroundImage: "var(--grad-primary, linear-gradient(90deg, #00d4ff, #7c3aed))",
                        boxShadow: "0 0 14px rgba(0, 212, 255, 0.8)",
                        transition: "width 0.12s ease-out",
                      }}
                    />
                  </div>
                </div>

                {/* Status text cycling */}
                <motion.p
                  className="font-mono text-[11px] tracking-[0.25em] text-cyan/70 uppercase font-medium mt-1"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  {progress < 30  ? "INITIALIZING SYSTEM..."
                  : progress < 65 ? "LOADING PORTFOLIO..."
                  : progress < 90 ? "RENDERING ASSETS..."
                  :                 "READY"}
                </motion.p>
              </motion.div>
            )}

            {phase === 1 && (
              <motion.div
                key="reveal-phase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-1 mt-1"
              >
                {lines.map(({ text, small }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={linesDone[i] ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p
                      className={`font-black leading-tight select-none ${
                        small
                          ? "text-xs tracking-[0.4em] text-cyan font-mono font-bold mb-1 uppercase"
                          : "text-2xl sm:text-4xl tracking-tight"
                      }`}
                      style={!small ? {
                        backgroundImage:      "var(--grad-primary, linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #f0abfc 100%))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor:  "transparent",
                        backgroundClip:       "text",
                        filter: "drop-shadow(0 0 30px rgba(0, 212, 255, 0.4))",
                      } : {}}
                    >
                      <ScrambleText text={text} trigger={linesDone[i]} />
                    </p>
                  </motion.div>
                ))}

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-2 font-mono text-xs tracking-[0.3em] text-cyan/70 font-semibold uppercase"
                >
                  MD. MUTTAKIUL ISLAM TUSER
                </motion.p>
              </motion.div>
            )}
          </div>

          {/* ── Bottom status ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] sm:text-xs tracking-[0.35em] text-cyan/50 uppercase"
            style={{ zIndex: 2 }}
          >
            MERN · NEXT.JS · PORTFOLIO
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;