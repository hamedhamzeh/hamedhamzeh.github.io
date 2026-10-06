'use client';

import {
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';

// Selector for focusable elements within the menu
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface SlideMenuProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  position?: 'left' | 'right';
  returnFocusRef?: RefObject<HTMLElement | null>;
}

/**
 * Accessible slide-out menu panel.
 * Features: focus trapping, focus restoration, escape-to-close,
 * scroll locking without moving the page, reduced-motion support via CSS.
 */
export default function SlideMenu({
  id,
  isOpen,
  onClose,
  children,
  position = 'right',
  returnFocusRef,
}: SlideMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Preserve the body's layout and sticky elements while blocking background scroll.
  useLayoutEffect(() => {
    if (!isOpen) return;

    const { documentElement } = document;
    const rootOverflow = documentElement.style.overflow;
    documentElement.style.overflow = 'hidden';

    // Also block background touch gestures on Safari, without blocking menu scroll.
    const blockBackgroundTouch = (event: TouchEvent) => {
      if (!menuRef.current?.contains(event.target as Node))
        event.preventDefault();
    };
    document.addEventListener('touchmove', blockBackgroundTouch, {
      passive: false,
    });

    return () => {
      documentElement.style.overflow = rootOverflow;
      document.removeEventListener('touchmove', blockBackgroundTouch);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus management: trap focus and restore on close
  useEffect(() => {
    if (isOpen) {
      // Save currently focused element
      previousActiveElement.current =
        returnFocusRef?.current ?? (document.activeElement as HTMLElement);

      // Focus first focusable element in menu
      const focusableElements =
        menuRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusableElements?.length) {
        focusableElements[0].focus({ preventScroll: true });
      }
    } else if (previousActiveElement.current) {
      // Restore focus when closing
      previousActiveElement.current.focus({ preventScroll: true });
      previousActiveElement.current = null;
    }
  }, [isOpen, returnFocusRef]);

  // Focus trapping
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const focusableElements =
      menuRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

    if (!focusableElements?.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus({ preventScroll: true });
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus({ preventScroll: true });
    }
  }, []);

  return (
    <>
      {/* Overlay - click to close */}
      <div
        className={`slide-menu-overlay${isOpen ? ' slide-menu-overlay--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Menu panel */}
      <div
        ref={menuRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`slide-menu slide-menu--${position}${isOpen ? ' slide-menu--open' : ''}`}
        aria-hidden={!isOpen}
        inert={!isOpen}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </>
  );
}
