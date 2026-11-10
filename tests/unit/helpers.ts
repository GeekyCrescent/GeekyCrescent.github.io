import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { parse } from 'yaml';

export const ROOT = new URL('../../', import.meta.url).pathname;
export const CASES_DIR = join(ROOT, 'src/content/cases');

const TEXT_EXTENSIONS = new Set(['.mdx', '.md', '.astro', '.ts', '.css', '.svg', '.typ', '.html', '.json']);

export function listTextFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return listTextFiles(path);
    return TEXT_EXTENSIONS.has(extname(name)) ? [path] : [];
  });
}

export function readFrontmatter(path: string): Record<string, unknown> {
  const match = readFileSync(path, 'utf8').match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error(`No frontmatter in ${path}`);
  return parse(match[1]) as Record<string, unknown>;
}
