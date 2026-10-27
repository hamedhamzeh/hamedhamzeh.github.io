import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  getAllProjects,
  getDetailSlugs,
  getProjectBySlug,
  getProjectShowcaseEntries,
  getPublicationBySlug,
} from '../portfolio-content';

describe('portfolio Markdown content', () => {
  const temporaryRoots: string[] = [];

  afterEach(() => {
    vi.restoreAllMocks();
    for (const root of temporaryRoots)
      fs.rmSync(root, { recursive: true, force: true });
    temporaryRoots.length = 0;
  });

  function useTemporaryContent(
    kind: 'projects' | 'publications',
    slug: string,
    markdown: string,
  ) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-content-'));
    temporaryRoots.push(root);
    const directory = path.join(root, 'content', kind);
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, `${slug}.md`), markdown);
    vi.spyOn(process, 'cwd').mockReturnValue(root);
  }

  it('loads the first publication from Markdown and derives its route', () => {
    const slug = 'wormlike-robot-ferromagnetic-surface-inspection';
    const publication = getPublicationBySlug(slug);
    expect(publication).toMatchObject({
      detailPath: `/publications/${slug}/`,
      doi: '10.1109/MRA.2026.3683248',
      status: 'Published',
    });
    expect(getDetailSlugs('publications')).toContain(slug);
    expect(publication?.media.videoGalleries?.experiments).toHaveLength(5);
    expect(publication?.media.galleries?.['design']).toHaveLength(3);
    expect(publication?.media.galleries?.['analysis']).toBeUndefined();
    expect(publication?.media.galleries?.['results']).toHaveLength(4);
  });

  it('loads the puppet publication video gallery', () => {
    const publication = getPublicationBySlug('puppet-robot-pose-detection');
    expect(publication?.media.images?.['pose-annotations']).toBeDefined();
    expect(publication?.media.galleries?.['mechanical-design']).toHaveLength(4);
    expect(publication?.media.galleries?.['model-results']).toBeUndefined();
    expect(publication?.media.videoGalleries?.demonstrations).toHaveLength(3);
  });

  it('points every publication image at an existing file', () => {
    for (const slug of getDetailSlugs('publications')) {
      const publication = getPublicationBySlug(slug);
      const images = [
        ...Object.values(publication?.media.images ?? {}),
        ...Object.values(publication?.media.galleries ?? {}).flat(),
      ];
      for (const image of images) {
        expect(
          fs.existsSync(path.join(process.cwd(), 'public', image.src.slice(1))),
        ).toBe(true);
      }
    }
  });

  it('points every publication video at an existing MP4 and poster', () => {
    for (const slug of [
      'wormlike-robot-ferromagnetic-surface-inspection',
      'puppet-robot-pose-detection',
    ]) {
      const publication = getPublicationBySlug(slug);
      for (const videos of Object.values(
        publication?.media.videoGalleries ?? {},
      )) {
        for (const video of videos) {
          expect(
            fs.existsSync(path.join(process.cwd(), 'public', video.src)),
          ).toBe(true);
          expect(
            fs.existsSync(path.join(process.cwd(), 'public', video.poster)),
          ).toBe(true);
        }
      }
    }
  });

  it('adds a Markdown-backed project to the index data', () => {
    useTemporaryContent(
      'projects',
      'sample-project',
      `---
title: Sample Project
description: A project used to test Markdown loading.
date: '2026-09-23'
featured: false
---
## Overview

Sample body.
`,
    );
    expect(getProjectBySlug('sample-project')).toMatchObject({
      link: '/projects/sample-project/',
      desc: 'A project used to test Markdown loading.',
    });
    expect(
      getAllProjects().some(
        (project) => project.link === '/projects/sample-project/',
      ),
    ).toBe(true);
  });

  it('keeps Markdown projects separate from index placeholders', () => {
    useTemporaryContent(
      'projects',
      'sample-project',
      `---
title: Sample Project
description: A sample project summary.
date: '2026-09-23'
---
Project body.
`,
    );
    expect(getAllProjects()).toHaveLength(1);
    expect(getAllProjects()[0]).toMatchObject({
      title: 'Sample Project',
      link: '/projects/sample-project/',
      desc: 'A sample project summary.',
    });
  });

  it('rejects an invalid project date', () => {
    useTemporaryContent(
      'projects',
      'invalid-date',
      `---
title: Invalid Date
description: A test entry.
date: '2026-02-31'
---
`,
    );
    expect(() => getProjectBySlug('invalid-date')).toThrow(/valid YYYY-MM-DD/);
  });

  it('replaces a placeholder with a real card without duplicating or sending article data', () => {
    const cards = getProjectShowcaseEntries();
    expect(cards).toHaveLength(11);
    expect(
      cards.filter((card) => card.category === 'Computer Vision'),
    ).toHaveLength(5);
    expect(cards[0]).toMatchObject({
      title: 'Contact-Anchored Ball Mapping',
      label: 'AISoccerCoach · Computer Vision',
      desc: 'Estimating a 2D ball path from soccer broadcasts using contact detection and player tracking.',
      link: '/projects/contact-anchored-soccer-ball-mapping/',
    });
    expect(cards[0]).not.toHaveProperty('subtitle');
    expect(cards[0]).not.toHaveProperty('tech');
    const project = getProjectBySlug('contact-anchored-soccer-ball-mapping');
    expect(project?.title).toBe('AISoccerCoach: Contact-Anchored Ball Mapping');
    expect(project?.subtitle).toBe(
      'Estimating a 2D ball path from single-camera soccer broadcasts.',
    );
    expect(project?.tech).toHaveLength(4);
    expect(cards[0]).not.toHaveProperty('number');
    expect(cards[0]).not.toHaveProperty('content');
    expect(cards[0]).not.toHaveProperty('media');
  });

  it('rejects replacement slots belonging to another category', () => {
    useTemporaryContent(
      'projects',
      'wrong-category',
      `---
title: Test
description: Test
category: Robotics
replaces: computer-vision-01
---
`,
    );
    expect(() => getProjectShowcaseEntries()).toThrow(
      /placeholder in its category/,
    );
  });

  it('allows an undated project and validates all its demonstration files', () => {
    const project = getProjectBySlug('contact-anchored-soccer-ball-mapping');
    expect(project?.date).toBeUndefined();
    const videos = Object.values(project?.media.videoGalleries ?? {}).flat();
    expect(videos).toHaveLength(4);
    expect(
      project?.media.videoGalleries?.['trajectory-candidates'],
    ).toHaveLength(1);
    expect(project?.content).not.toMatch(/repository|notebook|colab/i);
    expect(project?.content).toContain('to discuss access');
    for (const video of videos ?? []) {
      for (const file of [video.src, video.poster]) {
        expect(fs.existsSync(path.join(process.cwd(), 'public', file))).toBe(
          true,
        );
      }
    }
  });

  it('rejects a missing gallery reference', () => {
    useTemporaryContent(
      'projects',
      'broken-gallery',
      `---
title: Broken Gallery
description: A test entry.
date: '2026-09-23'
---
<Gallery id="missing" />
`,
    );
    expect(() => getProjectBySlug('broken-gallery')).toThrow(
      /missing media id/,
    );
  });

  it('rejects invalid image dimensions', () => {
    useTemporaryContent(
      'projects',
      'broken-image',
      `---
title: Broken Image
description: A test entry.
date: '2026-09-23'
media:
  images:
    robot:
      src: /images/robot.webp
      alt: Robot
      width: 0
      height: 500
---
<ImageBlock id="robot" />
`,
    );
    expect(() => getProjectBySlug('broken-image')).toThrow(
      /positive integer width and height/,
    );
  });

  it('rejects a missing video gallery reference', () => {
    useTemporaryContent(
      'projects',
      'broken-videos',
      `---
title: Broken Videos
description: A test entry.
date: '2026-09-23'
---
<VideoGallery id="missing" />
`,
    );
    expect(() => getProjectBySlug('broken-videos')).toThrow(/missing media id/);
  });

  it('rejects invalid video paths and dimensions', () => {
    useTemporaryContent(
      'projects',
      'broken-video-data',
      `---
title: Broken Video Data
description: A test entry.
date: '2026-09-23'
media:
  videoGalleries:
    demo:
      - src: https://example.com/demo.mp4
        poster: /videos/demo.webp
        title: Demo
        width: 0
        height: 720
---
<VideoGallery id="demo" />
`,
    );
    expect(() => getProjectBySlug('broken-video-data')).toThrow(
      /positive integer width and height/,
    );
  });

  it('rejects external video URLs', () => {
    useTemporaryContent(
      'projects',
      'external-video',
      `---
title: External Video
description: A test entry.
date: '2026-09-23'
media:
  videoGalleries:
    demo:
      - src: https://example.com/demo.mp4
        poster: /videos/demo.webp
        title: Demo
---
<VideoGallery id="demo" />
`,
    );
    expect(() => getProjectBySlug('external-video')).toThrow(
      /local \/videos\/ .mp4 path/,
    );
  });
});
