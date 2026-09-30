import type { Project } from '@/data/projects';

interface PlaceholderCardProps {
  data: Project;
  index: number;
}

export default function PlaceholderCard({ data, index }: PlaceholderCardProps) {
  const number = String(index + 1).padStart(2, '0');

  return (
    <article className="project-preview-card">
      <div className="project-preview-art" aria-hidden="true">
        <span className="project-preview-art-number">{number}</span>
        <span className="project-preview-art-orbit" />
        <span className="project-preview-art-shape" />
      </div>
      <div className="project-preview-content">
        <p className="project-preview-label">Project {number}</p>
        <h2>{data.title}</h2>
        <p>{data.desc}</p>
      </div>
    </article>
  );
}
