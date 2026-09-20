import type { Honor as HonorType } from '@/data/resume/honors';

import Honor from './Honors/Honor';

interface HonorsProps {
  data: HonorType[];
}

export default function Honors({ data }: HonorsProps) {
  return (
    <div className="honors">
      <div className="link-to" id="honors" />
      <div className="title">
        <h3>Honors &amp; Awards</h3>
      </div>
      <div className="honors-list">
        {data.map((honor) => (
          <Honor data={honor} key={`${honor.year}-${honor.title}`} />
        ))}
      </div>
    </div>
  );
}
