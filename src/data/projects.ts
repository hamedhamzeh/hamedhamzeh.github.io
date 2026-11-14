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
  openInNewTab?: boolean;
  actionLabel?: string;
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

// Front-end course projects are maintained and deployed in their own repositories.
export const frontendProjects: ProjectCard[] = [
  {
    id: 'game-hub',
    title: 'Game Hub',
    desc: 'A game browser with search, sorting, genre and platform filters, and individual game pages. Built with React and TypeScript.',
    category: 'Front-end',
    date: '2023-03-06',
    replaces: 'front-end-01',
    link: 'https://hamedhamzeh.github.io/my-game-hub/',
    openInNewTab: true,
    actionLabel: 'Visit website',
    image: '/images/projects/frontend/game-hub.webp',
  },
  {
    id: 'hosting-landing-page',
    title: 'Web Hosting Landing Page',
    desc: 'A responsive web hosting demo with a domain search interface and pricing cards, built with HTML, CSS, and JavaScript.',
    category: 'Front-end',
    date: '2023-02-07',
    replaces: 'front-end-02',
    link: 'https://hamedhamzeh.github.io/my-front-project/',
    openInNewTab: true,
    actionLabel: 'Visit website',
    image: '/images/projects/frontend/hosting-landing-page.webp',
  },
];

export const MOF_HYDROGEN_STORAGE_REPO_URL =
  'https://github.com/hamedhamzeh/MOF-Hydrogen-Storage-prediction';

export const githubProjects: ProjectCard[] = [
  {
    id: 'virtual-fence',
    title: 'Virtual Fence & Person Tracking',
    desc: 'Uses YOLOv8 and SimpleSORT to track people in video and count when they enter a marked area.',
    category: 'Computer Vision',
    replaces: 'computer-vision-03',
    date: '2025-12-27',
    link: 'https://github.com/hamedhamzeh/virtual-fence',
    openInNewTab: true,
    actionLabel: 'View on GitHub',
    image: '/images/projects/computer-vision/virtual-fence.webp',
  },
  {
    id: 'xception-bone-age-prediction',
    title: 'Bone Age Estimation from Hand X-rays',
    desc: 'Estimates skeletal maturity from pediatric hand X-rays using an Xception model trained on the RSNA Pediatric Bone Age dataset.',
    category: 'Computer Vision',
    replaces: 'computer-vision-04',
    date: '2024-08-24',
    link: 'https://github.com/hamedhamzeh/xception-bone-age-prediction',
    openInNewTab: true,
    actionLabel: 'View on GitHub',
    image: '/images/projects/computer-vision/bone-age-estimation.webp',
  },
  {
    id: 'mof-hydrogen-storage',
    title: 'Predicting Hydrogen Storage in MOFs',
    desc: 'Uses machine learning to estimate usable hydrogen storage by mass and volume in metal–organic frameworks and shortlist promising materials.',
    category: 'ML Projects',
    label: 'ML Projects · Competition winner',
    replaces: 'ml-projects-01',
    date: '2024',
    link: MOF_HYDROGEN_STORAGE_REPO_URL,
    openInNewTab: true,
    actionLabel: 'View on GitHub',
    image: '/images/projects/mof-hydrogen-storage.svg',
  },
];

// Project cards can also introduce work documented on an existing publication page.
export const linkedProjects: ProjectCard[] = [
  {
    id: 'vision-controlled-puppet-robot',
    title: 'Vision-Controlled Puppet Robot',
    desc: 'Uses camera-based pose estimation to make a robotic puppet mimic the movements of a manually operated puppet.',
    category: 'Robotics',
    label: 'Robotics · Research project',
    date: '2024',
    replaces: 'robotics-02',
    link: '/publications/puppet-robot-pose-detection/',
    image: '/videos/puppet-robot/posters/puppet-demo-1.webp',
  },
  {
    id: 'wormlike-surface-inspection-robot',
    title: 'Wormlike Robot for Surface Inspection',
    desc: 'A silkworm-inspired robot that uses passive magnets and flexible joints to move around corners and along curved steel surfaces.',
    category: 'Robotics',
    label: 'Robotics · Research project',
    date: '2026',
    link: '/publications/wormlike-robot-ferromagnetic-surface-inspection/',
    image: '/images/assets/wormlike-robot-poster.webp',
  },
];

const placeholderCounts: Record<ProjectCategory, number> = {
  'Computer Vision': 5,
  Robotics: 2,
  'Front-end': 2,
  MLOps: 2,
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
