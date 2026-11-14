import { expect, test } from './fixtures';

test('the AISoccer Coach resume card opens the Computer Vision filter', async ({
  page,
}) => {
  await page.goto('/resume/#experience');
  const job = page.locator('#experience article').filter({
    has: page.getByRole('heading', {
      name: 'AISoccer Coach - Computer Vision Developer',
    }),
  });
  await expect(job.getByRole('listitem')).toHaveCount(3);
  await expect(
    job.getByRole('link', { name: /on the App Store/ }),
  ).toHaveAttribute('target', '_blank');
  await job
    .getByRole('link', { name: 'View computer vision projects' })
    .click();
  await expect(page).toHaveURL(/\/projects\/#computer-vision$/);

  const categories = page.getByRole('group', { name: 'Project categories' });
  const computerVision = categories.getByRole('button', {
    name: 'Computer Vision',
    exact: true,
  });
  await expect(computerVision).toHaveAttribute('aria-pressed', 'true');
  const cards = page.locator('.project-carousel-slide .project-card-title');
  await expect(cards).toHaveCount(6);
  await expect(cards.first()).toHaveText('Contact-Anchored Ball Mapping');

  await page.reload();
  await expect(computerVision).toHaveAttribute('aria-pressed', 'true');
  const all = categories.getByRole('button', { name: 'All', exact: true });
  await all.click();
  await expect(all).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/\/projects\/$/);
});

test('orders every project category by date with category-specific leaders', async ({
  page,
}) => {
  await page.goto('/projects/');
  const cardTitles = page.locator(
    '.project-carousel-slide .project-card-title',
  );
  const categories = page.getByRole('group', { name: 'Project categories' });

  for (const [category, titles] of [
    [
      'All',
      [
        'Contact-Anchored Ball Mapping',
        'Semantic Text Search API',
        'Airbnb Availability Prediction Pipeline',
        'Player Action & Ball Event Detection',
        'Smoking & Phone Use Detection',
        'Wormlike Robot for Surface Inspection',
        'Virtual Fence & Person Tracking',
        'Predicting Asphalt Binder Stiffness',
        'Soccer Team & Role Assignment',
        'Bone Age Estimation from Hand X-rays',
        'Vision-Controlled Puppet Robot',
        'Predicting Hydrogen Storage in MOFs',
        'Game Hub',
        'Web Hosting Landing Page',
        'Whole-Body Rehabilitation Device',
      ],
    ],
    [
      'Computer Vision',
      [
        'Contact-Anchored Ball Mapping',
        'Player Action & Ball Event Detection',
        'Soccer Team & Role Assignment',
        'Smoking & Phone Use Detection',
        'Virtual Fence & Person Tracking',
        'Bone Age Estimation from Hand X-rays',
      ],
    ],
    [
      'Robotics',
      [
        'Whole-Body Rehabilitation Device',
        'Wormlike Robot for Surface Inspection',
        'Vision-Controlled Puppet Robot',
      ],
    ],
    ['Front-end', ['Game Hub', 'Web Hosting Landing Page']],
    [
      'MLOps',
      ['Semantic Text Search API', 'Airbnb Availability Prediction Pipeline'],
    ],
    [
      'ML Projects',
      [
        'Predicting Asphalt Binder Stiffness',
        'Predicting Hydrogen Storage in MOFs',
      ],
    ],
  ] as const) {
    await categories
      .getByRole('button', { name: category, exact: true })
      .click();
    await expect(cardTitles).toHaveText([...titles]);
  }

  await categories.getByRole('button', { name: 'All', exact: true }).click();
  await expect(cardTitles.first()).toHaveText('Contact-Anchored Ball Mapping');
});

test('the hydrogen storage project and award link directly to GitHub', async ({
  page,
}) => {
  const repository =
    'https://github.com/hamedhamzeh/MOF-Hydrogen-Storage-prediction';
  await page.goto('/projects/');
  await page.getByRole('button', { name: 'ML Projects', exact: true }).click();
  const carousel = page.getByRole('region', { name: 'ML Projects projects' });
  await expect(carousel.locator('.project-carousel-slide')).toHaveCount(2);
  if (page.viewportSize()!.width < 600) {
    await carousel
      .getByRole('button', { name: 'Show projects 2 to 2 of 2' })
      .click();
  }
  const card = carousel.getByRole('link', { name: /View on GitHub/ });
  await expect(card.getByRole('heading')).toHaveText(
    'Predicting Hydrogen Storage in MOFs',
  );
  await expect(card.locator('time')).toHaveText('2024');
  const poster = card.getByRole('img');
  await expect(poster).toHaveJSProperty('complete', true);
  expect(
    await poster.evaluate((image: HTMLImageElement) => image.naturalWidth),
  ).toBeGreaterThan(0);
  await expect(card).toHaveAttribute('href', repository);
  await expect(card).toHaveAttribute('target', '_blank');

  await page.goto('/resume/#honors');
  const honor = page.locator('#honors article').filter({
    has: page.getByRole('heading', {
      name: 'Winner, Third National Competition',
    }),
  });
  const awardLink = honor.getByRole('link', { name: /View project on GitHub/ });
  await expect(awardLink).toHaveAttribute('href', repository);
  await expect(awardLink).toHaveAttribute('target', '_blank');
});

