"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Coffee, Gamepad2 } from "lucide-react";

const About = () => {
  const ref    = useRef(null);
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
              I&apos;m a passionate{" "}
              <span className="text-primary font-semibold">MERN Stack Developer</span>{" "}
              who loves turning ideas into beautiful, functional web applications. My
              programming journey started during college when I built my first website,
              and I&apos;ve been hooked ever since.
            </p>

            <p className="text-foreground/90 leading-relaxed text-sm sm:text-base">
              I specialize in building full-stack applications using React, Next.js,
              Node.js, Express, and MongoDB. I enjoy the entire process — from designing
              clean UIs to architecting robust backend systems. I thrive on solving
              complex problems and writing code that is both maintainable and scalable.
            </p>

            <p className="text-foreground/90 leading-relaxed text-sm sm:text-base">
              When I&apos;m not coding, you&apos;ll find me exploring new tech,
              contributing to open-source projects, or sharing knowledge with the
              developer community. Outside of programming, I enjoy playing cricket,
              reading tech blogs, and sketching UI designs.
            </p>

            {/* ── Icon Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {[
                {
                  icon:  Code2,
                  label: "Clean Code Enthusiast",
                  desc:  "Writing maintainable, scalable code",
                },
                {
                  icon:  Coffee,
                  label: "Fueled by Coffee",
                  desc:  "Late-night coding sessions",
                },
                {
                  icon:  Gamepad2,
                  label: "Cricket & Gaming",
                  desc:  "When AFK from the terminal",
                },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center p-4 rounded-xl bg-secondary/25"
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


