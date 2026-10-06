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

test('switching pages keeps Resume still until the destination appears', async ({
  page,
}) => {
  const before = await visitSkills(page);
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  // Simulate a slow destination to expose movement before the route commits.
  await page.route('**/about/**', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
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
  await test.step('Choose About and wait for the new page', async () => {
    await page
      .getByRole('dialog')
      .getByRole('link', { name: 'About', exact: true })
      .click();
    await expect(
      page.getByRole('heading', { level: 1, name: 'About', exact: true }),
    ).toBeVisible();
  });
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
