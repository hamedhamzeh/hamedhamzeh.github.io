import { afterEach, describe, expect, it, vi } from 'vitest';

import { SITE_URL } from '@/lib/utils';

import PostPage, { generateMetadata, generateStaticParams } from './page';

vi.mock('next/navigation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/navigation')>();
  return { ...actual };
});

describe('writing post metadata', () => {
  afterEach(() => vi.unstubAllEnvs());
  it('uses a trailing-slash canonical URL for posts', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const metadata = await generateMetadata({
      params: Promise.resolve({
        slug: 'writing-sample',
      }),
    });

    expect(metadata.openGraph?.url).toBe(`${SITE_URL}/writing/writing-sample/`);
  });
  it('does not generate or render draft posts in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(generateStaticParams()).not.toContainEqual({
      slug: 'writing-sample',
    });
    const props = { params: Promise.resolve({ slug: 'writing-sample' }) };
    expect((await generateMetadata(props)).robots).toEqual({
      index: false,
      follow: true,
    });
    await expect(PostPage(props)).rejects.toThrow(
      'NEXT_HTTP_ERROR_FALLBACK;404',
    );
  });
});
