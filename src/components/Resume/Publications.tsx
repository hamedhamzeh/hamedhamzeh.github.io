import type { Publication as PublicationType } from '@/data/resume/publications';

import Publication from './Publications/Publication';

interface PublicationsProps {
  data: PublicationType[];
}

export default function Publications({ data }: PublicationsProps) {
  return (
    <div className="publications">
      <h2 className="section-title">Publications</h2>
      <div className="publication-list">
        {data.map((publication) => (
          <Publication data={publication} key={publication.title} />
        ))}
      </div>
    </div>
  );
}
