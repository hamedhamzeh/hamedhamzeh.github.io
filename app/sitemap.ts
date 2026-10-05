import type { MetadataRoute } from 'next';
import { getDetailSlugs } from '@/lib/portfolio-content';
import { getAllPosts } from '@/lib/posts';
import { SITE_URL } from '@/lib/utils';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().filter((post) => !post.draft);
  const paths = [
    '/',
    '/about/',
    '/resume/',
    '/publications/',
    '/projects/',
    '/contact/',
    ...getDetailSlugs('publications').map((slug) => `/publications/${slug}/`),
    ...getDetailSlugs('projects').map((slug) => `/projects/${slug}/`),
    ...(posts.length ? ['/writing/'] : []),
    ...posts.map((post) => `/writing/${post.slug}/`),
  ];

  // Omit lastModified until actual content modification dates are available.
  return paths.map((path) => ({ url: new URL(path, SITE_URL).toString() }));
}
