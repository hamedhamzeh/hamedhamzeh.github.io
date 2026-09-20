import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Job from '../../Resume/Experience/Job';

describe('Job', () => {
  const mockJob = {
    name: 'Acme Corp',
    position: 'Senior Engineer',
    url: 'https://acme.com',
    startDate: '2020-01-15',
    endDate: '2023-06-30',
    summary: 'Led development of **critical systems**.',
    highlights: ['Shipped feature X', 'Improved performance by 50%'],
  };

  it('renders company name with link', () => {
    render(<Job data={mockJob} />);

    const link = screen.getByRole('link', { name: /acme corp/i });
    expect(link).toHaveAttribute('href', 'https://acme.com');
  });

  it('renders company name without a link when no URL is provided', () => {
    render(<Job data={{ ...mockJob, url: undefined }} />);

    expect(
      screen.getByRole('heading', {
        name: /acme corp - senior engineer/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /acme corp/i }),
    ).not.toBeInTheDocument();
  });

  it('renders position title', () => {
    render(<Job data={mockJob} />);

    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
      'Senior Engineer',
    );
  });

  it('formats date range correctly', () => {
    render(<Job data={mockJob} />);

    expect(screen.getByText(/january 2020/i)).toBeInTheDocument();
    expect(screen.getByText(/june 2023/i)).toBeInTheDocument();
  });

  it('shows Present for current job (no end date)', () => {
    const currentJob = {
      ...mockJob,
      endDate: undefined,
    };

    render(<Job data={currentJob} />);

    expect(screen.getByText(/present/i)).toBeInTheDocument();
  });

  it('renders summary with markdown', () => {
    render(<Job data={mockJob} />);

    // Summary text should be present
    expect(screen.getByText(/led development of/i)).toBeInTheDocument();
  });

  it('renders highlights as list items', () => {
    render(<Job data={mockJob} />);

    expect(screen.getByText('Shipped feature X')).toBeInTheDocument();
    expect(screen.getByText('Improved performance by 50%')).toBeInTheDocument();

    const listItems = document.querySelectorAll('.points li');
    expect(listItems.length).toBe(2);
  });

  it('handles missing summary gracefully', () => {
    const jobWithoutSummary = {
      ...mockJob,
      summary: undefined,
    };

    render(<Job data={jobWithoutSummary} />);

    // Should not crash, highlights should still render
    expect(screen.getByText('Shipped feature X')).toBeInTheDocument();
  });

  it('handles missing highlights gracefully', () => {
    const jobWithoutHighlights = {
      ...mockJob,
      highlights: undefined,
    };

    render(<Job data={jobWithoutHighlights} />);

    // Should not crash, summary should still render
    expect(screen.getByText(/led development/i)).toBeInTheDocument();

    const list = document.querySelector('.points');
    expect(list).not.toBeInTheDocument();
  });

  it('renders project or role subsections with their own dates', () => {
    render(
      <Job
        data={{
          ...mockJob,
          highlights: undefined,
          subsections: [
            {
              title: 'Research Project',
              startDate: '2021-02-01',
              endDate: '2021-08-01',
              highlights: ['Validated the prototype'],
            },
          ],
        }}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Research Project' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Validated the prototype')).toBeInTheDocument();
    expect(screen.getByText(/february 2021/i)).toBeInTheDocument();
    expect(screen.getByText(/august 2021/i)).toBeInTheDocument();
  });

  it('renders safe external and internal evidence links', () => {
    render(
      <Job
        data={{
          ...mockJob,
          links: [
            { label: 'View app', url: 'https://example.com/app' },
            { label: 'View project', url: '/projects/example' },
          ],
        }}
      />,
    );

    expect(screen.getByRole('link', { name: /view app/i })).toHaveAttribute(
      'target',
      '_blank',
    );
    expect(screen.getByRole('link', { name: /view app/i })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    );
    expect(
      screen.getByRole('link', { name: 'View project' }),
    ).not.toHaveAttribute('target');
  });

  it('renders as article element', () => {
    render(<Job data={mockJob} />);

    const article = document.querySelector('article.jobs-container');
    expect(article).toBeInTheDocument();
  });
});
