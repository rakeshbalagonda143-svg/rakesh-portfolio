export type SkillCategory = 'Programming' | 'Database' | 'Web Development';

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency?: 'Intermediate' | 'Beginner';
  proficiencyPercent?: number;
  description: string;
}

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  illustrationKey: 'campus-carebox' | 'smartshop' | 'calorie-tracker' | 'more-projects';
  isPlaceholder?: boolean;
  details: string[];
}

export interface EducationEntry {
  id: string;
  stage: string;
  institution: string;
  program: string;
  meta: string;
  highlights: { label: string; value: string }[];
  isCurrent?: boolean;
}

export const PERSONAL_INFO = {
  fullName: 'BALAGONDA RAKESH ROSHAN',
  brandName: 'RAKESH ROSHAN',
  signatureName: 'Rakesh Roshan',
  roleLine: 'Aspiring Software Developer | AI & ML Student | Web Developer',
  heroTopLeft: 'WEB DEVELOPER & AI/ML STUDENT',
  heroTopRight: 'AVAILABLE FOR INTERNSHIP OPPORTUNITIES',
  heroRole: 'ASPIRING SOFTWARE DEVELOPER',
  heroDescription:
    'I am a Computer Science and Engineering student specializing in Artificial Intelligence and Machine Learning, passionate about programming, web development, and building practical digital solutions.',
  college: 'JAIN University',
  degree: 'B.Tech — Computer Science and Engineering (Artificial Intelligence & Machine Learning)',
  expectedGraduation: '2029',
  location: 'Bengaluru, Karnataka, India',
  shortLocation: 'Bengaluru, India',
  email: 'rakeshbalagonda143@gmail.com',
  phone: '+91 8184867080',
  phoneHref: 'tel:+918184867080',
  linkedinUrl: 'https://www.linkedin.com/in/rakesh-roshan-0b025543b',
  portraitPath: '/assets/aistudio/WhatsApp_Image_2026-11-13_at_2.12.31_PM_72eef1a2.jpeg',
  resumePath: '/Rakesh_Roshan_Resume.pdf',
  resumeFilename: 'Rakesh_Roshan_Resume.pdf',
} as const;

export const PROJECTS: ProjectItem[] = [
  {
    id: 'campus-carebox',
    index: '01',
    title: 'CAMPUS CAREBOX',
    subtitle: 'Campus Digital Concept',
    description:
      'A campus-focused digital solution concept designed to improve access to essential items through a convenient platform.',
    tags: ['Digital Platform Concept', 'Student Utility'],
    illustrationKey: 'campus-carebox',
    details: [
      'Designed around everyday student access to essential campus items.',
      'Focuses on a convenient, straightforward digital browsing and request flow.',
      'Repository and live demo links will be published here once development is complete.',
    ],
  },
  {
    id: 'smartshop',
    index: '02',
    title: 'SMARTSHOP',
    subtitle: 'AI / ML Shopping Concept',
    description:
      'A smart shopping concept exploring AI/ML features and optimization to enhance the shopping experience.',
    tags: ['AI / ML Concept', 'Optimization'],
    illustrationKey: 'smartshop',
    details: [
      'Explores applied Artificial Intelligence and Machine Learning features for retail discovery.',
      'Focuses on optimizing product selection and streamlining the shopping experience.',
      'Repository and live demo links will be connected once the build is published.',
    ],
  },
  {
    id: 'calorie-tracker',
    index: '03',
    title: 'CALORIE TRACKER WEBSITE',
    subtitle: 'Web Development Concept',
    description:
      'A web-based calorie tracking concept designed to help users monitor food intake and daily nutrition.',
    tags: ['Web Development', 'Nutrition Concept'],
    illustrationKey: 'calorie-tracker',
    details: [
      'Structured around clear daily food intake logging and calorie monitoring.',
      'Prioritizes clean layout readability for effortless nutrition tracking.',
      'Repository and live deployment links will be added upon public release.',
    ],
  },
  {
    id: 'more-projects',
    index: '04',
    title: 'MORE PROJECTS',
    subtitle: 'Upcoming Work',
    description:
      'A dedicated space for upcoming software development and AI/ML projects.',
    tags: ['Software Development', 'AI / ML'],
    illustrationKey: 'more-projects',
    isPlaceholder: true,
    details: [
      'Reserved for future coursework, web builds, database systems, and AI/ML prototypes.',
      'Verified GitHub repositories and live links will be added as new work launches.',
    ],
  },
];

