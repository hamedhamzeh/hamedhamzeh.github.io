import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Skills from '../../Resume/Skills';

const mockCategories = [
  { name: 'Languages', color: '#6968b3' },
  { name: 'ML Engineering', color: '#37b1f5' },
  { name: 'Web Development', color: '#40494e' },
];

const mockSkills = [
  { title: 'Python', category: ['Languages', 'ML Engineering'] },
  {
    title: 'TypeScript',
    category: ['Languages', 'Web Development'],
  },
  {
    title: 'JavaScript',
    category: ['Languages', 'Web Development'],
  },
  { title: 'PyTorch', category: ['ML Engineering'] },
  { title: 'React', category: ['Web Development'] },
];

describe('Skills', () => {
  it('renders the skills section with title', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    expect(
      screen.getByRole('heading', { name: /skills/i }),
    ).toBeInTheDocument();
  });

  it('renders category filter buttons including All', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Languages' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'ML Engineering' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Web Development' }),
    ).toBeInTheDocument();
  });

  it('shows the configured category by default', () => {
    render(
      <Skills
        skills={mockSkills}
        categories={mockCategories}
        defaultCategory="ML Engineering"
      />,
    );

    expect(
      screen.getByRole('button', { name: 'ML Engineering' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('PyTorch')).toBeInTheDocument();
    expect(screen.queryByText('React')).not.toBeInTheDocument();
  });

  it('filters skills when category button is clicked', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    const mlButton = screen.getByRole('button', { name: 'ML Engineering' });
    fireEvent.click(mlButton);

    // Should show ML Engineering skills
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('PyTorch')).toBeInTheDocument();

    // Should not show non-ML skills
    expect(screen.queryByText('React')).not.toBeInTheDocument();
  });

  it('shows all skills only when All is explicitly selected', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    const mlButton = screen.getByRole('button', { name: 'ML Engineering' });
    fireEvent.click(mlButton);
    fireEvent.click(screen.getByRole('button', { name: 'All' }));

    // All skills should be visible again (may appear in multiple groups)
    expect(screen.getAllByText('Python').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('React').length).toBeGreaterThanOrEqual(1);
  });

  it('sets aria-pressed on active category button', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    const languagesButton = screen.getByRole('button', { name: 'Languages' });
    expect(languagesButton).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(languagesButton);
    expect(languagesButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('keeps an active category selected when clicked again', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    const languagesButton = screen.getByRole('button', { name: 'Languages' });
    fireEvent.click(languagesButton);
    fireEvent.click(languagesButton);

    expect(languagesButton).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByText('PyTorch')).not.toBeInTheDocument();
  });

  it('displays skills grouped by category', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    // Should have group titles
    const groupTitles = document.querySelectorAll('.skill-group-title');
    expect(groupTitles.length).toBeGreaterThan(0);
  });

  it('preserves the authored skill order within a category', () => {
    render(<Skills skills={mockSkills} categories={mockCategories} />);

    // Filter to Languages to check sorting
    fireEvent.click(screen.getByRole('button', { name: 'Languages' }));

    const skillTags = document.querySelectorAll('.skill-tag-name');
    const skillNames = Array.from(skillTags).map((el) => el.textContent);

    // The data intentionally places Python before JavaScript.
    const jsIndex = skillNames.indexOf('JavaScript');
    const pythonIndex = skillNames.indexOf('Python');
    expect(pythonIndex).toBeLessThan(jsIndex);
  });
});
