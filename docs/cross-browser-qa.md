# Cross-browser visual checks

The goal is consistent colors, typography, icons, media, and motion behavior.
Font antialiasing, native video controls, and browser chrome can still differ.
Viewport resizing alone does not test browser engines or touch capabilities.

## Design rules

- A first visit defaults to dark. Saved light/dark choices take priority, even
  over the device preference. Use a fresh browser profile to check the default.
- Use shared CSS tokens and bundled site fonts for the visual system. Check
  again after fonts and images load, and with a slow connection.
- Use SVGs for control icons rather than Unicode arrows that depend on fonts.
- Keep the homepage drift and tracking boxes on touch devices. Only pointer
  interaction depends on mouse/pen input. Reduced motion keeps a static field.
- Browser support must be checked against the CSS actually shipped. The
  `browserslist` field alone does not guarantee feature fallbacks.

## Before releasing

1. Run formatting, lint, TypeScript, tests, and the production static build.
2. Preview the export, rather than relying only on the development server.
3. Inspect Home, About, Resume, Publications, both publication detail pages,
   Projects, and Contact at 320px, 390px, 768px, and a desktop width, in both
   themes. Check landscape and 200% text zoom, too.
4. Repeat core flows in desktop Chrome/Edge, Firefox, and Safari. Mobile checks
   need Android Chrome and iPhone Safari. A phone-shaped preview is useful but
   does not replace these checks.
5. Check fresh storage with a light system preference, saved light and dark
   preferences, blocked storage, reduced motion, touch-only input, and keyboard
   navigation. Verify the theme before hydration and after a full reload.
6. On Home, confirm drift, tracking boxes, theme changes, scroll behavior, and
   pausing when hidden/offscreen. On Publications and Resume, check SVG arrows,
   wrapped actions, and links. Check menus, galleries, and video playback on the
   detail pages. Verify that fonts/images finish loading and no content spills
   sideways.
7. Repeat the core checks on the published URL after deployment; record the
   browser/OS, site revision, viewport, theme, and input/motion settings for any
   failure. A local pass does not verify the deployed site.

## Playwright on Windows

The project now includes `@playwright/test`, a Node-based static preview server,
and five projects in `playwright.config.ts`: installed Microsoft Edge (Chromium),
Firefox, WebKit, Android/Pixel emulation through Edge, and iPhone emulation
through WebKit. The desktop visual profiles use 1280px; navigation regressions
use 390px in every engine. Emulation does not run Android or iOS itself.

Install the test browsers once with `npx playwright install firefox webkit`.
Edge must already be installed. This configuration uses Edge because the
Chromium download service returned a regional access restriction during setup.
No browser extension or paid testing service is required.

After changing website source, build the static export before testing:

```bash
npm run build
npm run test:e2e
npm run test:e2e:report
```

The tests start `npm run preview` automatically on `127.0.0.1:4174`. You can
also run the preview yourself. The report opens on `127.0.0.1:9323` and includes
action traces. These servers bind only to this computer.

For an interactive demonstration, run `npm run test:e2e:ui` and open
`http://127.0.0.1:9324`. Select a project, run a test, then click its actions to
inspect the rendered page before and after each step. Unlike Vitest's existing
`test:ui`, this interface runs real browser engines. Stop the terminal command
with Ctrl+C when finished.

### Current coverage

- Open/dismiss the hamburger from Resume Skills without changing scroll,
  content width, heading position, or sticky section-navigation position.
- Keep Resume still during a deliberately delayed destination load; reset
  scroll when the new page commits. Selecting Resume again only closes the menu.
- Preserve focus on dismissal, prevent background scroll, and keep the menu
  closed when returning with browser Back. Mobile WebKit lacks a mouse-wheel
  API, so mobile profiles verify the touch-cancellation guard instead; real
  finger swipes still need a phone check.
- Check Home and Publications in both themes and attach screenshots for local
  review, plus the menu over Skills. These are previews, not pixel comparisons.
- Check the dark first-visit default with a light system setting, saved light
  persistence, canvas frame changes on desktop/touch profiles, and reduced motion.

Screenshot previews wait for fonts and visible images. They include the actual
decorative canvas; its animation is checked separately. Screenshots, reports,
videos, and traces stay in ignored `test-results/` and `playwright-report/`
folders. No reference images are required or committed. `e2e/snapshots/` is also
ignored to prevent accidental inclusion of old baselines. Extend coverage to
the remaining pages and real phones as part of the release checklist above.

Run the CLI suite and UI runner separately because they share test artifacts.
Local tests stub Google analytics requests so they do not depend on that service
or count as website visits. The website's analytics code remains unchanged.

### Reviewing visual changes

Run `npm run test:e2e`, open the report or UI, and inspect the screenshots under
Attachments for the tests tagged `@visual`. Compare colors, fonts, icons, and
spacing manually. The behavior tests automatically detect the menu and theme
regressions listed above, but passing them does not certify the whole design:
automatic screenshot comparison has been removed at the user's request to
keep generated images out of the repository.

Keep a short real-phone check for scrolling, browser bars, battery/performance
behavior, and native media playback. A Windows WebKit pass does not verify
actual iPhone Safari or its media codecs.

Windows WebKit also renders the site's variable-font weights much thinner than
Edge and Firefox, despite loading the same fonts and applying the same CSS.
Its previews are not approval of iPhone typography. Compare text weight on a
real iPhone before release. Playwright's
[Windows WebKit font-rendering issue](https://github.com/microsoft/playwright/issues/7441)
describes this platform limitation.
