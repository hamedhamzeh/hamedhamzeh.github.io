import type { Metadata } from 'next';

import PlaceholderCard from '@/components/Projects/PlaceholderCard';
import { SchemaGraph } from '@/components/Schema';
import PageWrapper from '@/components/Template/PageWrapper';
import projects from '@/data/projects';
import { createPageMetadata } from '@/lib/metadata';
import { breadcrumbNode, collectionPageNode, HOME_URL, SITE_URL } from '@/lib/schema';

const PROJECTS_URL = `${SITE_URL}/projects/`;

const PROJECTS_DESCRIPTION = 'A preview of Hamed Hamzeh’s project portfolio.';

export const metadata: Metadata = createPageMetadata({
  title: 'Projects',
  description: PROJECTS_DESCRIPTION,
  path: '/projects/',
});

export default function ProjectsPage() {
  return (
    <PageWrapper>
      <SchemaGraph
        nodes={[
          collectionPageNode({
            url: PROJECTS_URL,
            name: 'Projects',
            description: PROJECTS_DESCRIPTION,
            hasBreadcrumb: true,
          }),
          breadcrumbNode(PROJECTS_URL, [
            { name: 'Home', url: HOME_URL },
            { name: 'Projects', url: PROJECTS_URL },
          ]),
        ]}
      />
      <section className="projects-page">
        <header className="page-header projects-header">
          <h1 className="page-title">Projects</h1>
          <p className="projects-intro">Project stories are being prepared.</p>
        </header>
        <div className="projects-showcase">
          {projects.map((project, index) => (
            <PlaceholderCard data={project} index={index} key={project.title} />
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
