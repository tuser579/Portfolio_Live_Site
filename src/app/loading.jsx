"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      { target: 30,  delay: 200  },
      { target: 65,  delay: 600  },
      { target: 88,  delay: 400  },
      { target: 100, delay: 500  },
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
                // Stagger line reveals
                [0, 1, 2].forEach((i) =>
                  setTimeout(() => setLinesDone((p) => { const n=[...p]; n[i]=true; return n; }), i * 300)
                );
                setTimeout(() => setPhase(2), 1800);
                setTimeout(() => onComplete?.(), 2400);
              }, 300);
            } else {
              run(stepIdx + 1);
            }
          }
        }, 18);
      }, delay);
    };

    run(0);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  const lines = [
    { text: "WELCOME TO",       mono: true,  small: true  },
    { text: "MY PORTFOLIO",     mono: false, small: false },
    { text: "SITE",             mono: false, small: false },
  ];

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "hsl(222 47% 8%)" }}
        >

          {/* ── Scan line overlay ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
              zIndex: 1,
            }}
          />

          {/* ── Corner brackets ── */}
          {[
            "top-6 left-6 border-t border-l",
            "top-6 right-6 border-t border-r",
            "bottom-6 left-6 border-b border-l",
            "bottom-6 right-6 border-b border-r",
          ].map((cls, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              className={`absolute w-8 h-8 border-primary/40 ${cls}`}
              style={{ zIndex: 2 }}
            />
          ))}

          {/* ── Top status bar ── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.4em] text-primary/50 uppercase"
            style={{ zIndex: 2 }}
          >
            SYS_INIT · {new Date().getFullYear()}
          </motion.div>

          {/* ── Main content ── */}
          <div className="relative z-10 text-center px-6 w-full max-w-3xl">

            {phase === 0 && (
              <motion.div
                key="loading-phase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-10"
              >
                {/* Hex spinner */}
                <div className="relative w-20 h-20">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2.5 - i * 0.5,
                        repeat: Infinity,
                        ease: "linear",
                        direction: i % 2 === 0 ? "normal" : "reverse",
                      }}
                      className="absolute inset-0 rounded-full border border-primary/30"
                      style={{
                        inset: `${i * 10}px`,
                        borderTopColor: `hsl(198 93% ${59 - i * 10}%)`,
                        borderRightColor: "transparent",
                      }}
                    />
                  ))}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="font-mono text-sm font-bold text-primary tabular-nums"
                    >
                      {String(progress).padStart(3, "0")}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-xs">
                  <div className="flex justify-between font-mono text-[10px] text-primary/40 mb-2 tracking-widest">
                    <span>LOADING</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-px w-full bg-primary/10 relative overflow-hidden">
                    <motion.div
                      className="absolute top-0 left-0 h-full"
                      style={{
                        width: `${progress}%`,
                        backgroundImage: "var(--gradient-primary)",
                        boxShadow: "0 0 12px hsl(198 93% 59% / 0.8)",
                        transition: "width 0.18s linear",
                      }}
                    />
                  </div>
                  {/* Segmented dots */}
                  <div className="flex gap-1.5 mt-3 justify-center">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full transition-all duration-150"
                        style={{
                          background: progress >= (i + 1) * 5
                            ? "hsl(198 93% 59%)"
                            : "hsl(198 93% 59% / 0.15)",
                          boxShadow: progress >= (i + 1) * 5
                            ? "0 0 6px hsl(198 93% 59% / 0.6)"
                            : "none",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Status text cycling */}
                <motion.p
                  className="font-mono text-[11px] tracking-[0.3em] text-primary/40 uppercase"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {progress < 30  ? "INITIALIZING SYSTEMS..."
                  : progress < 65 ? "LOADING ASSETS..."
                  : progress < 88 ? "RENDERING COMPONENTS..."
                  :                 "ALMOST READY..."}
                </motion.p>
              </motion.div>
            )}

            {phase === 1 && (
              <motion.div
                key="reveal-phase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-2"
              >
                {lines.map(({ text, mono, small }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
                    animate={linesDone[i]
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : {}}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p
                      className={`font-black leading-none tracking-tight select-none ${
                        small
                          ? "text-xs tracking-[0.5em] text-primary/60 font-mono font-normal mb-3"
                          : "text-[clamp(2.8rem,10vw,7rem)]"
                      }`}
                      style={!small ? {
                        backgroundImage:      "var(--gradient-primary)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor:  "transparent",
                        backgroundClip:       "text",
                        filter: "drop-shadow(0 0 40px hsl(198 93% 59% / 0.4))",
                      } : {}}
                    >
                      <ScrambleText text={text} trigger={linesDone[i]} />
                    </p>
                  </motion.div>
                ))}

                {/* Underline sweep */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.7, ease: "easeOut" }}
                  className="mt-4 h-px w-48"
                  style={{
                    backgroundImage: "var(--gradient-primary)",
                    transformOrigin: "left",
                    boxShadow: "0 0 16px hsl(198 93% 59% / 0.5)",
                  }}
                />

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-3 font-mono text-[10px] tracking-[0.4em] text-primary/40 uppercase"
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
            className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.4em] text-primary/30 uppercase"
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