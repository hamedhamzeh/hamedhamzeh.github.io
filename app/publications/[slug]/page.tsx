import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import DetailContent from '@/components/Portfolio/DetailContent';
import { SchemaGraph } from '@/components/Schema';
import PageWrapper from '@/components/Template/PageWrapper';
import { createPageMetadata } from '@/lib/metadata';
import { getDetailSlugs, getPublicationBySlug } from '@/lib/portfolio-content';
import { breadcrumbNode, HOME_URL, SITE_URL, webPageNode } from '@/lib/schema';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getDetailSlugs('publications').map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const publication = getPublicationBySlug(slug);
  if (!publication) return { title: 'Publication Not Found' };

  return createPageMetadata({
    title: publication.title,
    description: publication.description,
    path: publication.detailPath as `/${string}`,
  });
}

export default async function PublicationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const publication = getPublicationBySlug(slug);
  if (!publication) notFound();

  const url = `${SITE_URL}${publication.detailPath}`;
  const indexUrl = `${SITE_URL}/publications/`;

  return (
    <PageWrapper>
      <SchemaGraph
        nodes={[
          webPageNode({
            url,
            name: publication.title,
            description: publication.description,
            hasBreadcrumb: true,
          }),
          breadcrumbNode(url, [
            { name: 'Home', url: HOME_URL },
            { name: 'Publications', url: indexUrl },
            { name: publication.title, url },
          ]),
        ]}
      />
      <article className="portfolio-detail-page">
        <header className="portfolio-detail-header">
          <h1>{publication.title}</h1>
          <p>{publication.authors.map((author) => author.name).join(', ')}</p>
          <p>
            {publication.venue} · {publication.year}
          </p>
          <div className="portfolio-detail-links">
            {publication.url && publication.linkLabel && (
              <a
                href={publication.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {publication.linkLabel} <span aria-hidden="true">↗</span>
              </a>
            )}
            {publication.doi && <span>DOI: {publication.doi}</span>}
          </div>
        </header>
        <DetailContent
          content={publication.content}
          media={publication.media}
        />
      </article>
    </PageWrapper>
  );
}
