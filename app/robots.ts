import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/utils';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  // Allow crawling so search engines can see noindex on unpublished pages.
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
