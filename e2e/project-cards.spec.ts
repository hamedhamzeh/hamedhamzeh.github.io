import { expect, test } from './fixtures';

for (const theme of ['dark', 'light'] as const) {
  test(`project cards have one clear action and unclipped hover in ${theme}`, async ({
    page,
  }, testInfo) => {
    await page.addInitScript(
      (choice: string) => window.localStorage.setItem('theme', choice),
      theme,
    );
    await page.goto('/projects/');
    await expect(page.locator('.theme-toggle')).toBeVisible();
    const card = page.locator('.project-card-link').first();
    // The reusable UI may be committed before the first project is published.
    test.skip(
      (await card.count()) === 0,
      'No project detail cards are available yet.',
    );
    await expect(card).toBeVisible();
    await expect(card.locator('.project-card-action')).toHaveText(
      'Explore project',
    );
    await expect(card.getByRole('button')).toHaveCount(0);
    await expect(card.locator('.tech-tag')).toHaveCount(0);
    const actionBox = await card.locator('.project-card-action').boundingBox();
    const linkBox = await card.boundingBox();
    expect(Math.abs(actionBox!.width - linkBox!.width)).toBeLessThan(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (!testInfo.project.use.hasTouch) {
      const article = page.locator('.project-card').first();
      const resting = await article.boundingBox();
      await card.hover();
      await expect
        .poll(async () => (await article.boundingBox())!.y)
        .toBeLessThan(resting!.y);
      const hovered = await article.boundingBox();
      const viewport = await page
        .locator('.project-carousel-viewport')
        .boundingBox();
      expect(hovered!.y).toBeGreaterThan(viewport!.y + 4);
      await testInfo.attach(`card-hover-${theme}`, {
        body: await page.screenshot({ animations: 'disabled' }),
        contentType: 'image/png',
      });
      await page.mouse.move(0, 0);
      // Check keyboard focus styling independently of link-tabbing preferences.
      await page.keyboard.press('Tab');
      await card.focus();
      await expect(card).toBeFocused();
      await expect
        .poll(() =>
          article.evaluate((element) =>
            Number.parseFloat(getComputedStyle(element).outlineWidth),
          ),
        )
        .toBeGreaterThan(0);
    }
  });
}
