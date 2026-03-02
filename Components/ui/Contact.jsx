"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, Send, MapPin, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const YOUR_EMAIL    = "tusermon720@gmail.com";
const YOUR_PHONE    = "+8801760049326";
const YOUR_WHATSAPP = "8801760049326";

const Contact = () => {
    const ref    = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });
    const [form,    setForm]    = useState({ name: "", email: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const loadingToast = toast.loading("Sending your message…");

        try {
            const res  = await fetch("/api/contact", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(form),
            });
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
            <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                        Get In <span className="text-gradient">Touch</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Left */}
                        <div className="space-y-6">
                            <div className="glass-card rounded-xl p-5 sm:p-6">
                                <h3 className="font-bold text-foreground mb-4">Contact Info</h3>
                                <div className="space-y-4">
                                    {[
                                        { icon: Mail,   label: YOUR_EMAIL,         href: `mailto:${YOUR_EMAIL}`                       },
                                        { icon: Phone,  label: YOUR_PHONE,          href: `tel:${YOUR_PHONE}`                          },
                                        { icon: MapPin, label: "Dhaka, Bangladesh", href: "https://maps.google.com/?q=Dhaka,Bangladesh" },
                                    ].map(({ icon: Icon, label, href }) => (
                                        <a
                                            key={label}
                                            href={href}
                                            target={href.startsWith("http") ? "_blank" : undefined}
                                            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                                            className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <div className="p-2 rounded-lg border shrink-0">
                                                <Icon className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="text-sm break-all">{label}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-card rounded-xl p-5 sm:p-6">
                                <h3 className="font-bold text-foreground mb-2">WhatsApp</h3>
                                <a
                                    href={`https://wa.me/${YOUR_WHATSAPP}?text=${encodeURIComponent("Hi! I saw your portfolio and would like to connect.")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-primary font-medium text-sm hover:bg-primary hover:text-primary-foreground transition-all"
                                >
                                    <Send className="w-4 h-4" />
                                    Message on WhatsApp
                                </a>
                            </div>
                        </div>

                        {/* Right — Form */}
                        <form onSubmit={handleSubmit} className="glass-card rounded-xl p-5 sm:p-6 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-1 block">Name</label>
                                <input
                                    type="text" required value={form.name} disabled={loading}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-60"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                                <input
                                    type="email" required value={form.email} disabled={loading}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-60"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-1 block">Message</label>
                                <textarea
                                    required rows={4} value={form.message} disabled={loading}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none disabled:opacity-60"
                                    placeholder="Your message..."
                                />
                            </div>
                            <button
                                type="submit" disabled={loading}
                                className="w-full py-3 rounded-lg font-semibold text-primary-foreground transition-all duration-300 glow hover-lift disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                style={{ backgroundImage: "var(--gradient-primary)" }}
                            >
                                {loading ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                                ) : (
                                    "Send Message"
                                )}
                            </button>
                        </form>

                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;