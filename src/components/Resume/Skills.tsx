'use client';

import type { CSSProperties } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { Category, Skill } from '@/data/resume/skills';

import CategoryButton from './Skills/CategoryButton';
import SkillTag from './Skills/SkillTag';

interface SkillsProps {
  skills: Skill[];
  categories: Category[];
  defaultCategory?: string;
}

export default function Skills({
  skills,
  categories,
  defaultCategory = 'All',
}: SkillsProps) {
  const controlsRef = useRef<HTMLDivElement>(null);
  const categoryNames = useMemo(
    () => ['All', ...categories.map(({ name }) => name)],
    [categories],
  );
  const [activeCategory, setActiveCategory] = useState(() =>
    categoryNames.includes(defaultCategory) ? defaultCategory : 'All',
  );

  // Memoize button elements to avoid recreation on every render
  const buttonElements = useMemo(
    () =>
      categoryNames.map((categoryName) => (
        <CategoryButton
          label={categoryName}
          key={categoryName}
          isActive={activeCategory === categoryName}
          handleClick={setActiveCategory}
        />
      )),
    [activeCategory, categoryNames],
  );

  useEffect(() => {
    const controls = controlsRef.current;
    const activeButton = controlsRef.current?.querySelector<HTMLButtonElement>(
      '[aria-pressed="true"]',
    );

    if (!controls || !activeButton || typeof controls.scrollTo !== 'function') {
      return;
    }

    const prefersReducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    controls.scrollTo({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      left: Math.max(
        0,
        activeButton.offsetLeft -
          (controls.clientWidth - activeButton.offsetWidth) / 2,
      ),
    });
  }, [activeCategory]);

  // Memoize sorting, filtering, and grouping to avoid recalculating on every render
  const groupedSkills = useMemo(() => {
    // Preserve the authored order from the resume data while filtering.
    const filteredSkills = skills.filter(
      (skill) =>
        activeCategory === 'All' || skill.category.includes(activeCategory),
    );

    // Group skills by their primary category for grouped view
    if (activeCategory === 'All') {
      return categories.reduce(
        (groups, category) => {
          const categorySkills = filteredSkills.filter((skill) =>
            skill.category.includes(category.name),
          );
          if (categorySkills.length > 0) {
            groups[category.name] = categorySkills;
          }
          return groups;
        },
        {} as Record<string, Skill[]>,
      );
    }
    return { [activeCategory]: filteredSkills };
  }, [skills, categories, activeCategory]);

  return (
    <div className="skills">
      <h2 className="section-title">Skills</h2>
      <div
        ref={controlsRef}
        className="skill-button-container"
        role="group"
        aria-label="Skill categories"
      >
        {buttonElements}
      </div>
      <div className="skill-groups">
        {Object.entries(groupedSkills).map(([categoryName, categorySkills]) => {
          const category = categories.find((c) => c.name === categoryName);
          // Pass color via CSS custom property for design system consistency
          const titleStyle = {
            '--skill-category-color': category?.color,
          } as CSSProperties;
          return (
            <div key={categoryName} className="skill-group">
              <h3 className="skill-group-title" style={titleStyle}>
                {categoryName}
              </h3>
              <div className="skill-tags">
                {categorySkills.map((skill) => (
                  <SkillTag
                    key={skill.title}
                    data={skill}
                    categories={categories}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
