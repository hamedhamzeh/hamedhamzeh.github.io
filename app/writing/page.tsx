import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaGraph } from '@/components/Schema';
import PageWrapper from '@/components/Template/PageWrapper';
import { createPageMetadata } from '@/lib/metadata';
import { getAllPosts } from '@/lib/posts';
import {
  blogNode,
  breadcrumbNode,
  collectionPageNode,
  HOME_URL,
  SITE_URL,
  WRITING_DESCRIPTION,
} from '@/lib/schema';
import { formatDate } from '@/lib/utils';

const WRITING_URL = `${SITE_URL}/writing/`;

export const metadata: Metadata = {
  ...createPageMetadata({
    title: 'Writing',
    description: WRITING_DESCRIPTION,
    path: '/writing/',
  }),
};

interface UnifiedItem {
  title: string;
  url: string;
  date: string;
  description: string;
}

function WritingItem({ item }: { item: UnifiedItem }) {
  return (
    <Link href={item.url} className="writing-item">
      {item.date && (
        <time className="writing-date" dateTime={item.date}>
          {formatDate(item.date)}
        </time>
      )}
      <h2 className="writing-title">{item.title}</h2>
      <p className="writing-description">{item.description}</p>
    </Link>
  );
}

export default function WritingPage() {
  const internalPosts = getAllPosts();
  const posts: UnifiedItem[] = internalPosts.map((post) => ({
    title: post.title,
    url: `/writing/${post.slug}`,
    date: post.date,
    description: post.description,
  }));
  const latestPostDate = posts[0]?.date;

  return (
    <PageWrapper>
      <SchemaGraph
        nodes={[
          collectionPageNode({
            url: WRITING_URL,
            name: 'Writing',
            description: WRITING_DESCRIPTION,
            hasBreadcrumb: true,
          }),
          blogNode(latestPostDate),
          breadcrumbNode(WRITING_URL, [
            { name: 'Home', url: HOME_URL },
            { name: 'Writing', url: WRITING_URL },
          ]),
        ]}
      />
      <article className="writing-page">
        <header className="page-header writing-header">
          <h1 className="page-title">Writing</h1>
        </header>

        <div className="writing-list">
          {posts.map((item) => (
            <WritingItem key={item.url} item={item} />
          ))}
        </div>
      </article>
    </PageWrapper>
  );
}
