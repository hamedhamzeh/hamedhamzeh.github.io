# Homepage background

The homepage uses a decorative Canvas 2D vision field in `HeroBackground.tsx`.
The page and its content remain statically rendered; the animation initializes
in a browser effect after hydration. It adds no dependencies, external assets,
API calls, or server requirements and works with the existing GitHub Pages export.

## Approved behavior

- 150 points at viewport widths up to 736px, 250 at 737–1024px, and 400 above 1024px.
- Slow drift, gentle pointer repulsion, and short connections near the pointer.
- A tracking box fades in and out for 2.5 seconds every approximately 4.44 seconds.
- Existing accent tokens supply colors in both themes; points behind hero content are faded.
- Touch-only devices and reduced-motion preferences use the static CSS fallback.
- The background is decorative, hidden from assistive technology, and never intercepts input.

## Performance and lifecycle

Canvas drawing is capped at approximately 30fps and device pixel ratio at 1.5.
The loop pauses when the document is hidden or the hero leaves the viewport.
Resizing updates the point count without starting duplicate loops. Theme changes
update the canvas color. Frames, observers, and event listeners are cleaned up
when navigating away. Distant connections are rejected with squared-distance
checks before computing their lengths.

## Initial page loading

The favicon SVG embeds a 192px optimized PNG rather than the original 1254px
image. Keep the approved transparent HMZ artwork when regenerating it.
`ThemePortrait` serves 160px, 320px, and 640px WebP derivatives using `srcSet`;
the hero's `sizes` matches its 112px mobile and 160px desktop presentation. The
original JPEG remains available. Regenerate the derivatives when replacing it.
Only the hero portrait uses high fetch priority; the footer portrait loads lazily.

Shared navigation, footer, mobile-menu, and hero links disable automatic Next.js
prefetching so other routes do not compete with the initial page load. Clicking
still uses client navigation, but destination downloads begin on navigation.

Filled buttons use a separate foreground token for readable text in each theme,
with a visible keyboard outline. Footer section labels are level-two headings;
the repeated profile name is ordinary text and retains its existing styling.

The shared layout applies the persisted theme using a native inline head script
before hydration. Do not move this bootstrap into `next/script`: its queued
execution can leave the light palette visible until the Next.js runtime loads.
The root canvas uses the same background token as the body. Check saved dark
mode with a light system preference, the inverse, and slow JavaScript downloads
on both initial loads and full-document navigation. A static preview must serve
Next.js `.txt` route payloads as `text/plain`; an incorrect content type can cause
client navigation to fall back to full page loads.

## Verification

Run formatting, lint, TypeScript, `npm test`, and `npm run build` before committing.
`HeroBackground.test.tsx` covers density boundaries, resize, frame throttling,
visibility and motion changes, unavailable canvas, cleanup, pointer connections,
and static rendering.

Check the exported homepage at 390px, 800px, and 1280px. Move the pointer in the
outer background, wait for a tracking box, switch themes, and navigate to About
and back. Confirm that the background does not block links or appear on other
routes. With reduced motion or touch-only input, confirm the static fallback.
Use a production preview for performance measurements; the development server
includes tooling that is absent from the static export.
