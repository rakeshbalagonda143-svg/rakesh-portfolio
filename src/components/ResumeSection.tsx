import { motion } from 'motion/react';
import { ArrowDown, ExternalLink, FileText } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export function ResumeSection() {
  return (
    <section
      id="resume"
      className="border-b border-[#151515]/15 bg-[#EDE6DA] py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-between gap-10 rounded-2xl border border-[#151515]/15 bg-[#FAF7F2] p-8 sm:p-12 lg:flex-row lg:items-center"
        >
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-[#A8502D] uppercase">
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span>PDF Document · Rakesh_Roshan_Resume.pdf</span>
            </div>

            <h2 className="mt-3 font-condensed text-5xl leading-[0.9] tracking-tight text-[#151515] sm:text-6xl">
              MY RESUME
            </h2>

            <p className="mt-4 text-base leading-relaxed text-[#38342F]">
              Want to know more about my academic background, technical skills, and projects? Download my professional resume.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center shrink-0">
            <a
              href={PERSONAL_INFO.resumePath}
              download={PERSONAL_INFO.resumeFilename}
              className="inline-flex min-h-[54px] items-center justify-center gap-3 rounded-md bg-[#C96D48] px-8 py-4 text-sm font-bold tracking-wider text-white uppercase transition-colors duration-150 hover:bg-[#151515] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#151515]"
            >
              <span>DOWNLOAD MY RESUME</span>
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>

            <a
              href={PERSONAL_INFO.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-md border border-[#151515]/25 bg-transparent px-6 py-4 text-xs font-semibold tracking-wider text-[#151515] uppercase transition-colors duration-150 hover:border-[#C96D48] hover:text-[#A8502D] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96D48]"
            >
              <span>View Resume</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
