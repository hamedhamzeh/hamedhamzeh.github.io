import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getAllPosts } from '@/lib/posts';
import { SITE_URL } from '@/lib/utils';
import robots from '../robots';
import sitemap from '../sitemap';

vi.mock('@/lib/posts', () => ({ getAllPosts: vi.fn(() => []) }));

beforeEach(() => vi.mocked(getAllPosts).mockReturnValue([]));

describe('search discovery', () => {
  it('allows crawling and advertises the production sitemap', () => {
    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/' },
      sitemap: `${SITE_URL}/sitemap.xml`,
    });
  });

  it('lists canonical public URLs without drafts, empty sections, or invented modification dates', () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    expect(urls).toContain(`${SITE_URL}/`);
    expect(urls).toContain(`${SITE_URL}/projects/`);
    expect(urls).toContain(
      `${SITE_URL}/publications/puppet-robot-pose-detection/`,
    );
    expect(
      urls.every((url) => url.startsWith(SITE_URL) && url.endsWith('/')),
    ).toBe(true);
    expect(urls.some((url) => /writing|stats|_unpublished/.test(url))).toBe(
      false,
    );
    expect(new Set(urls).size).toBe(urls.length);
    expect(entries.every((entry) => entry.lastModified === undefined)).toBe(
      true,
    );
  });

  it('discovers future published writing while still excluding drafts', () => {
    vi.mocked(getAllPosts).mockReturnValue([
      {
        slug: 'published',
        title: 'Published',
        description: 'A real post',
        date: '2026-10-05',
        content: 'Content',
      },
      {
        slug: 'draft',
        title: 'Draft',
        description: 'A draft',
        date: '2026-10-05',
        content: 'Content',
        draft: true,
      },
    ]);
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain(`${SITE_URL}/writing/`);
    expect(urls).toContain(`${SITE_URL}/writing/published/`);
    expect(urls).not.toContain(`${SITE_URL}/writing/draft/`);
  });
});
