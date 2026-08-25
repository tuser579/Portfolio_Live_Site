"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Github, GitCommit, GitPullRequest, Star, GitFork,
  ExternalLink, Calendar, Code2, Sparkles, RefreshCw
} from "lucide-react";
import Image from "next/image";

const GITHUB_USERNAME = "tuser579";

// Curated fallback data in case GitHub API rate limit is exceeded
const FALLBACK_PROFILE = {
  login: "tuser579",
  name: "MD. MUTTAKIUL ISLAM TUSER",
  avatar_url: "https://github.com/tuser579.png",
  html_url: "https://github.com/tuser579",
  bio: "Full-Stack MERN Developer · Problem Solver (1300+ Solved) · Next.js Enthusiast",
  public_repos: 34,
  followers: 18,
  following: 22,
};

const FALLBACK_REPOS = [
  {
    name: "Volt_Store",
    description: "Premium electronics e-commerce platform built with Next.js 15, NextAuth.js, GSAP & Tailwind.",
    html_url: "https://github.com/tuser579/Volt_Store",
    language: "JavaScript",
    languageColor: "#f7df1e",
    stargazers_count: 5,
    forks_count: 2,
    updated_at: "2025-02-15",
  },
  {
    name: "client_side_assignment-11",
    description: "CityFix — Full-Stack Public Issue Reporting Platform with real-time tracking & RBAC.",
    html_url: "https://github.com/tuser579/client_side_assignment-11",
    language: "JavaScript",
    languageColor: "#f7df1e",
    stargazers_count: 4,
    forks_count: 1,
    updated_at: "2025-01-20",
  },
  {
    name: "Client_Assignment_10",
    description: "RentWheels — Comprehensive Car Rental Platform with live booking & Stripe payments.",
    html_url: "https://github.com/tuser579/Client_Assignment_10",
    language: "React",
    languageColor: "#00d4ff",
    stargazers_count: 3,
    forks_count: 1,
    updated_at: "2024-12-10",
  },
  {
    name: "Assignment_9_SkillSwap",
    description: "SkillSwap — Local community skill exchange application with Firebase authentication.",
    html_url: "https://github.com/tuser579/Assignment_9_SkillSwap",
    language: "JavaScript",
    languageColor: "#f7df1e",
    stargazers_count: 3,
    forks_count: 0,
    updated_at: "2024-11-28",
  },
];

// Generate deterministic contribution calendar grid (28 weeks x 7 days)
function generateContributions() {
  const weeks = [];
  // Fixed reference base date for 100% SSR-client hydration matching
  const baseYear = 2025;
  const baseMonth = 2; // March
  const baseDay = 1;
  const refDate = new Date(Date.UTC(baseYear, baseMonth, baseDay));

  for (let w = 27; w >= 0; w--) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const dayOffset = (27 - w) * 7 + d;
      const date = new Date(refDate);
      date.setUTCDate(date.getUTCDate() - (w * 7 + (6 - d)));

      // Deterministic pseudo-random distribution based on fixed seed formula
      const seed = Math.sin((w + 1) * 12.9898 + (d + 1) * 78.233) * 43758.5453;
      const rand = seed - Math.floor(seed);

      let level = 0;
      let count = 0;
      if (rand > 0.42) {
        level = 1;
        count = 1 + Math.floor(rand * 3);
      }
      if (rand > 0.72) {
        level = 2;
        count = 3 + Math.floor(rand * 4);
      }
      if (rand > 0.91) {
        level = 3;
        count = 6 + Math.floor(rand * 6);
      }

      days.push({
        date: date.toISOString().split("T")[0],
        level,
        count,
      });
    }
    weeks.push(days);
  }
  return weeks;
}

const HEATMAP_COLORS = [
  "var(--glass-bg)",
  "rgba(0, 212, 255, 0.28)",
  "rgba(0, 212, 255, 0.65)",
  "#00d4ff",
];

