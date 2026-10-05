import type { CSSProperties } from 'react';

import LightboxGallery from '@/components/Media/LightboxGallery';
import type { Category, Skill } from '@/data/resume/skills';

interface SkillTagProps {
  data: Skill;
  categories: Category[];
}

export default function SkillTag({ data, categories }: SkillTagProps) {
  const { category, gallery, title } = data;

  // Get the primary category color
  const categoryColor = categories.find((cat) =>
    category.includes(cat.name),
  )?.color;

  return (
    <span
      className="skill-tag skill-tag--md"
      style={
        {
          '--tag-color': categoryColor,
        } as CSSProperties
      }
    >
      <span className="skill-tag-name">{title}</span>
      {gallery && (
        <LightboxGallery
          images={gallery.images}
          triggerLabel={gallery.triggerLabel}
          dialogLabel={gallery.dialogLabel}
        />
      )}
    </span>
  );
}
