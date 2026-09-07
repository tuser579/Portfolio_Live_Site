"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Calendar, Phone, Mail, Clock, Check,
  Copy, ExternalLink, X, Send, Sparkles, MapPin, Coffee
} from "lucide-react";
import toast from "react-hot-toast";
import { safeCopyToClipboard } from "../../src/lib/clipboard";

const PRESET_MESSAGES = [
  "Hi Tuser, I reviewed your portfolio and would like to discuss a Full-Stack Developer opportunity.",
  "Hey Tuser, I have a freelance/contract project and would love to work with you.",
  "Hello Tuser, let's schedule a 15-minute quick interview / coffee chat.",
  "Hi Tuser, I'm interested in collaborating on an open-source MERN project.",
];

export default function QuickConnectDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("whatsapp"); // 'whatsapp' | 'meeting'
  const [customMsg, setCustomMsg] = useState(PRESET_MESSAGES[0]);
  const [emailSubject, setEmailSubject] = useState("Full-Stack Developer Role / Project Inquiry");
  const [emailBody, setEmailBody] = useState("Hi Tuser,\n\nI reviewed your portfolio and would love to connect regarding an opportunity.\n\nBest regards,");
  const [copiedField, setCopiedField] = useState(null);

  // User contact details
  const PHONE_NUMBER = "+8801760049326";
  const CLEAN_PHONE = "8801760049326";
  const EMAIL = "tusermon720@gmail.com";

  const EMAIL_PRESET_SUBJECTS = [
    "Full-Stack Developer Opportunity",
    "Freelance / Contract Project",
    "15-Minute Technical Interview",
    "Collaboration / General Inquiry",
  ];

  const handleCopy = async (text, field) => {
    await safeCopyToClipboard(text);
    setCopiedField(field);
    toast.success(`Copied ${field} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSendWhatsApp = () => {
    const encoded = encodeURIComponent(customMsg.trim() || PRESET_MESSAGES[0]);
    window.open(`https://wa.me/${CLEAN_PHONE}?text=${encoded}`, "_blank");
    toast.success("Opening WhatsApp chat...");
  };

  const handleOpenEmail = async (type = "gmail") => {
    const subject = encodeURIComponent(emailSubject.trim() || "Full-Stack Developer Role / Project Inquiry");
    const body = encodeURIComponent(emailBody.trim());

    // Safely copy email to clipboard while window is focused before opening new tab
    await safeCopyToClipboard(EMAIL);

    if (type === "gmail") {
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=${subject}&body=${body}`;
      window.open(gmailUrl, "_blank");
      toast.success("Opening Gmail Web Composer...");
    } else {
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
      toast.success("Opening default Mail App...");
    }
  };

  // Lock background body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isOpen]);

  return (
    <>
      {/* ── Floating Launcher Trigger Pill (Bottom Left) ── */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open Quick Connect & WhatsApp Chat"
        style={{
          position: "fixed",
          bottom: 24,
          left: 24,
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          gap: "0.55rem",
          padding: "0.55rem 1rem",
          borderRadius: 9999,
          background: "var(--glass-bg)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(16, 185, 129, 0.35)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(16,185,129,0.15)",
          color: "var(--text-primary)",
          cursor: "pointer",
          transition: "all 0.25s",
        }}
        className="group"
      >
        <span style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#10b981",
          boxShadow: "0 0 10px #10b981",
          animation: "dot-pulse 1.5s ease-in-out infinite",
        }} />
        <MessageSquare size={16} style={{ color: "#10b981" }} />
        <span style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "0.8rem",
          fontWeight: 700,
          color: "var(--text-primary)",
        }}>
          Quick Connect
        </span>
        <span style={{
          fontSize: "0.68rem",
          padding: "0.15rem 0.45rem",
          borderRadius: 6,
          background: "rgba(16,185,129,0.15)",
          color: "#10b981",
          fontWeight: 600,
        }} className="hidden sm:inline-block">
          WhatsApp / Call
        </span>
      </motion.button>

      {/* ── Centered Liquid Glass Quick Connect Modal ── */}
      <AnimatePresence>
        {isOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(2, 8, 24, 0.75)",
              backdropFilter: "blur(16px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "520px",
                maxHeight: "88vh",
                background: "rgba(4, 13, 36, 0.96)",
                backdropFilter: "blur(36px)",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                borderRadius: 24,
                boxShadow: "0 25px 80px rgba(0, 0, 0, 0.85), 0 0 35px rgba(16, 185, 129, 0.15)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Drawer Header */}
              <div style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid var(--glass-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(2, 8, 24, 0.6)",
              }}>
                <div className="flex items-center gap-3">
                  <div style={{ position: "relative" }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "2px solid #10b981",
                      position: "relative",
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/lustro-Gemini_Generated_Image_kkbq5akkbq5akkbq.png"
                        alt="MD. Muttakiul Islam Tuser Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/WhatsApp Image 2025-02-12 at 18.28.13_7f432b84.jpg";
                        }}
                      />
                    </div>
                    <span style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "#10b981",
                      border: "2px solid #020818",
                    }} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1rem", color: "var(--text-primary)" }}>
                      MD. MUTTAKIUL ISLAM TUSER
                    </h3>
                    <p style={{ fontSize: "0.72rem", color: "#10b981", display: "flex", alignItems: "center", gap: "0.3rem", fontWeight: 600 }}>
                      <Sparkles size={11} /> Available for Full-Stack Roles
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Navigation Tabs */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                padding: "0.75rem 1.5rem",
                gap: "0.5rem",
                borderBottom: "1px solid var(--glass-border)",
              }}>
                <button
                  onClick={() => setActiveTab("whatsapp")}
                  style={{
                    padding: "0.6rem",
                    borderRadius: 12,
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    fontFamily: "'Outfit', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    border: activeTab === "whatsapp" ? "1px solid #10b981" : "1px solid var(--glass-border)",
                    background: activeTab === "whatsapp" ? "rgba(16, 185, 129, 0.15)" : "transparent",
                    color: activeTab === "whatsapp" ? "#10b981" : "var(--text-secondary)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <MessageSquare size={14} /> WhatsApp Direct
                </button>

                <button
                  onClick={() => setActiveTab("meeting")}
                  style={{
                    padding: "0.6rem",
                    borderRadius: 12,
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    fontFamily: "'Outfit', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    border: activeTab === "meeting" ? "1px solid var(--cyan)" : "1px solid var(--glass-border)",
                    background: activeTab === "meeting" ? "rgba(0, 212, 255, 0.15)" : "transparent",
                    color: activeTab === "meeting" ? "var(--cyan)" : "var(--text-secondary)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <Calendar size={14} /> Schedule / Info
                </button>
              </div>

              {/* Drawer Body Content with Y-axis scrolling */}
              <div style={{
                padding: "1.5rem",
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}>
                
                {activeTab === "whatsapp" ? (
                  <>
                    {/* Preset Message Selection */}
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "'Outfit', sans-serif" }}>
                        Select Quick Topic:
                      </label>
                      <div className="flex flex-col gap-2 mt-2">
                        {PRESET_MESSAGES.map((msg, i) => (
                          <button
                            key={i}
                            onClick={() => setCustomMsg(msg)}
                            style={{
                              textAlign: "left",
                              padding: "0.6rem 0.8rem",
                              borderRadius: 10,
                              fontSize: "0.75rem",
                              lineHeight: 1.4,
                              background: customMsg === msg ? "rgba(16, 185, 129, 0.12)" : "rgba(255, 255, 255, 0.03)",
                              border: customMsg === msg ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid var(--glass-border)",
                              color: customMsg === msg ? "#d1fae5" : "var(--text-secondary)",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                          >
                            💬 &ldquo;{msg}&rdquo;
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Editable Message Box */}
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "'Outfit', sans-serif" }}>
                        Your Message:
                      </label>
                      <textarea
                        rows={3}
                        value={customMsg}
                        onChange={(e) => setCustomMsg(e.target.value)}
                        placeholder="Type your message here..."
                        style={{
                          width: "100%",
                          marginTop: "0.4rem",
                          padding: "0.75rem",
                          borderRadius: 12,
                          background: "rgba(0, 0, 0, 0.4)",
                          border: "1px solid var(--glass-border)",
                          color: "#ffffff",
                          fontSize: "0.8rem",
                          fontFamily: "'Inter', sans-serif",
                          outline: "none",
                          resize: "none",
                        }}
                      />
                    </div>

                    {/* WhatsApp CTA */}
                    <button
                      onClick={handleSendWhatsApp}
                      style={{
                        width: "100%",
                        padding: "0.85rem",
                        borderRadius: 14,
                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        fontFamily: "'Outfit', sans-serif",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 6px 20px rgba(16, 185, 129, 0.35)",
                      }}
                    >
                      <Send size={16} /> Open in WhatsApp Web / App
                    </button>
                  </>
                ) : (
                  <>
                    {/* Direct Details & Coffee Chat */}
                    <div className="space-y-3">
                      <div style={{
                        padding: "1rem",
                        borderRadius: 14,
                        background: "rgba(0, 212, 255, 0.08)",
                        border: "1px solid rgba(0, 212, 255, 0.2)",
                      }}>
                        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs mb-1">
                          <Coffee size={14} /> 15-Minute Coffee Chat / Tech Screen
                        </div>
                        <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                          Open to discussing full-time engineering roles, frontend contract work, or technical architecture evaluations.
                        </p>
                      </div>

                      {/* Contact Info Pills */}
                      <div className="space-y-2.5">
                        {/* Email */}
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.75rem 1rem",
                          borderRadius: 12,
                          background: "var(--glass-bg)",
                          border: "1px solid var(--glass-border)",
                        }}>
                          <div className="flex items-center gap-2.5">
                            <Mail size={16} style={{ color: "var(--cyan)" }} />
                            <div>
                              <p style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>EMAIL</p>
                              <p style={{ fontSize: "0.8rem", color: "var(--text-primary)", fontWeight: 600 }}>{EMAIL}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCopy(EMAIL, "Email")}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: copiedField === "Email" ? "#10b981" : "var(--cyan)",
                              cursor: "pointer",
                              display: "flex",
                            }}
                          >
                            {copiedField === "Email" ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div>

                        {/* Phone / WhatsApp */}
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.75rem 1rem",
                          borderRadius: 12,
                          background: "var(--glass-bg)",
                          border: "1px solid var(--glass-border)",
                        }}>
                          <div className="flex items-center gap-2.5">
                            <Phone size={16} style={{ color: "#10b981" }} />
                            <div>
                              <p style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>PHONE / WHATSAPP</p>
                              <p style={{ fontSize: "0.8rem", color: "var(--text-primary)", fontWeight: 600 }}>{PHONE_NUMBER}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCopy(PHONE_NUMBER, "Phone")}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: copiedField === "Phone" ? "#10b981" : "#10b981",
                              cursor: "pointer",
                              display: "flex",
                            }}
                          >
                            {copiedField === "Phone" ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div>

                        {/* Location / Timezone */}
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.75rem 1rem",
                          borderRadius: 12,
                          background: "var(--glass-bg)",
                          border: "1px solid var(--glass-border)",
                        }}>
                          <MapPin size={16} style={{ color: "var(--violet)" }} />
                          <div>
                            <p style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>LOCATION &amp; TIMEZONE</p>
                            <p style={{ fontSize: "0.8rem", color: "var(--text-primary)", fontWeight: 600 }}>Dhaka, Bangladesh (GMT+6 · Open to Remote Worldwide)</p>
                          </div>
                        </div>
                      </div>

                      {/* ── Custom Email Subject & Message Form ── */}
                      <div className="space-y-3 pt-2">
                        {/* Quick Subject Presets */}
                        <div>
                          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "'Outfit', sans-serif" }}>
                            Quick Subject:
                          </label>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {EMAIL_PRESET_SUBJECTS.map((s, i) => (
                              <button
                                key={i}
                                onClick={() => setEmailSubject(s)}
                                style={{
                                  padding: "0.25rem 0.55rem",
                                  borderRadius: 8,
                                  fontSize: "0.7rem",
                                  background: emailSubject === s ? "rgba(0, 212, 255, 0.15)" : "rgba(255, 255, 255, 0.04)",
                                  border: emailSubject === s ? "1px solid var(--cyan)" : "1px solid var(--glass-border)",
                                  color: emailSubject === s ? "var(--cyan)" : "var(--text-secondary)",
                                  cursor: "pointer",
                                  transition: "all 0.2s",
                                }}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Subject Input */}
                        <div>
                          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "'Outfit', sans-serif" }}>
                            Subject:
                          </label>
                          <input
                            type="text"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            placeholder="Enter email subject..."
                            style={{
                              width: "100%",
                              marginTop: "0.35rem",
                              padding: "0.65rem 0.75rem",
                              borderRadius: 12,
                              background: "rgba(0, 0, 0, 0.4)",
                              border: "1px solid var(--glass-border)",
                              color: "#ffffff",
                              fontSize: "0.8rem",
                              fontFamily: "'Inter', sans-serif",
                              outline: "none",
                            }}
                          />
                        </div>

                        {/* Message Body Input */}
                        <div>
                          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "'Outfit', sans-serif" }}>
                            Message:
                          </label>
                          <textarea
                            rows={3}
                            value={emailBody}
                            onChange={(e) => setEmailBody(e.target.value)}
                            placeholder="Type your email message here..."
                            style={{
                              width: "100%",
                              marginTop: "0.35rem",
                              padding: "0.65rem 0.75rem",
                              borderRadius: 12,
                              background: "rgba(0, 0, 0, 0.4)",
                              border: "1px solid var(--glass-border)",
                              color: "#ffffff",
                              fontSize: "0.8rem",
                              fontFamily: "'Inter', sans-serif",
                              outline: "none",
                              resize: "none",
                            }}
                          />
                        </div>
                      </div>

                      {/* Direct Email Action Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        <button
                          onClick={() => handleOpenEmail("gmail")}
                          style={{
                            padding: "0.8rem",
                            borderRadius: 14,
                            background: "linear-gradient(135deg, var(--cyan) 0%, var(--violet) 100%)",
                            color: "#ffffff",
                            fontWeight: 700,
                            fontSize: "0.82rem",
                            fontFamily: "'Outfit', sans-serif",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.45rem",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 6px 20px rgba(0, 212, 255, 0.3)",
                          }}
                        >
                          <Mail size={15} /> Open in Gmail
                        </button>

                        <button
                          onClick={() => handleOpenEmail("default")}
                          style={{
                            padding: "0.8rem",
                            borderRadius: 14,
                            background: "rgba(255, 255, 255, 0.08)",
                            border: "1px solid var(--glass-border)",
                            color: "var(--text-primary)",
                            fontWeight: 700,
                            fontSize: "0.82rem",
                            fontFamily: "'Outfit', sans-serif",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.45rem",
                            cursor: "pointer",
                          }}
                        >
                          <ExternalLink size={14} /> Other Mail App
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Response SLA Note */}
                <div style={{
                  marginTop: "auto",
                  padding: "0.75rem",
                  borderRadius: 10,
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--glass-border)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                }}>
                  <Clock size={14} style={{ color: "#f59e0b", flexShrink: 0 }} />
                  <span>⚡ Typically responds within <strong>1–2 hours</strong> during active hours.</span>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
