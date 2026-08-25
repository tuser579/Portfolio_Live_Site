"use client";

import Link from "next/link";
import { Github, Linkedin, Twitter, ArrowUp, Mail, MapPin, Sparkles, Heart } from "lucide-react";

const NAV_LINKS = [
  { name: "Home",           href: "#home"          },
  { name: "About",          href: "#about"         },
  { name: "Skills",         href: "#skills"        },
  { name: "Projects",       href: "#projects"      },
  { name: "Problem Solving", href: "#problem-solving" },
  { name: "Education",      href: "#education"     },
  { name: "Certifications", href: "#certifications"},
  { name: "Contact",        href: "#contact"       },
];

const SOCIALS = [
  { icon: Github,   href: "https://github.com/tuser579",                                     label: "GitHub",   color: "var(--cyan)",    handle: "@tuser579" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/md-muttakiul-islam-tuser-36b104388", label: "LinkedIn", color: "#0ea5e9",        handle: "md-muttakiul-islam-tuser" },
  { icon: Twitter,  href: "https://x.com/md_57990667",                                       label: "Twitter",  color: "#38bdf8",        handle: "@md_57990667" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer style={{ position: "relative", overflow: "hidden" }} className="section-padding !pt-12 !pb-8">
      <div className="site-container">
        {/* Top Gradient Separator */}
        <div className="mb-12" style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.4), rgba(124,58,237,0.4), transparent)",
        }} />

        {/* Main 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 items-start w-full">

          {/* Column 1: Brand & Status (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-start gap-4">
            {/* Standardized Title Header (Height 28px) */}
            <div style={{ height: 28, display: "flex", alignItems: "center" }}>
              <Link
                href="#home"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 800,
                  fontSize: "1.15rem",
                  background: "linear-gradient(135deg, var(--cyan) 0%, var(--violet) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                  textDecoration: "none",
                  letterSpacing: "-0.02em",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                &lt;Tuser /&gt;
              </Link>
            </div>

            <p style={{
              color: "var(--text-secondary)",
              fontSize: "0.88rem",
              lineHeight: 1.7,
              maxWidth: 380,
            }}>
              Full-Stack MERN Developer specializing in high-performance frontend interfaces, responsive designs, and scalable full-stack applications.
            </p>

            {/* Live Availability Badge */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.55rem",
              padding: "0.4rem 0.9rem",
              borderRadius: 9999,
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--glow-card)",
              backdropFilter: "blur(12px)",
            }}>
              <span style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 8px #10b981",
                animation: "dot-pulse 1.5s ease-in-out infinite",
              }} />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "var(--text-primary)",
              }}>
                Available for New Opportunities
              </span>
            </div>

            {/* Location & Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginTop: "0.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: "var(--text-muted)", fontSize: "0.78rem" }}>
                <MapPin size={13} style={{ color: "var(--cyan)" }} />
                <span>DSC, Asulia, Birulia, Dhaka-1216</span>
              </div>
              <a
                href="mailto:tusermon720@gmail.com"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  color: "var(--text-secondary)",
                  fontSize: "0.78rem",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--cyan)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
              >
                <Mail size={13} style={{ color: "var(--violet)" }} />
                <span>tusermon720@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links (3 cols) */}
          <div className="lg:col-span-3 flex flex-col items-start gap-4">
            {/* Standardized Title Header (Height 28px) */}
            <div style={{ height: 28, display: "flex", alignItems: "center" }}>
              <h4 style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--text-primary)",
                letterSpacing: "0.02em",
                margin: 0,
              }}>
                Quick Links
              </h4>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem 1rem", width: "100%" }}>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.83rem",
                    textDecoration: "none",
                    transition: "all 0.2s",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--cyan)";
                    e.currentTarget.style.transform = "translateX(3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-secondary)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Connect & Socials (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-4">
            <div style={{ width: "100%" }} className="flex flex-col lg:items-end gap-4">
              {/* Standardized Title Header (Height 28px) */}
              <div style={{ height: 28, display: "flex", alignItems: "center" }}>
                <h4 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "var(--text-primary)",
                  letterSpacing: "0.02em",
                  margin: 0,
                }}>
                  Connect
                </h4>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", width: "100%", maxWidth: 280 }}>
                {SOCIALS.map(({ icon: Icon, href, label, color, handle }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.5rem 0.85rem",
                      borderRadius: 12,
                      background: "var(--glass-bg)",
                      border: "1px solid var(--glass-border)",
                      textDecoration: "none",
                      color: "var(--text-secondary)",
                      transition: "all 0.25s",
                      boxShadow: "var(--glow-card)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--glass-border-hover)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--glass-border)";
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                      <Icon size={16} style={{ color }} />
                      <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{label}</span>
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "var(--text-muted)" }}>
                      {handle}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.45rem 1.1rem",
                borderRadius: 9999,
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                color: "var(--text-secondary)",
                fontSize: "0.78rem",
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.25s",
                boxShadow: "var(--glow-card)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--cyan)";
                e.currentTarget.style.color = "var(--cyan)";
                e.currentTarget.style.boxShadow = "0 0 16px rgba(0,212,255,0.2)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--glass-border)";
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.boxShadow = "var(--glow-card)";
                e.currentTarget.style.transform = "none";
              }}
            >
              <ArrowUp size={14} /> Back to Top
            </button>
          </div>

        </div>

        {/* Bottom Horizontal Bar */}
        <div style={{
          borderTop: "1px solid var(--glass-border)",
          paddingTop: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}>
          {/* Copyright */}
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.74rem",
            color: "var(--text-muted)",
          }}>
            © {new Date().getFullYear()} MD. MUTTAKIUL ISLAM TUSER. All rights reserved.
          </p>
        </div>
      </div>

      {/* Subtle Background Aurora Glow */}
      <div style={{
        position: "absolute",
        bottom: -50,
        left: "50%",
        transform: "translateX(-50%)",
        width: 500,
        height: 120,
        background: "radial-gradient(ellipse, rgba(0, 212, 255, 0.08), rgba(124, 58, 237, 0.04), transparent 70%)",
        pointerEvents: "none",
        filter: "blur(40px)",
      }} />
    </footer>
  );
}