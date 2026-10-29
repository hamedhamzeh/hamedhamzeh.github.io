import { expect, test } from './fixtures';

const projectPath = '/projects/whole-body-rehabilitation-device/';
test.use({ reducedMotion: 'reduce' });

for (const theme of ['dark', 'light'] as const) {
  test(`rehabilitation card, thesis link, figures and CAD playback in ${theme}`, async ({
    page,
  }, testInfo) => {
    await page.addInitScript(
      (choice: string) => window.localStorage.setItem('theme', choice),
      theme,
    );
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/projects/');
    await expect(page.locator('.theme-toggle')).toBeVisible();
    await page.getByRole('button', { name: 'Robotics', exact: true }).click();
    await expect(page.locator('.project-carousel-slide')).toHaveCount(2);
    const card = page.locator(`a[href="${projectPath}"]`);
    await expect(card).toBeVisible();
    await expect(card.getByRole('heading')).toHaveText(
      'Whole-Body Rehabilitation Device',
    );
    await expect(card.locator('.project-card-action')).toHaveText(
      'Explore project',
    );
    await card.click();
    await expect(page).toHaveURL(new RegExp(`${projectPath}$`));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Whole-Body Rehabilitation Device',
    );
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://hamedhamzeh.github.io${projectPath}`,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /whole-body-rehabilitation-device\/assembly-card.webp/,
    );
    const sections = page.getByRole('navigation', { name: 'Project sections' });
    await expect(sections.getByRole('link')).toHaveCount(6);
    await expect(
      sections.getByRole('link', {
        name: 'Load Analysis and Component Sizing',
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Limitations|Further Work/ }),
    ).toHaveCount(0);
    const figureLayout = await page.evaluate(() => {
      const figures = Array.from(
        document.querySelectorAll<HTMLElement>('.rehabilitation-figure figure'),
      );
      const pair = document.querySelector<HTMLElement>(
        '.project-technical-figures--pair .portfolio-gallery-grid',
      )!;
      const analysisCards = document.querySelectorAll<HTMLElement>(
        '.project-technical-figures:not(.project-technical-figures--pair) .portfolio-gallery-thumbnail',
      );
      return {
        figures: figures.map((figure) => {
          const parent = figure.parentElement!.getBoundingClientRect();
          const bounds = figure.getBoundingClientRect();
          return {
            width: bounds.width,
            expected: Math.min(parent.width - 32, 720),
            centered: Math.abs(
              bounds.left - parent.left - (parent.right - bounds.right),
            ),
          };
        }),
        pairWidth: pair.querySelector('button')!.getBoundingClientRect().width,
        analysisWidth: analysisCards[0].getBoundingClientRect().width,
        pairCentered: Math.abs(
          pair.getBoundingClientRect().left -
            pair.parentElement!.getBoundingClientRect().left -
            (pair.parentElement!.getBoundingClientRect().right -
              pair.getBoundingClientRect().right),
        ),
        captionsCentered: Array.from(
          document.querySelectorAll(
            '.rehabilitation-figure figcaption, .project-technical-figures .portfolio-gallery-thumbnail span',
          ),
        ).every((caption) => getComputedStyle(caption).textAlign === 'center'),
      };
    });
    expect(figureLayout.figures).toHaveLength(2);
    for (const figure of figureLayout.figures) {
      expect(Math.abs(figure.width - figure.expected)).toBeLessThan(1);
      expect(figure.centered).toBeLessThan(1);
    }
    expect(
      Math.abs(figureLayout.pairWidth - figureLayout.analysisWidth),
    ).toBeLessThan(1);
    expect(figureLayout.pairCentered).toBeLessThan(1);
    expect(figureLayout.captionsCentered).toBe(true);
    await sections
      .getByRole('link', { name: 'My Contribution', exact: true })
      .click();
    await expect(page).toHaveURL(/#my-contribution$/);
    await expect(
      page.getByRole('heading', { name: 'My Contribution', exact: true }),
    ).toBeInViewport();

    const drawing = page.getByRole('button', {
      name: /^View image 1: Manufacturing drawing of the main arm/,
    });
    await drawing.click();
    await expect(
      page.getByRole('dialog', { name: 'Main-arm manufacturing drawing' }),
    ).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(drawing).toBeFocused();

    const simulation = page.getByRole('region', { name: 'cad-motion videos' });
    const video = simulation.locator('video');
    await expect(video).toHaveAttribute('preload', 'none');
    await expect(video).not.toHaveAttribute('autoplay');
    expect(
      await video.evaluate((element: HTMLVideoElement) => element.paused),
    ).toBe(true);
    await simulation.getByText('Read transcript', { exact: true }).click();
    await expect(
      simulation.getByText(
        /does not show a patient or physical prototype testing/,
      ),
    ).toBeVisible();
    await simulation
      .getByRole('button', {
        name: 'Play CAD simulation of the rehabilitation mechanism',
        exact: true,
      })
      .click();
    await expect
      .poll(() =>
        video.evaluate(
          (element: HTMLVideoElement) =>
            !element.paused && element.currentTime > 0,
        ),
      )
      .toBe(true);
    expect(
      await video.evaluate((element: HTMLVideoElement) => element.duration),
    ).toBeCloseTo(7.866667, 1);
    await video.evaluate((element: HTMLVideoElement) => element.pause());
    await expect(
      page.getByRole('link', { name: 'Zeus Multi-CPM', exact: true }),
    ).toHaveAttribute(
      'href',
      encodeURI('https://www.sharifexo.com/مولتی-cpm-زئوس/'),
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await testInfo.attach(`rehabilitation-${theme}`, {
      body: await page.screenshot({ fullPage: true, animations: 'disabled' }),
      contentType: 'image/png',
    });

    await page.goto('/resume/#education');
    await expect(page.locator('.theme-toggle')).toBeVisible();
    await page
      .getByRole('link', { name: 'View thesis project', exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`${projectPath}$`));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Whole-Body Rehabilitation Device',
    );
    expect(errors).toEqual([]);
  });

  test(`rehabilitation figures fit a 320px viewport in ${theme}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.addInitScript(
      (choice: string) => window.localStorage.setItem('theme', choice),
      theme,
    );
    await page.goto(projectPath);
    await expect(page.locator('.theme-toggle')).toBeVisible();
    await expect(
      page.locator('.portfolio-detail-figure img').first(),
    ).toBeVisible();
    for (const image of await page
      .locator('.portfolio-detail-prose img')
      .all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate(
            (element: HTMLImageElement) =>
              element.complete && element.naturalWidth > 0,
          ),
        )
        .toBe(true);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await testInfo.attach(`rehabilitation-320-${theme}`, {
      body: await page.screenshot({ fullPage: true, animations: 'disabled' }),
      contentType: 'image/png',
    });
  });
}
