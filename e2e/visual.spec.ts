import { expect, type Page, test } from './fixtures';

async function ready(page: Page) {
  await expect(page.locator('.theme-toggle')).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
    const visibleImages = Array.from(document.images).filter(
      (image: HTMLImageElement) => {
        const bounds = image.getBoundingClientRect();
        return bounds.bottom > 0 && bounds.top < window.innerHeight;
      },
    );
    await Promise.all(
      visibleImages.map((image: HTMLImageElement) => image.decode()),
    );
  });
}

for (const theme of ['dark', 'light'] as const) {
  test(`@visual homepage and publication controls in ${theme}`, async ({
    page,
  }, testInfo) => {
    await page.addInitScript(
      (choice: string) => window.localStorage.setItem('theme', choice),
      theme,
    );
    for (const [name, path] of [
      ['home', '/'],
      ['publications', '/publications/'],
    ] as const) {
      await page.goto(path);
      await ready(page);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await testInfo.attach(`${name}-${theme}`, {
        body: await page.screenshot({ animations: 'disabled' }),
        contentType: 'image/png',
      });
    }
  });
}

test('@visual menu over Resume Skills', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/resume/');
  await ready(page);
  await page.evaluate(() =>
    document.querySelector('#skills')?.scrollIntoView({ behavior: 'instant' }),
  );
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await expect(
    page.getByRole('dialog', { name: 'Navigation menu' }),
  ).toBeVisible();
  await testInfo.attach('menu-over-skills', {
    body: await page.screenshot({ animations: 'disabled' }),
    contentType: 'image/png',
  });
});

test('first visits start dark and the field animates on every input profile', async ({
  page,
}) => {
  await page.emulateMedia({
    colorScheme: 'light',
    reducedMotion: 'no-preference',
  });
  await page.goto('/');
  await ready(page);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('.hero-bg')).toHaveAttribute(
    'data-animated',
    'true',
  );
  const canvas = page.locator('.hero-vision-field');
  const firstFrame = await canvas.evaluate((element: HTMLCanvasElement) =>
    element.toDataURL(),
  );
  await expect
    .poll(() =>
      canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL()),
    )
    .not.toBe(firstFrame);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.hero-bg')).toHaveAttribute(
    'data-animated',
    'false',
  );
  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});
