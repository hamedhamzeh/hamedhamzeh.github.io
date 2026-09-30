export interface Project {
  title: string;
  subtitle?: string;
  link?: string;
  image?: string;
  date?: string;
  desc: string;
  tech?: string[];
  featured?: boolean;
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
