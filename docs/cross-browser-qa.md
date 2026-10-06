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

## Repeatable visual regression coverage

For future automation, use Playwright projects for Chromium, Firefox, and
WebKit, with separate desktop and touch/mobile profiles. Test both themes and
reduced motion explicitly. Compare screenshots against a reviewed baseline
for each browser/profile; do not compare all engines to one identical image.
Wait for fonts/images, and mask or pause the canvas in screenshot comparisons
so changing animation frames do not create false failures. Check actual canvas
animation separately. Keep a short real-phone check for scrolling, browser
bars, battery/performance behavior, and native media playback.

This repository currently has unit tests for touch animation and theme startup;
it does not yet have the browser-engine screenshot suite described above.
