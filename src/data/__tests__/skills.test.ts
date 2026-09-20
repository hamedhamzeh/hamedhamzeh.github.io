import { describe, expect, it } from 'vitest';

import { categories, skills } from '../resume/skills';

describe('skills data', () => {
  it('exports an array of skills', () => {
    expect(Array.isArray(skills)).toBe(true);
    expect(skills.length).toBeGreaterThan(0);
  });

  it('each skill has required properties', () => {
    for (const skill of skills) {
      expect(skill).toHaveProperty('title');
      expect(skill).toHaveProperty('category');

      expect(typeof skill.title).toBe('string');
      expect(Array.isArray(skill.category)).toBe(true);
    }
  });

  it('each skill has at least one category', () => {
    for (const skill of skills) {
      expect(skill.category.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('skill categories reference valid category names', () => {
    const categoryNames = categories.map((c) => c.name);

    for (const skill of skills) {
      for (const cat of skill.category) {
        expect(categoryNames).toContain(cat);
      }
    }
  });

  it('skill categories remain stable for consistent UI display', () => {
    for (const skill of skills) {
      expect(skill.category.length).toBe(1);
    }
  });

  it('provides both IELTS report variants to exercise gallery navigation', () => {
    const ieltsSkill = skills.find((skill) => skill.title.includes('IELTS'));

    expect(ieltsSkill?.gallery?.images).toHaveLength(2);
    expect(ieltsSkill?.gallery?.images.map(({ width }) => width)).toEqual([
      1425, 713,
    ]);
  });
});

describe('categories data', () => {
  it('exports an array of categories', () => {
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it('each category has required properties', () => {
    for (const category of categories) {
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('color');

      expect(typeof category.name).toBe('string');
      expect(typeof category.color).toBe('string');
    }
  });

  it('category colors are valid CSS colors (hex or CSS variable)', () => {
    const hexColorRegex = /^#[0-9a-fA-F]{6}$/;
    const cssVarRegex = /^var\(--[\w-]+\)$/;

    for (const category of categories) {
      const isValidColor =
        hexColorRegex.test(category.color) || cssVarRegex.test(category.color);
      expect(isValidColor).toBe(true);
    }
  });

  it('categories follow the intended resume display order', () => {
    const names = categories.map((c) => c.name);

    expect(names).toEqual([
      'Vision',
      'ML & DL',
      'MLOps',
      'Optimization',
      'Programming',
      'Front-end',
      'Robotics',
      'Mechanical Eng',
      'Tools',
      'Languages',
    ]);
  });

  it('all skill categories are represented', () => {
    const usedCategories = new Set(skills.flatMap((s) => s.category));
    const availableCategories = new Set(categories.map((c) => c.name));

    for (const used of usedCategories) {
      expect(availableCategories.has(used)).toBe(true);
    }
  });

  it('has unique category names', () => {
    const names = categories.map((c) => c.name);
    const uniqueNames = new Set(names);

    expect(uniqueNames.size).toBe(names.length);
  });
});
