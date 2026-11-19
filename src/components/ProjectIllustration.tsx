import type { ProjectItem } from '../data/portfolioData';

interface ProjectIllustrationProps {
  illustrationKey: ProjectItem['illustrationKey'];
  title: string;
}

export function ProjectIllustration({ illustrationKey, title }: ProjectIllustrationProps) {
  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden border-b border-[#151515]/12 bg-[#EDE6DA]"
      aria-label={`${title} conceptual thumbnail`}
    >
      {illustrationKey === 'campus-carebox' && (
        <svg
          viewBox="0 0 640 400"
          className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-hidden="true"
        >
          <rect width="640" height="400" fill="#EDE6DA" />
          <path
            d="M0 80H640M0 160H640M0 240H640M0 320H640M128 0V400M256 0V400M384 0V400M512 0V400"
            stroke="rgba(21,21,21,0.05)"
            strokeWidth="1"
          />
          <circle cx="515" cy="90" r="64" fill="#C96D48" fillOpacity="0.18" />
          <rect
            x="92"
            y="64"
            width="456"
            height="272"
            rx="12"
            fill="#FAF7F2"
            stroke="rgba(21,21,21,0.14)"
          />
          <rect x="124" y="96" width="144" height="12" rx="3" fill="#151515" />
          <rect x="124" y="120" width="210" height="8" rx="2" fill="#8C8377" fillOpacity="0.6" />
          <rect
            x="124"
            y="158"
            width="120"
            height="136"
            rx="8"
            fill="#F5F0E7"
            stroke="rgba(21,21,21,0.12)"
          />
          <rect
            x="260"
            y="158"
            width="120"
            height="136"
            rx="8"
            fill="#F5F0E7"
            stroke="rgba(21,21,21,0.12)"
          />
          <rect
            x="396"
            y="158"
            width="120"
            height="136"
            rx="8"
            fill="#151515"
          />
          <circle cx="184" cy="204" r="20" stroke="#151515" strokeWidth="1.75" />
          <path d="M184 194V214M174 204H194" stroke="#C96D48" strokeWidth="2" />
          <rect x="148" y="244" width="72" height="7" rx="2" fill="#4A4640" fillOpacity="0.55" />
          <rect x="158" y="260" width="52" height="6" rx="2" fill="#8C8377" fillOpacity="0.45" />

          <rect x="300" y="186" width="40" height="36" rx="4" stroke="#151515" strokeWidth="1.75" />
          <path d="M310 186V178H330V186" stroke="#C96D48" strokeWidth="2" />
          <rect x="284" y="244" width="72" height="7" rx="2" fill="#4A4640" fillOpacity="0.55" />
          <rect x="294" y="260" width="52" height="6" rx="2" fill="#8C8377" fillOpacity="0.45" />

          <polygon
            points="456,182 476,194 476,218 456,230 436,218 436,194"
            stroke="#C96D48"
            strokeWidth="2"
          />
          <path d="M436 194L456 206L476 194M456 206V230" stroke="#C96D48" strokeWidth="2" />
          <rect x="420" y="244" width="72" height="7" rx="2" fill="#FAF7F2" fillOpacity="0.85" />
          <rect x="430" y="260" width="52" height="6" rx="2" fill="#FAF7F2" fillOpacity="0.45" />
        </svg>
      )}

      {illustrationKey === 'smartshop' && (
        <svg
          viewBox="0 0 640 400"
          className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-hidden="true"
        >
          <rect width="640" height="400" fill="#EDE6DA" />
          <path
            d="M0 100H640M0 200H640M0 300H640M160 0V400M320 0V400M480 0V400"
            stroke="rgba(21,21,21,0.05)"
            strokeWidth="1"
          />
          <circle cx="320" cy="200" r="130" fill="#C96D48" fillOpacity="0.12" />
          <path
            d="M140 262C210 262 220 140 315 140C405 140 415 215 500 130"
            stroke="#C96D48"
            strokeWidth="2.2"
          />
          <path
            d="M140 150C220 150 240 250 320 250C410 250 430 190 500 240"
            stroke="#151515"
            strokeOpacity="0.35"
            strokeWidth="1.5"
            strokeDasharray="5 5"
          />
          <rect x="92" y="120" width="96" height="60" rx="8" fill="#FAF7F2" stroke="rgba(21,21,21,0.14)" />
          <rect x="92" y="230" width="96" height="60" rx="8" fill="#FAF7F2" stroke="rgba(21,21,21,0.14)" />
          <rect x="264" y="102" width="112" height="76" rx="10" fill="#151515" />
          <rect x="292" y="130" width="56" height="8" rx="2" fill="#FAF7F2" />
          <rect x="292" y="148" width="40" height="6" rx="2" fill="#C96D48" />
          <rect x="264" y="214" width="112" height="72" rx="8" fill="#FAF7F2" stroke="rgba(21,21,21,0.14)" />
          <rect x="452" y="96" width="96" height="70" rx="8" fill="#FAF7F2" stroke="#C96D48" strokeWidth="1.5" />
          <circle cx="500" cy="130" r="14" stroke="#C96D48" strokeWidth="2" />
          <path d="M494 130L498 134L507 125" stroke="#151515" strokeWidth="2" />
          <rect x="452" y="206" width="96" height="70" rx="8" fill="#FAF7F2" stroke="rgba(21,21,21,0.14)" />
          <circle cx="140" cy="262" r="4.5" fill="#151515" />
          <circle cx="315" cy="140" r="4.5" fill="#C96D48" />
          <circle cx="500" cy="130" r="4.5" fill="#C96D48" />
        </svg>
      )}

      {illustrationKey === 'calorie-tracker' && (
        <svg
          viewBox="0 0 640 400"
          className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-hidden="true"
        >
          <rect width="640" height="400" fill="#EDE6DA" />
          <rect
            x="88"
            y="58"
            width="464"
            height="284"
            rx="12"
            fill="#FAF7F2"
            stroke="rgba(21,21,21,0.14)"
          />
          <circle cx="196" cy="200" r="64" stroke="rgba(21,21,21,0.1)" strokeWidth="10" />
          <circle
            cx="196"
            cy="200"
            r="64"
            stroke="#C96D48"
            strokeWidth="10"
            strokeDasharray="280 402"
            strokeLinecap="round"
            transform="rotate(-90 196 200)"
          />
          <rect x="172" y="190" width="48" height="10" rx="3" fill="#151515" />
          <rect x="178" y="208" width="36" height="6" rx="2" fill="#8C8377" />

          <rect x="304" y="108" width="120" height="10" rx="2" fill="#151515" />
          <rect x="304" y="138" width="212" height="34" rx="6" fill="#F5F0E7" stroke="rgba(21,21,21,0.1)" />
          <rect x="320" y="151" width="94" height="8" rx="2" fill="#4A4640" />
          <rect x="464" y="151" width="36" height="8" rx="2" fill="#C96D48" />

          <rect x="304" y="184" width="212" height="34" rx="6" fill="#F5F0E7" stroke="rgba(21,21,21,0.1)" />
          <rect x="320" y="197" width="112" height="8" rx="2" fill="#4A4640" />
          <rect x="464" y="197" width="36" height="8" rx="2" fill="#151515" />

          <rect x="304" y="230" width="212" height="34" rx="6" fill="#F5F0E7" stroke="rgba(21,21,21,0.1)" />
          <rect x="320" y="243" width="84" height="8" rx="2" fill="#4A4640" />
          <rect x="464" y="243" width="36" height="8" rx="2" fill="#C96D48" />

          <rect x="304" y="284" width="212" height="6" rx="3" fill="rgba(21,21,21,0.1)" />
          <rect x="304" y="284" width="144" height="6" rx="3" fill="#151515" />
        </svg>
      )}

      {illustrationKey === 'more-projects' && (
        <svg
          viewBox="0 0 640 400"
          className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-hidden="true"
        >
          <rect width="640" height="400" fill="#EDE6DA" />
          <path
            d="M0 80H640M0 160H640M0 240H640M0 320H640M160 0V400M320 0V400M480 0V400"
            stroke="rgba(21,21,21,0.06)"
            strokeWidth="1"
          />
          <rect
            x="160"
            y="80"
            width="320"
            height="240"
            rx="12"
            fill="#FAF7F2"
            stroke="rgba(21,21,21,0.22)"
            strokeDasharray="6 6"
          />
          <circle cx="320" cy="196" r="38" fill="#C96D48" />
          <path d="M320 180V212M304 196H336" stroke="#FAF7F2" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="256" y="256" width="128" height="8" rx="2" fill="#151515" fillOpacity="0.6" />
        </svg>
      )}
    </div>
  );
}
