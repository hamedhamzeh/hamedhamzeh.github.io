import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PublicationCard from '../../Publications/PublicationCard';

const mockPublication = {
  title: 'A Verified Robotics Paper',
  authors: [
    { name: 'Hamed Hamzeh', citationName: 'H. Hamzeh', isHighlighted: true },
    { name: 'Research Collaborator', citationName: 'R. Collaborator' },
  ],
  venue: 'International Robotics Conference',
  year: 2024,
  type: 'Conference paper' as const,
  status: 'Published' as const,
  url: 'https://example.com/paper',
  linkLabel: 'View publication',
  doi: '10.1000/example',
  detailPath: '/publications/verified-robotics-paper/',
  presentation: {
    label: 'Oral presentation',
    note: 'Selected for oral presentation at ICRoM 2024.',
    gallery: {
      triggerLabel: 'View presentation certificate',
      dialogLabel: 'ICRoM 2024 presentation certificate',
      images: [
        {
          src: '/images/assets/ICROM 2024.webp',
          alt: 'ICRoM 2024 presentation certificate',
          width: 1636,
          height: 1181,
        },
      ],
    },
  },
};

describe('PublicationCard', () => {
  it('renders the citation details', () => {
    render(<PublicationCard data={mockPublication} />);

    expect(
      screen.getByRole('heading', { level: 3, name: mockPublication.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(mockPublication.venue)).toBeInTheDocument();
    expect(
      screen.getByText(/H\. Hamzeh, R\. Collaborator/),
    ).toBeInTheDocument();
    expect(screen.getByText('2024')).toHaveAttribute('datetime', '2024');
  });

  it('shows an explicit detail-page action', () => {
    render(<PublicationCard data={mockPublication} />);
    expect(
      screen.getByRole('link', { name: 'Publication page' }),
    ).toHaveAttribute('href', mockPublication.detailPath);
  });

  it('opens the dedicated page from the whole card when one exists', () => {
    render(<PublicationCard data={mockPublication} />);

    expect(screen.getByRole('article')).toHaveClass('project-card--linked');
    expect(
      screen.getByRole('link', { name: mockPublication.title }),
    ).toHaveAttribute('href', mockPublication.detailPath);
  });

  it('keeps a publication without a dedicated page static', () => {
    const { container } = render(
      <PublicationCard data={{ ...mockPublication, detailPath: undefined }} />,
    );

    expect(screen.getByRole('article')).toHaveClass('project-card--static');
    expect(
      container.querySelector('.publication-card-link'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Publication page' }),
    ).not.toBeInTheDocument();
  });

  it('links the publication record safely in a new tab', () => {
    render(<PublicationCard data={mockPublication} />);

    const link = screen.getByRole('link', { name: /view publication/i });
    expect(link).toHaveAttribute('href', mockPublication.url);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders no type or status badges', () => {
    const { container } = render(<PublicationCard data={mockPublication} />);

    expect(
      container.querySelector('.project-card-tech'),
    ).not.toBeInTheDocument();
    expect(container.querySelectorAll('.tech-tag')).toHaveLength(0);
  });

  it('keeps the year inside the action row', () => {
    render(<PublicationCard data={mockPublication} />);

    const actionRow = screen
      .getByRole('link', { name: /view publication/i })
      .closest('.resume-actions');

    expect(actionRow).not.toBeNull();
    expect(
      within(actionRow as HTMLElement).getByText('2024'),
    ).toBeInTheDocument();
  });

  it('leaves the presentation certificate to the Resume section', () => {
    render(<PublicationCard data={mockPublication} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByText(/certificate/i)).not.toBeInTheDocument();
  });

  it('shows the review status as a badge when there is no venue', () => {
    const { container } = render(
      <PublicationCard
        data={{ ...mockPublication, venue: undefined, status: 'Under Review' }}
      />,
    );

    const badge = container.querySelector(
      '.project-card-status .publication-type',
    );
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Under Review');
  });

  it('renders an under-review manuscript without controls', () => {
    render(
      <PublicationCard
        data={{
          ...mockPublication,
          status: 'Under Review',
          type: 'Journal manuscript',
          year: undefined,
          venue: undefined,
          url: undefined,
          linkLabel: undefined,
          doi: undefined,
          detailPath: undefined,
          presentation: undefined,
        }}
      />,
    );

    expect(screen.getByText('Under Review')).toHaveClass('publication-type');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('time')).not.toBeInTheDocument();
  });
});
