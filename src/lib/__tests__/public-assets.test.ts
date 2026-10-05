import { afterEach, describe, expect, it, vi } from 'vitest';

import { publicAssetUrl } from '../public-assets';

afterEach(() => vi.unstubAllEnvs());

describe('publicAssetUrl', () => {
  it('uses root paths for a user site', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '');
    expect(publicAssetUrl('/videos/demo.mp4')).toBe('/videos/demo.mp4');
  });

  it('prefixes project-site paths and encodes filenames', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '/portfolio/');
    expect(publicAssetUrl('/videos/Experiment 4 (Pipe & Climbing).mp4')).toBe(
      '/portfolio/videos/Experiment%204%20(Pipe%20%26%20Climbing).mp4',
    );
  });

  it('rejects paths that are not local public paths', () => {
    expect(() => publicAssetUrl('videos/demo.mp4')).toThrow(/single slash/);
    expect(() => publicAssetUrl('//example.com/demo.mp4')).toThrow(
      /single slash/,
    );
  });
});
