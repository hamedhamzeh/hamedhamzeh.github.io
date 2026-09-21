import type { Certificate as CertificateType } from '@/data/resume/certificates';

interface CertificateProps {
  data: CertificateType;
}

export default function Certificate({ data }: CertificateProps) {
  return (
    <article className="certificate-card">
      <header className="certificate-card-header">
        <div>
          <h4>{data.title}</h4>
          <p className="certificate-issuer">{data.issuer}</p>
        </div>
        <time dateTime={data.issued}>{data.issuedLabel}</time>
      </header>

      <ul className="certificate-courses" aria-label="Included courses">
        {data.courses.map((course) => (
          <li key={course}>{course}</li>
        ))}
      </ul>

      <a
        className="certificate-link"
        href={data.credentialUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        View credential
        <span aria-hidden="true"> ↗</span>
      </a>
    </article>
  );
}
