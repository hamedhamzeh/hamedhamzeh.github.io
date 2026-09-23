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
});
