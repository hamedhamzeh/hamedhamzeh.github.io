import { describe, expect, it } from 'vitest';
import { SITE_URL } from '@/lib/utils';
import sitemap from '../../sitemap';
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

  it('exports the assignment route with its own share image and includes both projects in the sitemap', async () => {
    const assignmentSlug = 'soccer-team-role-assignment';
    expect(generateStaticParams()).toContainEqual({ slug: assignmentSlug });
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: assignmentSlug }),
    });
    const url = `${SITE_URL}/projects/${assignmentSlug}/`;
    expect(metadata.alternates?.canonical).toBe(url);
    expect(metadata.openGraph?.url).toBe(url);
    expect(metadata.openGraph?.images).toEqual([
      {
        url: '/videos/aisoccercoach-team-assignment/posters/01_showcase.webp',
        alt: 'AISoccerCoach: Team & Role Assignment',
      },
    ]);
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain(url);
    expect(urls).toContain(`${SITE_URL}/projects/${slug}/`);
  });

  it.each([
    {
      slug: 'airbnb-availability-prediction',
      title: 'Airbnb Availability Prediction Pipeline',
      poster: 'airbnb-pipeline.webp',
    },
    {
      slug: 'semantic-text-search-api',
      title: 'Semantic Text Search API',
      poster: 'semantic-search.webp',
    },
  ])('exports $slug with its own share image and sitemap URL', async ({
    slug,
    title,
    poster,
  }) => {
    const url = `${SITE_URL}/projects/${slug}/`;
    expect(generateStaticParams()).toContainEqual({ slug });
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug }),
    });

    expect(metadata.alternates?.canonical).toBe(url);
    expect(metadata.openGraph?.url).toBe(url);
    expect(metadata.openGraph?.images).toEqual([
      { url: `/images/projects/mlops/${poster}`, alt: title },
    ]);
    expect(sitemap().map((entry) => entry.url)).toContain(url);
  });
});
