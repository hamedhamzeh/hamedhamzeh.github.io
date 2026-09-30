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

const data: Project[] = [
  {
    title: 'Project 01',
    desc: 'Project details will be added here.',
  },
  {
    title: 'Project 02',
    desc: 'Project details will be added here.',
  },
  {
    title: 'Project 03',
    desc: 'Project details will be added here.',
  },
];

export default data;
