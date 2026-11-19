import { PERSONAL_INFO } from '../data/portfolioData';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#151515] py-12 text-[#F5F0E7]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="flex flex-col justify-between gap-8 border-b border-white/15 pb-8 md:flex-row md:items-end">
          <div>
            <p className="font-condensed text-3xl tracking-wide text-white sm:text-4xl">
              {PERSONAL_INFO.brandName}
            </p>
            <p className="mt-2 font-editorial-serif text-lg italic text-[#D4CBC0]">
              &ldquo;Building skills. Creating ideas. Developing the future.&rdquo;
            </p>
          </div>

          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-6 text-xs font-medium tracking-wider uppercase text-[#D4CBC0]">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('home');
              }}
              className="transition-colors hover:text-[#C96D48]"
            >
              Home
            </a>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('projects');
              }}
              className="transition-colors hover:text-[#C96D48]"
            >
              Projects
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('about');
              }}
              className="transition-colors hover:text-[#C96D48]"
            >
              About
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }}
              className="transition-colors hover:text-[#C96D48]"
            >
              Contact
            </a>
            <a
              href={PERSONAL_INFO.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#C96D48]"
            >
              LinkedIn
            </a>
          </nav>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-3 text-xs text-[#9E958B] sm:flex-row sm:items-center">
          <p>
            &copy; {currentYear} {PERSONAL_INFO.fullName}. All rights reserved.
          </p>
          <p>{PERSONAL_INFO.location}</p>
        </div>
      </div>
    </footer>
  );
}
