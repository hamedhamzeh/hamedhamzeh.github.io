import type { Honor as HonorType } from '@/data/resume/honors';

interface HonorProps {
  data: HonorType;
}

export default function Honor({ data }: HonorProps) {
  return (
    <article className="honor-card">
      <header className="honor-card-header">
        <div>
          <h4>{data.title}</h4>
          <p className="honor-issuer">{data.issuer}</p>
        </div>
        <time dateTime={String(data.year)}>{data.year}</time>
      </header>
      <p className="honor-description">{data.description}</p>
      {data.note ? <p className="honor-note">{data.note}</p> : null}
    </article>
  );
}
