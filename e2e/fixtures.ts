import { test as base } from '@playwright/test';

export { expect, type Page } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    // Keep local regression runs independent of analytics and out of visit counts.
    await page.route(
      /^https:\/\/(?:www\.googletagmanager\.com|www\.google-analytics\.com)\//,
      (route) =>
        route.fulfill({
          status: 200,
          contentType: 'text/javascript',
          body: '',
        }),
    );
    await use(page);
  },
});
