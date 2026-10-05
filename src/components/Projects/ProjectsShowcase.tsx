'use client';

import { useEffect, useRef, useState } from 'react';

import CategoryButton from '@/components/Resume/Skills/CategoryButton';
import projects, { projectCategories } from '@/data/projects';

import ProjectCarousel from './ProjectCarousel';

const filters = ['All', ...projectCategories] as const;
type ProjectFilter = (typeof filters)[number];

export default function ProjectsShowcase() {
  const [activeCategory, setActiveCategory] = useState<ProjectFilter>('All');
  const controlsRef = useRef<HTMLDivElement>(null);
  const visibleProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  useEffect(() => {
    const controls = controlsRef.current;
    const activeButton = controls?.querySelector<HTMLButtonElement>(
      '[aria-pressed="true"]',
    );
    if (!controls || !activeButton || typeof controls.scrollTo !== 'function') {
      return;
    }
    controls.scrollTo({
      behavior: 'auto',
      left: Math.max(
        0,
        activeButton.offsetLeft -
          (controls.clientWidth - activeButton.offsetWidth) / 2,
      ),
    });
  }, [activeCategory]);

  return (
    <div className="projects-showcase">
      <div
        ref={controlsRef}
        className="skill-button-container projects-category-controls"
        role="group"
        aria-label="Project categories"
      >
        {filters.map((category) => (
          <CategoryButton
            key={category}
            label={category}
            isActive={activeCategory === category}
            handleClick={(label) => setActiveCategory(label as ProjectFilter)}
          />
        ))}
      </div>
      <div className="projects-category-heading" aria-live="polite">
        <h2>{activeCategory === 'All' ? 'All projects' : activeCategory}</h2>
        <span>{visibleProjects.length} placeholders</span>
      </div>
      <ProjectCarousel
        key={activeCategory}
        projects={visibleProjects}
        category={activeCategory}
      />
    </div>
  );
}
