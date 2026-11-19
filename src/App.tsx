import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { PythonLabSection } from './components/PythonLabSection';
import { EducationSection } from './components/EducationSection';
import { AboutSection } from './components/AboutSection';
import { ResumeSection } from './components/ResumeSection';
import { LookingForSection } from './components/LookingForSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export default function App() {
  const [prefilledSubject, setPrefilledSubject] = useState<string>('');

  const handleInquireProject = (projectTitle: string) => {
    setPrefilledSubject(projectTitle);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E7] text-[#151515]">
      <Navbar />
      <main>
        <HeroSection />
        <ProjectsSection onInquireProject={handleInquireProject} />
        <SkillsSection />
        <PythonLabSection />
        <EducationSection />
        <AboutSection />
        <ResumeSection />
        <LookingForSection />
        <ContactSection prefilledSubject={prefilledSubject} />
      </main>
      <Footer />
    </div>
  );
}
