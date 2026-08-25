"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Globe, Server, Shield, Database, Cpu, ArrowRight,
  CheckCircle2, Lock, Zap, RefreshCw, Layers, HardDrive,
  CloudLightning, Smartphone, Monitor, ChevronRight
} from "lucide-react";

const ARCHITECTURE_LAYERS = [
  {
    id: "client",
    tier: "01. CLIENT & UI LAYER",
    title: "Next.js & React Frontend",
    icon: Globe,
    color: "#00d4ff",
    borderColor: "rgba(0, 212, 255, 0.35)",
    glowColor: "rgba(0, 212, 255, 0.15)",
    techStack: ["Next.js 15", "React 19", "Tailwind CSS", "Framer Motion", "Turbopack"],
    role: "Delivers pixel-perfect, liquid-glass responsive user interfaces with server-side rendering (SSR) and client caching.",
    metrics: {
      latency: "< 25ms TTFB",
      rendering: "SSR & Hydration",
      caching: "Edge CDN & Tag Revalidation",
    },
    features: [
      "Dynamic responsive viewports for Mobile, Tablet & Desktop",
      "Liquid glassmorphism design system & micro-interactions",
      "Optimized static asset bundling with zero layout shifts",
      "Client-side state management with instant optimistic updates",
    ],
  },
  {
    id: "api",
    tier: "02. API & GATEWAY LAYER",
    title: "Express & Node.js Routing",
    icon: Server,
    color: "#10b981",
    borderColor: "rgba(16, 185, 129, 0.35)",
    glowColor: "rgba(16, 185, 129, 0.15)",
    techStack: ["Node.js", "Express.js", "RESTful Endpoints", "CORS", "Express Rate-Limit"],
    role: "Manages incoming HTTP payloads, rate limits malicious traffic, and orchestrates asynchronous business logic.",
    metrics: {
      latency: "< 45ms Avg API",
      security: "Strict CORS & Headers",
      throughput: "High Concurrency",
    },
    features: [
      "RESTful API design with clean resource routing",
      "Global error-handling middleware with structured JSON responses",
      "Request sanitization & Zod/Joi schema validation",
      "Rate limiting to prevent brute-force attacks and DDOS",
    ],
  },
  {
    id: "auth",
    tier: "03. AUTH & SECURITY LAYER",
    title: "JWT & Role-Based Access",
    icon: Shield,
    color: "#a855f7",
    borderColor: "rgba(168, 85, 247, 0.35)",
    glowColor: "rgba(168, 85, 247, 0.15)",
    techStack: ["JWT Tokens", "Firebase Auth", "Bcrypt.js", "RBAC Policies", "HTTPS SSL"],
    role: "Guarantees zero-trust security with encrypted bearer tokens, permission hierarchies, and identity verification.",
    metrics: {
      encryption: "HS256 / SHA-256",
      authModel: "RBAC & Claims",
      tokenExpiry: "Sliding Sessions",
    },
    features: [
      "Role-Based Access Control (Admin, Moderator, Registered User)",
      "Secure HTTP-only cookie & Bearer token authorization",
      "Bcrypt password hashing with multi-round salt generation",
      "Firebase OAuth integration (Google, GitHub, Email authentication)",
    ],
  },
  {
    id: "database",
    tier: "04. PERSISTENCE & STORAGE",
    title: "MongoDB Atlas & Cloud",
    icon: Database,
    color: "#f59e0b",
    borderColor: "rgba(245, 158, 11, 0.35)",
    glowColor: "rgba(245, 158, 11, 0.15)",
    techStack: ["MongoDB Atlas", "Mongoose ODM", "Cloudinary Media", "Stripe API", "Indexed Queries"],
    role: "Stores transactional records, executes complex multi-stage aggregation pipelines, and manages cloud assets.",
    metrics: {
      replication: "Multi-Zone Cluster",
      indexes: "Compound & Geospatial",
      scalability: "Horizontal Sharding",
    },
    features: [
      "Atomic operations & schema validations with Mongoose",
      "Multi-stage analytical aggregation pipelines ($lookup, $group)",
      "Cloudinary integration for automatic media transformation & CDN",
      "Stripe webhook listeners for automated payment settlement",
    ],
  },
];

