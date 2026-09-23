import { describe, expect, it } from 'vitest';

import { SITE_URL } from '@/lib/utils';
import { generateMetadata, generateStaticParams } from './page';

describe('publication detail page', () => {
  const slug = 'wormlike-robot-ferromagnetic-surface-inspection';

  it('exports the Markdown-backed publication route', () => {
    expect(generateStaticParams()).toContainEqual({ slug });
  });

  it('uses its trailing-slash canonical URL in metadata', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug }),
    });
    expect(metadata.openGraph?.url).toBe(`${SITE_URL}/publications/${slug}/`);
  });
});
