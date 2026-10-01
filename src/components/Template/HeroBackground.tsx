'use client';

import { useEffect, useRef } from 'react';

export default function HeroBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const background = backgroundRef.current;
    const enabled = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    if (!background) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      background.dataset.active = 'false';
    };
    const move = (event: PointerEvent) => {
      if (!enabled.matches || event.pointerType === 'touch') return;
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        background.style.setProperty('--pointer-x', `${x}px`);
        background.style.setProperty('--pointer-y', `${y}px`);
        background.dataset.active = 'true';
        frame = 0;
      });
    };

    document.addEventListener('pointermove', move);
    document.documentElement.addEventListener('pointerleave', reset);
    enabled.addEventListener('change', reset);
    document.addEventListener('visibilitychange', reset);
    return () => {
      reset();
      document.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', reset);
      enabled.removeEventListener('change', reset);
      document.removeEventListener('visibilitychange', reset);
    };
  }, []);

  return (
    <div className="hero-bg" aria-hidden="true" ref={backgroundRef}>
      <div className="hero-dot-grid" />
      <div className="hero-dot-spotlight" />
    </div>
  );
}
