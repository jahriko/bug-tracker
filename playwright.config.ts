import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],

  globalSetup: './tests/global.setup.ts',
  globalTeardown: './tests/global.teardown.ts',

  webServer: [
    {
      command: 'docker-compose up -d test-db',
      port: 5433,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'NODE_ENV=test bun run start',
      url: 'http://127.0.0.1:3000',
      reuseExistingServer: !process.env.CI,
      env: {
        DATABASE_URL: process.env.TEST_DATABASE_URL,
      },
    },
  ],
});