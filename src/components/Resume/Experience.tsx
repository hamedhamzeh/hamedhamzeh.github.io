import type { Position } from '@/data/resume/work';

import Job from './Experience/Job';

interface ExperienceProps {
  data: Position[];
}

export default function Experience({ data }: ExperienceProps) {
  return (
    <div className="experience">
      <h2 className="section-title">Experience</h2>
      {data.map((job) => (
        <Job data={job} key={`${job.name}-${job.position}`} />
      ))}
    </div>
  );
}
