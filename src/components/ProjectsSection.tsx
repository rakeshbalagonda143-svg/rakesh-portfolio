import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Github, ArrowUpRight, ThumbsUp } from 'lucide-react';
import { PROJECTS, type ProjectItem } from '../data/portfolioData';
import { ProjectIllustration } from './ProjectIllustration';
import { ProjectModal } from './ProjectModal';

interface ProjectsSectionProps {
  onInquireProject: (projectTitle: string) => void;
}

export function ProjectsSection({ onInquireProject }: ProjectsSectionProps) {
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [modalTrigger, setModalTrigger] = useState<'view' | 'github'>('view');
  const [endorsements, setEndorsements] = useState<Record<string, number>>({});
  const [endorsingId, setEndorsingId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch('/api/projects/endorsements')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (mounted && data?.endorsements) {
          setEndorsements(data.endorsements);
        }
      })
      .catch(() => {
        // Ignore silent initial fetch failures
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleEndorse = async (projectId: string) => {
    setEndorsingId(projectId);
    try {
      const response = await fetch(`/api/projects/${projectId}/endorse`, {
        method: 'POST',
      });
      if (response.ok) {
        const data = await response.json();
        setEndorsements((prev) => ({
          ...prev,
          [projectId]: data.endorsements,
        }));
      }
    } finally {
      setEndorsingId(null);
    }
  };

  const openModal = (project: ProjectItem, trigger: 'view' | 'github') => {
    setActiveProject(project);
    setModalTrigger(trigger);
  };

  return (
    <section
      id="projects"
      className="border-b border-[#151515]/15 bg-[#F5F0E7] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="flex flex-col justify-between gap-6 border-b border-[#151515]/15 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[#A8502D] uppercase">
              01 · Portfolio Concepts
            </p>
            <h2 className="mt-2 font-condensed text-5xl leading-[0.9] tracking-tight text-[#151515] sm:text-6xl lg:text-7xl">
              SELECTED
              <br />
              PROJECTS
            </h2>
          </div>

          <p className="max-w-md font-editorial-serif text-xl italic leading-snug text-[#4A4640]">
            Curated software, web, and AI/ML project concepts designed around practical everyday needs.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {PROJECTS.map((project, idx) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.45,
                delay: idx * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`group flex flex-col justify-between overflow-hidden rounded-xl border transition-all duration-200 ${
                project.isPlaceholder
                  ? 'border-dashed border-[#151515]/25 bg-[#FAF7F2]/70 hover:border-[#C96D48]'
                  : 'border-[#151515]/14 bg-[#FAF7F2] hover:border-[#C96D48]'
              }`}
            >
              <div>
                <button
                  type="button"
                  onClick={() => openModal(project, 'view')}
                  className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96D48]"
                  aria-label={`View ${project.title}`}
                >
                  <ProjectIllustration
                    illustrationKey={project.illustrationKey}
                    title={project.title}
                  />
                </button>

                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C574F]">
                    <span className="font-semibold text-[#A8502D] tabular-nums">
                      {project.index}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{project.subtitle}</span>
                    {project.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-2">
                        <span aria-hidden="true">·</span>
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>

                  <h3 className="mt-3 font-condensed text-3xl tracking-tight text-[#151515] sm:text-4xl">
                    {project.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-[#4A4640] sm:text-[15px]">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#151515]/10 px-6 py-4 sm:px-8">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => openModal(project, 'view')}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md bg-[#151515] px-4 py-2 text-xs font-semibold text-[#F5F0E7] transition-colors duration-150 hover:bg-[#C96D48] hover:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96D48]"
                  >
                    <span>View Project</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => openModal(project, 'github')}
                    className="inline-flex min-h-[40px] items-center gap-2 rounded-md border border-[#151515]/20 bg-transparent px-4 py-2 text-xs font-medium text-[#151515] transition-colors duration-150 hover:border-[#C96D48] hover:text-[#A8502D] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96D48]"
                  >
                    <Github className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>GitHub</span>
                  </button>
                </div>

                <button
                  type="button"
                  disabled={endorsingId === project.id}
                  onClick={() => handleEndorse(project.id)}
                  aria-label={`Appreciate ${project.title}`}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-[#151515]/15 bg-[#F5F0E7] px-3 py-2 text-xs font-semibold text-[#151515] transition-colors hover:border-[#C96D48] hover:text-[#A8502D] tabular-nums whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96D48]"
                >
                  <ThumbsUp className="h-3.5 w-3.5 text-[#C96D48]" aria-hidden="true" />
                  <span>{endorsements[project.id] ?? 0}</span>
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <ProjectModal
        project={activeProject}
        triggerType={modalTrigger}
        onClose={() => setActiveProject(null)}
        onInquire={(projectTitle) => {
          setActiveProject(null);
          onInquireProject(projectTitle);
        }}
      />
    </section>
  );
}
