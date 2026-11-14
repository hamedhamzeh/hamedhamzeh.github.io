'use client';

import { useEffect, useRef, useState } from 'react';

import CategoryButton from '@/components/Resume/Skills/CategoryButton';
import placeholders, {
  type ProjectShowcaseEntry,
  projectCategories,
} from '@/data/projects';

import ProjectCarousel from './ProjectCarousel';

const filters = ['All', ...projectCategories] as const;
type ProjectFilter = (typeof filters)[number];

function filterHash(category: ProjectFilter): string {
  return category === 'All'
    ? ''
    : `#${category.toLowerCase().replaceAll(' ', '-')}`;
}

const leadingProjects: Partial<Record<ProjectFilter, string[]>> = {
  'Computer Vision': [
    'contact-anchored-soccer-ball-mapping',
    'soccer-action-detection',
    'soccer-team-role-assignment',
  ],
  Robotics: ['whole-body-rehabilitation-device'],
};

function projectDate(project: ProjectShowcaseEntry): string {
  return ('date' in project && project.date) || '';
}

export default function ProjectsShowcase({
  projects = placeholders,
}: {
  projects?: ProjectShowcaseEntry[];
}) {
  const [activeCategory, setActiveCategory] = useState<ProjectFilter>('All');
  const [initialView, setInitialView] = useState(true);
  const controlsRef = useRef<HTMLDivElement>(null);
  const leading = leadingProjects[activeCategory] ?? [];
  const visibleProjects = projects.filter(
    (project) =>
      activeCategory === 'All' || project.category === activeCategory,
  );
  visibleProjects.sort(
    (a, b) =>
      Number(leading.includes(b.id)) - Number(leading.includes(a.id)) ||
      projectDate(b).localeCompare(projectDate(a)),
  );

  useEffect(() => {
    const selectLinkedCategory = () => {
      const category = filters.find(
        (filter) => filterHash(filter) === window.location.hash,
      );
      setActiveCategory(category ?? 'All');
      if (category && category !== 'All') setInitialView(false);
    };

    selectLinkedCategory();
    window.addEventListener('hashchange', selectLinkedCategory);
    return () => window.removeEventListener('hashchange', selectLinkedCategory);
  }, []);

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
            handleClick={() => {
              if (category !== activeCategory) setInitialView(false);
              setActiveCategory(category);
              const url = new URL(window.location.href);
              url.hash = filterHash(category);
              if (url.hash !== window.location.hash) {
                window.history.replaceState(window.history.state, '', url);
              }
            }}
          />
        ))}
      </div>
      <div className="projects-category-heading" aria-live="polite">
        <h2>{activeCategory === 'All' ? 'All projects' : activeCategory}</h2>
        <span>
          {visibleProjects.length}{' '}
          {visibleProjects.length === 1 ? 'project' : 'projects'}
        </span>
      </div>
      {activeCategory === 'Front-end' && (
        <p className="projects-category-note">
          These projects are a little time capsule from my front-end learning
          days, before AI made coding much easier. Back then, one stubborn CSS
          bug could keep me company all evening. Have a click around!
        </p>
      )}
      <ProjectCarousel
        key={activeCategory}
        projects={visibleProjects}
        category={activeCategory}
        prioritizeFirstPoster={initialView && activeCategory === 'All'}
      />
    </div>
  );
}
