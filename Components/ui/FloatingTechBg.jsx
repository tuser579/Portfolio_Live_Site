'use client';
import { motion } from "framer-motion";

const techIcons = [
  { label: "⚛️", x: "5%", y: "10%", size: 28, duration: 6, delay: 0 },
  { label: "🟢", x: "90%", y: "15%", size: 22, duration: 7, delay: 1 },
  { label: "🔷", x: "15%", y: "80%", size: 24, duration: 8, delay: 0.5 },
  { label: "🍃", x: "85%", y: "75%", size: 26, duration: 5.5, delay: 1.5 },
  { label: "🔥", x: "50%", y: "5%", size: 20, duration: 9, delay: 0.3 },
  { label: "⚡", x: "75%", y: "45%", size: 22, duration: 6.5, delay: 2 },
  { label: "🛠️", x: "10%", y: "50%", size: 20, duration: 7.5, delay: 0.8 },
  { label: "📦", x: "60%", y: "85%", size: 18, duration: 8.5, delay: 1.2 },
  { label: "🌐", x: "35%", y: "92%", size: 24, duration: 6, delay: 0.6 },
  { label: "💻", x: "95%", y: "55%", size: 20, duration: 7, delay: 1.8 },
  { label: "</>", x: "25%", y: "30%", size: 16, duration: 10, delay: 0.2 },
  { label: "{ }", x: "70%", y: "20%", size: 14, duration: 8, delay: 1.4 },
  { label: "API", x: "40%", y: "60%", size: 12, duration: 9, delay: 0.9 },
  { label: "DB", x: "80%", y: "90%", size: 14, duration: 7, delay: 2.2 },
];

const FloatingTechBg = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {techIcons.map((icon, i) => (
        <motion.span
          key={i}
          className="absolute select-none text-primary/10 font-mono font-bold"
          style={{
            left: icon.x,
            top: icon.y,
            fontSize: icon.size,
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 0.15, 0.08, 0.15, 0],
            scale: [0.8, 1.1, 0.95, 1.05, 0.8],
            y: [0, -18, 8, -12, 0],
            x: [0, 6, -4, 8, 0],
            rotate: [0, 8, -5, 3, 0],
          }}
          transition={{
            duration: icon.duration,
            delay: icon.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {icon.label}
        </motion.span>
      ))}

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute w-72 h-72 rounded-full opacity-[0.04]"
        style={{
          background: "var(--gradient-primary)",
          left: "10%",
          top: "20%",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, 40, -20, 30, 0],
          y: [0, -30, 20, -10, 0],
          scale: [1, 1.2, 0.9, 1.1, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-[0.03]"
        style={{
          background: "var(--gradient-primary)",
          right: "5%",
          bottom: "15%",
          filter: "blur(100px)",
        }}
        animate={{
          x: [0, -30, 20, -40, 0],
          y: [0, 20, -30, 15, 0],
          scale: [1, 0.9, 1.15, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full opacity-[0.05]"
        style={{
          background: "var(--gradient-primary)",
          left: "50%",
          top: "60%",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, 25, -15, 20, 0],
          y: [0, -20, 15, -25, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
    </div>
  );
};

export default FloatingTechBg;
