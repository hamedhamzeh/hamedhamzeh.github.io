import dayjs from 'dayjs';

import CardPoster from '@/components/Media/CardPoster';
import type { Project } from '@/data/projects';

export type ProjectCardData = Omit<Project, 'date' | 'image'> & {
  date?: string;
  image?: string;
  label?: string;
};

interface CellProps {
  data: ProjectCardData;
  prioritizePoster?: boolean;
}

export default function Cell({ data, prioritizePoster }: CellProps) {
  const {
    title,
    subtitle,
    link,
    image,
    date,
    desc,
    featured,
    category,
    label,
    openInNewTab,
  } = data;

  const hasLink = Boolean(link);

  const cardContent = (
    <>
      {image ? (
        <CardPoster
          key={image}
          src={image}
          alt={title}
          prioritize={prioritizePoster}
          draggable={false}
        />
      ) : (
        <div
          className="project-card-image project-card-image--placeholder"
          aria-hidden="true"
        >
          Project
        </div>
      )}

      <div className="project-card-content">
        <header className="project-card-header">
          {(label ?? category) && (
            <p className="project-preview-label">{label ?? category}</p>
          )}
          <h3 className="project-card-title">{title}</h3>
          {subtitle && <p className="project-card-subtitle">{subtitle}</p>}
        </header>

        <p className="project-card-desc">{desc}</p>

        {date && (
          <time className="project-card-date" dateTime={date}>
            {dayjs(date).format('YYYY')}
          </time>
        )}
      </div>
    </>
  );

  return (
    <article
      className={`project-card ${featured ? 'project-card--featured' : ''} ${hasLink ? 'project-card--linked' : 'project-card--static'}`}
    >
      {hasLink ? (
        <a
          href={link}
          target={openInNewTab ? '_blank' : undefined}
          rel={openInNewTab ? 'noopener noreferrer' : undefined}
          className="project-card-link"
          draggable={false}
        >
          {cardContent}
          <span className="project-card-action">
            {data.actionLabel ?? 'Explore project'}
            {openInNewTab && (
              <span className="sr-only"> (opens in a new tab)</span>
            )}
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </span>
        </a>
      ) : (
        <div className="project-card-static">{cardContent}</div>
      )}
    </article>
  );
}
