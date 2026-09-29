'use client';

import { type CSSProperties, useRef, useState } from 'react';

import VideoPlayer from '@/components/Media/VideoPlayer';
import type { VideoData } from '@/types/media';

interface VideoGalleryProps {
  videos: VideoData[];
  label: string;
  showTitle?: boolean;
}

interface DragStart {
  pointerId: number;
  x: number;
  captured: boolean;
}

function slideOffset(index: number, activeIndex: number, count: number) {
  let offset = (index - activeIndex + count) % count;
  if (offset > count / 2) offset -= count;
  return offset;
}

export default function VideoGallery({
  videos,
  label,
  showTitle = true,
}: VideoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const galleryRef = useRef<HTMLElement>(null);
  const dragStart = useRef<DragStart | null>(null);
  const suppressClickUntil = useRef(0);
  const count = videos.length;

  if (count === 0) return null;

  const move = (direction: number) => {
    if (count < 2) return;
    setActiveIndex((current) => (current + direction + count) % count);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (count < 2 || (event.pointerType === 'mouse' && event.button !== 0)) {
      return;
    }

    const target = event.target as HTMLElement;
    if (target.closest('.video-player-play, .video-player-transcript')) {
      return;
    }
    if (target instanceof HTMLVideoElement) {
      const bounds = target.getBoundingClientRect();
      if (!target.paused || event.clientY > bounds.bottom - 48) return;
    }

    dragStart.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      captured: false,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStart.current?.pointerId !== event.pointerId) return;
    const distance = event.clientX - dragStart.current.x;
    if (Math.abs(distance) > 8) {
      event.preventDefault();
      if (!dragStart.current.captured) {
        event.currentTarget.setPointerCapture?.(event.pointerId);
        dragStart.current.captured = true;
      }
    }
    const limit = event.currentTarget.clientWidth * 0.6;
    setDragX(Math.max(-limit, Math.min(limit, distance)));
  };

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStart.current?.pointerId !== event.pointerId) return;
    const distance = event.clientX - dragStart.current.x;
    const threshold = Math.min(80, event.currentTarget.clientWidth * 0.15);
    suppressClickUntil.current = Math.abs(distance) > 8 ? Date.now() + 350 : 0;
    dragStart.current = null;
    setDragX(0);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (Math.abs(distance) >= threshold) move(distance < 0 ? 1 : -1);
  };

  const cancelDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStart.current?.pointerId !== event.pointerId) return;
    dragStart.current = null;
    setDragX(0);
  };

  return (
    <section
      ref={galleryRef}
      className="video-gallery"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={count > 1 ? 0 : undefined}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          move(event.key === 'ArrowRight' ? 1 : -1);
        }
      }}
    >
      {showTitle && (
        <div
          className="video-gallery-heading"
          aria-live="polite"
          aria-atomic="true"
        >
          <h3 className="video-gallery-title" key={videos[activeIndex].src}>
            {videos[activeIndex].title}
          </h3>
        </div>
      )}
      <div
        className={`video-gallery-viewport${dragStart.current ? ' is-dragging' : ''}`}
        style={{ '--drag-offset': `${dragX}px` } as CSSProperties}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={cancelDrag}
        onClickCapture={(event) => {
          if (Date.now() > suppressClickUntil.current) return;
          event.preventDefault();
          event.stopPropagation();
          suppressClickUntil.current = 0;
        }}
      >
        <div className="video-gallery-track">
          {videos.map((video, index) => {
            const offset = slideOffset(index, activeIndex, count);
            const active = offset === 0;
            const adjacent = Math.abs(offset) === 1;
            const slideStyle = {
              '--slide-offset': `${offset * 94}%`,
            } as CSSProperties;

            return (
              <div
                key={video.src}
                className={`video-gallery-slide${active ? ' is-active' : ''}${adjacent ? ' is-adjacent' : ''}`}
                style={slideStyle}
              >
                <div inert={!active} aria-hidden={!active}>
                  <VideoPlayer video={video} active={active} />
                </div>
                {adjacent && (
                  <button
                    className="video-gallery-select"
                    type="button"
                    aria-label={`Select ${video.title}`}
                    onClick={(event) => {
                      setActiveIndex(index);
                      if (event.detail === 0) galleryRef.current?.focus();
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      {count > 1 && (
        <div
          className="video-gallery-indicators"
          role="group"
          aria-label="Choose a video"
        >
          {videos.map((video, index) => (
            <button
              key={video.src}
              className={`video-gallery-indicator${index === activeIndex ? ' is-active' : ''}`}
              type="button"
              aria-label={`Show ${video.title} (${index + 1} of ${count})`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => setActiveIndex(index)}
            >
              <span
                className="video-gallery-indicator-mark"
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
