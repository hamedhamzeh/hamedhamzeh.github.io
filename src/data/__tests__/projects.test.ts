import { describe, expect, it } from 'vitest';

import projects from '../projects';

describe('project placeholders', () => {
  it('provides the requested category counts without project claims', () => {
    expect(projects).toHaveLength(11);
    expect(
      Object.fromEntries(
        [
          'Computer Vision',
          'Robotics',
          'Front-end',
          'MLOps',
          'ML Projects',
        ].map((category) => [
          category,
          projects.filter((project) => project.category === category).length,
        ]),
      ),
    ).toEqual({
      'Computer Vision': 5,
      Robotics: 2,
      'Front-end': 2,
      MLOps: 1,
      'ML Projects': 1,
    });

    for (const project of projects) {
      expect(project.desc).toBe('Project details will be added here.');
      expect(project.id).toBeTruthy();
      expect(project).not.toHaveProperty('link');
      expect(project).not.toHaveProperty('image');
      expect(project).not.toHaveProperty('date');
      expect(project).not.toHaveProperty('tech');
    }
  });
});
