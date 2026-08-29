"use client";

import { useState } from "react";
import LoadingScreen from "./loading";
import FloatingTechBg from "../../Components/ui/FloatingTechBg";
import Navbar from "../../Components/ui/Navbar";
import Hero from "../../Components/ui/Hero";
import About from "../../Components/ui/About";
import Skills from "../../Components/ui/Skills";
import ExperienceEducation from "../../Components/ui/Experienceeducation";
import Projects from "../../Components/ui/Projects";
import GithubStats from "../../Components/ui/GithubStats";
import Contact from "../../Components/ui/Contact";
import Footer from "../../Components/ui/Footer";
import CertificationsSection from "../../Components/ui/CertificationsSection";
import ProblemSolving from "../../Components/ui/ProblemSolving";

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <div className="relative min-h-screen bg-background">
      {!loadingComplete && (
        <LoadingScreen onComplete={() => setLoadingComplete(true)} />
      )}
      <FloatingTechBg />
      <Navbar />
      <Hero />
      <About />
      <ProblemSolving />
      <Skills />
      <Projects />
      <GithubStats />
      <ExperienceEducation />
      <CertificationsSection />
      <Contact />
      <Footer />
    </div>
  );
}
