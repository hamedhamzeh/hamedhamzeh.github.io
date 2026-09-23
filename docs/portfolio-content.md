# Portfolio detail pages

Add a Markdown file named for its URL slug in `content/publications/` or `content/projects/`. For example, `content/projects/my-robot.md` creates `/projects/my-robot/` and adds a card to the Projects index. Only files with a detail page belong in these directories; card-only entries remain in the TypeScript data files.

The file needs the required frontmatter below. The card and page appear during local development; the published static site gets them on its next build and deployment.

If its title matches an existing TypeScript card, the Markdown entry upgrades that card instead of adding a duplicate. For a publication, any existing presentation-certificate data remains attached; the Markdown frontmatter supplies the shared citation and page fields.

## Project frontmatter

```md
---
title: My Robot
description: A short, factual summary for the card and search metadata.
date: '2026-09-23'
subtitle: Optional card subtitle
image: /images/projects/my-robot.webp
tech:
  - Python
  - Computer Vision
featured: false
---

## Overview

Write the project story here.
```

`title`, `description`, and `date` are required. `subtitle`, `image`, `tech`, and `featured` are optional. The route and card link come from the filename. The current Projects index places `featured: true` entries in its featured group and all other entries in its second group.

## Publication frontmatter

The two published-paper files in `content/publications/` are current examples. A publication requires `title`, `description`, `authors` (each with `name` and `citationName`), `year`, `type`, and `status`. Optional fields include `venue`, `url`, `linkLabel`, `doi`, `image`, and `presentation`. The puppet robot file shows how `presentation` keeps its certificate gallery on the Resume. The frontmatter supplies its card, Resume citation, and detail-page metadata. The Markdown body may be empty until verified detail is ready.

## Images and galleries

Define named media in frontmatter, then insert it where needed in the body:

```md
---
title: My Robot
description: A short, factual summary.
date: '2026-09-23'
media:
  images:
    prototype:
      src: /images/projects/prototype.webp
      alt: The robot prototype on a workbench
      width: 1200
      height: 800
      caption: Prototype on the workbench
  galleries:
    testing:
      - src: /images/projects/test-one.webp
        alt: The robot at the start of a test
        width: 1200
        height: 800
      - src: /images/projects/test-two.webp
        alt: The robot at the end of a test
        width: 1200
        height: 800
---

## Prototype

<ImageBlock id="prototype" />

## Testing

<Gallery id="testing" />
```

Use local `/images/` paths, meaningful alt text, and the actual image dimensions. A gallery needs at least two images. It displays thumbnails that open the existing lightbox. Standard Markdown headings receive stable URL anchors. Video blocks will be defined in a later milestone.
