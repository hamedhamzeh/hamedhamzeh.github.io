'use client';

import { useEffect, useRef } from 'react';

interface IndicatorItem {
  key: string;
  label: string;
}

interface CarouselIndicatorsProps {
  items: IndicatorItem[];
  activeIndex: number;
  groupLabel: string;
  onSelect: (index: number) => void;
  variant?: 'video' | 'project';
}

export default function CarouselIndicators({
  items,
  activeIndex,
  groupLabel,
  onSelect,
  variant = 'video',
}: CarouselIndicatorsProps) {
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controls = controlsRef.current;
    const activeButton =
      controls?.querySelector<HTMLButtonElement>('.is-active');
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
  }, [activeIndex]);

  const legacyPrefix =
    variant === 'video' ? 'video-gallery' : 'project-carousel';

  return (
    <div
      ref={controlsRef}
      className={`carousel-indicators ${legacyPrefix}-indicators`}
      role="group"
      aria-label={groupLabel}
    >
      {items.map((item, index) => (
        <button
          key={item.key}
          className={`carousel-indicator ${legacyPrefix}-indicator${index === activeIndex ? ' is-active' : ''}`}
          type="button"
          aria-label={item.label}
          aria-current={index === activeIndex ? 'true' : undefined}
          onClick={() => onSelect(index)}
        >
          <span
            className={`carousel-indicator-mark ${legacyPrefix}-indicator-mark`}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
}
