export interface ProjectCardSummary {
  title: string;
  description: string;
  label?: string;
}

export interface Project {
  title: string;
  subtitle?: string;
  link?: string;
  image?: string;
  date?: string;
  desc: string;
  tech?: string[];
  featured?: boolean;
  category?: ProjectCategory;
  replaces?: string;
  card?: ProjectCardSummary;
}

export const projectCategories = [
  'Computer Vision',
  'Robotics',
  'Front-end',
  'MLOps',
  'ML Projects',
] as const;

export type ProjectCategory = (typeof projectCategories)[number];

export interface ProjectPlaceholder {
  id: string;
  category: ProjectCategory;
  number: string;
  title: string;
  desc: string;
}

export interface ProjectCard extends Project {
  id: string;
  category: ProjectCategory;
  label?: string;
}

export type ProjectShowcaseEntry = ProjectPlaceholder | ProjectCard;

// Project cards can also introduce work documented on an existing publication page.
export const linkedProjects: ProjectCard[] = [
  {
    id: 'vision-controlled-puppet-robot',
    title: 'Vision-Controlled Puppet Robot',
    desc: 'A modular puppet robot combining mechanical design, embedded control, and vision-based movement.',
    category: 'Robotics',
    label: 'Robotics · Research project',
    replaces: 'robotics-02',
    link: '/publications/puppet-robot-pose-detection/',
    image: '/videos/puppet-robot/posters/puppet-demo-1.webp',
  },
  {
    id: 'wormlike-surface-inspection-robot',
    title: 'Wormlike Surface-Inspection Robot',
    desc: 'A bio-inspired robotic platform designed for movement on ferromagnetic surfaces.',
    category: 'Robotics',
    label: 'Robotics · Research project',
    link: '/publications/wormlike-robot-ferromagnetic-surface-inspection/',
    image: '/images/assets/wormlike-robot-poster.webp',
  },
];

const placeholderCounts: Record<ProjectCategory, number> = {
  'Computer Vision': 5,
  Robotics: 2,
  'Front-end': 2,
  MLOps: 1,
  'ML Projects': 1,
};

const data: ProjectPlaceholder[] = projectCategories.flatMap((category) =>
  Array.from({ length: placeholderCounts[category] }, (_, index) => {
    const number = String(index + 1).padStart(2, '0');
    return {
      id: `${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${number}`,
      category,
      number,
      title: `Project ${number}`,
      desc: 'Project details will be added here.',
    };
  }),
);

export default data;
