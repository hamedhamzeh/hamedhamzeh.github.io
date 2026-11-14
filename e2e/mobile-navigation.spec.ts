import { expect, type Page, test } from './fixtures';

async function visitSkills(page: Page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/resume/');
  await expect(
    page.getByRole('button', { name: 'Open navigation menu' }),
  ).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
    document
      .querySelector('#skills')
      ?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await expect(page.locator('#skills h2')).toBeInViewport();
  return page.evaluate(() => ({
    scrollY: window.scrollY,
    width: document.querySelector('#skills')!.getBoundingClientRect().width,
    top: document.querySelector('#skills h2')!.getBoundingClientRect().top,
    navTop: document.querySelector('.section-nav')!.getBoundingClientRect().top,
  }));
}

test('opening and dismissing the menu preserves the Skills layout and scroll', async ({
  page,
}, testInfo) => {
  const before = await visitSkills(page);
  await test.step('Open the hamburger from Skills', async () => {
    await page.getByRole('button', { name: 'Open navigation menu' }).click();
    await expect(
      page.getByRole('dialog', { name: 'Navigation menu' }),
    ).toBeVisible();
  });
  const opened = await page.evaluate(() => ({
    scrollY: window.scrollY,
    width: document.querySelector('#skills')!.getBoundingClientRect().width,
    top: document.querySelector('#skills h2')!.getBoundingClientRect().top,
    navTop: document.querySelector('.section-nav')!.getBoundingClientRect().top,
  }));
  for (const key of ['scrollY', 'width', 'top', 'navTop'] as const) {
    expect(Math.abs(opened[key] - before[key]), key).toBeLessThan(1);
  }
  if (!testInfo.project.use.isMobile) {
    await page.mouse.move(10, 400);
    await page.mouse.wheel(0, 400);
  } else {
    // Mobile WebKit has no mouse-wheel API. Verify the background touch guard.
    const gestureAllowed = await page
      .locator('.slide-menu-overlay')
      .evaluate((overlay: HTMLElement) =>
        overlay.dispatchEvent(
          new Event('touchmove', { bubbles: true, cancelable: true }),
        ),
      );
    expect(gestureAllowed).toBe(false);
  }
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBe(before.scrollY);
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('button', { name: 'Open navigation menu' }),
  ).toBeFocused();
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBe(before.scrollY);
});

test('the menu closes without covering the current page before About commits', async ({
  page,
}) => {
  const before = await visitSkills(page);
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  // Simulate a slow destination to expose movement before the route commits.
  const gate = Promise.withResolvers<void>();
  await page.route('**/about/**', async (route) => {
    await gate.promise;
    await route.continue();
  });
  await page.evaluate(() => {
    const samples: number[] = [];
    (
      window as Window & { navigationScrollSamples?: number[] }
    ).navigationScrollSamples = samples;
    const sample = () => {
      if (!document.querySelector('.resume-page')) return;
      samples.push(window.scrollY);
      requestAnimationFrame(sample);
    };
    sample();
  });
  try {
    await page
      .getByRole('dialog')
      .getByRole('link', { name: 'About', exact: true })
      .click();
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(
      page.getByRole('status').filter({ hasText: 'Loading About' }),
    ).toHaveText('Loading About');
    await expect(page.locator('.route-skeleton')).toHaveCount(0);
    await expect(page.locator('#skills h2')).toBeInViewport();
    await expect(
      page.getByRole('heading', { name: 'Resume', level: 1 }),
    ).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.style.overflow))
      .not.toBe('hidden');
  } finally {
    gate.resolve();
  }
  const heading = page.getByRole('heading', {
    level: 1,
    name: 'About',
    exact: true,
  });
  await expect(heading).toBeVisible();
  await expect(heading).toBeFocused();
  await expect(page.locator('.route-skeleton')).toHaveCount(0);
  const samples = await page.evaluate(
    () =>
      (window as Window & { navigationScrollSamples?: number[] })
        .navigationScrollSamples ?? [],
  );
  expect(samples.length).toBeGreaterThan(5);
  expect(samples.every((y: number) => Math.abs(y - before.scrollY) < 1)).toBe(
    true,
  );
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect
    .poll(() =>
      page.evaluate(() => getComputedStyle(document.documentElement).overflow),
    )
    .not.toBe('hidden');
  await page.goBack();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Resume', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('desktop navigation opens the latest destination while a route is delayed', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 844 });
  await page.goto('/');
  const gate = Promise.withResolvers<void>();
  await page.route('**/resume/**', async (route) => {
    await gate.promise;
    await route.continue().catch(() => undefined);
  });
  const header = page.locator('.site-header');
  try {
    await header.getByRole('link', { name: 'Resume' }).click();
    await expect(page.locator('.site-wrapper > [role="status"]')).toHaveText(
      'Loading Resume',
    );
    await expect(page.locator('.route-skeleton')).toHaveCount(0);
    await header.getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL(/\/projects\/$/);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Projects' }),
    ).toBeFocused();
  } finally {
    gate.resolve();
  }
  await expect(page.locator('.route-skeleton')).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/projects\/$/);
  await expect(page.locator('.route-skeleton')).toHaveCount(0);
  await header.getByRole('link', { name: 'Projects' }).click();
  await expect(page.locator('.route-skeleton')).toHaveCount(0);
});

test('choosing the current page closes the menu without losing Skills', async ({
  page,
}) => {
  const before = await visitSkills(page);
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await page
    .getByRole('dialog')
    .getByRole('link', { name: 'Resume', exact: true })
    .click();
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBe(before.scrollY);
});

test('Back clears the loading announcement and restores the previous page', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 844 });
  await page.goto('/');
  const header = page.locator('.site-header');
  await header.getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL(/\/about\/$/);

  const gate = Promise.withResolvers<void>();
  await page.route('**/contact/**', async (route) => {
    await gate.promise;
    await route.continue().catch(() => undefined);
  });
  try {
    await header.getByRole('link', { name: 'Contact' }).click();
    const status = page.locator('.site-wrapper > [role="status"]');
    await expect(status).toHaveText('Loading Contact');
    await expect(page.locator('.route-skeleton')).toHaveCount(0);
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(status).toBeEmpty();
    await expect(page.locator('main h1')).toBeVisible();
  } finally {
    gate.resolve();
  }
});