test('the Sasobit cards open the same manuscript preview', async ({ page }) => {
  const path = '/projects/sasobit-binder-stiffness/';
  const poster =
    '/images/projects/sasobit-binder-stiffness/sasobit-pellets.webp';
  const illustrationTitle = 'Schematic Illustration of Research Processes';

  await page.goto('/projects/');
  await page.getByRole('button', { name: 'ML Projects', exact: true }).click();
  const carousel = page.getByRole('region', { name: 'ML Projects projects' });
  const project = carousel.getByRole('link', {
    name: /Predicting Asphalt Binder Stiffness/,
  });
  await expect(project.locator('time')).toHaveAttribute('datetime', '2025-12');
  await expect(project.getByRole('img')).toHaveAttribute('src', poster);
  await project.click();
  await expect(page).toHaveURL(new RegExp(`${path}$`));
  await expect(page.getByText(/manuscript is under review/)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Abstract' })).toBeVisible();
  await expect(page.getByText(/R² = 0\.9875, RMSE = 0\.314/)).toBeVisible();
  await expect(
    page
      .getByRole('navigation', { name: 'Project sections' })
      .getByRole('link'),
  ).toHaveText(['Abstract', 'Research Workflow']);
  await expect(page.locator('figcaption')).toHaveText(illustrationTitle);

  const figure = page.getByRole('button', {
    name: /^View image 1: The study workflow/,
  });
  await expect(page.locator('.theme-toggle')).toBeVisible();
  await figure.scrollIntoViewIfNeeded();
  await expect(figure.locator('img')).toHaveJSProperty('naturalWidth', 1248);
  await figure.press('Enter');
  const viewer = page.getByRole('dialog', { name: illustrationTitle });
  await expect(viewer.getByRole('img')).toHaveJSProperty('naturalWidth', 1248);
  await viewer.getByRole('button', { name: 'Zoom in' }).click();
  await expect(
    viewer.getByRole('button', { name: 'Reset zoom' }),
  ).not.toHaveText('100%');

  await page.goto('/publications/');
  const manuscript = page.getByRole('link', {
    name: /^Advancing Sustainable Pavement Design/,
  });
  await expect(
    manuscript.locator('xpath=ancestor::article').getByRole('img'),
  ).toHaveAttribute('src', poster);
  await manuscript.click();
  await expect(page).toHaveURL(new RegExp(`${path}$`));
});

test('GitHub project cards show their years above the repository action', async ({
  page,
}) => {
  await page.goto('/projects/');
  await page
    .getByRole('button', { name: 'Computer Vision', exact: true })
    .click();
  const carousel = page.getByRole('region', {
    name: 'Computer Vision projects',
  });
  const selectors = carousel
    .getByRole('group', { name: 'Choose visible projects' })
    .getByRole('button');
  const viewportWidth = await page.evaluate(() => window.innerWidth);
  const cardsPerView = viewportWidth >= 1000 ? 3 : viewportWidth >= 600 ? 2 : 1;
  const lastSelector = 6 - cardsPerView;
  await expect(selectors).toHaveCount(lastSelector + 1);

  for (const [slot, repository, year] of [
    [4, 'virtual-fence', '2025'],
    [5, 'xception-bone-age-prediction', '2024'],
  ] as const) {
    await selectors.nth(Math.min(slot, lastSelector)).click();
    const slide = carousel.locator('.project-carousel-slide').nth(slot);
    await expect(slide).toHaveAttribute('aria-hidden', 'false');
    const card = slide.getByRole('link');
    await expect(card).toHaveAttribute(
      'href',
      `https://github.com/hamedhamzeh/${repository}`,
    );
    await expect(card).toHaveAttribute('target', '_blank');
    const action = card.locator('.project-card-action');
    await expect(action).toContainText('View on GitHub');
    const date = card.locator('time');
    await expect(date).toHaveText(year);
    await expect(card.getByRole('img')).toHaveJSProperty('complete', true);
    expect(
      await card
        .getByRole('img')
        .evaluate((image: HTMLImageElement) => image.naturalWidth),
    ).toBeGreaterThan(0);

    const dateBox = (await date.boundingBox())!;
    const actionBox = (await action.boundingBox())!;
    expect(dateBox.y + dateBox.height).toBeLessThan(actionBox.y);
    expect(dateBox.x).toBeGreaterThan(actionBox.x + actionBox.width / 2);
  }
});

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
