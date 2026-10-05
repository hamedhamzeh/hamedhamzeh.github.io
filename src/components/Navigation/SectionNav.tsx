'use client';

import { useEffect, useRef, useState } from 'react';

export interface SectionNavItem {
  id: string;
  name: string;
}

interface SectionNavProps {
  ariaLabel: string;
  initialActiveId?: string;
  items: readonly SectionNavItem[];
}

const INTERSECTION_MARGIN = '-20% 0px -75% 0px';

export default function SectionNav({
  ariaLabel,
  initialActiveId,
  items,
}: SectionNavProps) {
  const [activeSection, setActiveSection] = useState(
    initialActiveId ?? items[0]?.id ?? '',
  );
  const observerRef = useRef<IntersectionObserver | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        const targetEntry =
          visibleEntries.length > 0
            ? visibleEntries.reduce((previous, current) =>
                current.intersectionRatio > previous.intersectionRatio
                  ? current
                  : previous,
              )
            : entries.reduce<IntersectionObserverEntry | null>(
                (closest, current) => {
                  if (!closest) {
                    return current;
                  }

                  return Math.abs(current.boundingClientRect.top) <
                    Math.abs(closest.boundingClientRect.top)
                    ? current
                    : closest;
                },
                null,
              );

        if (
          targetEntry &&
          items.some((item) => item.id === targetEntry.target.id)
        ) {
          setActiveSection(targetEntry.target.id);
        }
      },
      {
        rootMargin: INTERSECTION_MARGIN,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const { id } of items) {
      const element = document.getElementById(id);
      if (element) {
        observerRef.current.observe(element);
      }
    }

    return () => observerRef.current?.disconnect();
  }, [items]);

  useEffect(() => {
    const nav = navRef.current;
    const activeLink = linkRefs.current.get(activeSection);
    if (!nav || !activeLink || typeof nav.scrollTo !== 'function') {
      return;
    }

    const prefersReducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    nav.scrollTo({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      left: Math.max(
        0,
        activeLink.offsetLeft - (nav.clientWidth - activeLink.offsetWidth) / 2,
      ),
    });
  }, [activeSection]);

  return (
    <nav ref={navRef} className="section-nav" aria-label={ariaLabel}>
      {items.map((item) => (
        <a
          key={item.id}
          ref={(element) => {
            if (element) {
              linkRefs.current.set(item.id, element);
            } else {
              linkRefs.current.delete(item.id);
            }
          }}
          href={`#${item.id}`}
          className={`section-nav-link ${activeSection === item.id ? 'active' : ''}`}
          aria-current={activeSection === item.id ? 'location' : undefined}
        >
          {item.name}
        </a>
      ))}
    </nav>
  );
}
