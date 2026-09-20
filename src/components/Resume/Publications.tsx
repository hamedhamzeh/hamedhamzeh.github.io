import type { Publication as PublicationType } from '@/data/resume/publications';

import Publication from './Publications/Publication';

interface PublicationsProps {
  data: PublicationType[];
}

export default function Publications({ data }: PublicationsProps) {
  return (
    <div className="publications">
      <div className="link-to" id="publications" />
      <div className="title">
        <h3>Publications</h3>
      </div>
      <div className="publication-list">
        {data.map((publication) => (
          <Publication data={publication} key={publication.title} />
        ))}
      </div>
    </div>
  );
}
