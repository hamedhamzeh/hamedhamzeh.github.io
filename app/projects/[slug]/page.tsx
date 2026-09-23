import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import DetailContent from '@/components/Portfolio/DetailContent';
import { SchemaGraph } from '@/components/Schema';
import PageWrapper from '@/components/Template/PageWrapper';
import { createPageMetadata } from '@/lib/metadata';
import { getDetailSlugs, getProjectBySlug } from '@/lib/portfolio-content';
import { breadcrumbNode, HOME_URL, SITE_URL, webPageNode } from '@/lib/schema';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const slugs = getDetailSlugs('projects');
  // Next's static export currently requires at least one generated parameter.
  // This path renders notFound and is not linked or listed in the sitemap.
  return (slugs.length ? slugs : ['_unpublished']).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found' };

  return createPageMetadata({
    title: project.title,
    description: project.desc,
    path: project.link as `/${string}`,
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const url = `${SITE_URL}${project.link}`;
  const indexUrl = `${SITE_URL}/projects/`;

  return (
    <PageWrapper>
      <SchemaGraph
        nodes={[
          webPageNode({
            url,
            name: project.title,
            description: project.desc,
            hasBreadcrumb: true,
          }),
          breadcrumbNode(url, [
            { name: 'Home', url: HOME_URL },
            { name: 'Projects', url: indexUrl },
            { name: project.title, url },
          ]),
        ]}
      />
      <article className="portfolio-detail-page">
        <header className="portfolio-detail-header">
          <h1>{project.title}</h1>
          {project.subtitle && <p>{project.subtitle}</p>}
          <p>{project.desc}</p>
        </header>
        <DetailContent content={project.content} media={project.media} />
      </article>
    </PageWrapper>
  );
}