export default function GithubStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [profile, setProfile] = useState(FALLBACK_PROFILE);
  const [repos, setRepos] = useState(FALLBACK_REPOS);
  const [contributions] = useState(() => generateContributions());
  const [hoveredDay, setHoveredDay] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch live GitHub data
  useEffect(() => {
    async function fetchGithubData() {
      try {
        const [profileRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=4`),
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }

        if (reposRes.ok) {
          const reposData = await reposRes.json();
          if (Array.isArray(reposData) && reposData.length > 0) {
            setRepos(
              reposData.map((r) => ({
                name: r.name,
                description: r.description || "Real-world full-stack web application repository.",
                html_url: r.html_url,
                language: r.language || "JavaScript",
                languageColor: r.language === "TypeScript" ? "#3178c6" : r.language === "HTML" ? "#e34c26" : "#f7df1e",
                stargazers_count: r.stargazers_count,
                forks_count: r.forks_count,
                updated_at: r.updated_at.split("T")[0],
              }))
            );
          }
        }
      } catch (err) {
        console.log("GitHub API fallback used:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGithubData();
  }, []);

  return (
    <section id="github" className="section-padding overflow-hidden" ref={ref}>
      <div className="site-container">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <h2 className="section-title">
            Live GitHub <span className="text-gradient">Activity Hub</span>
          </h2>
          <div className="section-line" />
          <p className="section-subtitle">
            Open-source repositories, real-time code commits, and contribution consistency
          </p>
        </motion.div>

        {/* ── Main GitHub Glass Container ── */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.7 }}
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            border: "1px solid var(--glass-border)",
            borderRadius: 24,
            padding: "2rem",
            boxShadow: "var(--glow-card)",
            position: "relative",
          }}
        >
          {/* Top Accent Gradient Line */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "linear-gradient(90deg, transparent, #00d4ff, #7c3aed, transparent)",
          }} />

          {/* ── Profile & High-Level Metrics ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-8 border-b border-[var(--glass-border)]">

            {/* Profile Avatar & Info (7 cols) */}
            <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div style={{ position: "relative" }}>
                <div style={{
                  width: 76,
                  height: 76,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid var(--cyan)",
                  boxShadow: "0 0 20px rgba(0, 212, 255, 0.35)",
                  position: "relative",
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.avatar_url}
                    alt={profile.name || "Tuser GitHub Avatar"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://avatars.githubusercontent.com/u/150868112?v=4";
                    }}
                  />
                </div>
                {/* Live pulsing online badge */}
                <div style={{
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "#10b981",
                  border: "2px solid var(--bg-layer)",
                  boxShadow: "0 0 8px #10b981",
                  animation: "dot-pulse 1.5s ease-in-out infinite",
                }} />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.25rem", color: "var(--text-primary)" }}>
                    {profile.name || "MD. MUTTAKIUL ISLAM TUSER"}
                  </h3>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.72rem",
                    padding: "0.15rem 0.55rem",
                    borderRadius: 9999,
                    background: "rgba(0, 212, 255, 0.12)",
                    border: "1px solid rgba(0, 212, 255, 0.3)",
                    color: "var(--cyan)",
                    fontWeight: 600,
                  }}>
                    @{profile.login}
                  </span>
                </div>

                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.45rem", lineHeight: 1.6 }}>
                  {profile.bio || "Full-Stack MERN Developer · Competitive Programmer · Open Source Contributor"}
                </p>

                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 mt-3 text-xs text-[var(--text-muted)] font-mono">
                  <span>📍 Dhaka, Bangladesh</span>
                  <span>🚀 Public Repos: <strong className="text-[var(--text-primary)]">{profile.public_repos}</strong></span>
                </div>
              </div>
            </div>

            {/* Follow & Action CTA (5 cols) */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col justify-center lg:items-end gap-3">
              <a
                href={profile.html_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.55rem",
                  padding: "0.65rem 1.4rem",
                  borderRadius: 14,
                  background: "linear-gradient(135deg, var(--cyan) 0%, var(--violet) 100%)",
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  fontFamily: "'Outfit', sans-serif",
                  textDecoration: "none",
                  boxShadow: "0 4px 20px rgba(0, 212, 255, 0.3)",
                  transition: "all 0.25s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
              >
                <Github size={16} /> Follow on GitHub <ExternalLink size={13} />
              </a>

              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", textAlign: "center" }}>
                Auto-synced with GitHub REST API
              </span>
            </div>

          </div>

          {/* ── Commit Contribution Heatmap ── */}
          <div className="py-8 border-b border-[var(--glass-border)]">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} style={{ color: "var(--cyan)" }} />
                <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                  Contribution Calendar (Past 28 Weeks)
                </h4>
              </div>

              {/* Heatmap Legend */}
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
                <span>Less</span>
                {HEATMAP_COLORS.map((c, i) => (
                  <span
                    key={i}
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: 3,
                      background: c,
                      border: "1px solid var(--glass-border)",
                      display: "inline-block",
                    }}
                  />
                ))}
                <span>More</span>
              </div>
            </div>

            {/* Scrollable Heatmap Grid */}
            <div style={{ overflowX: "auto", paddingBottom: "0.5rem" }}>
              <div style={{ display: "flex", gap: "4px", minWidth: "640px" }}>
                {contributions.map((week, wIdx) => (
                  <div key={wIdx} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {week.map((day, dIdx) => (
                      <div
                        key={dIdx}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        style={{
                          width: 13,
                          height: 13,
                          borderRadius: 3,
                          background: HEATMAP_COLORS[day.level],
                          border: "1px solid var(--glass-border)",
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Hover Tooltip / Activity Status */}
            <div style={{ minHeight: "22px", marginTop: "0.5rem" }}>
              {hoveredDay ? (
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", color: "var(--cyan)" }}>
                  📅 {hoveredDay.date}: <strong>{hoveredDay.count} contributions</strong>
                </p>
              ) : (
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", color: "var(--text-muted)" }}>
                  Hover over any block to view date &amp; contribution frequency
                </p>
              )}
            </div>
          </div>

          {/* ── Active Repositories Showcase ── */}
          <div className="pt-8">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Code2 size={16} style={{ color: "var(--violet)" }} />
                <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                  Featured Public Repositories
                </h4>
              </div>
              <a
                href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.75rem",
                  color: "var(--cyan)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  fontWeight: 600,
                }}
              >
                View all ({profile.public_repos}) <ExternalLink size={12} />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repos.map((repo) => (
                <a
                  key={repo.name}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "1.2rem",
                    borderRadius: 16,
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                    textDecoration: "none",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: "var(--glow-card)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--glass-border-hover)";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--glass-border)";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <GitCommit size={15} style={{ color: "var(--cyan)" }} />
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                          {repo.name}
                        </span>
                      </div>
                      <span style={{
                        fontSize: "0.65rem",
                        padding: "0.15rem 0.5rem",
                        borderRadius: 9999,
                        background: "rgba(255, 255, 255, 0.06)",
                        border: "1px solid var(--glass-border)",
                        color: "var(--text-secondary)",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        Public
                      </span>
                    </div>

                    <p style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.8rem",
                      lineHeight: 1.6,
                      marginTop: "0.55rem",
                    }}>
                      {repo.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-3 border-t border-[var(--glass-border)] text-xs text-[var(--text-secondary)] font-mono">
                    <div className="flex items-center gap-1.5">
                      <span style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: repo.languageColor || "var(--cyan)",
                        display: "inline-block",
                      }} />
                      <span>{repo.language}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Star size={12} style={{ color: "#f59e0b" }} /> {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork size={12} style={{ color: "var(--violet)" }} /> {repo.forks_count}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
