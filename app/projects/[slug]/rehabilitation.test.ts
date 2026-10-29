import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import placeholders from '@/data/projects';
import degrees from '@/data/resume/degrees';
import {
  getProjectBySlug,
  getProjectShowcaseEntries,
} from '@/lib/portfolio-content';
import { SITE_URL } from '@/lib/utils';
import sitemap from '../../sitemap';
import { generateMetadata, generateStaticParams } from './page';

const slug = 'whole-body-rehabilitation-device';
const projectPath = `/projects/${slug}/`;

describe('rehabilitation project integration', () => {
  it('replaces one Robotics slot and connects Education to the same article', () => {
    const cards = getProjectShowcaseEntries();
    const robotics = cards.filter((card) => card.category === 'Robotics');
    expect(cards).toHaveLength(placeholders.length);
    expect(robotics).toHaveLength(2);
    expect(robotics.filter((card) => 'number' in card)).toHaveLength(1);
    expect(robotics.filter((card) => 'link' in card)).toHaveLength(1);
    expect(robotics[0]).toMatchObject({
      title: 'Whole-Body Rehabilitation Device',
      label: 'Bachelor’s project · Mechanical design',
      replaces: 'robotics-01',
      link: projectPath,
    });
    expect(degrees[0].thesis?.projectUrl).toBe(projectPath);
    expect(getProjectBySlug(slug)?.link).toBe(projectPath);
  });

  it('exports the canonical page with a dedicated share image and sitemap entry', async () => {
    expect(generateStaticParams()).toContainEqual({ slug });
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug }),
    });
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}${projectPath}`);
    expect(metadata.openGraph?.url).toBe(`${SITE_URL}${projectPath}`);
    expect(metadata.openGraph?.images).toEqual([
      {
        url: `/images/projects/${slug}/assembly-card.webp`,
        alt: 'Whole-Body Rehabilitation Device',
      },
    ]);
    expect(sitemap().map((entry) => entry.url)).toContain(
      `${SITE_URL}${projectPath}`,
    );
  });

  it('ships every declared figure, the single CAD simulation and its poster', () => {
    const project = getProjectBySlug(slug);
    expect(project).not.toBeNull();
    const images = [
      ...Object.values(project?.media.images ?? {}),
      ...Object.values(project?.media.galleries ?? {}).flat(),
    ];
    expect(images).toHaveLength(8);
    const videos = Object.values(project?.media.videoGalleries ?? {}).flat();
    expect(videos).toHaveLength(1);
    expect(videos[0].title).toContain('CAD simulation');
    expect(videos[0].transcript).toBeTruthy();
    const assets = [
      project?.image,
      ...images.map((image) => image.src),
      videos[0].src,
      videos[0].poster,
    ];
    for (const asset of assets) {
      expect(asset).toBeTruthy();
      expect(
        fs.statSync(path.join(process.cwd(), 'public', asset!)).size,
      ).toBeGreaterThan(0);
    }
  });
});
