import type { ProjectPlaceholder } from '@/data/projects';

interface PlaceholderCardProps {
  data: ProjectPlaceholder;
}

export default function PlaceholderCard({ data }: PlaceholderCardProps) {
  return (
    <article
      className="project-preview-card"
      aria-label={`${data.category} ${data.title} placeholder`}
    >
      <div className="project-preview-art" aria-hidden="true">
        <span className="project-preview-art-number">{data.number}</span>
        <span className="project-preview-art-orbit" />
        <span className="project-preview-art-shape" />
      </div>
      <div className="project-preview-content">
        <p className="project-preview-label">{data.category}</p>
        <h3>{data.title}</h3>
        <p>{data.desc}</p>
      </div>
    </article>
  );
}
