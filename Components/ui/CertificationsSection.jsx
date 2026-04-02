'use client';

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Award } from 'lucide-react';
import { certifications } from "../../data/portfolio";

const CertificationsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="certifications" className="section-padding" ref={ref}>
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Certifications & <span className="text-gradient">Competitions</span>
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card rounded-xl p-5 sm:p-6 relative border-l-2 border-primary hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="font-mono text-xs text-primary">{cert.date}</span>
                  </div>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/50 hover:text-primary transition-colors"
                      aria-label="View Credential"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                
                <h4 className="font-bold text-foreground mt-1 text-sm sm:text-base group-hover:text-primary transition-colors">
                  {cert.title}
                </h4>
                
                <p className="text-muted-foreground text-sm mb-3">{cert.issuer}</p>
                
                <p className="text-foreground/80 text-sm leading-relaxed">
                  {cert.description}
                </p>
                
                {!cert.credentialUrl && (
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1 text-[10px] text-primary/70 font-mono">
                      🏆 Competition Achievement
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CertificationsSection;