'use client';

import Image from 'next/image';
import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import type { LightboxImage } from '@/types/media';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.5;

interface LightboxGalleryProps {
  images: LightboxImage[];
  triggerLabel: string;
  dialogLabel: string;
}

export default function LightboxGallery({
  images,
  triggerLabel,
  dialogLabel,
}: LightboxGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const imageCount = images.length;
  const hasMultipleImages = imageCount > 1;
  const activeImage = images[activeIndex];

  const closeGallery = useCallback(() => {
    setIsOpen(false);
    setZoom(MIN_ZOOM);
  }, []);

  const showImage = useCallback(
    (index: number) => {
      if (!imageCount) return;

      setActiveIndex((index + imageCount) % imageCount);
      setZoom(MIN_ZOOM);
    },
    [imageCount],
  );

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeGallery();
      } else if (hasMultipleImages && event.key === 'ArrowLeft') {
        event.preventDefault();
        showImage(activeIndex - 1);
      } else if (hasMultipleImages && event.key === 'ArrowRight') {
        event.preventDefault();
        showImage(activeIndex + 1);
      }
    };

    document.addEventListener('keydown', handleDocumentKeyDown);
    return () => document.removeEventListener('keydown', handleDocumentKeyDown);
  }, [activeIndex, closeGallery, hasMultipleImages, isOpen, showImage]);

  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;

    const focusableElements =
      dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (!focusableElements?.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  if (!activeImage) return null;

  const imageWidth = `min(${activeImage.width * zoom}px, ${80 * zoom}vw, ${
    (activeImage.width / activeImage.height) * 78 * zoom
  }vh)`;
  const imageStyle = {
    '--lightbox-image-width': imageWidth,
  } as CSSProperties;

  const modal = isOpen ? (
    <div
      className="lightbox-gallery-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeGallery();
      }}
    >
      <div
        ref={dialogRef}
        className="lightbox-gallery-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleDialogKeyDown}
      >
        <div className="lightbox-gallery-toolbar">
          <div className="lightbox-gallery-heading">
            <h2 id={titleId}>{activeImage.title ?? dialogLabel}</h2>
            {hasMultipleImages && (
              <span aria-live="polite">
                {activeIndex + 1} of {imageCount}
              </span>
            )}
          </div>

          <div className="lightbox-gallery-actions" aria-label="Image controls">
            <button
              type="button"
              onClick={() =>
                setZoom((currentZoom) =>
                  Math.max(MIN_ZOOM, currentZoom - ZOOM_STEP),
                )
              }
              disabled={zoom === MIN_ZOOM}
              aria-label="Zoom out"
            >
              −
            </button>
            <button
              type="button"
              className="lightbox-gallery-zoom-level"
              onClick={() => setZoom(MIN_ZOOM)}
              aria-label="Reset zoom"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              onClick={() =>
                setZoom((currentZoom) =>
                  Math.min(MAX_ZOOM, currentZoom + ZOOM_STEP),
                )
              }
              disabled={zoom === MAX_ZOOM}
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              ref={closeButtonRef}
              type="button"
              className="lightbox-gallery-close"
              onClick={closeGallery}
              aria-label="Close image viewer"
            >
              ×
            </button>
          </div>
        </div>

        <div className="lightbox-gallery-viewport">
          <figure className="lightbox-gallery-figure" style={imageStyle}>
            <Image
              className="lightbox-gallery-image"
              src={activeImage.src}
              alt={activeImage.alt}
              width={activeImage.width}
              height={activeImage.height}
              sizes="80vw"
              draggable={false}
            />
            {activeImage.caption && (
              <figcaption>{activeImage.caption}</figcaption>
            )}
          </figure>
        </div>

        {hasMultipleImages && (
          <div className="lightbox-gallery-navigation">
            <button
              type="button"
              onClick={() => showImage(activeIndex - 1)}
              aria-label="View previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => showImage(activeIndex + 1)}
              aria-label="View next image"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="lightbox-gallery-trigger"
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
      >
        {triggerLabel}
      </button>
      {modal && createPortal(modal, document.body)}
    </>
  );
}
