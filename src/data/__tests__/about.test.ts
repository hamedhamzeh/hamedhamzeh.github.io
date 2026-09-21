import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '../about';

describe('about data', () => {
  it('exports aboutMarkdown as a string', () => {
    expect(typeof aboutMarkdown).toBe('string');
    expect(aboutMarkdown.length).toBeGreaterThan(0);
  });

  it('contains the intro section', () => {
    expect(aboutMarkdown).toContain('# Intro');
    expect(aboutMarkdown).toContain('computer vision');
    expect(aboutMarkdown).toContain('AISoccer Coach');
  });

  it('contains the history section', () => {
    expect(aboutMarkdown).toContain('# Some History');
    expect(aboutMarkdown).toContain('University of Tehran');
  });

  it('contains the likes section', () => {
    expect(aboutMarkdown).toContain('# I Like');
    expect(aboutMarkdown).toContain('Playing volleyball');
    expect(aboutMarkdown).toContain('Chess.com');
  });

  it('contains the fun facts section', () => {
    expect(aboutMarkdown).toContain('# Fun Facts');
  });

  it('contains the dreams section', () => {
    expect(aboutMarkdown).toContain('# I Dream Of');
    expect(aboutMarkdown).toContain('A freer and brighter future for Iran');
  });

  it('contains the closing section', () => {
    expect(aboutMarkdown).toContain('# One Last Thing');
    expect(aboutMarkdown).toContain('interested in collaborating');
  });

  it('contains valid markdown links', () => {
    // Check for markdown link format [text](url)
    const linkRegex = /\[.+?\]\(.+?\)/g;
    const links = aboutMarkdown.match(linkRegex);

    expect(links).not.toBeNull();
    expect(links).toHaveLength(2);
  });

  it('contains properly formatted headers', () => {
    // Check for markdown headers
    const headerRegex = /^#+ .+$/gm;
    const headers = aboutMarkdown.match(headerRegex);

    expect(headers).not.toBeNull();
    expect(headers!.length).toBeGreaterThan(5);
  });
});
