import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import DetailContent from '../../Portfolio/DetailContent';

const image = {
  src: '/images/projects/robot.webp',
  alt: 'Robot prototype',
  width: 1200,
  height: 800,
  caption: 'Prototype view',
};

describe('DetailContent', () => {
  it('renders stable, unique heading anchors', () => {
    render(<DetailContent content={'## Overview\n\n## Overview'} media={{}} />);
    expect(
      screen.getAllByRole('heading', { name: 'Overview' })[0],
    ).toHaveAttribute('id', 'overview');
    expect(
      screen.getAllByRole('heading', { name: 'Overview' })[1],
    ).toHaveAttribute('id', 'overview-2');
  });

  it('renders named images with alt text and captions', () => {
    render(
      <DetailContent
        content={'<ImageBlock id="prototype" />'}
        media={{ images: { prototype: image } }}
      />,
    );
    expect(
      screen.getByRole('img', { name: 'Robot prototype' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Prototype view')).toBeInTheDocument();
  });

  it('renders a named gallery as thumbnails that open the lightbox', () => {
    render(
      <DetailContent
        content={'<Gallery id="prototype" />'}
        media={{
          galleries: {
            prototype: [
              image,
              {
                ...image,
                src: '/images/projects/robot-side.webp',
                alt: 'Robot side view',
              },
            ],
          },
        }}
      />,
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'View image 2: Robot side view' }),
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Robot side view' }),
    ).toBeInTheDocument();
  });
});
