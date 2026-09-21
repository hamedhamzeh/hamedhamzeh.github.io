import LightboxGallery from '@/components/Media/LightboxGallery';
import type { Publication as PublicationType } from '@/data/resume/publications';

interface PublicationProps {
  data: PublicationType;
}

const MAX_VISIBLE_AUTHORS = 4;

function getVisibleAuthors(
  authors: PublicationType['authors'],
): Array<PublicationType['authors'][number] | null> {
  if (authors.length <= MAX_VISIBLE_AUTHORS) {
    return authors;
  }

  const finalAuthor = authors.at(-1);

  return finalAuthor
    ? [...authors.slice(0, MAX_VISIBLE_AUTHORS - 1), null, finalAuthor]
    : authors;
}

export default function Publication({ data }: PublicationProps) {
  const visibleAuthors = getVisibleAuthors(data.authors);

  return (
    <article className="publication-card">
      <header className="publication-card-header">
        <div className="publication-types">
          <span className="publication-type">
            {data.status === 'Under Review' ? data.status : data.type}
          </span>
          {data.presentation ? (
            <span className="publication-type">{data.presentation.label}</span>
          ) : null}
        </div>
        {data.year ? (
          <time dateTime={String(data.year)}>{data.year}</time>
        ) : null}
      </header>

      <h4>
        <cite>{data.title}</cite>
      </h4>

      <p className="publication-authors">
        {visibleAuthors.map((author, index) => (
          <span key={author?.name ?? 'omitted-authors'}>
            {index > 0 ? ', ' : null}
            {author === null ? (
              <span aria-label="additional authors">…</span>
            ) : author.isHighlighted ? (
              <strong>{author.citationName}</strong>
            ) : (
              author.citationName
            )}
          </span>
        ))}
      </p>

      {data.venue ? <p className="publication-venue">{data.venue}</p> : null}

      {data.presentation ? (
        <p className="publication-presentation-note">
          {data.presentation.note}
        </p>
      ) : null}

      {data.url || data.doi || data.presentation ? (
        <div className="publication-links">
          {data.url && data.linkLabel ? (
            <a href={data.url} target="_blank" rel="noopener noreferrer">
              {data.linkLabel}
              <span aria-hidden="true"> ↗</span>
            </a>
          ) : null}
          {data.presentation ? (
            <LightboxGallery
              images={data.presentation.gallery.images}
              triggerLabel={data.presentation.gallery.triggerLabel}
              dialogLabel={data.presentation.gallery.dialogLabel}
            />
          ) : null}
          {data.doi ? (
            <span className="publication-doi">DOI: {data.doi}</span>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
