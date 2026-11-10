import { test, expect } from '@playwright/test';

const WORK_RIGHTS =
  'Based in Sydney · Student visa with work rights (48 h/fortnight during session, unrestricted in breaks)';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('hero states the positioning and three figures', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cloud & AI, built around the client.');
  const figures = page.getByTestId('hero-figure-value');
  await expect(figures).toHaveText(['6×-36×', '20/24', '2 Pro']);
});

test('work-rights line is visible verbatim', async ({ page }) => {
  await expect(page.getByText(WORK_RIGHTS).first()).toBeVisible();
});

test('sections appear in the approved order', async ({ page }) => {
  const headings = await page.getByRole('heading', { level: 2 }).allTextContents();
  expect(headings).toEqual(['How I work', 'Selected work', 'Certifications', 'Other projects', 'About']);
});

test('selected work shows six cards linking to their case pages', async ({ page }) => {
  const cards = page.getByTestId('case-card');
  await expect(cards).toHaveCount(6);
  const hrefs = await cards.evaluateAll((els) => els.map((el) => el.getAttribute('href')));
  expect(hrefs).toEqual([
    '/work/llm-agent-tool-calling/',
    '/work/speech-to-text-cost-model/',
    '/work/event-driven-integration/',
    '/work/document-ai-human-in-the-loop/',
    '/work/nextjs-security-and-prod-bug/',
    '/work/factotum/',
  ]);
  await expect(cards.last()).toContainText('Code on GitHub');
});

test('about section does not mention the intern progression', async ({ page }) => {
  await expect(page.locator('#about')).not.toContainText(/intern/i);
});

test('CV download points to the PDF', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Download CV' })).toHaveAttribute('href', '/cv.pdf');
});

test('page never scrolls sideways', async ({ page }) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
