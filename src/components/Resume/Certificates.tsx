import type { Certificate as CertificateType } from '@/data/resume/certificates';

import Certificate from './Certificates/Certificate';

interface CertificatesProps {
  data: CertificateType[];
}

export default function Certificates({ data }: CertificatesProps) {
  return (
    <div className="certificates">
      <div className="link-to" id="certificates" />
      <div className="title">
        <h3>Certificates</h3>
      </div>
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
