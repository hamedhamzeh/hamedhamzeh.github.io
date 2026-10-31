# Front-end project links

The Game Hub and Hosting Landing Page cards replace the two Front-end placeholders
and open each project's independent GitHub Pages deployment in a new tab:

- Game Hub: https://hamedhamzeh.github.io/my-game-hub/
- Hosting Landing Page: https://hamedhamzeh.github.io/my-front-project/

The portfolio contains the cards, their two thumbnail assets, and the warm note
shown only when Front-end is selected. It contains no imported application source,
compiled bundles, API configuration, app-specific build commands, redirects, or
embedded frames. These external deployments are not added to the portfolio sitemap.

Both links opt in to `openInNewTab`, with `noopener noreferrer` and a screen-reader
notice. These two cards use the action label **Visit website**; their category label is
simply **Front-end**, with no coursework attribution on the cards. Other cards keep
their existing action labels and navigation behavior. The posters
are 1024 by 576 WebP images, each smaller than 31,000 bytes, cropped from the
user-supplied screenshots of the live homepages. Browser controls, bookmarks,
scrollbars, and the Windows taskbar are removed. The complete page viewport is
preserved without stretching, with page-colored clearance inside the 16:9 frame.
The original full-screen captures are not included in the portfolio.

The user confirmed both projects were built through Code with Mosh coursework
before AI became part of their coding routine. Keep the attribution accurate.

## Project ownership and validation

Game Hub source, API timeout and sample-catalog improvements, cached artwork, tests,
and build tooling live in `G:\work\Front-Projects\my-game-hub`.
The HTML/CSS landing page and its navigation, local demo controls, metadata, and
portrait improvements live in `G:\work\Front-Projects\my-front-project`.
Each project has its own README with local preview and verification instructions.

Run the portfolio's normal checks and
`npm run test:e2e -- e2e/frontend-demos.spec.ts` for card links, thumbnails, themes,
and conditional note visibility. App behavior is verified against previews served
from the original repos. Do not rely on deployed sites to reflect uncommitted local
changes. No commit, push, or deployment is part of this migration.
