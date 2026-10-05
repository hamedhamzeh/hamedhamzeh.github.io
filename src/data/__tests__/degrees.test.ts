import { describe, expect, it } from 'vitest';

import degrees from '../resume/degrees';

describe('degrees data', () => {
  it('exports an array of degrees', () => {
    expect(Array.isArray(degrees)).toBe(true);
    expect(degrees.length).toBeGreaterThan(0);
  });

  it('each degree has required properties', () => {
    for (const degree of degrees) {
      expect(degree).toHaveProperty('school');
      expect(degree).toHaveProperty('degree');
      expect(degree).toHaveProperty('link');
      expect(degree).toHaveProperty('startYear');
      expect(degree).toHaveProperty('endYear');

      expect(typeof degree.school).toBe('string');
      expect(typeof degree.degree).toBe('string');
      expect(typeof degree.link).toBe('string');
      expect(typeof degree.startYear).toBe('number');
      expect(typeof degree.endYear).toBe('number');
    }
  });

  it('degree years are reasonable (between 1950 and current year + 10)', () => {
    const currentYear = new Date().getFullYear();

    for (const degree of degrees) {
      expect(degree.startYear).toBeGreaterThanOrEqual(1950);
      expect(degree.endYear).toBeLessThanOrEqual(currentYear + 10);
      expect(degree.endYear).toBeGreaterThanOrEqual(degree.startYear);
    }
  });

  it('links are valid URLs', () => {
    const urlRegex = /^https?:\/\/.+/;

    for (const degree of degrees) {
      expect(degree.link).toMatch(urlRegex);
    }
  });

  it('degrees are ordered by year (most recent first)', () => {
    for (let i = 0; i < degrees.length - 1; i++) {
      expect(degrees[i].endYear).toBeGreaterThanOrEqual(degrees[i + 1].endYear);
    }
  });

  it('has unique school entries', () => {
    const schools = degrees.map((d) => d.school);
    const uniqueSchools = new Set(schools);

    expect(uniqueSchools.size).toBe(schools.length);
  });

  it('each degree has a non-empty degree name', () => {
    for (const degree of degrees) {
      expect(degree.degree.trim().length).toBeGreaterThan(0);
    }
  });

  it('thesis details are complete when present', () => {
    for (const degree of degrees) {
      if (degree.thesis) {
        expect(degree.thesis.title.trim().length).toBeGreaterThan(0);
        expect(degree.thesis.grade).toMatch(/^\d+(\.\d+)?\/\d+$/);
        expect(degree.thesis.supervisor.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
