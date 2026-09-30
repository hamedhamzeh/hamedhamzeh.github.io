'use client';

import { useEffect, useRef, useState } from 'react';

import CarouselIndicators from '@/components/Media/CarouselIndicators';
import type { ProjectPlaceholder } from '@/data/projects';
import { useCarouselGestures } from '@/hooks/useCarouselGestures';

import PlaceholderCard from './PlaceholderCard';

interface ProjectCarouselProps {
  projects: ProjectPlaceholder[];
  category: string;
}

function cardsPerView(width: number): number {
  if (width >= 1000) return 3;
  if (width >= 600) return 2;
  return 1;
}

export default function ProjectCarousel({
  projects,
  category,
}: ProjectCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [step, setStep] = useState(0);
  const [requestedStart, setRequestedStart] = useState(0);
  const maxStart = Math.max(0, projects.length - visibleCount);
  const activeStart = Math.min(requestedStart, maxStart);

  useEffect(() => {
    const updateLayout = () => {
      setVisibleCount(cardsPerView(window.innerWidth));
      const track = trackRef.current;
      const firstSlide = track?.firstElementChild;
      if (!track || !firstSlide) return;
      const gap =
        Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
      setStep(firstSlide.getBoundingClientRect().width + gap);
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(updateLayout);
    if (viewportRef.current) observer?.observe(viewportRef.current);
    return () => {
      window.removeEventListener('resize', updateLayout);
      observer?.disconnect();
    };
  }, []);

  const move = (direction: -1 | 1) => {
    setRequestedStart((current) =>
      Math.max(0, Math.min(current + direction, maxStart)),
    );
  };
  const gestures = useCarouselGestures({
    enabled: maxStart > 0,
    onSwipe: move,
  });

  const indicators = Array.from({ length: maxStart + 1 }, (_, index) => ({
    key: String(index),
    label: `Show projects ${index + 1} to ${Math.min(index + visibleCount, projects.length)} of ${projects.length}`,
  }));
  const visibleFrom = activeStart + 1;
  const visibleTo = Math.min(activeStart + visibleCount, projects.length);
  const position =
    visibleFrom === visibleTo
      ? `${visibleFrom} of ${projects.length}`
      : `${visibleFrom}–${visibleTo} of ${projects.length}`;

  return (
    <section
      className={`project-carousel${maxStart === 0 ? ' is-contained' : ''}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${category} projects`}
      tabIndex={maxStart > 0 ? 0 : undefined}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          move(event.key === 'ArrowRight' ? 1 : -1);
        }
      }}
    >
      <div
        ref={viewportRef}
        className={`project-carousel-viewport${gestures.isDragging ? ' is-dragging' : ''}`}
        onPointerDown={gestures.onPointerDown}
        onPointerMove={gestures.onPointerMove}
        onPointerUp={gestures.onPointerUp}
        onPointerCancel={gestures.onPointerCancel}
        onClickCapture={gestures.onClickCapture}
      >
        <div
          ref={trackRef}
          className="project-carousel-track"
          style={{
            transform: `translate3d(${gestures.dragX - activeStart * step}px, 0, 0)`,
          }}
        >
          {projects.map((project, index) => {
            const visible =
              index >= activeStart && index < activeStart + visibleCount;
            return (
              <div
                key={project.id}
                className="project-carousel-slide"
                aria-hidden={!visible}
                inert={!visible}
              >
                <PlaceholderCard data={project} />
              </div>
            );
          })}
        </div>
      </div>
      {maxStart > 0 &&
        (indicators.length <= 6 ? (
          <div className="project-carousel-footer">
            <CarouselIndicators
              items={indicators}
              activeIndex={activeStart}
              groupLabel="Choose visible projects"
              onSelect={setRequestedStart}
              variant="project"
            />
            <output className="project-carousel-position" aria-live="polite">
              {position}
            </output>
          </div>
        ) : (
          <div
            className="project-carousel-range-controls"
            role="group"
            aria-label="Navigate projects"
          >
            <button
              type="button"
              aria-label="Previous projects"
              disabled={activeStart === 0}
              onClick={() => move(-1)}
            >
              <span aria-hidden="true">←</span>
            </button>
            <output className="project-carousel-position" aria-live="polite">
              {position}
            </output>
            <button
              type="button"
              aria-label="Next projects"
              disabled={activeStart === maxStart}
              onClick={() => move(1)}
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        ))}
    </section>
  );
}
