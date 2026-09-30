import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  getAllProjects,
  getDetailSlugs,
  getProjectBySlug,
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

  it('upgrades a matching project card instead of duplicating it', () => {
    useTemporaryContent(
      'projects',
      'nearest-dollar',
      `---
title: Nearest Dollar
description: A replacement summary for the existing card.
date: '2026-09-23'
---
Project body.
`,
    );
    const matching = getAllProjects().filter(
      (project) => project.title === 'Nearest Dollar',
    );
    expect(matching).toHaveLength(1);
    expect(matching[0]).toMatchObject({
      link: '/projects/nearest-dollar/',
      desc: 'A replacement summary for the existing card.',
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
