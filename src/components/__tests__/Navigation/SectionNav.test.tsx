import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SectionNav from '../../Navigation/SectionNav';

const sections = [
  { name: 'Experience', id: 'experience' },
  { name: 'Education', id: 'education' },
  { name: 'Skills', id: 'skills' },
] as const;

describe('SectionNav', () => {
  it('renders the supplied navigation label and section links', () => {
    render(
      <SectionNav
        items={sections}
        ariaLabel="Resume sections"
        initialActiveId="experience"
      />,
    );

    const nav = screen.getByRole('navigation', { name: 'Resume sections' });
    expect(nav).toHaveClass('section-nav');
    expect(screen.getByRole('link', { name: 'Experience' })).toHaveAttribute(
      'href',
      '#experience',
    );
    expect(screen.getByRole('link', { name: 'Education' })).toHaveAttribute(
      'href',
      '#education',
    );
    expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute(
      'href',
      '#skills',
    );
  });

  it('marks the configured initial section as the current location', () => {
    render(
      <SectionNav
        items={sections}
        ariaLabel="Resume sections"
        initialActiveId="education"
      />,
    );

    const activeLink = screen.getByRole('link', { name: 'Education' });
    expect(activeLink).toHaveClass('active');
    expect(activeLink).toHaveAttribute('aria-current', 'location');
    expect(
      screen.getByRole('link', { name: 'Experience' }),
    ).not.toHaveAttribute('aria-current');
  });
});
