import { motion } from 'motion/react';
import { ABOUT_INFO } from '../data/portfolioData';

export function AboutSection() {
  return (
    <section
      id="about"
      className="border-b border-[#151515]/15 bg-[#FAF7F2] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Heading + Editorial Serif Pull Line */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <p className="text-xs font-semibold tracking-[0.16em] text-[#A8502D] uppercase">
              04 · Profile
            </p>
            <h2 className="mt-2 font-condensed text-5xl leading-[0.9] tracking-tight text-[#151515] sm:text-6xl lg:text-7xl">
              A LITTLE
              <br />
              ABOUT ME
            </h2>

            <p className="mt-6 max-w-sm font-editorial-serif text-2xl italic leading-snug text-[#4A4640]">
              Learning deeply, building deliberately, and growing toward software engineering excellence.
            </p>
          </motion.div>

          {/* Right Column: Narrative + 4 Editorial Information Blocks */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="space-y-5 text-base leading-relaxed text-[#2E2A26] sm:text-[17px]">
              {ABOUT_INFO.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-[#151515]/14 bg-[#151515]/14 sm:grid-cols-2">
              {ABOUT_INFO.blocks.map((block) => (
                <div
                  key={block.label}
                  className="bg-[#F5F0E7] p-6 transition-colors duration-150 hover:bg-[#EDE6DA]"
                >
                  <p className="text-xs font-semibold tracking-[0.12em] text-[#A8502D] uppercase">
                    {block.label}
                  </p>
                  <p className="mt-2 font-editorial-serif text-2xl font-semibold text-[#151515] tabular-nums">
                    {block.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
