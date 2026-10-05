'use client';

import { type CSSProperties, useRef, useState } from 'react';
import VideoPlayer from '@/components/Media/VideoPlayer';
import { useCarouselGestures } from '@/hooks/useCarouselGestures';
import type { VideoData } from '@/types/media';

import CarouselIndicators from './CarouselIndicators';

interface VideoGalleryProps {
  videos: VideoData[];
  label: string;
  showTitle?: boolean;
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
  const galleryRef = useRef<HTMLElement>(null);
  const count = videos.length;

  const move = (direction: number) => {
    if (count < 2) return;
    setActiveIndex((current) => (current + direction + count) % count);
  };

  const gestures = useCarouselGestures({
    enabled: count > 1,
    onSwipe: move,
    canStart: (event) => {
      const target = event.target as HTMLElement;
      if (target.closest('.video-player-play, .video-player-transcript')) {
        return false;
      }
      if (target instanceof HTMLVideoElement) {
        const bounds = target.getBoundingClientRect();
        if (!target.paused || event.clientY > bounds.bottom - 48) return false;
      }
      return true;
    },
  });

  if (count === 0) return null;

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
        className={`video-gallery-viewport${gestures.isDragging ? ' is-dragging' : ''}`}
        style={{ '--drag-offset': `${gestures.dragX}px` } as CSSProperties}
        onPointerDown={gestures.onPointerDown}
        onPointerMove={gestures.onPointerMove}
        onPointerUp={gestures.onPointerUp}
        onPointerCancel={gestures.onPointerCancel}
        onClickCapture={gestures.onClickCapture}
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
        <CarouselIndicators
          items={videos.map((video, index) => ({
            key: video.src,
            label: `Show ${video.title} (${index + 1} of ${count})`,
          }))}
          activeIndex={activeIndex}
          groupLabel="Choose a video"
          onSelect={setActiveIndex}
        />
      )}
    </section>
  );
}
