import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  testMatch: '**/*.spec.tsx',
  fullyParallel: true,
  reporter: 'html',
  workers: 1,
  use: {
    baseURL: 'https://slowpace-web.vercel.app/',
    trace: 'on-first-retry',
  },
  
  webServer: {
    command: 'npm run dev',
    url: 'https://slowpace-web.vercel.app/',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome (Pixel 5)', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari (iPhone 12)', use: { ...devices['iPhone 12'] } },
    { name: 'Mobile Safari (iPhone 14)', use: { ...devices['iPhone 14'] } },
    { name: 'Microsoft Edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
    { name: 'Google Chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
  ],
});