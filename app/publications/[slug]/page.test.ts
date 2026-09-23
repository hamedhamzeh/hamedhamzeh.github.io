import { describe, expect, it } from 'vitest';

import { SITE_URL } from '@/lib/utils';
import { generateMetadata, generateStaticParams } from './page';

describe('publication detail page', () => {
  const slugs = [
    'wormlike-robot-ferromagnetic-surface-inspection',
    'puppet-robot-pose-detection',
  ];

  it('exports both Markdown-backed publication routes', () => {
    for (const slug of slugs) {
      expect(generateStaticParams()).toContainEqual({ slug });
    }
  });

  it('uses trailing-slash canonical URLs in metadata', async () => {
    for (const slug of slugs) {
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug }),
      });
      expect(metadata.openGraph?.url).toBe(`${SITE_URL}/publications/${slug}/`);
    }
  });
});
