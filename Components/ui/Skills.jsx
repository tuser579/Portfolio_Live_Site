"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { skills } from "../../data/portfolio";

const categories = [
  { key: "all",      label: "All"      },
  { key: "frontend", label: "Frontend" },
  { key: "backend",  label: "Backend"  },
  { key: "database", label: "Database" },
  { key: "tools",    label: "Tools"    },
];

const Skills = () => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [active, setActive] = useState("all");

  const filtered =
    active === "all" ? skills : skills.filter((s) => s.category === active);

  return (
    <section id="skills" className="section-padding" ref={ref}>
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* ── Heading ── */}
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            My <span className="text-gradient">Skills</span>
          </h2>

          {/* ── Category Filter Tabs ── */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActive(cat.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  active === cat.key
                    ? "bg-primary text-primary-foreground"
                    : "border text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* ── Skill Bars ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {filtered.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="glass-card rounded-xl p-4"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-foreground text-sm">
                    {skill.name}
                  </span>
                  <span className="font-mono text-primary text-sm">
                    {skill.level}%
                  </span>
                </div>
                <div className="skill-bar">
                  <motion.div
                    className="skill-bar-fill"
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                    transition={{ delay: i * 0.05 + 0.3, duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;