import { test, expect } from '@playwright/test';

const CASES = [
  { slug: 'llm-agent-tool-calling', status: 'In production', hasCode: false },
  { slug: 'speech-to-text-cost-model', status: 'Decision memo · system in production', hasCode: false },
  { slug: 'event-driven-integration', status: 'Proposal · outcome pending', hasCode: false },
  { slug: 'document-ai-human-in-the-loop', status: 'Requirements & architecture · ready to build', hasCode: false },
  { slug: 'nextjs-security-and-prod-bug', status: 'In development · deployed to QA', hasCode: false },
  { slug: 'factotum', status: 'Open source · in daily use', hasCode: true },
];

const SECTIONS = ['The client’s need', 'What I proposed', 'The hard call', 'Outcome'];
const CONFIDENTIAL_NOTE = 'Client work, details anonymised. Happy to walk through it in an interview.';

for (const c of CASES) {
  test.describe(c.slug, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/work/${c.slug}/`);
    });

    test('shows its honest status', async ({ page }) => {
      await expect(page.getByTestId('case-status')).toHaveText(c.status);
    });

    test('has the four story sections in order', async ({ page }) => {
      const headings = await page.getByRole('heading', { level: 2 }).allTextContents();
      expect(headings).toEqual(SECTIONS);
    });

    test('shows three figures', async ({ page }) => {
      await expect(page.getByTestId('case-figure')).toHaveCount(3);
    });

    test('loads its diagram with alt text', async ({ page }) => {
      const img = page.getByTestId('case-diagram');
      await expect(img).toHaveAttribute('alt', /\S{10,}/);
      expect(await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    });

    test(c.hasCode ? 'links to its public code' : 'shows the confidentiality note', async ({ page }) => {
      if (c.hasCode) {
        await expect(page.getByRole('link', { name: /View the code/ })).toHaveAttribute('href', /github\.com\/GeekyCrescent\//);
      } else {
        await expect(page.getByText(CONFIDENTIAL_NOTE)).toBeVisible();
      }
    });

    test('never scrolls sideways', async ({ page }) => {
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  });
}
