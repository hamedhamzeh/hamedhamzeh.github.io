import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { frontendProjects } from '@/data/projects';
import { getProjectShowcaseEntries } from '../portfolio-content';

describe('independently hosted Front-end projects', () => {
  it('replaces both placeholders with direct links to their project deployments', () => {
    const entries = getProjectShowcaseEntries().filter(
      (entry) => entry.category === 'Front-end',
    );
    expect(entries.map((entry) => entry.id)).toEqual([
      'game-hub',
      'hosting-landing-page',
    ]);
    expect(entries.map((entry) => 'link' in entry && entry.link)).toEqual([
      'https://hamedhamzeh.github.io/my-game-hub/',
      'https://hamedhamzeh.github.io/my-front-project/',
    ]);
    for (const project of frontendProjects) {
      expect(project.openInNewTab).toBe(true);
      expect(fs.existsSync(path.join('public', project.image!))).toBe(true);
      expect(fs.existsSync(path.join('public/projects', project.id))).toBe(
        false,
      );
    }
  });
});
