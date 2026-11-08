import { expect, test } from './fixtures';

const projectPath = '/projects/soccer-team-role-assignment/';
const demos = [
  { title: 'Results showcase', duration: 34.52, seek: 12 },
  { title: 'Inference walkthrough', duration: 36.92, seek: 15 },
  { title: 'Training walkthrough', duration: 35, seek: 21 },
] as const;

test.use({ reducedMotion: 'reduce' });

for (const theme of ['dark', 'light'] as const) {
  test(`team assignment card, training evidence and all three videos in ${theme}`, async ({
    page,
  }, testInfo) => {
    test.setTimeout(60_000);
    await page.addInitScript(
      (choice: string) => window.localStorage.setItem('theme', choice),
      theme,
    );
    const errors: string[] = [];
    const requests: (string | null)[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('request', (request) => {
      if (request.url().endsWith('.mp4'))
        requests.push(request.headers().range ?? null);
    });
    await page.goto('/projects/');
    await page
      .getByRole('button', { name: 'Computer Vision', exact: true })
      .click();
    const slides = page.locator('.project-carousel-slide');
    await expect(slides).toHaveCount(5);
    const assignmentSlot = slides.nth(1);
    const card = assignmentSlot.locator(`a[href="${projectPath}"]`);
    // Mobile shows one card at a time: reveal the second slot using its selector.
    if ((await assignmentSlot.getAttribute('aria-hidden')) === 'true') {
      await page.getByRole('button', { name: /^Show projects 2 to/ }).click();
    }
    await expect(card.getByRole('heading')).toHaveText(
      'Team & Role Assignment',
    );
    await card.click();
    await expect(page).toHaveURL(new RegExp(`${projectPath}$`));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'AISoccerCoach: Team & Role Assignment',
    );
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://hamedhamzeh.github.io${projectPath}`,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /01_showcase.webp/,
    );
    await expect(
      page.locator('nav[aria-label="Project sections"] a'),
    ).toHaveCount(8);
    await page.getByRole('link', { name: 'Results', exact: true }).click();
    await expect(page.locator('#results + p')).toContainText(
      '15 trained models',
    );
    await expect(page.locator('#results + p')).toBeInViewport();
    const candidates = page.getByRole('region', {
      name: 'Three model-selection candidates on the development benchmark',
      exact: true,
    });
    await expect(candidates.locator('tbody tr')).toHaveCount(3);
    await expect(candidates.getByText('97.31%', { exact: true })).toBeVisible();
    const benchmarkDetails = page.locator('details').filter({
      has: page.locator('summary', {
        hasText: 'Complete benchmark comparison',
      }),
    });
    await expect(benchmarkDetails).not.toHaveAttribute('open');
    await benchmarkDetails.locator('summary').click();
    const benchmark = page.getByRole('region', {
      name: 'All 15 models on the common development benchmark',
      exact: true,
    });
    await expect(benchmark.locator('tbody tr')).toHaveCount(15);
    await expect(benchmark).toBeVisible();
    await benchmarkDetails.locator('summary').click();
    await page.getByRole('link', { name: 'Training', exact: true }).click();
    const trainingDetails = page.locator('details').filter({
      has: page.locator('summary', { hasText: 'Complete training history' }),
    });
    await expect(trainingDetails).not.toHaveAttribute('open');
    await trainingDetails.locator('summary').click();
    const trainingTable = page.getByRole('region', {
      name: 'All 19 archived training configurations',
      exact: true,
    });
    await expect(trainingTable.locator('tbody tr')).toHaveCount(19);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await testInfo.attach(`training-history-${theme}`, {
      body: await page.screenshot({ animations: 'disabled' }),
      contentType: 'image/png',
    });
    await trainingDetails.locator('summary').click();
    for (const id of [
      'same-video-triplet',
      'training-loss',
      'benchmark-progression',
      'embedding-inspection',
    ]) {
      const trigger = page.locator(`[aria-label="${id} image"] button`);
      await trigger.click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await expect
        .poll(() =>
          dialog
            .locator('img')
            .evaluate((image: HTMLImageElement) => image.naturalWidth),
        )
        .toBeGreaterThan(0);
      await testInfo.attach(`${id}-${theme}`, {
        body: await page.screenshot({ animations: 'disabled' }),
        contentType: 'image/png',
      });
      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
    }
    await page.goto(`${projectPath}#implementation`);
    await expect(
      page.getByRole('heading', { name: 'Implementation', exact: true }),
    ).toBeInViewport();
    await expect(
      page.getByRole('link', { name: 'Email me', exact: true }),
    ).toHaveAttribute('href', 'mailto:hamed.hamze2212@gmail.com');
    expect(
      requests.every((range) => {
        const probe = range?.match(/^bytes=0-(\d+)$/);
        return probe != null && Number(probe[1]) < 4096;
      }),
    ).toBe(true);
    await page
      .getByRole('link', { name: 'Demonstrations', exact: true })
      .click();
    await expect(page.locator('video')).toHaveCount(demos.length);
    for (const video of await page.locator('video').all())
      await expect(video).toHaveAttribute('preload', 'none');
    for (const [index, { title, duration, seek }] of demos.entries()) {
      const video = page.locator('video').nth(index);
      const selector = page.getByRole('button', {
        name: `Show ${title} (${index + 1} of ${demos.length})`,
        exact: true,
      });
      await expect(selector).toBeVisible();
      if (index > 0) {
        await selector.focus();
        await page.keyboard.press('Enter');
        const previous = page.locator('video').nth(index - 1);
        await expect
          .poll(() => previous.evaluate((el: HTMLVideoElement) => el.paused))
          .toBe(true);
      }
      await page
        .getByRole('button', { name: `Play ${title}`, exact: true })
        .click();
      await expect
        .poll(() =>
          video.evaluate(
            (el: HTMLVideoElement) => !el.paused && el.currentTime > 0,
          ),
        )
        .toBe(true);
      expect(
        await video.evaluate((el: HTMLVideoElement) => el.duration),
      ).toBeCloseTo(duration, 1);
      await video.evaluate((el: HTMLVideoElement, time) => {
        el.currentTime = time;
      }, seek);
      await expect
        .poll(() =>
          video.evaluate(
            (el: HTMLVideoElement, time) =>
              !el.seeking && el.currentTime >= time,
            seek,
          ),
        )
        .toBe(true);
      await testInfo.attach(`assignment-${theme}-${duration}s`, {
        body: await page.screenshot({ animations: 'disabled' }),
        contentType: 'image/png',
      });
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.goto('/projects/');
    expect(errors).toEqual([]);
  });
}

