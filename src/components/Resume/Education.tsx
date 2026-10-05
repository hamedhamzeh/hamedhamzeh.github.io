import type { Degree as DegreeType } from '@/data/resume/degrees';

import Degree from './Education/Degree';

interface EducationProps {
  data: DegreeType[];
}

export default function Education({ data }: EducationProps) {
  return (
    <div className="education">
      <h2 className="section-title">Education</h2>
      {data.map((degree) => (
        <Degree data={degree} key={degree.school} />
      ))}
    </div>
  );
}
