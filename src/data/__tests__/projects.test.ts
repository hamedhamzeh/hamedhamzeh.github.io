import { describe, expect, it } from 'vitest';

import projects from '../projects';

describe('project placeholders', () => {
  it('provides exactly three neutral project cards', () => {
    expect(projects).toHaveLength(3);
    expect(projects.map(({ title }) => title)).toEqual([
      'Project 01',
      'Project 02',
      'Project 03',
    ]);

    for (const project of projects) {
      expect(project.desc).toBe('Project details will be added here.');
      expect(project).not.toHaveProperty('link');
      expect(project).not.toHaveProperty('image');
      expect(project).not.toHaveProperty('date');
      expect(project).not.toHaveProperty('tech');
    }
  });
});
