import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Cell from '../../Projects/Cell';

describe('Cell', () => {
  const mockProject = {
    title: 'Test Project',
    subtitle: 'A test subtitle',
    image: '/images/test.jpg',
    date: '2023-01-01',
    desc: 'This is a test project description',
    link: 'https://example.com',
  };

  it('renders project as a clickable card with link', () => {
    render(<Cell data={mockProject} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', mockProject.link);
    expect(link).toHaveClass('project-card-link');
    expect(link).not.toHaveAttribute('target');
    expect(link).toContainElement(screen.getByText('Explore project'));
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('opens an opted-in project in a separate tab and announces it', () => {
    render(
      <Cell
        data={{
          ...mockProject,
          openInNewTab: true,
          actionLabel: 'Visit website',
        }}
      />,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveAccessibleName(/opens in a new tab/);
    expect(screen.getByText('Visit website')).toBeVisible();
  });

  it('omits tags and keeps the explore action only on linked cards', () => {
    const { container, rerender } = render(
      <Cell data={{ ...mockProject, tech: ['Python', 'OpenCV'] }} />,
    );
    expect(container.querySelector('.project-card-tech')).toBeNull();
    rerender(<Cell data={{ ...mockProject, link: undefined }} />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByText('Explore project')).toBeNull();
  });

  it('renders project description', () => {
    render(<Cell data={mockProject} />);
    expect(screen.getByText(mockProject.desc)).toBeInTheDocument();
  });

  it('renders project date in correct format', () => {
    render(<Cell data={mockProject} />);
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('renders project image with alt text', () => {
    render(<Cell data={mockProject} />);
    const image = screen.getByAltText(mockProject.title);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('test.jpg'));
  });
});
