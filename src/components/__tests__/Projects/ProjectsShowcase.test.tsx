import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ProjectsShowcase from '../../Projects/ProjectsShowcase';

const originalWidth = window.innerWidth;

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: originalWidth,
  });
});

function resizeTo(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: width,
  });
  fireEvent(window, new Event('resize'));
}

describe('ProjectsShowcase', () => {
  it('uses a readable range and arrow controls when there are many positions', () => {
    resizeTo(390);
    render(<ProjectsShowcase />);

    expect(
      screen.queryByRole('group', { name: 'Choose visible projects' }),
    ).toBeNull();
    expect(screen.getByText('1 of 11')).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Previous projects' }),
    ).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Next projects' }));
    expect(screen.getByText('2 of 11')).toBeVisible();

    resizeTo(1280);
    expect(screen.getByText('2–4 of 11')).toBeVisible();
  });

  it('filters the requested placeholder categories', () => {
    resizeTo(1280);
    const { container } = render(<ProjectsShowcase />);
    expect(container.querySelectorAll('.project-carousel-slide')).toHaveLength(
      11,
    );

    const controls = screen.getByRole('group', { name: 'Project categories' });
    for (const [category, count] of [
      ['Computer Vision', 5],
      ['Robotics', 2],
      ['Front-end', 2],
      ['MLOps', 1],
      ['ML Projects', 1],
    ] as const) {
      fireEvent.click(within(controls).getByRole('button', { name: category }));
      expect(screen.getByRole('heading', { name: category })).toBeVisible();
      expect(
        container.querySelectorAll('.project-carousel-slide'),
      ).toHaveLength(count);
    }
  });

  it('shows three, two, then one card as the viewport narrows', () => {
    resizeTo(1280);
    const { container } = render(<ProjectsShowcase />);
    fireEvent.click(screen.getByRole('button', { name: 'Computer Vision' }));

    const slides = () => container.querySelectorAll('.project-carousel-slide');
    const indicators = () =>
      screen.getAllByRole('button', { name: /^Show projects / });
    expect(indicators()).toHaveLength(3);
    expect(
      [...slides()].filter(
        (slide) => slide.getAttribute('aria-hidden') === 'false',
      ),
    ).toHaveLength(3);

    resizeTo(800);
    expect(indicators()).toHaveLength(4);
    expect(
      [...slides()].filter(
        (slide) => slide.getAttribute('aria-hidden') === 'false',
      ),
    ).toHaveLength(2);

    resizeTo(390);
    expect(indicators()).toHaveLength(5);
    expect(screen.getByText('1 of 5')).toBeVisible();
    expect(
      [...slides()].filter(
        (slide) => slide.getAttribute('aria-hidden') === 'false',
      ),
    ).toHaveLength(1);

    fireEvent.click(
      screen.getByRole('button', { name: 'Show projects 3 to 3 of 5' }),
    );
    expect(slides()[2]).toHaveAttribute('aria-hidden', 'false');
    expect(slides()[0]).toHaveAttribute('aria-hidden', 'true');
  });

  it('moves between cards with keyboard arrows and a pointer swipe', () => {
    resizeTo(390);
    const { container } = render(<ProjectsShowcase />);
    fireEvent.click(screen.getByRole('button', { name: 'Computer Vision' }));

    const carousel = screen.getByRole('region', {
      name: 'Computer Vision projects',
    });
    carousel.focus();
    fireEvent.keyDown(carousel, { key: 'ArrowRight' });
    expect(
      screen.getByRole('button', { name: 'Show projects 2 to 2 of 5' }),
    ).toHaveAttribute('aria-current', 'true');

    const viewport = container.querySelector('.project-carousel-viewport');
    expect(viewport).not.toBeNull();
    Object.defineProperty(viewport, 'clientWidth', {
      configurable: true,
      value: 320,
    });
    fireEvent.pointerDown(viewport!, {
      pointerId: 1,
      pointerType: 'touch',
      clientX: 250,
    });
    fireEvent.pointerMove(viewport!, {
      pointerId: 1,
      pointerType: 'touch',
      clientX: 120,
    });
    fireEvent.pointerUp(viewport!, {
      pointerId: 1,
      pointerType: 'touch',
      clientX: 120,
    });
    expect(
      screen.getByRole('button', { name: 'Show projects 3 to 3 of 5' }),
    ).toHaveAttribute('aria-current', 'true');
  });
});
