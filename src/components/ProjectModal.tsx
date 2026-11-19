import { useEffect } from 'react';
import { X, Github, ArrowRight, Info } from 'lucide-react';
import type { ProjectItem } from '../data/portfolioData';
import { ProjectIllustration } from './ProjectIllustration';

interface ProjectModalProps {
  project: ProjectItem | null;
  triggerType: 'view' | 'github';
  onClose: () => void;
  onInquire: (projectTitle: string) => void;
}

export function ProjectModal({
  project,
  triggerType,
  onClose,
  onInquire,
}: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const statusHeading =
    triggerType === 'github' ? 'GitHub Repository Placeholder' : 'Project Concept Overview';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#151515]/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#151515]/15 bg-[#FAF7F2] text-[#151515] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project dialog"
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#151515]/20 bg-[#FAF7F2]/95 text-[#151515] transition-colors hover:bg-[#151515] hover:text-[#F5F0E7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96D48]"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <ProjectIllustration
          illustrationKey={project.illustrationKey}
          title={project.title}
        />

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C574F]">
            <span className="font-semibold text-[#A8502D] tabular-nums">{project.index}.</span>
            <span aria-hidden="true">·</span>
            <span>{project.subtitle}</span>
            {project.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-2">
                <span aria-hidden="true">·</span>
                <span>{tag}</span>
              </span>
            ))}
          </div>

          <h3
            id="project-modal-title"
            className="mt-3 font-condensed text-3xl tracking-tight text-[#151515] sm:text-4xl"
          >
            {project.title}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-[#38342F] sm:text-base">
            {project.description}
          </p>

          <div className="mt-6 border-t border-[#151515]/12 pt-5">
            <h4 className="text-xs font-semibold tracking-wider text-[#5C574F] uppercase">
              Concept Scope
            </h4>
            <ul className="mt-3 space-y-2.5 text-sm text-[#38342F]">
              {project.details.map((detail) => (
                <li key={detail} className="flex items-start gap-2.5">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C96D48]"
                    aria-hidden="true"
                  />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-lg border border-[#C96D48]/35 bg-[#F5F0E7] p-4">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#A8502D]" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold text-[#151515]">{statusHeading}</p>
                <p className="mt-1 text-xs leading-relaxed text-[#4A4640]">
                  {project.isPlaceholder
                    ? 'This card is reserved for upcoming software development and AI/ML projects. Verified GitHub links will be added as each project is published.'
                    : 'A public GitHub repository link has not been attached yet. You can reach out directly if you would like to discuss this project concept.'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#151515]/12 pt-5">
            <span className="inline-flex items-center gap-1.5 text-xs text-[#5C574F]">
              <Github className="h-3.5 w-3.5" aria-hidden="true" />
              <span>GitHub repository link pending</span>
            </span>

            <button
              type="button"
              onClick={() => onInquire(project.title)}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-md bg-[#151515] px-4 py-2 text-xs font-semibold text-[#F5F0E7] transition-colors hover:bg-[#C96D48] hover:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96D48]"
            >
              <span>Discuss This Project</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
