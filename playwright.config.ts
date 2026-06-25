import { defineConfig } from '@playwright/test';

const isCI = process.env['CI'] !== undefined;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:8080',
  },
  webServer: {
    command: 'python3 -m http.server 8080',
    url: 'http://127.0.0.1:8080/',
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
