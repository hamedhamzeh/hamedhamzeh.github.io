'use client';

import { useEffect, useRef } from 'react';

interface Point {
  u: number;
  v: number;
  phase: number;
  dx: number;
  dy: number;
  x: number;
  y: number;
}

const TRACKING_INTERVAL = 40 / 9;
const TRACKING_DURATION = 2.5;

export default function HeroBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const background = backgroundRef.current;
    const canvas = canvasRef.current;
    if (!background || !canvas) return;
    const motion = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    let points: Point[] = [];
    let context: CanvasRenderingContext2D | null = null;
    let frame = 0;
    let lastTime = 0;
    let elapsed = 0;
    let width = 0;
    let height = 0;
    let color = '';
    let visible = true;
    let pointer: { x: number; y: number } | null = null;
    let contentBounds: DOMRect | undefined;

    const updateColor = () => {
      color = getComputedStyle(canvas).color;
    };
    const resize = () => {
      const bounds = background.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const pointCount =
        window.innerWidth <= 736 ? 150 : window.innerWidth <= 1024 ? 250 : 400;
      if (points.length !== pointCount) {
        points = Array.from(
          { length: pointCount },
          (_, index) =>
            points[index] ?? {
              u: (index * 0.61803398875 + 0.13) % 1,
              v: (index * 0.41421356237 + 0.21) % 1,
              phase: index * 2.39996,
              dx: 0,
              dy: 0,
              x: 0,
              y: 0,
            },
        );
      }
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context?.setTransform(scale, 0, 0, scale, 0, 0);
      contentBounds = background.parentElement
        ?.querySelector('.hero-content')
        ?.getBoundingClientRect();
      updateColor();
    };
    const emphasis = (point: Point): number => {
      if (!contentBounds) return 1;
      return point.x > contentBounds.left - 20 &&
        point.x < contentBounds.right + 20 &&
        point.y > contentBounds.top - 20 &&
        point.y < contentBounds.bottom + 20
        ? 0.25
        : 1;
    };
    const draw = (time: number) => {
      frame = 0;
      if (!context || !motion.matches || document.hidden || !visible) return;
      if (lastTime && time - lastTime < 32) {
        frame = requestAnimationFrame(draw);
        return;
      }
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.06) : 1 / 30;
      lastTime = time;
      elapsed += dt;
      context.clearRect(0, 0, width, height);
      context.fillStyle = color;
      context.strokeStyle = color;
      context.lineWidth = 0.8;
      for (const point of points) {
        const baseX =
          point.u * width + Math.sin(elapsed * 0.2 + point.phase) * 22;
        const baseY =
          point.v * height + Math.cos(elapsed * 0.15 + point.phase) * 18;
        let targetX = 0;
        let targetY = 0;
        if (pointer) {
          const x = baseX - pointer.x;
          const y = baseY - pointer.y;
          const distance = Math.hypot(x, y);
          if (distance > 0 && distance < 170) {
            const force = 38 * (1 - distance / 170) ** 2;
            targetX = (x / distance) * force;
            targetY = (y / distance) * force;
          }
        }
        const ease = 1 - Math.exp(-dt * 7);
        point.dx += (targetX - point.dx) * ease;
        point.dy += (targetY - point.dy) * ease;
        point.x = baseX + point.dx;
        point.y = baseY + point.dy;
        const proximity = pointer
          ? Math.max(
              0,
              1 - Math.hypot(point.x - pointer.x, point.y - pointer.y) / 230,
            )
          : 0;
        context.globalAlpha = (0.35 + proximity * 0.45) * emphasis(point);
        context.beginPath();
        context.arc(point.x, point.y, 1.6 + proximity * 0.8, 0, Math.PI * 2);
        context.fill();
      }
      if (pointer) {
        for (let i = 0; i < points.length; i++) {
          const a = points[i];
          const proximity = Math.max(
            0,
            1 - Math.hypot(a.x - pointer.x, a.y - pointer.y) / 240,
          );
          if (!proximity) continue;
          for (let j = i + 1; j < points.length; j++) {
            const b = points[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distanceSquared = dx * dx + dy * dy;
            if (distanceSquared > 155 * 155) continue;
            const distance = Math.sqrt(distanceSquared);
            context.globalAlpha =
              proximity *
              (1 - distance / 155) *
              0.5 *
              Math.min(emphasis(a), emphasis(b));
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.stroke();
          }
        }
      }
      // Fade one tracking box in and out per cycle.
      const bracketInterval = TRACKING_INTERVAL;
      const bracketStart = Math.min(2, bracketInterval - TRACKING_DURATION);
      const phase = elapsed % bracketInterval;
      if (phase > bracketStart && phase < bracketStart + TRACKING_DURATION) {
        const point =
          points[
            (Math.floor(elapsed / bracketInterval) * 13 + 7) % points.length
          ];
        context.globalAlpha =
          Math.sin(((phase - bracketStart) / TRACKING_DURATION) * Math.PI) *
          0.65 *
          emphasis(point);
        context.beginPath();
        for (const x of [-1, 1]) {
          for (const y of [-1, 1]) {
            context.moveTo(point.x + x * 7, point.y + y * 13);
            context.lineTo(point.x + x * 13, point.y + y * 13);
            context.lineTo(point.x + x * 13, point.y + y * 7);
          }
        }
        context.stroke();
      }
      frame = requestAnimationFrame(draw);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      background.dataset.animated = 'false';
      if (!motion.matches || document.hidden || !visible) {
        pointer = null;
        return;
      }
      context ??= canvas.getContext('2d');
      if (!context) return;
      resize();
      background.dataset.animated = 'true';
      frame = requestAnimationFrame(draw);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'touch')
        pointer = { x: event.clientX, y: event.clientY };
    };
    const leave = () => {
      pointer = null;
    };
    const scroll = () => {
      leave();
      contentBounds = background.parentElement
        ?.querySelector('.hero-content')
        ?.getBoundingClientRect();
    };
    const themeObserver = new MutationObserver(updateColor);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    if (background.parentElement)
      visibilityObserver.observe(background.parentElement);
    window.addEventListener('resize', sync);
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('blur', leave);
    document.addEventListener('pointermove', move);
    document.documentElement.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    sync();
    return () => {
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener('resize', sync);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('blur', leave);
      document.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', sync);
      motion.removeEventListener('change', sync);
    };
  }, []);

  return (
    <div className="hero-bg" aria-hidden="true" ref={backgroundRef}>
      <div className="hero-vision-fallback" />
      <canvas className="hero-vision-field" ref={canvasRef} />
    </div>
  );
}
