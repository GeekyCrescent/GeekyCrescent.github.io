import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { createMatcher, loadBannedTerms } from '../../src/lib/banned-terms';

// Fictional terms only: the real list never lives in this public repo.
const find = createMatcher(['Northwind', 'Contoso Clínica', 'SSX', '10.20.', '/home/someone', '87654321']);

describe('createMatcher', () => {
  test('finds names regardless of case', () => {
    expect(find('built for NORTHWIND')).toEqual(['Northwind']);
  });

  test('matches names written without accents', () => {
    expect(find('Contoso Clinica')).toEqual(['Contoso Clínica']);
  });

  test('catches identifiers with punctuation as substrings', () => {
    expect(find('id 87654321 at 10.20.30.40 in /home/someone/x')).toEqual(['10.20.', '/home/someone', '87654321']);
  });

  test('does not flag words that merely contain a short term', () => {
    expect(find('the SSXL size')).toEqual([]);
  });

  test('allows text with none of the terms', () => {
    expect(find('Software Engineer at BWR')).toEqual([]);
  });
});

describe('loadBannedTerms', () => {
  test('reads one term per line from the env var, ignoring blanks and comments', () => {
    expect(loadBannedTerms({ BANNED_TERMS: 'Northwind\n\n# note\n10.20.\n' }, '/nonexistent')).toEqual(['Northwind', '10.20.']);
  });

  test('falls back to the local .banned-terms file', () => {
    const dir = mkdtempSync(join(tmpdir(), 'bt-'));
    writeFileSync(join(dir, '.banned-terms'), 'Contoso\n');
    expect(loadBannedTerms({}, dir)).toEqual(['Contoso']);
  });

  test('fails loudly when no list is available', () => {
    expect(() => loadBannedTerms({}, '/nonexistent')).toThrow(/BANNED_TERMS/);
  });
});
