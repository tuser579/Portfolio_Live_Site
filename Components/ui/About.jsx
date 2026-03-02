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
              who finds pure joy in solving complex problems through code. My journey into programming started with a simple curiosity—how do websites actually work?—and quickly evolved into a deep love for building things that live on the internet. Whether it's debugging a tricky issue or architecting a scalable solution, I genuinely enjoy every challenge that comes my way.
            </p>

            <p className="text-foreground/90 leading-relaxed text-sm sm:text-base">
              I specialize in building full-stack applications using React, Next.js, Node.js, Express, and MongoDB. What drives me is the ability to think critically about problems and craft elegant solutions. I believe that good code isn't just about making things work—it's about making them work efficiently, cleanly, and in a way that others can build upon. I thrive on those "aha!" moments when a complex problem finally clicks into place.
            </p>

            <p className="text-foreground/90 leading-relaxed text-sm sm:text-base">
              Beyond the screen, my life is balanced between technology and the outdoors. I'm passionate about farming—there's something grounding about working with the land and watching things grow. When I'm not in the fields, you'll find me on a cricket field, where strategy and teamwork mirror the problem-solving I love in coding. I believe that whether you're debugging code, tending to crops, or chasing a cricket ball, patience and persistence are what lead to the best outcomes.
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


