import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from 'vitest';
import { CASES_DIR, readFrontmatter } from './helpers';

const EXPECTED_STATUS: Record<string, string> = {
  factotum: 'Open source · in daily use',
  'llm-agent-tool-calling': 'In production',
  'speech-to-text-cost-model': 'Decision memo · system in production',
  'event-driven-integration': 'Proposal · outcome pending',
  'document-ai-human-in-the-loop': 'Requirements & architecture · ready to build',
  'nextjs-security-and-prod-bug': 'In development · deployed to QA',
};

const cases = readdirSync(CASES_DIR)
  .filter((f) => f.endsWith('.mdx'))
  .map((f) => ({ slug: f.replace(/\.mdx$/, ''), data: readFrontmatter(join(CASES_DIR, f)) }));

test('there are exactly the six approved cases', () => {
  expect(cases.map((c) => c.slug).sort()).toEqual(Object.keys(EXPECTED_STATUS).sort());
});

test.each(Object.entries(EXPECTED_STATUS))('%s keeps its honest status', (slug, status) => {
  expect(cases.find((c) => c.slug === slug)?.data.status).toBe(status);
});

test.each(Object.keys(EXPECTED_STATUS))('%s has exactly three figures', (slug) => {
  expect(cases.find((c) => c.slug === slug)?.data.figures).toHaveLength(3);
});

test('only open-source cases link to code', () => {
  const withCode = cases.filter((c) => c.data.codeUrl).map((c) => c.slug);
  expect(withCode).toEqual(['factotum']);
});
