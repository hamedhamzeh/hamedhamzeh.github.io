import { MetadataRoute } from 'next';
import { getDetailSlugs } from '@/lib/portfolio-content';
import { SITE_URL } from '@/lib/utils';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/about/`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/resume/`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/publications/`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/projects/`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact/`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    ...getDetailSlugs('publications').map((slug) => ({
      url: `${SITE_URL}/publications/${slug}/`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    ...getDetailSlugs('projects').map((slug) => ({
      url: `${SITE_URL}/projects/${slug}/`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];
}
