import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Education from '../../Resume/Education';
import Degree from '../../Resume/Education/Degree';

const mockDegrees = [
  {
    school: 'Stanford University',
    degree: 'M.S. Computer Science',
    link: 'https://stanford.edu',
    startYear: 2018,
    endYear: 2020,
  },
  {
    school: 'MIT',
    degree: 'B.S. Computer Science',
    link: 'https://mit.edu',
    startYear: 2012,
    endYear: 2016,
  },
];

describe('Education', () => {
  it('renders the education section with title', () => {
    render(<Education data={mockDegrees} />);

    expect(
      screen.getByRole('heading', { name: /education/i }),
    ).toBeInTheDocument();
  });

  it('renders all degrees', () => {
    render(<Education data={mockDegrees} />);

    expect(screen.getByText('M.S. Computer Science')).toBeInTheDocument();
    expect(screen.getByText('B.S. Computer Science')).toBeInTheDocument();
  });

  it('renders school links', () => {
    render(<Education data={mockDegrees} />);

    const stanfordLink = screen.getByRole('link', { name: /stanford/i });
    expect(stanfordLink).toHaveAttribute('href', 'https://stanford.edu');

    const mitLink = screen.getByRole('link', { name: /mit/i });
    expect(mitLink).toHaveAttribute('href', 'https://mit.edu');
  });

  it('has anchor link for navigation', () => {
    render(<Education data={mockDegrees} />);

    const anchor = document.getElementById('education');
    expect(anchor).toBeInTheDocument();
  });
});

describe('Degree', () => {
  const mockDegree = {
    school: 'Stanford University',
    degree: 'M.S. Computer Science',
    link: 'https://stanford.edu',
    startYear: 2018,
    endYear: 2020,
    location: 'Stanford, CA',
    gpa: 'Last two years: 4.0/4',
    thesis: {
      title: 'A Study of Reliable Systems',
      grade: '19/20',
      supervisor: 'Dr. Ada Lovelace',
    },
  };

  it('renders degree title', () => {
    render(<Degree data={mockDegree} />);

    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
      'M.S. Computer Science',
    );
  });

  it('renders school name with link', () => {
    render(<Degree data={mockDegree} />);

    const link = screen.getByRole('link', { name: /stanford/i });
    expect(link).toHaveAttribute('href', 'https://stanford.edu');
  });

  it('displays date range and location', () => {
    render(<Degree data={mockDegree} />);

    expect(document.querySelector('.school')).toHaveTextContent(
      'Stanford University, 2018–2020 · Stanford, CA',
    );
  });

  it('renders GPA and thesis details', () => {
    render(<Degree data={mockDegree} />);

    expect(screen.getByText(/Last two years: 4.0\/4/)).toBeInTheDocument();
    expect(screen.getByText('A Study of Reliable Systems')).toBeInTheDocument();
    expect(screen.getByText(/19\/20/)).toBeInTheDocument();
    expect(screen.getByText(/Dr. Ada Lovelace/)).toBeInTheDocument();
  });

  it('renders as article element', () => {
    render(<Degree data={mockDegree} />);

    const article = document.querySelector('article.degree-container');
    expect(article).toBeInTheDocument();
  });
});
