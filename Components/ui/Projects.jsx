"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Github, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { projects } from "../../data/portfolio";

const ITEMS_PER_PAGE = 3;

const Projects = () => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [page, setPage] = useState(1);

  const totalPages  = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const paginated   = projects.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const goTo = (p) => {
    setPage(p);
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="projects" className="section-padding" ref={ref}>
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* ── Heading ── */}
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            My <span className="text-gradient">Projects</span>
          </h2>
        
          {/* ── Project Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="glass-card rounded-2xl overflow-hidden hover-lift group flex flex-col"
              >
                {/* ── Thumbnail ── */}
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* ── Card Body ── */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-foreground text-base sm:text-lg mb-1">
                    {project.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2 flex-1">
                    {project.shortDescription}
                  </p>

                  {/* ── Tech Badges ── */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 rounded-md border border-border text-primary font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* ── Actions ── */}
                  <div className="flex flex-col gap-2 mt-auto">

                    {/* Row 1 — Live URL + GitHub (same line) */}
                    <div className="flex items-center gap-2">
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-primary-foreground transition-all hover-lift"
                        style={{ backgroundImage: "var(--gradient-primary)" }}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Live
                      </a>
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-border text-foreground hover:border-primary hover:text-primary transition-all"
                      >
                        <Github className="w-3.5 h-3.5" />
                        GitHub
                      </a>
                    </div>

                    {/* Row 2 — View Details (full width) */}
                    <Link
                      href={`/project/${project.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-3 py-3 mt-1 rounded-lg text-xs font-semibold border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center justify-center gap-2 mt-12"
            >
              {/* Prev */}
              <button
                onClick={() => goTo(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goTo(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                    p === page
                      ? "text-primary-foreground glow"
                      : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                  style={p === page ? { backgroundImage: "var(--gradient-primary)" } : {}}
                >
                  {p}
                </button>
              ))}

              {/* Next */}
              <button
                onClick={() => goTo(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Page info */}
          {totalPages > 1 && (
            <p className="text-center text-xs text-muted-foreground mt-3 font-mono">
              Page {page} of {totalPages} · {projects.length} projects
            </p>
          )}

        </motion.div>
      </div>
    </section>
  );
};

export default Projects;