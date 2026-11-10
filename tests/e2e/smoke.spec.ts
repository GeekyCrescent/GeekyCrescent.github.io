import { test, expect } from '@playwright/test';

test('home responds and has the site title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Ferro/);
});
