import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { getAllPublications } from '@/lib/portfolio-content';
import Publications from '../../Resume/Publications';
import Publication from '../../Resume/Publications/Publication';

const mockPublication = {
  title: 'A Verified Robotics Paper',
  authors: [
    {
      name: 'Hamed Hamzeh',
      citationName: 'H. Hamzeh',
      isHighlighted: true,
    },
    { name: 'Research Collaborator', citationName: 'R. Collaborator' },
  ],
  venue: 'International Robotics Conference',
  year: 2024,
  type: 'Conference paper' as const,
  status: 'Published' as const,
  url: 'https://example.com/paper',
  linkLabel: 'View publication',
  doi: '10.1000/example',
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

describe('Publications', () => {
  it('keeps the puppet paper certificate action after loading Markdown', () => {
    const puppetPaper = getAllPublications().find((publication) =>
      publication.title.startsWith('Design of a Remote Controlled Puppet'),
    );
    expect(puppetPaper).toBeDefined();
    render(<Publications data={[puppetPaper!]} />);
    expect(
      screen.getByRole('button', { name: 'View presentation certificate' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /view on ieee xplore/i }),
    ).toHaveAttribute('href', 'https://ieeexplore.ieee.org/document/10903519');
  });

  it('renders the section title, anchor, and publications', () => {
    render(<Publications data={[mockPublication]} />);

    expect(
      screen.getByRole('heading', { name: 'Publications' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Publications', level: 2 }),
    ).toHaveClass('section-title');
    expect(screen.getByText(mockPublication.title)).toBeInTheDocument();
  });
});

describe('Publication', () => {
  it('renders citation metadata and emphasizes the portfolio owner', () => {
    render(<Publication data={mockPublication} />);

    expect(screen.getByText('H. Hamzeh').tagName).toBe('STRONG');
    expect(screen.getByText(/R\. Collaborator/)).toBeInTheDocument();
    expect(screen.getByText(mockPublication.venue)).toBeInTheDocument();
    expect(screen.getByText('2024')).toHaveAttribute('datetime', '2024');
    expect(screen.getByText('DOI: 10.1000/example')).toBeInTheDocument();
    expect(screen.getByRole('article')).toHaveClass('resume-card');
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      mockPublication.title,
    );
  });

  it('shows no more than four author names and always retains the last author', () => {
    const manyAuthors = {
      ...mockPublication,
      authors: [
        ...mockPublication.authors,
        { name: 'Third Author', citationName: 'T. Author' },
        { name: 'Fourth Author', citationName: 'F. Author' },
        { name: 'Supervising Author', citationName: 'S. Author' },
      ],
    };

    render(<Publication data={manyAuthors} />);

    expect(screen.getByText('H. Hamzeh')).toBeInTheDocument();
    expect(screen.getByText(/R\. Collaborator/)).toBeInTheDocument();
    expect(screen.getByText(/T\. Author/)).toBeInTheDocument();
    expect(screen.queryByText(/F\. Author/)).not.toBeInTheDocument();
    expect(screen.getByText(/S\. Author/)).toBeInTheDocument();
    expect(screen.getByLabelText('additional authors')).toBeInTheDocument();
  });

  it('renders an under-review manuscript without a year or external link', () => {
    render(
      <Publication
        data={{
          ...mockPublication,
          status: 'Under Review',
          type: 'Journal manuscript',
          year: undefined,
          venue: undefined,
          url: undefined,
          linkLabel: undefined,
          doi: undefined,
          presentation: undefined,
        }}
      />,
    );

    expect(screen.getByText('Under Review')).toBeInTheDocument();
    expect(screen.queryByRole('time')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('opens the publication record safely in a new tab', () => {
    render(<Publication data={mockPublication} />);

    const link = screen.getByRole('link', { name: /view publication/i });
    expect(link).toHaveAttribute('href', mockPublication.url);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders oral-presentation evidence in the shared lightbox', () => {
    render(<Publication data={mockPublication} />);

    expect(screen.getByText('Oral presentation')).toBeInTheDocument();
    expect(
      screen.getByText('Selected for oral presentation at ICRoM 2024.'),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'View presentation certificate' }),
    );

    expect(
      screen.getByRole('dialog', {
        name: 'ICRoM 2024 presentation certificate',
      }),
    ).toBeInTheDocument();
  });
});
