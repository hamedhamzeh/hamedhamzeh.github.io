import { describe, expect, it } from 'vitest';

import honors from '../resume/honors';

describe('honors data', () => {
  it('contains the confirmed honors in reverse chronological order', () => {
    expect(honors).toHaveLength(3);
    expect(honors.map(({ year }) => year)).toEqual([2025, 2024, 2018]);
  });

  it('contains complete display content', () => {
    for (const honor of honors) {
      expect(honor.title.trim()).not.toBe('');
      expect(honor.issuer.trim()).not.toBe('');
      expect(honor.description.trim()).not.toBe('');
    }
  });
});
