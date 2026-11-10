import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { createMatcher, loadBannedTerms } from '../../src/lib/banned-terms';
import { CASES_DIR, ROOT, listTextFiles, readFrontmatter } from './helpers';

const findBannedTerms = createMatcher(loadBannedTerms(process.env, ROOT));

describe('repository content', () => {
  const dirs = ['src', 'public', 'cv'].map((d) => join(ROOT, d)).filter(existsSync);

  test('no source file contains a banned term', () => {
    const leaks = dirs
      .flatMap(listTextFiles)
      .map((file) => ({ file: file.replace(ROOT, ''), terms: findBannedTerms(readFileSync(file, 'utf8')) }))
      .filter((hit) => hit.terms.length > 0);
    expect(leaks).toEqual([]);
  });

  test('no tracked file of any type contains a banned term', () => {
    const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: ROOT, encoding: 'utf8' }).split('\0').filter(Boolean);
    // Binary bytes produce random short "words"; there only identifiers that metadata could carry matter.
    const isBinary = (file: string) => /\.(png|pdf|pyc|woff2?|ico)$/.test(file);
    const isIdentifier = (term: string) => !/^[\p{L}\d ]+$/u.test(term) || /^\d+$/.test(term);
    const leaks = tracked
      .map((file) => {
        const terms = findBannedTerms(readFileSync(join(ROOT, file)).toString('latin1'));
        return { file, terms: isBinary(file) ? terms.filter(isIdentifier) : terms };
      })
      .filter((hit) => hit.terms.length > 0);
    expect(leaks).toEqual([]);
  });

  test('visible copy uses hyphens, never en or em dashes', () => {
    const files = [join(ROOT, 'src/content'), join(ROOT, 'src/components'), join(ROOT, 'src/data')]
      .filter(existsSync)
      .flatMap(listTextFiles);
    const withDashes = files.filter((f) => /[–—]/.test(readFileSync(f, 'utf8'))).map((f) => f.replace(ROOT, ''));
    expect(withDashes).toEqual([]);
  });

  test('no case title contains health words', () => {
    const titles = readdirSync(CASES_DIR).map((f) => String(readFrontmatter(join(CASES_DIR, f)).title));
    expect(titles.filter((t) => /health|medical|clinical|hospital|patient/i.test(t))).toEqual([]);
  });
});
