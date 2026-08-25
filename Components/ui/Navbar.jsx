"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { name: "Home",         href: "#home"          },
  { name: "About",        href: "#about"         },
  { name: "Solving",      href: "#problem-solving"},
  { name: "Skills",       href: "#skills"        },
  { name: "Projects",     href: "#projects"      },
  { name: "GitHub",       href: "#github"        },
  { name: "Education",    href: "#education"     },
  { name: "Certs",        href: "#certifications"},
  { name: "Contact",      href: "#contact"       },
];

export default function Navbar() {
  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark,   setIsDark]   = useState(true);
  const [active,   setActive]   = useState("home");

  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio-theme");
    const isLightTheme = savedTheme === "light";
    setIsDark(!isLightTheme);
    
    if (isLightTheme) {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      document.documentElement.setAttribute("data-theme", "light");
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    const nextDark = !isDark;
    setIsDark(nextDark);
    
    if (nextDark) {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      document.body.classList.remove("light");
      document.body.classList.add("dark");
      localStorage.setItem("portfolio-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      document.documentElement.setAttribute("data-theme", "light");
      document.body.classList.remove("dark");
      document.body.classList.add("light");
      localStorage.setItem("portfolio-theme", "light");
    }
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 sm:px-6 lg:px-8 pointer-events-none"
    >
      <div className="w-full max-w-6xl pointer-events-auto relative">
        <nav
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid var(--glass-border)",
            boxShadow: "var(--glow-card)",
            borderRadius: 9999,
          }}
          className="flex items-center justify-between px-4 sm:px-6 py-2.5 transition-all duration-300"
        >
          {/* ── LEFT: Brand / Logo ── */}
          <div className="flex items-center">
            <Link
              href="#home"
              onClick={() => setActive("home")}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
                background: "linear-gradient(135deg, var(--cyan) 0%, var(--violet) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
                textDecoration: "none",
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
              className="hover:opacity-90 transition-opacity"
            >
              &lt;Tuser /&gt;
            </Link>
          </div>

          {/* ── CENTER: Section Link Buttons (Desktop) ── */}
          <div className="hidden lg:flex items-center justify-center gap-1 mx-2 flex-1">
            {navLinks.map((link) => {
              const isCurrent = active === link.href.slice(1);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setActive(link.href.slice(1))}
                  style={{
                    padding: "0.35rem 0.75rem",
                    borderRadius: 9999,
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: isCurrent ? "var(--cyan)" : "var(--text-secondary)",
                    textDecoration: "none",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    fontFamily: "'Inter', sans-serif",
                    background: isCurrent ? "rgba(0, 212, 255, 0.12)" : "transparent",
                    border: isCurrent ? "1px solid rgba(0, 212, 255, 0.3)" : "1px solid transparent",
                    boxShadow: isCurrent ? "0 0 12px rgba(0, 212, 255, 0.15)" : "none",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrent) {
                      e.currentTarget.style.color = "var(--text-primary)";
                      e.currentTarget.style.background = "var(--glass-bg-hover)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrent) {
                      e.currentTarget.style.color = "var(--text-secondary)";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* ── RIGHT: Theme Toggle & Menu (Right side) ── */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                width: 34,
                height: 34,
                borderRadius: 9999,
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                color: "var(--text-secondary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.25s",
                boxShadow: "var(--glow-card)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--cyan)";
                e.currentTarget.style.borderColor = "var(--cyan)";
                e.currentTarget.style.boxShadow = "0 0 12px rgba(0, 212, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.borderColor = "var(--glass-border)";
                e.currentTarget.style.boxShadow = "var(--glow-card)";
              }}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Mobile / Tablet Hamburger Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden"
              aria-label="Toggle menu"
              style={{
                width: 34,
                height: 34,
                borderRadius: 9999,
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                color: isOpen ? "var(--cyan)" : "var(--text-secondary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.25s",
                boxShadow: "var(--glow-card)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--cyan)";
                e.currentTarget.style.borderColor = "var(--cyan)";
              }}
              onMouseLeave={(e) => {
                if (!isOpen) {
                  e.currentTarget.style.color = "var(--text-secondary)";
                  e.currentTarget.style.borderColor = "var(--glass-border)";
                }
              }}
            >
              {isOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </nav>

        {/* ── Mobile Dropdown Menu ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                right: 0,
                background: "var(--bg-layer)",
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
                border: "1px solid var(--glass-border)",
                borderRadius: 20,
                padding: "0.85rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
                boxShadow: "var(--glow-card)",
                pointerEvents: "auto",
              }}
            >
              {navLinks.map((link, i) => {
                const isCurrent = active === link.href.slice(1);
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => {
                        setIsOpen(false);
                        setActive(link.href.slice(1));
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.65rem 1rem",
                        borderRadius: 12,
                        fontSize: "0.88rem",
                        fontWeight: 600,
                        color: isCurrent ? "var(--cyan)" : "var(--text-primary)",
                        textDecoration: "none",
                        fontFamily: "'Inter', sans-serif",
                        background: isCurrent ? "rgba(0, 212, 255, 0.1)" : "transparent",
                        border: isCurrent ? "1px solid rgba(0, 212, 255, 0.25)" : "1px solid transparent",
                        transition: "all 0.2s",
                      }}
                    >
                      <span>{link.name}</span>
                      {isCurrent && (
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--cyan)", boxShadow: "0 0 8px var(--cyan)" }} />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}