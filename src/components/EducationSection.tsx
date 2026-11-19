import { motion } from 'motion/react';
import { GraduationCap } from 'lucide-react';
import { EDUCATION_HISTORY } from '../data/portfolioData';

export function EducationSection() {
  return (
    <section
      id="education"
      className="border-b border-[#151515]/15 bg-[#F5F0E7] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="flex flex-col justify-between gap-6 border-b border-[#151515]/15 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[#A8502D] uppercase">
              03 · Academic Record
            </p>
            <h2 className="mt-2 font-condensed text-5xl leading-[0.9] tracking-tight text-[#151515] sm:text-6xl lg:text-7xl">
              EDUCATION &amp;
              <br />
              ACADEMIC JOURNEY
            </h2>
          </div>

          <p className="max-w-md font-editorial-serif text-xl italic leading-snug text-[#4A4640]">
            Academic foundation across engineering, pre-university, and secondary studies.
          </p>
        </div>

        {/* Clean Editorial Academic Timeline */}
        <div className="relative mt-12 space-y-6 before:absolute before:bottom-6 before:left-5 before:top-6 before:hidden before:w-px before:bg-[#151515]/15 md:before:block md:pl-14">
          {EDUCATION_HISTORY.map((entry, idx) => (
            <motion.article
              key={entry.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.45,
                delay: idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`relative rounded-xl border p-6 transition-colors duration-200 sm:p-8 ${
                entry.isCurrent
                  ? 'border-[#C96D48]/55 bg-[#FAF7F2]'
                  : 'border-[#151515]/14 bg-[#FAF7F2]/80 hover:border-[#C96D48]/60'
              }`}
            >
              {/* Timeline marker on desktop */}
              <span
                aria-hidden="true"
                className={`absolute -left-[43px] top-8 hidden h-4 w-4 rounded-full border-2 md:block ${
                  entry.isCurrent
                    ? 'border-[#C96D48] bg-[#C96D48]'
                    : 'border-[#151515]/40 bg-[#F5F0E7]'
                }`}
              />

              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.14em] uppercase">
                    <GraduationCap
                      className={`h-4 w-4 ${
                        entry.isCurrent ? 'text-[#C96D48]' : 'text-[#5C574F]'
                      }`}
                      aria-hidden="true"
                    />
                    <span className={entry.isCurrent ? 'text-[#A8502D]' : 'text-[#5C574F]'}>
                      {entry.stage}
                    </span>
                  </div>

                  <h3 className="font-condensed text-3xl tracking-tight text-[#151515] sm:text-4xl">
                    {entry.institution}
                  </h3>

                  <p className="text-sm font-medium text-[#2E2A26] sm:text-base">
                    {entry.program}
                  </p>
                  <p className="text-xs text-[#5C574F]">{entry.meta}</p>
                </div>

                {/* Academic Scores / Semester Figures */}
                <div className="flex flex-wrap items-stretch gap-4 lg:justify-end">
                  {entry.highlights.map((item) => (
                    <div
                      key={item.label}
                      className="min-w-[136px] rounded-lg border border-[#C96D48]/30 bg-[#F5F0E7] px-5 py-3.5"
                    >
                      <p className="text-[11px] font-semibold tracking-wider text-[#5C574F] uppercase">
                        {item.label}
                      </p>
                      <p className="mt-1 font-condensed text-3xl text-[#151515] tabular-nums">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
