import { motion } from 'motion/react';
import { LOOKING_FOR_AREAS } from '../data/portfolioData';

export function LookingForSection() {
  return (
    <section className="border-b border-[#151515]/15 bg-[#F5F0E7] py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="flex flex-col justify-between gap-6 border-b border-[#151515]/15 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[#A8502D] uppercase">
              05 · Focus &amp; Opportunities
            </p>
            <h2 className="mt-2 font-condensed text-5xl leading-[0.9] tracking-tight text-[#151515] sm:text-6xl lg:text-7xl">
              LET&apos;S CREATE
              <br />
              SOMETHING GREAT
            </h2>
          </div>

          <p className="max-w-md font-editorial-serif text-xl italic leading-snug text-[#4A4640]">
            Areas where I am actively learning, building projects, and seeking opportunities to contribute.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LOOKING_FOR_AREAS.map((area, idx) => (
            <motion.article
              key={area.index}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.4,
                delay: idx * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="rounded-xl border border-[#151515]/14 bg-[#FAF7F2] p-7 transition-colors duration-200 hover:border-[#C96D48]"
            >
              <span className="font-condensed text-2xl text-[#C96D48] tabular-nums">
                {area.index}
              </span>
              <h3 className="mt-2 font-condensed text-3xl tracking-tight text-[#151515]">
                {area.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[#4A4640]">
                {area.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
