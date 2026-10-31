import { expect, test } from './fixtures';

for (const theme of ['dark', 'light'] as const) {
  test(`Robotics project cards open the existing publication pages in ${theme}`, async ({
    page,
  }, testInfo) => {
    await page.addInitScript(
      (choice: string) => window.localStorage.setItem('theme', choice),
      theme,
    );
    const targets = [
      {
        title: 'Vision-Controlled Puppet Robot',
        path: '/publications/puppet-robot-pose-detection/',
      },
      {
        title: 'Wormlike Surface-Inspection Robot',
        path: '/publications/wormlike-robot-ferromagnetic-surface-inspection/',
      },
    ];
    for (const [index, target] of targets.entries()) {
      await page.goto('/projects/');
      await expect(page.locator('.theme-toggle')).toBeVisible();
      await page.getByRole('button', { name: 'Robotics', exact: true }).click();
      const carousel = page.getByRole('region', { name: 'Robotics projects' });
      await expect(carousel.locator('.project-carousel-slide')).toHaveCount(3);
      await expect(carousel.locator('.project-preview-card')).toHaveCount(0);
      if (page.viewportSize()!.width < 1000) {
        await carousel.focus();
        for (let step = 0; step <= index; step++)
          await page.keyboard.press('ArrowRight');
      }
      const card = carousel.locator(`a[href="${target.path}"]`);
      await expect(card).toBeVisible();
      await expect(card.getByRole('heading')).toHaveText(target.title);
      await expect(card.locator('.project-card-action')).toHaveText(
        'Explore project',
      );
      await expect(card.locator('img')).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (index === 0)
        await testInfo.attach(`robotics-${theme}`, {
          body: await page.screenshot({ animations: 'disabled' }),
          contentType: 'image/png',
        });
      await card.click();
      await expect(page).toHaveURL(new RegExp(`${target.path}$`));
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://hamedhamzeh.github.io${target.path}`,
      );
    }
  });
}