export const TECHNICAL_SKILLS: SkillItem[] = [
  {
    id: 'python',
    name: 'Python',
    category: 'Programming',
    proficiency: 'Intermediate',
    proficiencyPercent: 65,
    description:
      'Used for algorithmic problem-solving, core programming logic, scripting, and foundational AI & ML exploration.',
  },
  {
    id: 'java',
    name: 'Java',
    category: 'Programming',
    proficiency: 'Beginner',
    proficiencyPercent: 35,
    description:
      'Building a solid foundation in object-oriented programming concepts, syntax, and structured problem solving.',
  },
  {
    id: 'sql',
    name: 'SQL',
    category: 'Database',
    proficiency: 'Intermediate',
    proficiencyPercent: 65,
    description:
      'Writing structured queries, designing relational tables, managing data integrity, and performing joins.',
  },
  {
    id: 'html',
    name: 'HTML',
    category: 'Web Development',
    description:
      'Crafting clean, semantic document structures and accessible page hierarchies for modern web interfaces.',
  },
  {
    id: 'css',
    name: 'CSS',
    category: 'Web Development',
    description:
      'Styling responsive layouts, typography, spacing systems, and visual polish across desktop and mobile viewports.',
  },
];

export const EDUCATION_HISTORY: EducationEntry[] = [
  {
    id: 'jain-university',
    stage: 'Current Education',
    institution: 'JAIN UNIVERSITY',
    program: 'B.Tech — Computer Science and Engineering (Artificial Intelligence & Machine Learning)',
    meta: 'Expected Graduation: 2029 · Bengaluru, Karnataka, India',
    isCurrent: true,
    highlights: [
      { label: 'Semester 1', value: '7.7' },
      { label: 'Semester 2', value: '76' },
    ],
  },
  {
    id: 'narayana-junior-college',
    stage: 'Pre-University',
    institution: 'NARAYANA JUNIOR COLLEGE',
    program: 'Intermediate Education',
    meta: 'Pre-University Academic Record',
    highlights: [{ label: 'Intermediate Score', value: '87%' }],
  },
  {
    id: 'jeevan-jyothi',
    stage: 'School Education',
    institution: 'JEEVAN JYOTHI',
    program: 'Secondary School Education',
    meta: '10th Grade Academic Record',
    highlights: [{ label: '10th Grade Score', value: '86%' }],
  },
];

export const ABOUT_INFO = {
  paragraphs: [
    "I'm Rakesh Roshan, a B.Tech student at JAIN University specializing in Computer Science and Engineering with Artificial Intelligence and Machine Learning.",
    'I enjoy programming, building websites, learning new technologies, and developing practical projects. I am continuously improving my technical skills and exploring opportunities to apply my knowledge in real-world software development.',
  ],
  blocks: [
    { label: 'Education', value: 'B.Tech CSE (AI & ML)' },
    { label: 'University', value: 'JAIN University' },
    { label: 'Location', value: 'Bengaluru, India' },
    { label: 'Graduation', value: '2029' },
  ],
} as const;

export const LOOKING_FOR_AREAS = [
  {
    index: '01',
    title: 'Software Development',
    description: 'Applying core programming and structured problem-solving to build dependable applications.',
  },
  {
    index: '02',
    title: 'Web Development',
    description: 'Creating clean, responsive web experiences with strong layout hierarchy and usability.',
  },
  {
    index: '03',
    title: 'Artificial Intelligence',
    description: 'Deepening academic and practical understanding of intelligent systems and real-world use cases.',
  },
  {
    index: '04',
    title: 'Machine Learning',
    description: 'Exploring data-driven models, optimization concepts, and foundational ML workflows.',
  },
  {
    index: '05',
    title: 'Internship Opportunities',
    description: 'Seeking hands-on engineering internships to learn from experienced teams and contribute actively.',
  },
  {
    index: '06',
    title: 'Collaborative Projects',
    description: 'Partnering with fellow students and builders to turn practical ideas into working prototypes.',
  },
] as const;