export default function SystemArchitecture() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeLayer, setActiveLayer] = useState(ARCHITECTURE_LAYERS[0]);

  return (
    <section id="architecture" className="section-padding overflow-hidden" ref={ref}>
      <div className="site-container">

        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <h2 className="section-title">
            Full-Stack <span className="text-gradient">System Architecture</span>
          </h2>
          <div className="section-line" />
          <p className="section-subtitle">
            End-to-end data lifecycle, high-concurrency API routing, security protocols &amp; database cluster design
          </p>
        </motion.div>

        {/* ── 4-Tier Interactive Architecture Flowchart ── */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {ARCHITECTURE_LAYERS.map((layer, index) => {
            const isSelected = activeLayer.id === layer.id;
            const Icon = layer.icon;
            return (
              <div
                key={layer.id}
                onClick={() => setActiveLayer(layer)}
                style={{
                  background: isSelected ? "var(--glass-bg)" : "rgba(4, 13, 36, 0.6)",
                  backdropFilter: "blur(24px)",
                  border: isSelected ? `1.5px solid ${layer.color}` : "1px solid var(--glass-border)",
                  borderRadius: 20,
                  padding: "1.35rem",
                  cursor: "pointer",
                  position: "relative",
                  boxShadow: isSelected ? `0 12px 35px ${layer.glowColor}` : "var(--glow-card)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isSelected ? "translateY(-4px)" : "none",
                }}
                className="group"
              >
                {/* Active Indicator Top Bar */}
                {isSelected && (
                  <motion.div
                    layoutId="activeArchitectureBar"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 20,
                      right: 20,
                      height: 3,
                      background: layer.color,
                      borderRadius: "0 0 4px 4px",
                      boxShadow: `0 0 10px ${layer.color}`,
                    }}
                  />
                )}

                {/* Tier & Number */}
                <div className="flex items-center justify-between mb-3">
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: layer.color,
                    letterSpacing: "0.05em",
                  }}>
                    {layer.tier}
                  </span>
                  <span style={{
                    fontSize: "0.75rem",
                    fontFamily: "'JetBrains Mono', monospace",
                    color: isSelected ? layer.color : "var(--text-muted)",
                    fontWeight: 700,
                  }}>
                    0{index + 1}
                  </span>
                </div>

                {/* Layer Icon & Title */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: isSelected ? `${layer.color}22` : "rgba(255, 255, 255, 0.05)",
                    border: `1px solid ${isSelected ? layer.color : "var(--glass-border)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: layer.color,
                  }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 800,
                      fontSize: "0.95rem",
                      color: "var(--text-primary)",
                    }}>
                      {layer.title}
                    </h3>
                  </div>
                </div>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {layer.techStack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      style={{
                        fontSize: "0.65rem",
                        padding: "0.15rem 0.45rem",
                        borderRadius: 6,
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid var(--glass-border)",
                        color: "var(--text-secondary)",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                  {layer.techStack.length > 3 && (
                    <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
                      +{layer.techStack.length - 3}
                    </span>
                  )}
                </div>

                {/* Active Indicator Footer */}
                <div className="mt-4 pt-3 border-t border-[var(--glass-border)] flex items-center justify-between">
                  <span style={{
                    fontSize: "0.7rem",
                    color: isSelected ? layer.color : "var(--text-muted)",
                    fontWeight: 600,
                    fontFamily: "'Outfit', sans-serif",
                  }}>
                    {isSelected ? "Inspecting Layer" : "Click to Inspect"}
                  </span>
                  <ChevronRight size={14} style={{ color: isSelected ? layer.color : "var(--text-muted)" }} />
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* ── Interactive Deep-Dive Architecture Inspector ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLayer.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            style={{
              background: "rgba(4, 13, 36, 0.94)",
              backdropFilter: "blur(32px)",
              border: `1px solid ${activeLayer.borderColor}`,
              borderRadius: 24,
              padding: "2rem",
              boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 35px ${activeLayer.glowColor}`,
            }}
          >
            {/* Top Bar with Icon, Tier Name and Key Metrics */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[var(--glass-border)]">
              <div className="flex items-center gap-4">
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: `${activeLayer.color}20`,
                  border: `1.5px solid ${activeLayer.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: activeLayer.color,
                  boxShadow: `0 0 20px ${activeLayer.glowColor}`,
                }}>
                  <activeLayer.icon size={26} />
                </div>
                <div>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: activeLayer.color,
                    letterSpacing: "0.05em",
                  }}>
                    {activeLayer.tier}
                  </span>
                  <h3 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.4rem",
                    color: "var(--text-primary)",
                  }}>
                    {activeLayer.title}
                  </h3>
                </div>
              </div>

              {/* Metrics Pill Grid */}
              <div className="flex flex-wrap items-center gap-3">
                {Object.entries(activeLayer.metrics).map(([key, val]) => (
                  <div
                    key={key}
                    style={{
                      padding: "0.5rem 0.9rem",
                      borderRadius: 12,
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid var(--glass-border)",
                    }}
                  >
                    <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>
                      {key}
                    </p>
                    <p style={{ fontSize: "0.82rem", fontWeight: 700, color: activeLayer.color, fontFamily: "'JetBrains Mono', monospace" }}>
                      {val}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Details & Engineering Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">

              {/* Left Overview Column (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                    Layer Responsibility &amp; Design
                  </h4>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.7 }}>
                    {activeLayer.role}
                  </p>
                </div>

                <div>
                  <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "0.6rem" }}>
                    Integrated Technologies:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeLayer.techStack.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          padding: "0.3rem 0.7rem",
                          borderRadius: 8,
                          background: `${activeLayer.color}15`,
                          border: `1px solid ${activeLayer.color}40`,
                          color: activeLayer.color,
                          fontSize: "0.75rem",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontWeight: 600,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Feature Highlights (7 cols) */}
              <div className="lg:col-span-7 space-y-3">
                <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                  Core Engineering Protocols &amp; Optimizations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeLayer.features.map((feat, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.6rem",
                        padding: "0.85rem",
                        borderRadius: 14,
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid var(--glass-border)",
                      }}
                    >
                      <CheckCircle2 size={16} style={{ color: activeLayer.color, flexShrink: 0, marginTop: "0.15rem" }} />
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
