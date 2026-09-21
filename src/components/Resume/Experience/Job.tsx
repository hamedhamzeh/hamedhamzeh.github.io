import dayjs from 'dayjs';

import type {
  EvidenceLink,
  Position,
  PositionSection,
} from '@/data/resume/work';

import JobSummary from './JobSummary';

interface JobProps {
  data: Position;
}

function DateRange({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate?: string;
}) {
  return (
    <p className="daterange">
      <time dateTime={startDate}>{dayjs(startDate).format('MMMM YYYY')}</time> -{' '}
      {endDate ? (
        <time dateTime={endDate}>{dayjs(endDate).format('MMMM YYYY')}</time>
      ) : (
        'Present'
      )}
    </p>
  );
}

function EvidenceLinks({ links }: { links: EvidenceLink[] }) {
  return (
    <div className="resume-actions" aria-label="Related evidence">
      {links.map((link) => {
        const isExternal = /^https?:\/\//.test(link.url);

        return (
          <a
            href={link.url}
            key={`${link.label}-${link.url}`}
            {...(isExternal
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            {link.label}
            {isExternal ? <span aria-hidden="true"> ↗</span> : null}
          </a>
        );
      })}
    </div>
  );
}

function JobSubsection({ data }: { data: PositionSection }) {
  return (
    <section className="job-subsection">
      <header className="job-subsection-header">
        <h4>{data.title}</h4>
        {data.startDate ? (
          <DateRange startDate={data.startDate} endDate={data.endDate} />
        ) : null}
      </header>
      <ul className="points">
        {data.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
      {data.links ? <EvidenceLinks links={data.links} /> : null}
    </section>
  );
}

export default function Job({ data }: JobProps) {
  const {
    name,
    position,
    url,
    startDate,
    endDate,
    summary,
    highlights,
    subsections,
    links,
  } = data;

  return (
    <article className="resume-card jobs-container">
      <header className="resume-card-header">
        <h3 className="resume-card-title">
          {url ? <a href={url}>{name}</a> : name} - {position}
        </h3>
        <DateRange startDate={startDate} endDate={endDate} />
      </header>
      {summary ? <JobSummary summary={summary} /> : null}
      {highlights ? (
        <ul className="points">
          {highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      ) : null}
      {links ? <EvidenceLinks links={links} /> : null}
      {subsections?.map((subsection) => (
        <JobSubsection
          data={subsection}
          key={`${subsection.title}-${subsection.startDate ?? 'project'}`}
        />
      ))}
    </article>
  );
}
