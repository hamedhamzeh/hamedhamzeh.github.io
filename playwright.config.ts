import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  workers: 2,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4174',
    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview',
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: !process.env.CI,
    timeout: 15_000,
  },
  projects: [
    {
      name: 'edge',
      use: {
        browserName: 'chromium',
        channel: 'msedge',
        viewport: { width: 1280, height: 844 },
      },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox', viewport: { width: 1280, height: 844 } },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit', viewport: { width: 1280, height: 844 } },
    },
    {
      name: 'android',
      use: {
        ...devices['Pixel 5'],
        browserName: 'chromium',
        channel: 'msedge',
      },
    },
    { name: 'iphone', use: { ...devices['iPhone 13'], browserName: 'webkit' } },
  ],
});
