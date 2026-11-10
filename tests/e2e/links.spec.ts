import { test, expect } from '@playwright/test';

test('every internal link on the site resolves', async ({ page, request }) => {
  const toVisit = ['/'];
  const seen = new Set<string>();
  const broken: string[] = [];

  while (toVisit.length > 0) {
    const path = toVisit.pop()!;
    if (seen.has(path)) continue;
    seen.add(path);

    const response = await request.get(path);
    if (response.status() !== 200) {
      broken.push(`${path} → ${response.status()}`);
      continue;
    }
    if (!(response.headers()['content-type'] ?? '').includes('text/html')) continue;

    await page.goto(path);
    const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href') ?? ''));
    for (const href of hrefs) {
      if (!href.startsWith('/')) continue;
      toVisit.push(href.split('#')[0] || '/');
    }
  }

  expect(broken).toEqual([]);
  expect(seen.size).toBeGreaterThanOrEqual(8);
});
