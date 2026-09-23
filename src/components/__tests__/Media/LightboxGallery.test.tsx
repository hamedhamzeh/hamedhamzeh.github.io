import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LightboxGallery from '../../Media/LightboxGallery';

const images = [
  {
    src: '/images/report-one.webp',
    alt: 'First report',
    width: 1200,
    height: 1600,
    title: 'First report title',
  },
  {
    src: '/images/report-two.webp',
    alt: 'Second report',
    width: 1200,
    height: 1600,
    title: 'Second report title',
  },
];

describe('LightboxGallery', () => {
  it('opens the selected thumbnail and restores focus to it', () => {
    render(
      <LightboxGallery
        images={images}
        triggerLabel="Prototype gallery"
        dialogLabel="Prototype gallery"
        display="grid"
      />,
    );

    const secondThumbnail = screen.getByRole('button', {
      name: 'View image 2: Second report',
    });
    fireEvent.click(secondThumbnail);
    expect(
      screen.getByRole('img', { name: 'Second report' }),
    ).toBeInTheDocument();
    expect(screen.getByText('2 of 2')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(secondThumbnail).toHaveFocus();
  });
  it('opens a single image without gallery navigation', () => {
    render(
      <LightboxGallery
        images={[images[0]]}
        triggerLabel="View report"
        dialogLabel="Score report"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'View report' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'First report' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'View next image' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('1 of 1')).not.toBeInTheDocument();
  });

  it('closes with the close button and restores trigger focus', () => {
    render(
      <LightboxGallery
        images={[images[0]]}
        triggerLabel="View report"
        dialogLabel="Score report"
      />,
    );

    const trigger = screen.getByRole('button', { name: 'View report' });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: 'Close image viewer' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes on Escape and backdrop click', () => {
    render(
      <LightboxGallery
        images={[images[0]]}
        triggerLabel="View report"
        dialogLabel="Score report"
      />,
    );

    const trigger = screen.getByRole('button', { name: 'View report' });
    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.click(trigger);
    const backdrop = document.querySelector('.lightbox-gallery-backdrop');
    fireEvent.click(backdrop!);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('navigates a multi-image gallery with controls and arrow keys', () => {
    render(
      <LightboxGallery
        images={images}
        triggerLabel="View gallery"
        dialogLabel="Project gallery"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'View gallery' }));
    expect(screen.getByText('1 of 2')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'View next image' }));
    expect(
      screen.getByRole('img', { name: 'Second report' }),
    ).toBeInTheDocument();
    expect(screen.getByText('2 of 2')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(
      screen.getByRole('img', { name: 'First report' }),
    ).toBeInTheDocument();
  });

  it('supports zooming and resets zoom when changing images', () => {
    render(
      <LightboxGallery
        images={images}
        triggerLabel="View gallery"
        dialogLabel="Project gallery"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'View gallery' }));
    fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
    expect(
      screen.getByRole('button', { name: 'Reset zoom' }),
    ).toHaveTextContent('150%');

    fireEvent.click(screen.getByRole('button', { name: 'View next image' }));
    expect(
      screen.getByRole('button', { name: 'Reset zoom' }),
    ).toHaveTextContent('100%');
  });

  it('locks page scrolling while open', () => {
    render(
      <LightboxGallery
        images={[images[0]]}
        triggerLabel="View report"
        dialogLabel="Score report"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'View report' }));
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.click(screen.getByRole('button', { name: 'Close image viewer' }));
    expect(document.body.style.overflow).toBe('');
  });
});
