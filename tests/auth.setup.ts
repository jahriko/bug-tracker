import { test as setup, expect } from '@playwright/test';
import prisma from '@/lib/prisma';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/api/auth/signin');
  await page.getByLabel('Email').fill('playwright_test@example.com');
  await page.getByLabel('Password').fill('testpassword123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // await expect(page.getByText('Signed in successfully')).toBeVisible();
  await page.waitForURL('**/issues');

  await page.context().storageState({ path: authFile });
});