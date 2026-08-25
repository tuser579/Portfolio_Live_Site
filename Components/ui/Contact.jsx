"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

const YOUR_EMAIL    = "tusermon720@gmail.com";
const YOUR_PHONE    = "+8801760049326";
const YOUR_WHATSAPP = "8801760049326";

const INFO = [
  { icon: Mail,   label: YOUR_EMAIL,  href: `mailto:${YOUR_EMAIL}`,                  color: "#00d4ff" },
  { icon: Phone,  label: YOUR_PHONE,  href: `tel:${YOUR_PHONE}`,                      color: "#a78bfa" },
  { icon: MapPin, label: "DSC, Asulia, Birulia, Dhaka-1216, BD", href: "https://maps.google.com/?q=Dhaka,Bangladesh", color: "#10b981" },
];

export default function Contact() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [form,    setForm]    = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Sending your message…");
    try {
      const res  = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      toast.success("Message sent! I'll get back to you soon.", { id: loadingToast });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error(err.message || "Failed to send. Please try again.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding" ref={ref}>
      <div className="site-container">

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <h2 className="section-title">Get In <span className="text-gradient">Touch</span></h2>
          <div className="section-line" />
          <p className="section-subtitle">Have a project in mind? Let&apos;s build something amazing together.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem" }} className="contact-grid">

          {/* Left — info cards */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.15, duration: 0.6 }}
            style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>

            {/* Info card */}
            <div style={{ background: "var(--glass-bg)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid var(--glass-border)", borderRadius: 18, padding: "1.5rem", flex: 1, boxShadow: "var(--glow-card)" }}>
              <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem", marginBottom: "1.25rem" }}>Contact Info</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {INFO.map(({ icon: Icon, label, href, color }) => (
                  <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem", textDecoration: "none", transition: "all 0.2s" }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}14`, border: `1px solid ${color}35`, flexShrink: 0, boxShadow: `0 0 12px ${color}20` }}>
                      <Icon size={16} style={{ color }} />
                    </div>
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.83rem", lineHeight: 1.5, paddingTop: "0.5rem", transition: "color 0.2s", fontWeight: 500 }}
                      onMouseEnter={e => e.parentElement.querySelector('div').style.boxShadow = `0 0 20px ${color}35`}
                      onMouseLeave={e => e.parentElement.querySelector('div').style.boxShadow = `0 0 12px ${color}20`}
                    >{label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* WhatsApp card */}
            <div style={{ background: "var(--glass-bg)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(37,211,102,0.25)", borderRadius: 18, padding: "1.25rem 1.5rem", boxShadow: "var(--glow-card)" }}>
              <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: "var(--text-primary)", fontSize: "0.92rem", marginBottom: "0.75rem" }}>Quick Message</h3>
              <a
                href={`https://wa.me/${YOUR_WHATSAPP}?text=${encodeURIComponent("Hi! I saw your portfolio and would like to connect.")}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.6rem 1.25rem", borderRadius: 9999, textDecoration: "none",
                  background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.35)",
                  color: "#16a34a", fontSize: "0.83rem", fontWeight: 600,
                  fontFamily: "'Outfit',sans-serif", transition: "all 0.25s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(37,211,102,0.2)"; e.currentTarget.style.borderColor = "rgba(37,211,102,0.6)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(37,211,102,0.25)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(37,211,102,0.12)"; e.currentTarget.style.borderColor = "rgba(37,211,102,0.35)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <MessageCircle size={16} /> Message on WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              background: "var(--glass-bg)", backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)", border: "1px solid var(--glass-border)",
              borderRadius: 18, padding: "1.75rem",
              display: "flex", flexDirection: "column", gap: "1.1rem",
              boxShadow: "var(--glow-card)",
            }}
          >
            {[
              { name: "name",    type: "text",    label: "Your Name",    placeholder: "MD. Tuser" },
              { name: "email",   type: "email",   label: "Email Address", placeholder: "you@email.com" },
            ].map(({ name, type, label, placeholder }) => (
              <div key={name}>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.45rem", fontFamily: "'Outfit',sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
                <input
                  type={type} required value={form[name]} disabled={loading}
                  onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                  placeholder={placeholder}
                  className="glass-input"
                />
              </div>
            ))}

            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.45rem", fontFamily: "'Outfit',sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>Message</label>
              <textarea
                required rows={5} value={form.message} disabled={loading}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell me about your project..."
                className="glass-input"
                style={{ resize: "none" }}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: "0.25rem", justifyContent: "center", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Sending…</> : <><Send size={16} /> Send Message</>}
            </button>
          </motion.form>

        </div>
      </div>

      <style>{`
        @media(min-width:768px){
          .contact-grid { grid-template-columns: 1fr 1.4fr !important; }
        }
      `}</style>
    </section>
  );
}