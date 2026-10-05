import { describe, expect, it } from 'vitest';

import {
  AUTHOR_NAME,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from '@/lib/utils';
import { metadata as aboutMetadata } from '../about/page';
import { metadata as contactMetadata } from '../contact/page';
import { metadata as notFoundMetadata } from '../not-found';
import { metadata as homeMetadata } from '../page';
import { metadata as projectsMetadata } from '../projects/page';
import { metadata as publicationsMetadata } from '../publications/page';
import { metadata as resumeMetadata } from '../resume/page';
import { metadata as writingMetadata } from '../writing/page';

describe('page metadata', () => {
  it('uses one descriptive homepage title and canonical URL across search and sharing', () => {
    expect(homeMetadata.title).toEqual({ absolute: SITE_TITLE });
    expect(homeMetadata.alternates?.canonical).toBe(`${SITE_URL}/`);
    expect(homeMetadata.openGraph?.title).toBe(SITE_TITLE);
    expect(homeMetadata.description).toBe(SITE_DESCRIPTION);
  });

  it.each([
    ['about', aboutMetadata, `${SITE_URL}/about/`],
    ['contact', contactMetadata, `${SITE_URL}/contact/`],
    ['projects', projectsMetadata, `${SITE_URL}/projects/`],
    ['publications', publicationsMetadata, `${SITE_URL}/publications/`],
    ['resume', resumeMetadata, `${SITE_URL}/resume/`],
    ['writing', writingMetadata, `${SITE_URL}/writing/`],
  ])('sets page-specific open graph metadata for %s', (_, metadata, url) => {
    expect(metadata.openGraph?.url).toBe(url);
    expect(metadata.alternates?.canonical).toBe(url);
    expect(metadata.openGraph?.description).toBe(metadata.description);
    expect(metadata.openGraph?.title).toBe(
      `${metadata.title} | ${AUTHOR_NAME}`,
    );
  });

  it('overrides 404 share metadata without inventing a canonical url', () => {
    expect(notFoundMetadata.openGraph?.url).toBeUndefined();
    expect(notFoundMetadata.alternates?.canonical).toBeUndefined();
    expect(notFoundMetadata.robots).toEqual({ index: false, follow: true });
    expect(notFoundMetadata.openGraph?.description).toBe(
      notFoundMetadata.description,
    );
    expect(notFoundMetadata.openGraph?.title).toBe(
      `${notFoundMetadata.title} | ${AUTHOR_NAME}`,
    );
  });

  it('does not expose an RSS feed before original writing is published', () => {
    expect(
      writingMetadata.alternates?.types?.['application/rss+xml'],
    ).toBeUndefined();
  });
});
