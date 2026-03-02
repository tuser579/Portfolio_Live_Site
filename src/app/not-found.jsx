"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

const NotFound404 = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let t = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cols = Math.ceil(canvas.width  / 48);
      const rows = Math.ceil(canvas.height / 48);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x    = c * 48 + 24;
          const y    = r * 48 + 24;
          const dist = Math.sqrt((x - canvas.width / 2) ** 2 + (y - canvas.height / 2) ** 2);
          const wave = Math.sin(dist / 80 - t) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(14,165,233,${wave * 0.18})`;
          ctx.fill();
        }
      }
      t += 0.03;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(198 93% 59% / 0.08) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 text-center px-4">

        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative inline-block mb-2"
        >
          <span
            className="text-[clamp(7rem,25vw,18rem)] font-black leading-none select-none"
            style={{
              backgroundImage:     "var(--gradient-primary)",
              WebkitBackgroundClip:"text",
              WebkitTextFillColor: "transparent",
              backgroundClip:      "text",
              filter:              "drop-shadow(0 0 60px hsl(198 93% 59% / 0.35))",
            }}
          >
            404
          </span>
          <motion.span
            animate={{ x: [0, -4, 4, -2, 0], opacity: [0, 0.5, 0.3, 0.5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
            aria-hidden
            className="absolute inset-0 text-[clamp(7rem,25vw,18rem)] font-black leading-none select-none text-primary"
            style={{ clipPath: "polygon(0 30%, 100% 30%, 100% 50%, 0 50%)", opacity: 0 }}
          >
            404
          </motion.span>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="h-px w-48 mx-auto mb-8"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-3 font-mono">
            Page Not Found
          </p>
          <p className="text-foreground/60 text-base sm:text-lg max-w-sm mx-auto leading-relaxed mb-10">
            The page you&apos;re looking for has drifted into the void.
            Let&apos;s get you back on track.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-primary-foreground transition-all hover-lift glow w-full sm:w-auto justify-center"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 font-mono text-xs text-muted-foreground/40 tracking-widest"
        >
          ERROR_CODE://404 · ROUTE_NOT_FOUND
        </motion.p>

      </div>
    </div>
  );
};

export default NotFound404;