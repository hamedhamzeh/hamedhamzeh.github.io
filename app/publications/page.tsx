import type { Metadata } from 'next';

import PublicationCard from '@/components/Publications/PublicationCard';
import { SchemaGraph } from '@/components/Schema';
import PageWrapper from '@/components/Template/PageWrapper';
import { createPageMetadata } from '@/lib/metadata';
import { getAllPublications } from '@/lib/portfolio-content';
import {
  breadcrumbNode,
  collectionPageNode,
  HOME_URL,
  SITE_URL,
} from '@/lib/schema';

const PUBLICATIONS_URL = `${SITE_URL}/publications/`;
const PUBLICATIONS_DESCRIPTION =
  'Research publications and manuscripts by Hamed Hamzeh.';

export const metadata: Metadata = createPageMetadata({
  title: 'Publications',
  description: PUBLICATIONS_DESCRIPTION,
  path: '/publications/',
});

export default function PublicationsPage() {
  const publications = getAllPublications();
  return (
    <PageWrapper>
      <SchemaGraph
        nodes={[
          collectionPageNode({
            url: PUBLICATIONS_URL,
            name: 'Publications',
            description: PUBLICATIONS_DESCRIPTION,
            hasBreadcrumb: true,
          }),
          breadcrumbNode(PUBLICATIONS_URL, [
            { name: 'Home', url: HOME_URL },
            { name: 'Publications', url: PUBLICATIONS_URL },
          ]),
        ]}
      />
      <section className="projects-page publications-page">
        <header className="page-header projects-header">
          <h1 className="page-title">Publications</h1>
        </header>

        <div className="projects-grid publications-grid">
          {publications.map((publication) => (
            <PublicationCard data={publication} key={publication.title} />
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
