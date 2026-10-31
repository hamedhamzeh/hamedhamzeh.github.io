import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { linkedProjects } from '@/data/projects';
import {
  getDetailSlugs,
  getProjectShowcaseEntries,
  getPublicationBySlug,
} from '../portfolio-content';

describe('Robotics publication project cards', () => {
  it('shows three real Robotics cards and preserves the other categories', () => {
    const entries = getProjectShowcaseEntries();
    const robotics = entries.filter((entry) => entry.category === 'Robotics');
    expect(robotics.map((entry) => entry.title)).toEqual([
      'Whole-Body Rehabilitation Device',
      'Vision-Controlled Puppet Robot',
      'Wormlike Surface-Inspection Robot',
    ]);
    expect(
      robotics.every((entry) => 'link' in entry && !('number' in entry)),
    ).toBe(true);
    expect(entries).toHaveLength(12);
    for (const [category, count] of [
      ['Computer Vision', 5],
      ['Front-end', 2],
      ['MLOps', 1],
      ['ML Projects', 1],
    ] as const) {
      expect(
        entries.filter((entry) => entry.category === category),
      ).toHaveLength(count);
    }
  });

  it('reuses existing publication routes and images without creating duplicate detail pages', () => {
    const entries = getProjectShowcaseEntries();
    for (const card of linkedProjects) {
      const slug = card.link!.split('/')[2];
      const publication = getPublicationBySlug(slug);
      expect(publication?.detailPath).toBe(card.link);
      expect(publication?.image).toBe(card.image);
      expect(
        fs.existsSync(path.join(process.cwd(), 'public', card.image!)),
      ).toBe(true);
      expect(
        entries.filter((entry) => 'link' in entry && entry.link === card.link),
      ).toHaveLength(1);
      expect(getDetailSlugs('projects')).not.toContain(card.id);
    }
  });
});
