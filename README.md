# geekycrescent.github.io

Personal portfolio of Juan Rodrigo Ferro — cloud & AI engineering. Built with Astro, deployed to GitHub Pages on every push to `main`.

```bash
pnpm install
pnpm dev        # local site
pnpm test       # content + confidentiality guard
pnpm build && pnpm test:e2e
pnpm cv         # rebuild public/cv.pdf from cv/cv.typ (needs typst)
```

Case studies live in `src/content/cases/*.mdx`. Client work is anonymised. The test suite fails if a confidential term appears in the source, the diagrams or the PDF; the term list itself is never committed (local `.banned-terms` file, `BANNED_TERMS` secret in CI).
