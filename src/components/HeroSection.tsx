import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDownRight, Download } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export function HeroSection() {
  const [imageError, setImageError] = useState(false);

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-[#151515]/15 bg-[#F5F0E7]"
    >
      <div className="mx-auto max-w-[1440px] px-6 pb-16 pt-6 lg:px-12 lg:pb-24 lg:pt-8">
        {/* Top Editorial Masthead Strip */}
        <div className="flex flex-col justify-between gap-2 border-b border-[#151515]/15 pb-4 text-[11px] font-semibold tracking-[0.14em] text-[#4A4640] uppercase sm:flex-row sm:items-center">
          <span>{PERSONAL_INFO.heroTopLeft}</span>
          <span className="text-[#A8502D]">{PERSONAL_INFO.heroTopRight}</span>
        </div>

        {/* Oversized Condensed PORTFOLIO Masthead */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="border-b border-[#151515]/15 py-5 sm:py-7"
        >
          <h1 className="font-condensed text-[clamp(4.75rem,17.5vw,13.75rem)] leading-[0.84] tracking-[-0.015em] text-[#151515] select-none">
            PORTFOLIO<span className="text-[#C96D48]">.</span>
          </h1>
        </motion.div>

        {/* Asymmetrical Editorial Grid: Left Bio/Signature, Right Portrait + Burnt Orange Circle */}
        <div className="mt-10 grid grid-cols-1 items-center gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-10">
          {/* LEFT COLUMN */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <p className="text-xs font-semibold tracking-[0.18em] text-[#A8502D] uppercase">
              HELLO, I&apos;M
            </p>

            <h2 className="mt-2 font-condensed text-5xl leading-[0.95] tracking-tight text-[#151515] sm:text-6xl lg:text-7xl">
              {PERSONAL_INFO.brandName}
            </h2>

            <p className="mt-3 font-editorial-serif text-2xl font-medium italic text-[#4A4640] sm:text-[1.75rem]">
              {PERSONAL_INFO.heroRole}
            </p>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#38342F] sm:text-[17px]">
              {PERSONAL_INFO.heroDescription}
            </p>

            {/* Signature-style Name */}
            <div className="mt-8 inline-block">
              <p className="font-editorial-serif text-3xl font-semibold italic tracking-wide text-[#151515] sm:text-4xl">
                {PERSONAL_INFO.signatureName}
              </p>
              <svg
                viewBox="0 0 210 14"
                className="mt-1 h-3 w-44 text-[#C96D48]"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 10.5C48 3.5 135 2 208 8.5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Primary & Secondary Actions */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={scrollToProjects}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-md bg-[#151515] px-6 py-3 text-sm font-semibold text-[#F5F0E7] transition-colors duration-150 hover:bg-[#C96D48] hover:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96D48]"
              >
                <span>Selected Projects</span>
                <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <a
                href={PERSONAL_INFO.resumePath}
                download={PERSONAL_INFO.resumeFilename}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-md border border-[#151515]/25 bg-[#FAF7F2] px-6 py-3 text-sm font-semibold text-[#151515] transition-colors duration-150 hover:border-[#C96D48] hover:text-[#A8502D] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96D48]"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>Download Resume</span>
              </a>
            </div>

            {/* Quiet Academic Metadata Line */}
            <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#151515]/12 pt-5 text-xs text-[#5C574F]">
              <span>{PERSONAL_INFO.college}</span>
              <span aria-hidden="true">·</span>
              <span>B.Tech CSE (AI &amp; ML)</span>
              <span aria-hidden="true">·</span>
              <span>{PERSONAL_INFO.location}</span>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Portrait + Large Burnt-Orange Circle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center lg:col-span-6 lg:justify-end"
          >
            <div className="relative flex w-full max-w-[460px] items-center justify-center py-4">
              {/* Large Burnt-Orange Circular Shape Behind Portrait */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                aria-hidden="true"
                className="absolute left-2 top-8 h-[285px] w-[285px] rounded-full bg-[#C96D48] sm:left-4 sm:top-6 sm:h-[370px] sm:w-[370px]"
              />

              {/* Subtle Editorial Orbital Ring */}
              <div
                aria-hidden="true"
                className="absolute -right-2 bottom-4 h-[295px] w-[295px] rounded-full border border-[#151515]/18 sm:right-0 sm:h-[380px] sm:w-[380px]"
              />

              {/* Portrait Arch Container Blending Naturally into Cream */}
              <div className="relative z-10 ml-6 mr-2 w-[275px] overflow-hidden rounded-t-[999px] rounded-b-2xl border border-[#151515]/12 bg-[#EAE4D9] shadow-xl sm:ml-10 sm:w-[345px]">
                <div className="aspect-[3/3.75] w-full overflow-hidden">
                  {!imageError ? (
                    <img
                      src={PERSONAL_INFO.portraitPath}
                      alt="Balagonda Rakesh Roshan — Professional Portrait"
                      referrerPolicy="no-referrer"
                      onError={() => setImageError(true)}
                      className="h-full w-full object-cover object-top transition-transform duration-700 ease-out hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-[#EAE4D9] p-8 text-center">
                      <span className="font-condensed text-5xl text-[#151515]">RR</span>
                      <span className="mt-2 text-xs text-[#5C574F]">{PERSONAL_INFO.fullName}</span>
                    </div>
                  )}
                </div>

                {/* Soft cream bottom blend */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#F5F0E7] via-[#F5F0E7]/45 to-transparent"
                />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-medium text-[#151515]">
                  <span>Balagonda Rakesh Roshan</span>
                  <span className="text-[#A8502D]">Class of 2029</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
