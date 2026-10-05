import type { Metadata } from 'next';

import { SchemaGraph } from '@/components/Schema';
import Hero from '@/components/Template/Hero';
import PageWrapper from '@/components/Template/PageWrapper';
import { createPageMetadata } from '@/lib/metadata';
import { HOME_URL, profilePageNode } from '@/lib/schema';
import { AUTHOR_NAME, SITE_DESCRIPTION, SITE_TITLE } from '@/lib/utils';

export const metadata: Metadata = createPageMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: '/',
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <PageWrapper>
      <SchemaGraph
        nodes={[profilePageNode({ url: HOME_URL, name: AUTHOR_NAME })]}
      />
      <Hero />
    </PageWrapper>
  );
}
