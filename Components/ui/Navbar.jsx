"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { name: "Home",       href: "#home"       },
  { name: "About",      href: "#about"      },
  { name: "Skills",     href: "#skills"     },
//   { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  { name: "Projects",   href: "#projects"   },
  { name: "Contact",    href: "#contact"    },
];

const Navbar = () => {
  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark,   setIsDark]   = useState(true);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-card border-b border-border/50" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-16">
        <Link href="#home" className="text-xl font-bold font-mono text-gradient">
          &lt;Tuser /&gt;
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark
              ? <Sun  className="w-4 h-4 text-foreground" />
              : <Moon className="w-4 h-4 text-background" />}
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-secondary"
            aria-label="Toggle theme"
          >
            {isDark
              ? <Sun  className="w-4 h-4 text-foreground" />
              : <Moon className="w-4 h-4 text-background" />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen
              ? <X    className="w-6 h-6 text-foreground" />
              : <Menu className="w-6 h-6 text-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass-card border-t border-border/50 overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;