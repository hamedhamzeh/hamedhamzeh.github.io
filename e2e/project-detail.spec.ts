import { expect, test } from './fixtures';

const projectPath = '/projects/contact-anchored-soccer-ball-mapping/';

// Keep disclosure interactions independent of in-flight anchor scrolling.
test.use({ reducedMotion: 'reduce' });

for (const theme of ['dark', 'light'] as const) {
  test(`ball-mapping card, content and demonstrations in ${theme}`, async ({
    page,
  }, testInfo) => {
    await page.addInitScript(
      (choice: string) => window.localStorage.setItem('theme', choice),
      theme,
    );
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const videoRequests: (string | null)[] = [];
    page.on('request', (request) => {
      if (request.url().endsWith('.mp4'))
        videoRequests.push(request.headers().range ?? null);
    });
    await page.goto('/projects/');
    await expect(page.locator('.theme-toggle')).toBeVisible();
    await page
      .getByRole('button', { name: 'Computer Vision', exact: true })
      .click();
    await expect(page.locator('.project-carousel-slide')).toHaveCount(5);
    const card = page.locator(`a[href="${projectPath}"]`);
    await expect(card).toBeVisible();
    await expect(card.getByRole('heading')).toHaveText(
      'Contact-Anchored Ball Mapping',
    );
    await expect(card.locator('.tech-tag')).toHaveCount(0);
    await expect(card.locator('.project-card-action')).toHaveText(
      'Explore project',
    );
    await expect(card.getByRole('button')).toHaveCount(0);
    await expect(card.locator('.project-card-subtitle')).toHaveCount(0);
    await expect(card.locator('img')).toHaveAttribute(
      'src',
      /01_comparison.webp/,
    );
    await testInfo.attach(`projects-${theme}`, {
      body: await page.screenshot({ animations: 'disabled' }),
      contentType: 'image/png',
    });
    await card.click();
    await expect(page).toHaveURL(new RegExp(`${projectPath}$`));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'AISoccerCoach: Contact-Anchored Ball Mapping',
    );
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://hamedhamzeh.github.io${projectPath}`,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /01_comparison.webp/,
    );
    await expect(
      page.locator('nav[aria-label="Project sections"] a'),
    ).toHaveCount(7);
    await expect(
      page.getByRole('heading', { name: 'Implementation', exact: true }),
    ).toHaveCount(0);
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    // Native WebKit may probe a small file header even with preload="none".
    // Reject full downloads or ranges beyond 4 KB before the first Play action.
    expect(
      videoRequests.every((range) => {
        const probe = range?.match(/^bytes=0-(\d+)$/);
        return probe != null && Number(probe[1]) < 4096;
      }),
    ).toBe(true);
    await expect(page.locator('video')).toHaveCount(4);
    for (const video of await page.locator('video').all()) {
      await expect(video).toHaveAttribute('preload', 'none');
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.getByRole('link', { name: 'Results', exact: true }).click();
    const resultTable = page.getByRole('region', {
      name: 'Contact classification on 371 development clips',
    });
    await expect(resultTable).toBeVisible();
    await expect(
      resultTable.getByText('76.28%', { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole('region', {
        name: 'Close V0 class metrics on 371 development clips',
      }),
    ).toBeVisible();
    await page
      .getByText('Compare all eight player-identification configurations', {
        exact: true,
      })
      .click();
    await expect(
      page.getByRole('region', {
        name: 'All eight player identification configurations',
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await testInfo.attach(`results-${theme}`, {
      body: await page.screenshot({ animations: 'disabled' }),
      contentType: 'image/png',
    });
    const trajectoryDemo = page.getByRole('region', {
      name: 'trajectory-candidates videos',
    });
    await trajectoryDemo.scrollIntoViewIfNeeded();
    await expect(trajectoryDemo).not.toHaveAttribute('aria-roledescription');
    await expect(
      trajectoryDemo.getByRole('group', { name: 'Choose a video' }),
    ).toHaveCount(0);
    const demoSize = await trajectoryDemo.evaluate((gallery) => {
      const bounds = gallery.getBoundingClientRect();
      const container = gallery.parentElement!.getBoundingClientRect();
      const video = gallery.querySelector('video')!.getBoundingClientRect();
      return {
        width: bounds.width,
        containerWidth: container.width,
        leftGap: bounds.left - container.left,
        rightGap: container.right - bounds.right,
        videoAspectRatio: video.width / video.height,
      };
    });
    expect(demoSize.width).toBeLessThanOrEqual(720);
    expect(demoSize.width).toBeLessThanOrEqual(demoSize.containerWidth - 31);
    expect(Math.abs(demoSize.leftGap - demoSize.rightGap)).toBeLessThan(1);
    expect(demoSize.videoAspectRatio).toBeCloseTo(16 / 9, 2);
    await expect(
      page.getByRole('link', { name: 'Email me', exact: true }),
    ).toHaveAttribute('href', 'mailto:hamed.hamze2212@gmail.com');
    await trajectoryDemo
      .getByRole('button', {
        name: 'Play How trajectory changes become candidates',
        exact: true,
      })
      .click();
    const trajectoryVideo = trajectoryDemo.locator('video');
    await expect
      .poll(() =>
        trajectoryVideo.evaluate(
          (video: HTMLVideoElement) => !video.paused && video.currentTime > 0,
        ),
      )
      .toBe(true);
    expect(
      await trajectoryVideo.evaluate(
        (video: HTMLVideoElement) => video.duration,
      ),
    ).toBeCloseTo(17.56, 1);
    await testInfo.attach(`stage1-${theme}`, {
      body: await page.screenshot({ animations: 'disabled' }),
      contentType: 'image/png',
    });
    await page
      .getByRole('link', { name: 'Demonstrations', exact: true })
      .click();
    await page
      .getByRole('button', {
        name: 'Play Direct homography vs. contact-anchored mapping',
        exact: true,
      })
      .click();
    const firstVideo = page.locator('.video-gallery-slide.is-active video');
    await expect
      .poll(() =>
        firstVideo.evaluate(
          (video: HTMLVideoElement) => !video.paused && video.currentTime > 0,
        ),
      )
      .toBe(true);
    await expect
      .poll(() =>
        trajectoryVideo.evaluate((video: HTMLVideoElement) => video.paused),
      )
      .toBe(true);
    await testInfo.attach(`demo-${theme}`, {
      body: await page.screenshot({ animations: 'disabled' }),
      contentType: 'image/png',
    });
    for (const title of [
      'From broadcast footage to a pitch view',
      'How contact anchors become a path',
    ]) {
      await page.getByRole('button', { name: `Show ${title}` }).click();
      await expect
        .poll(() =>
          page
            .locator('video')
            .evaluateAll((videos: HTMLVideoElement[]) =>
              videos.every((video) => video.paused),
            ),
        )
        .toBe(true);
      await page
        .getByRole('button', { name: `Play ${title}`, exact: true })
        .click();
      await expect
        .poll(() =>
          page
            .locator('.video-gallery-slide.is-active video')
            .evaluate(
              (video: HTMLVideoElement) =>
                !video.paused && video.currentTime > 0,
            ),
        )
        .toBe(true);
    }
    expect(errors).toEqual([]);
  });
}
