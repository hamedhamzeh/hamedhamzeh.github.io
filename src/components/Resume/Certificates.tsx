import type { Certificate as CertificateType } from '@/data/resume/certificates';

import Certificate from './Certificates/Certificate';

interface CertificatesProps {
  data: CertificateType[];
}

export default function Certificates({ data }: CertificatesProps) {
  return (
    <div className="certificates">
      <h2 className="section-title">Certificates</h2>
      <div className="certificate-list">
        {data.map((certificate) => (
          <Certificate
            data={certificate}
            key={`${certificate.title}-${certificate.issued}`}
          />
        ))}
      </div>
    </div>
  );
}
