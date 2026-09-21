import type { Metadata } from 'next';

import Personal from '@/components/Stats/Personal';
import Site from '@/components/Stats/Site';

import PageWrapper from '@/components/Template/PageWrapper';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Stats',
  description: "Some statistics about Michael D'Angelo and mldangelo.com",
  path: '/stats/',
});

export default function StatsPage() {
  return (
    <PageWrapper>
      <section className="stats-page">
        <header className="page-header stats-header">
          <h1 className="page-title">Stats</h1>
          <p className="page-subtitle stats-subtitle">Some fun numbers</p>
        </header>
        <div className="stats-content">
          <section>
            <h2 className="section-title">About me</h2>
            <Personal />
          </section>
          <section>
            <h2 className="section-title">This site</h2>
            <Site />
          </section>
        </div>
      </section>
    </PageWrapper>
  );
}
