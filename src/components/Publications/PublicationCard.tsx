import Image from 'next/image';

import type { Publication } from '@/data/resume/publications';
import { PROJECT_IMAGE } from '@/lib/utils';

interface PublicationCardProps {
  data: Publication;
}

/**
 * Publication card for the /publications index. A publication with a dedicated
 * page behaves like a project card: the whole card opens that page and the
 * card lifts on hover. It cannot be one large link the way a project card is,
 * because it also carries the publication record next to the citation, so the
 * title link is stretched over the card instead. Publications without a page
 * stay static and non-interactive. The presentation certificate stays in the
 * Resume's Publications section rather than being duplicated here.
 */
export default function PublicationCard({ data }: PublicationCardProps) {
  const image = data.image ?? data.presentation?.gallery.images[0]?.src;
  const authors = data.authors
    .map(({ citationName }) => citationName)
    .join(', ');
  const hasActionRow = Boolean(data.detailPath ?? data.url ?? data.year);
  const hasDetailPage = Boolean(data.detailPath);

  return (
    <article
      className={`project-card ${hasDetailPage ? 'project-card--linked' : 'project-card--static'}`}
    >
      <div className="project-card-static">
        {image ? (
          <div className="project-card-image">
            <Image
              src={image}
              alt={data.title}
              width={PROJECT_IMAGE.width}
              height={PROJECT_IMAGE.height}
              sizes="(max-width: 600px) 100vw, 50vw"
            />
          </div>
        ) : (
          <div
            className="project-card-image project-card-image--placeholder"
            aria-hidden="true"
          >
            Publication
          </div>
        )}

        <div className="project-card-content">
          <header className="project-card-header">
            <h3 className="project-card-title">
              {data.detailPath ? (
                <a className="publication-card-link" href={data.detailPath}>
                  {data.title}
                </a>
              ) : (
                data.title
              )}
            </h3>
            {data.venue ? (
              <p className="project-card-subtitle">{data.venue}</p>
            ) : null}
          </header>

          <p className="project-card-desc">{authors}</p>

          {/* A manuscript without a venue states its review status below the
              author line, where it reads as the citation's closing detail. */}
          {!data.venue ? (
            <p className="project-card-status">
              <span className="publication-type">{data.status}</span>
            </p>
          ) : null}

          {hasActionRow ? (
            <div className="resume-actions">
              {data.detailPath ? (
                <a href={data.detailPath}>Publication page</a>
              ) : null}

              {data.url && data.linkLabel ? (
                <a href={data.url} target="_blank" rel="noopener noreferrer">
                  {data.linkLabel}
                  <span aria-hidden="true"> ↗</span>
                </a>
              ) : null}

              {/* The year closes the action row, so it shares the buttons' line
                  when they fit and wraps to its own line when they do not. */}
              {data.year ? (
                <time
                  className="project-card-date"
                  dateTime={String(data.year)}
                >
                  {data.year}
                </time>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
