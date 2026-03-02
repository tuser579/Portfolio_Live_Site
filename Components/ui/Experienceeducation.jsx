"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, GraduationCap } from "lucide-react";
import { experiences, education } from "../../data/portfolio";

const ExperienceEducation = () => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    // <section id="experience" className="section-padding" ref={ref}>
    <section id="education" className="section-padding" ref={ref}>
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* ── Heading ── */}
          {/* <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Experience &amp; <span className="text-gradient">Education</span>
          </h2> */}

          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            My <span className="text-gradient">Education</span>
          </h2>

          {/* ── Two-column grid ── */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> */}
          <div className="grid grid-cols-1  gap-8">

            {/* ── Experience ── */}
            {/* <div>
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold text-foreground">Experience</h3>
              </div>
              <div className="space-y-6">
                {experiences.map((exp, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                    className="glass-card rounded-xl p-5 sm:p-6 relative border-l-2 border-primary"
                  >
                    <span className="font-mono text-xs text-primary">{exp.duration}</span>
                    <h4 className="font-bold text-foreground mt-1 text-sm sm:text-base">
                      {exp.role}
                    </h4>
                    <p className="text-muted-foreground text-sm">{exp.company}</p>
                    <p className="text-foreground/80 text-sm mt-2">{exp.description}</p>
                    <ul className="mt-3 space-y-1">
                      {exp.highlights.map((h) => (
                        <li key={h} className="text-xs text-muted-foreground flex gap-2">
                          <span className="text-primary shrink-0">▹</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div> */}

            {/* ── Education ── */}
            <div>
              {/* <div className="flex items-center gap-2 mb-6"> */}
                {/* <GraduationCap className="w-5 h-5 text-primary" /> */}
                {/* <h3 className="text-xl font-bold text-foreground">Education</h3> */}
              {/* </div> */}
              <div className="space-y-6">
                {education.map((edu, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.15 + 0.2, duration: 0.5 }}
                    className="glass-card rounded-xl p-5 sm:p-6 relative border-l-2 border-primary"
                  >
                    <span className="font-mono text-xs text-primary">{edu.duration}</span>
                    <h4 className="font-bold text-foreground mt-1 text-sm sm:text-base">
                      {edu.degree}
                    </h4>
                    <p className="text-muted-foreground text-sm">{edu.institution}</p>
                    <p className="text-foreground/80 text-sm mt-2">{edu.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceEducation;