"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Coffee, Gamepad2, Sprout } from "lucide-react";

const About = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding" ref={ref}>
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* ── Heading ── */}
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            About <span className="text-gradient">Me</span>
          </h2>

          {/* ── Card ── */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 md:p-12 space-y-6">
            <p className="text-foreground/90 leading-relaxed text-base sm:text-lg">
              I'm a passionate{" "}
              <span className="text-primary font-semibold">MERN Stack Developer</span>{" "}
              who loves solving complex problems through code. What started as curiosity about how websites work evolved into a deep passion for building things on the internet—from debugging tricky issues to architecting scalable solutions.
            </p>

            <p className="text-foreground/90 leading-relaxed text-sm sm:text-base">
              I specialize in full-stack applications with React, Next.js, Node.js, Express, and MongoDB. I thrive on thinking critically about problems and crafting elegant, efficient code that others can build upon. Those{" "}
              <span className="text-primary font-medium">"aha!" moments</span> when everything clicks? That's what drives me.
            </p>

            <p className="text-foreground/90 leading-relaxed text-sm sm:text-base">
              Outside coding, you'll find me farming—there's something grounding about watching things grow—or on the cricket field, where strategy and teamwork mirror the problem-solving I love. Whether debugging, tending crops, or chasing a cricket ball, patience and persistence lead to the best outcomes.
            </p>

            {/* ── Icon Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4">
              {[
                {
                  icon: Code2,
                  label: "Problem Solver",
                  desc: "Love untangling complex challenges",
                },
                {
                  icon: Coffee,
                  label: "Coding Enthusiast",
                  desc: "Building things that matter",
                },
                {
                  icon: Sprout,
                  label: "Farming",
                  desc: "Growing things offline too",
                },
                {
                  icon: Gamepad2,
                  label: "Cricket Player",
                  desc: "Strategy & teamwork IRL",
                },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center p-4 rounded-xl bg-secondary/25 hover:bg-secondary/40 transition-colors duration-300"
                >
                  <Icon className="w-6 h-6 text-primary mb-2" />
                  <span className="font-semibold text-foreground text-sm">{label}</span>
                  <span className="text-muted-foreground text-xs mt-1">{desc}</span>
                </div>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default About;


