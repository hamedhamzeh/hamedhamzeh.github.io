import { ExternalLinkIcon } from '@/components/Icons';
import type { Honor as HonorType } from '@/data/resume/honors';

interface HonorProps {
  data: HonorType;
}

export default function Honor({ data }: HonorProps) {
  return (
    <article className="resume-card honor-card">
      <header className="resume-card-header honor-card-header">
        <div>
          <h3 className="resume-card-title">{data.title}</h3>
          <p className="honor-issuer">{data.issuer}</p>
        </div>
        <time dateTime={String(data.year)}>{data.year}</time>
      </header>
      <p className="honor-description">{data.description}</p>
      {data.note ? <p className="honor-note">{data.note}</p> : null}
      {data.githubUrl && (
        <div className="resume-actions">
          <a href={data.githubUrl} target="_blank" rel="noopener noreferrer">
            View project on GitHub
            <ExternalLinkIcon />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      )}
    </article>
  );
}