test('plays all three complete assignment demos without skipping @media', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'edge',
    'Full-duration playback runs once in Edge.',
  );
  test.setTimeout(170_000);
  await page.goto(`${projectPath}#demonstrations`);
  for (const [index, milestones] of [
    [0, [3, 11, 20, 29]],
    [1, [3, 6, 10, 14, 17, 22, 28, 32, 35]],
    [2, [2, 8, 15, 20, 25, 30, 34]],
  ] as const) {
    const { title } = demos[index];
    if (index > 0)
      await page
        .getByRole('button', {
          name: `Show ${title} (${index + 1} of ${demos.length})`,
          exact: true,
        })
        .click();
    const video = page.locator('video').nth(index);
    await page
      .getByRole('button', { name: `Play ${title}`, exact: true })
      .click();
    for (const time of milestones) {
      await expect
        .poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime), {
          timeout: 15_000,
          intervals: [250],
        })
        .toBeGreaterThanOrEqual(time);
      await testInfo.attach(`complete-demo-${index + 1}-${time}s`, {
        body: await page.screenshot({ animations: 'disabled' }),
        contentType: 'image/png',
      });
    }
    await expect
      .poll(() => video.evaluate((el: HTMLVideoElement) => el.ended), {
        timeout: 12_000,
        intervals: [250],
      })
      .toBe(true);
    expect(await video.evaluate((el: HTMLVideoElement) => el.error)).toBeNull();
  }
});

test('assignment layout at phone, tablet and desktop widths @visual', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'edge',
    'Additional viewport checks run once in Edge.',
  );
  test.setTimeout(60_000);
  for (const theme of ['dark', 'light']) {
    await page.goto(projectPath);
    await page.evaluate(
      (choice: string) => window.localStorage.setItem('theme', choice),
      theme,
    );
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(projectPath);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          Array.from(document.images)
            .filter((image) => image.complete && image.naturalWidth > 0)
            .map((image) => image.decode().catch(() => {})),
        );
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await testInfo.attach(`assignment-header-${theme}-${width}`, {
        body: await page.screenshot({ animations: 'disabled' }),
        contentType: 'image/png',
      });
      await page.getByRole('link', { name: 'Method', exact: true }).click();
      await expect(
        page.getByRole('list', { name: 'Team and role assignment pipeline' }),
      ).toBeInViewport();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await testInfo.attach(`assignment-method-${theme}-${width}`, {
        body: await page.screenshot({ animations: 'disabled' }),
        contentType: 'image/png',
      });
      await page.getByRole('link', { name: 'Training', exact: true }).click();
      const history = page.locator('details').filter({
        has: page.locator('summary', { hasText: 'Complete training history' }),
      });
      await history.locator('summary').click();
      const table = page.getByRole('region', {
        name: 'All 19 archived training configurations',
        exact: true,
      });
      await table.scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await testInfo.attach(`assignment-training-${theme}-${width}`, {
        body: await page.screenshot({ animations: 'disabled' }),
        contentType: 'image/png',
      });
    }
  }
});
