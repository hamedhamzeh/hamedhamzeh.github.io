import type { Honor as HonorType } from '@/data/resume/honors';

import Honor from './Honors/Honor';

interface HonorsProps {
  data: HonorType[];
}

export default function Honors({ data }: HonorsProps) {
  return (
    <div className="honors">
      <h2 className="section-title">Honors &amp; Awards</h2>
      <div className="honors-list">
        {data.map((honor) => (
          <Honor data={honor} key={`${honor.year}-${honor.title}`} />
        ))}
      </div>
    </div>
  );
}
