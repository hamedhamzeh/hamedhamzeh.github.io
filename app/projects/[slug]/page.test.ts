import { describe, expect, it } from 'vitest';

import { SITE_URL } from '@/lib/utils';
import { generateMetadata, generateStaticParams } from './page';

describe('project detail page', () => {
  const slug = 'contact-anchored-soccer-ball-mapping';

  it('exports the project with its canonical route and project-specific share poster', async () => {
    expect(generateStaticParams()).toContainEqual({ slug });
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug }),
    });
    expect(metadata.alternates?.canonical).toBe(
      `${SITE_URL}/projects/${slug}/`,
    );
    expect(metadata.openGraph?.url).toBe(`${SITE_URL}/projects/${slug}/`);
    expect(metadata.openGraph?.images).toEqual([
      {
        url: '/videos/aisoccercoach-BallMapping/posters/01_comparison.webp',
        alt: 'AISoccerCoach: Contact-Anchored Ball Mapping',
      },
    ]);
  });
});
