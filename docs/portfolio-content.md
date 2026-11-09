# Portfolio detail pages

Add a Markdown file named for its URL slug in `content/publications/` or `content/projects/`. For example, `content/projects/my-robot.md` creates `/projects/my-robot/` and adds a card to the Projects index. Only files with a detail page belong in these directories; card-only entries remain in the TypeScript data files.

The file needs the required frontmatter below. The card and page appear during local development; the published static site gets them on its next build and deployment.

Use a project's `replaces` field to upgrade a neutral placeholder without adding a duplicate. For publications, matching titles upgrade existing TypeScript entries, and existing presentation-certificate data remains attached.

## Project frontmatter

```md
---
title: My Robot
description: A short, factual summary for the card and search metadata.
category: Robotics
replaces: robotics-01
date: '2026-09-23'
subtitle: Optional page subtitle
image: /images/projects/my-robot.webp
tech:
  - Python
  - Computer Vision
featured: false
---

## Overview

Write the project story here.
```

`title` and `description` are required; a known `category` is required for the Projects index. Categories are Computer Vision, Robotics, Front-end, MLOps, and ML Projects. `date` is optional and should only be supplied when verified. `subtitle`, `image`, `tech`, and `featured` are optional. The route and card link come from the filename. Card images may use an existing video poster; named image blocks still require `/images/` paths.

The Projects index uses a category-filtered carousel. Set `replaces` to an existing placeholder ID (for example, `computer-vision-01`) in the same category to replace that slot. Omit it to append another project. Duplicate replacements and category mismatches fail validation. Markdown is the single source for the real card and detail page; only card fields are passed to the client carousel. Remaining placeholders stay static.

For a compact card, add optional `card` frontmatter with `title`, `description`, and optional `label`. These override only the index card; the full page title, subtitle, description, technologies, and body stay intact. Index cards omit the subtitle and tags and show a full-width **Explore project** footer inside the card's single link. Their media frame is 16:9, while the carousel keeps three, two, or one cards at its existing breakpoints. The carousel reserves padding for the hover lift, shadow, and keyboard focus ring. For example:

```yaml
card:
  label: AISoccerCoach · Computer Vision
  title: Contact-Anchored Ball Mapping
  description: Estimating a 2D ball path from soccer broadcasts using contact detection and player tracking.
```

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

Use local `/images/` paths, meaningful alt text, and the actual image dimensions. A gallery needs at least two images. It displays thumbnails that open the existing lightbox. Standard Markdown headings receive stable URL anchors. `<ImageBlock id="…" display="card" />` renders a single image as a lightbox card, `showCaptions="false"` hides gallery thumbnails' captions, and `<VideoGallery id="…" showTitle="false" />` renders a named `videoGalleries` entry.

A `videoGalleries` entry with one video uses the shared player in a centered, content-width frame, with no carousel, selectors, or drag behavior. Entries with two or more videos retain the peek carousel. Add `transcript` to describe visual-only demonstrations accessibly.

## Maintaining the team assignment page

The second AISoccerCoach project is defined in [the Team & Role Assignment entry](../content/projects/soccer-team-role-assignment.md). Use the [cross-browser QA guide](./cross-browser-qa.md) to verify its media and layout.
