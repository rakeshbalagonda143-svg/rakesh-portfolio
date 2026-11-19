import { useState } from 'react';
import { motion } from 'motion/react';
import { Code2, Database, Globe, Terminal } from 'lucide-react';
import { TECHNICAL_SKILLS, type SkillCategory, type SkillItem } from '../data/portfolioData';

type FilterOption = 'All' | SkillCategory;

const FILTER_OPTIONS: FilterOption[] = ['All', 'Programming', 'Database', 'Web Development'];

function getSkillIcon(skill: SkillItem) {
  if (skill.id === 'python') return Terminal;
  if (skill.id === 'java') return Code2;
  if (skill.category === 'Database') return Database;
  return Globe;
}

export function SkillsSection() {
  const [selectedCategory, setSelectedCategory] = useState<FilterOption>('All');

  const filteredSkills =
    selectedCategory === 'All'
      ? TECHNICAL_SKILLS
      : TECHNICAL_SKILLS.filter((skill) => skill.category === selectedCategory);

  return (
    <section
      id="skills"
      className="border-b border-[#151515]/15 bg-[#EDE6DA]/60 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="flex flex-col justify-between gap-6 border-b border-[#151515]/15 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[#A8502D] uppercase">
              02 · Core Capabilities
            </p>
            <h2 className="mt-2 font-condensed text-5xl leading-[0.9] tracking-tight text-[#151515] sm:text-6xl lg:text-7xl">
              SKILLS &amp;
              <br />
              EXPERTISE
            </h2>
          </div>

          {/* Interactive Category Filter Control */}
          <div
            role="tablist"
            aria-label="Filter skills by category"
            className="flex flex-wrap items-center gap-1 rounded-lg border border-[#151515]/15 bg-[#FAF7F2] p-1 self-start md:self-auto"
          >
            {FILTER_OPTIONS.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96D48] ${
                    active
                      ? 'bg-[#151515] text-[#F5F0E7]'
                      : 'text-[#5C574F] hover:text-[#151515]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categorized Skill Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill, idx) => {
            const Icon = getSkillIcon(skill);
            return (
              <motion.article
                key={skill.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col justify-between rounded-xl border border-[#151515]/14 bg-[#FAF7F2] p-6 transition-colors duration-200 hover:border-[#C96D48]"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#151515]/12 bg-[#F5F0E7] text-[#151515]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-medium text-[#5C574F]">
                      {skill.category}
                    </span>
                  </div>

                  <div className="mt-5 flex items-baseline justify-between gap-3">
                    <h3 className="font-condensed text-3xl tracking-tight text-[#151515]">
                      {skill.name}
                    </h3>
                    {skill.proficiency && (
                      <span className="text-xs font-semibold text-[#A8502D]">
                        {skill.proficiency}
                      </span>
                    )}
                  </div>

                  <p className="mt-2.5 text-sm leading-relaxed text-[#4A4640]">
                    {skill.description}
                  </p>
                </div>

                {/* Horizontal indicator strictly ONLY for Python, Java, SQL */}
                {skill.proficiency && typeof skill.proficiencyPercent === 'number' ? (
                  <div className="mt-6 border-t border-[#151515]/10 pt-4">
                    <div className="mb-2 flex items-center justify-between text-xs text-[#5C574F]">
                      <span>Confirmed Level</span>
                      <span className="font-semibold text-[#151515]">{skill.proficiency}</span>
                    </div>
                    <div
                      className="h-1.5 w-full overflow-hidden rounded-full bg-[#151515]/10"
                      role="progressbar"
                      aria-valuenow={skill.proficiencyPercent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${skill.name} proficiency: ${skill.proficiency}`}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiencyPercent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full bg-[#C96D48]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 border-t border-[#151515]/10 pt-4">
                    <p className="text-xs text-[#5C574F]">
                      Core web structure &amp; presentation technology
                    </p>
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
