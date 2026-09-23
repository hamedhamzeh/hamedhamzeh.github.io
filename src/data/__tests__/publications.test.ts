import { describe, expect, it } from 'vitest';

import { getAllPublications } from '@/lib/portfolio-content';

describe('publications data', () => {
  const publications = getAllPublications();
  it('contains the two verified records and the under-review manuscript', () => {
    expect(publications).toHaveLength(3);

    const puppetPaper = publications.find((publication) =>
      publication.title.startsWith('Design of a Remote Controlled Puppet'),
    );
    const silkwormPaper = publications.find((publication) =>
      publication.title.startsWith('A Wormlike Robot'),
    );
    const pavementManuscript = publications.find((publication) =>
      publication.title.startsWith('Advancing Sustainable Pavement Design'),
    );

    expect(puppetPaper).toMatchObject({
      year: 2024,
      type: 'Conference paper',
      status: 'Published',
      doi: '10.1109/ICRoM64545.2024.10903519',
      url: 'https://ieeexplore.ieee.org/document/10903519',
      linkLabel: 'View on IEEE Xplore',
      presentation: {
        label: 'Oral presentation',
        note: 'Selected for oral presentation at ICRoM 2024.',
      },
    });
    expect(puppetPaper?.presentation?.gallery.images[0]?.src).toBe(
      '/images/assets/ICROM 2024.webp',
    );
    expect(silkwormPaper).toMatchObject({
      year: 2026,
      type: 'Journal article',
      status: 'Published',
      doi: '10.1109/MRA.2026.3683248',
      url: 'https://ieeexplore.ieee.org/document/11551324',
      linkLabel: 'View on IEEE Xplore',
    });
    expect(pavementManuscript).toMatchObject({
      type: 'Journal manuscript',
      status: 'Under Review',
    });
  });

  it('provides complete citation and author data', () => {
    for (const publication of publications) {
      expect(publication.title.trim()).not.toBe('');
      expect(publication.authors.length).toBeGreaterThan(0);
      expect(publication.authors.some((author) => author.isHighlighted)).toBe(
        true,
      );
      expect(
        publication.authors.every(
          (author) => author.name.trim() && author.citationName.trim(),
        ),
      ).toBe(true);

      if (publication.status === 'Published') {
        expect(publication.venue?.trim()).not.toBe('');
        expect(publication.url).toMatch(/^https:\/\//);
        expect(publication.doi?.trim()).not.toBe('');
      }
    }
  });
});
