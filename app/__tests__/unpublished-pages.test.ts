import { afterEach, describe, expect, it, vi } from 'vitest';

import StatsPage, { metadata as statsMetadata } from '../stats/page';
import WritingPage from '../writing/page';

vi.mock('next/navigation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/navigation')>();
  return { ...actual };
});

describe('unpublished sections', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('does not render an empty Writing page when only drafts exist', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(() => WritingPage()).toThrow('NEXT_HTTP_ERROR_FALLBACK;404');
  });

  it('keeps the writing template available for local draft previews', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(() => WritingPage()).not.toThrow();
  });

  it('does not render an empty public Stats page', () => {
    expect(() => StatsPage()).toThrow('NEXT_HTTP_ERROR_FALLBACK;404');
    expect(statsMetadata.robots).toEqual({ index: false, follow: true });
  });
});
