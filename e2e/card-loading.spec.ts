import { expect, test } from './fixtures';

for (const path of ['/projects/', '/publications/']) {
  test(`${path} prioritizes only the first poster in the exported HTML`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
    });
    try {
      const page = await context.newPage();
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      const posters = page.locator('.card-poster img');
      await expect(posters.first()).toHaveAttribute('fetchpriority', 'high');
      await expect(posters.first()).toHaveAttribute('loading', 'eager');
      await expect(
        page.locator('.card-poster img[fetchpriority="high"]'),
      ).toHaveCount(1);
      await expect(
        page.locator('.card-poster img[loading="lazy"]'),
      ).toHaveCount((await posters.count()) - 1);
    } finally {
      await context.close();
    }
  });
}

test('publication card skeletons clear when a poster loads or fails', async ({
  page,
}) => {
  const gate = Promise.withResolvers<void>();
  await page.route('**/wormlike-robot-poster.webp', async (route) => {
    await gate.promise;
    await route.abort('failed');
  });
  await page.route('**/puppet-demo-1.webp', async (route) => {
    await gate.promise;
    await route.continue();
  });
  await page.goto('/publications/', { waitUntil: 'domcontentloaded' });
  const cards = page.locator('.publications-grid article');
  const first = cards.nth(0);
  const firstPoster = first.locator('.card-poster');
  const secondPoster = cards.nth(1).locator('.card-poster');
  let before = null;
  try {
    await expect(firstPoster).toHaveAttribute('data-status', 'loading');
    const header = first.locator('.project-card-header');
    const link = first.getByRole('link', { name: 'Publication page' });
    await expect(header).toHaveCSS('opacity', '0');
    await link.focus();
    await expect(link).toBeFocused();
    await expect(header).toHaveCSS('opacity', '1');
    before = await firstPoster.boundingBox();
  } finally {
    gate.resolve();
  }
  await expect(first.getByText('Image unavailable')).toBeVisible();
  await expect(firstPoster).toHaveAttribute('data-status', 'error');
  await expect(secondPoster).toHaveAttribute('data-status', 'loaded');
  const after = await firstPoster.boundingBox();
  expect(after?.width).toBe(before?.width);
  expect(after?.height).toBe(before?.height);
});

test('Projects shows the page content while the cards load', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const gate = Promise.withResolvers<void>();
  await page.route('**/posters/01_comparison.webp', async (route) => {
    await gate.promise;
    await route.continue();
  });
  await page.goto('/projects/', { waitUntil: 'domcontentloaded' });
  const firstCard = page.locator('.project-carousel-slide').first();
  const poster = firstCard.locator('.card-poster');
  const header = firstCard.locator('.project-card-header');
  try {
    await expect(
      page.getByRole('heading', { name: 'Projects', exact: true }),
    ).toBeVisible();
    await expect(page.locator('.projects-intro')).toBeVisible();
    await expect(
      page.getByRole('group', { name: 'Project categories' }),
    ).toBeVisible();
    await expect(poster).toHaveAttribute('data-status', 'loading');
    await expect(header).toHaveCSS('opacity', '0');
  } finally {
    gate.resolve();
  }
  await expect(poster).toHaveAttribute('data-status', 'loaded');
  await expect(header).toHaveCSS('opacity', '1');
});

test('project filters and the Next control leave new posters at normal priority', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/projects/');
  const next = page.getByRole('button', { name: 'Next projects' });
  await next.click();
  const visiblePoster = page.locator(
    '.project-carousel-slide[aria-hidden="false"] .card-poster',
  );
  await expect(visiblePoster).toHaveAttribute('data-status', 'loaded');
  await expect(visiblePoster.locator('img')).toHaveAttribute('loading', 'lazy');

  await page.getByRole('button', { name: 'MLOps', exact: true }).click();
  await expect(visiblePoster).toHaveAttribute('data-status', 'loaded');
  await expect(
    page.locator('.card-poster img[fetchpriority="high"]'),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(visiblePoster).toHaveAttribute('data-status', 'loaded');
  await expect(
    page.locator('.card-poster img[fetchpriority="high"]'),
  ).toHaveCount(0);
});
