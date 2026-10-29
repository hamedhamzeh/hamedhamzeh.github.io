import type { Degree as DegreeType } from '@/data/resume/degrees';

interface DegreeProps {
  data: DegreeType;
}

export default function Degree({ data }: DegreeProps) {
  return (
    <article className="resume-card degree-container">
      <header>
        <h3 className="resume-card-title degree">{data.degree}</h3>
        <p className="school">
          <a href={data.link}>{data.school}</a>,{' '}
          <time dateTime={String(data.startYear)}>{data.startYear}</time>–
          <time dateTime={String(data.endYear)}>{data.endYear}</time>
          {data.location ? ` · ${data.location}` : null}
        </p>
      </header>
      {data.gpa ? (
        <p className="degree-detail">
          <strong>GPA:</strong> {data.gpa}
        </p>
      ) : null}
      {data.thesis ? (
        <div className="degree-thesis">
          <p className="degree-detail">
            <strong>Undergraduate thesis:</strong>{' '}
            <cite>{data.thesis.title}</cite>
          </p>
          {data.thesis.context ? (
            <p className="degree-detail">{data.thesis.context}</p>
          ) : null}
          <p className="degree-detail">
            <strong>Thesis grade:</strong> {data.thesis.grade}
          </p>
          <p className="degree-detail">
            <strong>Supervisor:</strong> {data.thesis.supervisor}
          </p>
          {data.thesis.projectUrl ? (
            <div className="resume-actions" aria-label="Related evidence">
              <a href={data.thesis.projectUrl}>View thesis project</a>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
