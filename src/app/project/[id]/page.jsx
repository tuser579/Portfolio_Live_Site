"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { projects } from "../../../../data/portfolio";

const ProjectDetail = () => {
  const { id }  = useParams();
  const router  = useRouter();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Project Not Found</h1>
          <Link href="/" className="text-primary hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* ── Back ── */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-primary mb-8 hover:gap-3 transition-all font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </button>

          {/* ── Hero Image ── */}
          <div className="relative rounded-2xl overflow-hidden mb-8 glow aspect-video w-full">
            <Image
              src={project.image}
              alt={project.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>

          {/* ── Title ── */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {project.name}
          </h1>

          {/* ── Tech Stack ── */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs px-3 py-1.5 rounded-lg border text-primary font-mono font-medium"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* ── Description ── */}
          <p className="text-foreground/90 leading-relaxed mb-8 text-lg">
            {project.description}
          </p>

          {/* ── Action Buttons ── */}
          <div className="flex flex-wrap gap-4 mb-12">
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-primary-foreground glow hover-lift"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              <ExternalLink className="w-4 h-4" /> Live Demo
            </a>
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <Github className="w-4 h-4" /> Client Repo
            </a>
          </div>

          {/* ── Challenges + Improvements ── */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
                <span className="text-primary">⚡</span> Challenges
              </h3>
              <ul className="space-y-3">
                {project.challenges.map((c) => (
                  <li key={c} className="flex gap-3 text-sm text-foreground/80">
                    <span className="text-primary mt-1 shrink-0">▹</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
                <span className="text-primary">🚀</span> Future Improvements
              </h3>
              <ul className="space-y-3">
                {project.improvements.map((imp) => (
                  <li key={imp} className="flex gap-3 text-sm text-foreground/80">
                    <span className="text-primary mt-1 shrink-0">▹</span>
                    {imp}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetail;