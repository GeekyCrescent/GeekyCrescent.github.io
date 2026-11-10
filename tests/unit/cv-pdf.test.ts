import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { createMatcher, loadBannedTerms } from '../../src/lib/banned-terms';
import { ROOT } from './helpers';

const PDF = join(ROOT, 'public/cv.pdf');
const MAX_PAGES = 2;
const findBannedTerms = createMatcher(loadBannedTerms(process.env, ROOT));

const pdfText = (): string => execFileSync('pdftotext', ['-layout', PDF, '-'], { encoding: 'utf8' });
const pageCount = (): number => Number(/Pages:\s+(\d+)/.exec(execFileSync('pdfinfo', [PDF], { encoding: 'utf8' }))?.[1]);

describe('downloadable CV', () => {
  test('exists', () => {
    expect(existsSync(PDF)).toBe(true);
  });

  test(`fits in ${MAX_PAGES} pages`, () => {
    expect(pageCount()).toBeLessThanOrEqual(MAX_PAGES);
  });

  test('carries the contact details and the portfolio URL', () => {
    const text = pdfText();
    expect(text).toContain('ferro.rayon@gmail.com');
    expect(text).toContain('geekycrescent.github.io');
  });

  test('contains no client names or personal identifiers', () => {
    expect(findBannedTerms(pdfText())).toEqual([]);
  });

  test('does not mention the intern progression', () => {
    expect(pdfText()).not.toMatch(/intern\b/i);
  });
});
