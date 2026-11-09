import { expect, test } from './fixtures';

const repository = 'https://github.com/hamedhamzeh/mlops-bootcamp/tree/main';

const projects = [
  {
    title: 'Airbnb Availability Prediction Pipeline',
    route: '/projects/airbnb-availability-prediction/',
    poster: 'airbnb-pipeline.webp',
    figures: 3,
    folders: [
      'hw11_etl-pipeline',
      'hw12_mlflow',
      'hw13_fastapi-serving',
      'hw21_model-serving',
      'hw01_airbnd-ops',
      'hw02_sql-metabase',
    ],
  },
  {
    title: 'Semantic Text Search API',
    route: '/projects/semantic-text-search-api/',
    poster: 'semantic-search.webp',
    figures: 2,
    folders: ['hw22_deployment/HW3_A', 'hw22_deployment/HW3_B'],
  },
] as const;

test.use({ reducedMotion: 'reduce' });

for (const theme of ['light', 'dark'] as const) {
  test(`opens both MLOps case studies from their cards in ${theme}`, async ({
    page,
  }) => {
    await page.addInitScript(
      (value) => window.localStorage.setItem('theme', value),
      theme,
    );
    const isNarrow = (page.viewportSize()?.width ?? 1280) < 600;
    if (isNarrow) await page.setViewportSize({ width: 320, height: 844 });

    for (const [index, project] of projects.entries()) {
      await page.goto('/projects/');
      await page.getByRole('button', { name: 'MLOps', exact: true }).click();

      const carousel = page.getByRole('region', { name: 'MLOps projects' });
      const slides = carousel.locator('.project-carousel-slide');
      await expect(slides).toHaveCount(2);
      const slide = slides.nth(index);

      if (isNarrow && index === 1) {
        await carousel.press('ArrowRight');
      }

      const card = slide.getByRole('link', { name: /Explore project/ });
      await expect(card).toHaveAttribute('href', project.route);
      await expect(card.getByRole('heading')).toHaveText(project.title);
      await expect(card.getByRole('img')).toHaveAttribute(
        'src',
        new RegExp(project.poster),
      );
      await expect(card.getByText('MLOps · Quera Minicamp')).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(page.viewportSize()?.width ?? 1280);

      await card.press('Enter');
      await expect(page).toHaveURL(new RegExp(`${project.route}$`));
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        project.title,
      );
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const sections = page.getByRole('navigation', {
        name: 'Project sections',
      });
      await expect(sections.getByRole('link')).toHaveText([
        'Overview',
        'My Contribution',
        'How It Works',
        'Results and Scope',
        'Task Repositories',
      ]);
      await sections.getByRole('link', { name: 'Results and Scope' }).click();
      await expect(page).toHaveURL(/#results-and-scope$/);

      const figures = page.locator(
        '.project-technical-figures--compact .portfolio-gallery-thumbnail',
      );
      await expect(figures).toHaveCount(project.figures);
      for (const figure of await figures.all()) {
        await expect(figure.locator('span')).toHaveCount(0);
        const width = await figure.evaluate(
          (element) => element.getBoundingClientRect().width,
        );
        expect(width).toBeLessThanOrEqual(isNarrow ? 320 : 480);
        if (!isNarrow) expect(width).toBe(480);

        await figure.press('Enter');
        const viewer = page.getByRole('dialog');
        await expect(viewer).toBeVisible();
        const image = viewer.getByRole('img');
        await expect(image).toHaveAttribute('alt', /\S/);
        await expect
          .poll(() =>
            image.evaluate((element: HTMLImageElement) => element.naturalWidth),
          )
          .toBeGreaterThan(0);
        await expect(viewer.locator('figcaption')).toHaveText(/\S/);
        await page.keyboard.press('Escape');
        await expect(viewer).toHaveCount(0);
        await expect(figure).toBeFocused();
      }

      await sections.getByRole('link', { name: 'Task Repositories' }).click();
      await expect(page).toHaveURL(/#task-repositories$/);
      for (const folder of project.folders) {
        await expect(
          page.getByRole('link', {
            name: folder.split('/').at(-1),
            exact: true,
          }),
        ).toHaveAttribute('href', `${repository}/${folder}`);
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(page.viewportSize()?.width ?? 1280);
    }
  });
}
