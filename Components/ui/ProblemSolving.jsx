'use client';

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Trophy, Code, Award, TrendingUp } from 'lucide-react';

const ProblemSolving = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const platforms = [
    {
      name: "Codeforces",
      icon: "⚡",
      handle: "your_codeforces_handle",
      rating: "1400",
      rank: "Specialist",
      solved: "500+",
      profileLink: "https://codeforces.com/profile/Tu.ser",
      color: "from-red-500 to-orange-500",
      problems: [
        "Solved 500 problems",
        "Max Rating: 1026",
        "Participated in 20+ contests"
      ]
    },
    {
      name: "CodeChef",
      icon: "🍴",
      handle: "your_codechef_handle",
      rating: "1800",
      rank: "3 Star",
      solved: "508+",
      profileLink: "https://www.codechef.com/users/tuser579",
      color: "from-brown-500 to-amber-500",
      problems: [
        "Solved 508 problems",
        "Max Rating: 1353",
        "Participated in 31+ contests"
      ]
    },
    {
      name: "LeetCode",
      icon: "💻",
      handle: "your_leetcode_handle",
      rating: "1700",
      rank: "Guardian",
      solved: "131+",
      profileLink: "https://leetcode.com/u/tuser579/",
      color: "from-yellow-500 to-orange-500",
      problems: [
        "Solved 131 problems",
        "Acceptance Rate 64.9%",
        "20+ Medium problems solved"
      ]
    },
    {
      name: "Beecrowd",
      icon: "🐝",
      handle: "your_beecrowd_handle",
      rating: "200+",
      rank: "Top 10%",
      solved: "164+",
      profileLink: "https://judge.beecrowd.com/en/profile/948665",
      color: "from-green-500 to-emerald-500",
      problems: [
        "Solved 164 problems",
        "Category: Beginner to Advanced",
        "Solved in C++"
      ]
    }
  ];

  const totalSolved = platforms.reduce((sum, p) => {
    const solvedNum = parseInt(p.solved) || 0;
    return sum + solvedNum;
  }, 0);

  return (
    <section id="problem-solving" className="section-padding" ref={ref}>
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Problem <span className="text-gradient">Solving</span>
          </h2>
          
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Competitive programmer with {totalSolved}+ problems solved across multiple platforms
          </p>

          {/* Platforms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platforms.map((platform, i) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card rounded-xl p-5 sm:p-6 relative overflow-hidden group"
              >
                {/* Gradient Border Effect */}
                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${platform.color}`} />
                
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{platform.icon}</span>
                    <div>
                      <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                        {platform.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        @{platform.handle}
                      </p>
                    </div>
                  </div>
                  <a
                    href={platform.profileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/50 hover:text-primary transition-colors"
                    aria-label={`Visit ${platform.name} profile`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Highlights */}
                <ul className="space-y-1.5">
                  {platform.problems.map((problem, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="text-primary shrink-0 mt-0.5">▹</span>
                      <span>{problem}</span>
                    </li>
                  ))}
                </ul>

                {/* View Profile Button */}
                <a
                  href={platform.profileLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full mt-4 px-3 py-2 rounded-lg text-xs font-medium border border-border hover:border-primary/50 text-foreground hover:text-primary transition-all duration-300"
                >
                  View Profile <ExternalLink className="w-3 h-3" />
                </a>
              </motion.div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSolving;