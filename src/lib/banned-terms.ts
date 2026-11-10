import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// The real list (client names, personal identifiers) is confidential, so it never lives in this
// public repo: locally it is the gitignored `.banned-terms` file, in CI the BANNED_TERMS secret.

const LOCAL_FILE = '.banned-terms';

const stripAccents = (text: string): string => text.normalize('NFD').replace(/\p{Diacritic}/gu, '');

const escapeRegex = (text: string): string => text.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');

const parseList = (raw: string): string[] =>
  raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));

export function loadBannedTerms(env: Record<string, string | undefined>, root: string): string[] {
  const fromEnv = parseList(env.BANNED_TERMS ?? '');
  if (fromEnv.length > 0) return fromEnv;
  const file = join(root, LOCAL_FILE);
  const fromFile = existsSync(file) ? parseList(readFileSync(file, 'utf8')) : [];
  if (fromFile.length > 0) return fromFile;
  throw new Error(`No banned-terms list: set BANNED_TERMS or create ${LOCAL_FILE} at the repo root.`);
}

// Word-like terms match on word boundaries so a short term does not fire inside a longer word;
// terms with punctuation (IPs, paths, domains) match as plain substrings.
export function createMatcher(terms: readonly string[]): (text: string) => string[] {
  const patterns = terms.map((term) => {
    const body = escapeRegex(stripAccents(term));
    const isWordLike = /^[\p{L}\d ]+$/u.test(term);
    return { term, regex: new RegExp(isWordLike ? `\\b${body}\\b` : body, 'i') };
  });
  return (text) => {
    const normalized = stripAccents(text);
    return patterns.filter(({ regex }) => regex.test(normalized)).map(({ term }) => term);
  };
}
