import LightboxGallery from '@/components/Media/LightboxGallery';
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

      {data.achievement && (
        <p className="certificate-achievement">{data.achievement}</p>
      )}

      {data.courses && (
        <ul className="certificate-courses" aria-label="Included courses">
          {data.courses.map((course) => (
            <li key={course}>{course}</li>
          ))}
        </ul>
      )}

      {data.highlights && (
        <ul className="certificate-courses" aria-label="Curriculum highlights">
          {data.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      )}

      <div className="experience-links" aria-label="Related evidence">
        {data.gallery && (
          <LightboxGallery
            images={data.gallery.images}
            triggerLabel={data.gallery.triggerLabel}
            dialogLabel={data.gallery.dialogLabel}
          />
        )}
        {data.credentialUrl && (
          <a
            href={data.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View credential
            <span aria-hidden="true"> ↗</span>
          </a>
        )}
        {data.projectUrl && (
          <a href={data.projectUrl} target="_blank" rel="noopener noreferrer">
            View project on GitHub
            <span aria-hidden="true"> ↗</span>
          </a>
        )}
      </div>
    </article>
  );
}
