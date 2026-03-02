"use client";

import { motion } from "framer-motion";
import { Download, Github, Linkedin, Twitter, Facebook } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import profilePhoto from "../../public/Gemini_Generated_Image_rjdcorrjdcorrjdc.png";

const Hero = () => {
    return (
        <section id="home" className="min-h-screen flex items-center section-padding pt-28">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* ── Photo — top on mobile, right column on lg+ ── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex justify-center lg:justify-end order-first lg:order-last"
                    >
                        <div className="relative">
                            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden glow animate-pulse-glow">
                                <Image
                                    src={profilePhoto}
                                    alt="Profile photo"
                                    fill
                                    className="object-cover rounded"
                                    priority
                                />
                            </div>
                            <div className="absolute -z-10 inset-0 rounded-2xl rotate-6 bg-primary/20" />
                        </div>
                    </motion.div>

                    {/* ── Text — bottom on mobile, left column on lg+ ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="order-last lg:order-first"
                    >
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="font-mono text-primary mb-4 text-sm tracking-wider"
                        >
                            Hello, I&apos;m
                        </motion.p>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                            <span className="text-foreground">MD.MUTTAKIUL ISLAM</span>{" "}
                            <span className="text-gradient">TUSER</span>
                        </h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg sm:text-xl text-muted-foreground mb-2 font-mono"
                        >
                            MERN Stack Developer
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-muted-foreground max-w-lg mb-8 leading-relaxed"
                        >
                            I build web applications using React, Node.js, Express, and MongoDB.
                            Passionate about clean code and pixel-perfect UIs.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 mb-8"
                        >
                            <a
                                href="/resume.pdf"
                                download
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-primary-foreground transition-all duration-300 glow hover-lift w-full sm:w-auto"
                                style={{ backgroundImage: "var(--gradient-primary)" }}
                            >
                                <Download className="w-4 h-4" />
                                Download Resume
                            </a>
                            <Link
                                href="#contact"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 w-full sm:w-auto"
                            >
                                Contact Me
                            </Link>
                        </motion.div>

                        {/* Social Links */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex justify-center sm:justify-start gap-4"
                        >
                            {[
                                { icon: Github, href: "https://github.com/tuser579", label: "GitHub" },
                                { icon: Linkedin, href: "https://www.linkedin.com/in/md-muttakiul-islam-tuser-36b104388", label: "LinkedIn" },
                                { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                                { icon: Facebook, href: "https://www.facebook.com/mohammad.osman.98622", label: "Facebook" },
                            ].map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="p-3 rounded-lg hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-300 hover-lift"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default Hero;




