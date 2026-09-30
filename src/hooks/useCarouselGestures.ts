import { type PointerEvent, useRef, useState } from 'react';

interface DragStart {
  pointerId: number;
  x: number;
  captured: boolean;
}

interface CarouselGesturesOptions {
  enabled: boolean;
  onSwipe: (direction: -1 | 1) => void;
  canStart?: (event: PointerEvent<HTMLDivElement>) => boolean;
}

export function useCarouselGestures({
  enabled,
  onSwipe,
  canStart,
}: CarouselGesturesOptions) {
  const [dragX, setDragX] = useState(0);
  const dragStart = useRef<DragStart | null>(null);
  const suppressClickUntil = useRef(0);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (
      !enabled ||
      (event.pointerType === 'mouse' && event.button !== 0) ||
      (canStart && !canStart(event))
    ) {
      return;
    }

    dragStart.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      captured: false,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
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

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current?.pointerId !== event.pointerId) return;
    const distance = event.clientX - dragStart.current.x;
    const threshold = Math.min(80, event.currentTarget.clientWidth * 0.15);
    suppressClickUntil.current = Math.abs(distance) > 8 ? Date.now() + 350 : 0;
    dragStart.current = null;
    setDragX(0);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (Math.abs(distance) >= threshold) onSwipe(distance < 0 ? 1 : -1);
  };

  const onPointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current?.pointerId !== event.pointerId) return;
    dragStart.current = null;
    setDragX(0);
  };

  const onClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (Date.now() > suppressClickUntil.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickUntil.current = 0;
  };

  return {
    dragX,
    isDragging: dragX !== 0,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onClickCapture,
  };
}
