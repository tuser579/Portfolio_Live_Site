import Image from "next/image";
import FloatingTechBg from "../../Components/ui/FloatingTechBg";
import Navbar from "../../Components/ui/Navbar";
import Hero from "../../Components/ui/Hero";
import About from "../../Components/ui/About";
import Skills from "../../Components/ui/Skills";
import ExperienceEducation from "../../Components/ui/Experienceeducation";
import Projects from "../../Components/ui/Projects";
import Contact from "../../Components/ui/Contact";
import Footer from "../../Components/ui/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background">
        <FloatingTechBg />
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <ExperienceEducation />
        <Projects />
        <Contact />
        <Footer />
    </div>
  );
}
