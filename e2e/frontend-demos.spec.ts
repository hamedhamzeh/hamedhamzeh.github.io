import { expect, test } from './fixtures';

for (const theme of ['dark', 'light'] as const) {
  test(`Front-end cards link to independent apps and show the note only when selected in ${theme}`, async ({
    page,
  }, testInfo) => {
    await page.addInitScript(
      (choice: string) => window.localStorage.setItem('theme', choice),
      theme,
    );
    await page.goto('/projects/');
    await expect(page.getByText(/a little time capsule/i)).toHaveCount(0);
    await page.getByRole('button', { name: 'Front-end', exact: true }).click();
    await expect(page.getByText(/a little time capsule/i)).toBeVisible();
    const cards = page.locator('.project-card-link');
    await expect(cards).toHaveCount(2);
    await expect(page.getByText(/Code with Mosh coursework/)).toHaveCount(0);
    for (const card of await cards.all()) {
      await expect(card.locator('.project-card-action')).toContainText(
        'Visit website',
      );
      await expect(card).toHaveAttribute('target', '_blank');
      await expect(card).toHaveAttribute('rel', 'noopener noreferrer');
    }
    await expect(cards.nth(0)).toHaveAttribute(
      'href',
      'https://hamedhamzeh.github.io/my-game-hub/',
    );
    await expect(cards.nth(1)).toHaveAttribute(
      'href',
      'https://hamedhamzeh.github.io/my-front-project/',
    );
    await expect(page.locator('iframe')).toHaveCount(0);
    await expect
      .poll(() =>
        cards
          .locator('img')
          .evaluateAll((images) =>
            images.every(
              (image) =>
                (image as HTMLImageElement).complete &&
                (image as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      )
      .toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (testInfo.project.name === 'edge' && theme === 'dark') {
      await page.screenshot({
        path: testInfo.outputPath('frontend-direct-links.png'),
        fullPage: true,
      });
      const originalUrl = page.url();
      for (const card of await cards.all()) {
        const destination = await card.getAttribute('href');
        const [popup] = await Promise.all([
          page.waitForEvent('popup'),
          card.click(),
        ]);
        await expect(popup).toHaveURL(destination!);
        await popup.close();
        expect(page.url()).toBe(originalUrl);
      }
    }
    await page.getByRole('button', { name: 'All', exact: true }).click();
    await expect(page.getByText(/a little time capsule/i)).toHaveCount(0);
  });
}
