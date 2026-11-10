import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Status labels are fixed so a proposal can never be relabelled as shipped.
export const CASE_STATUSES = [
  'In production',
  'Open source · in daily use',
  'Decision memo · system in production',
  'Proposal · outcome pending',
  'Requirements & architecture · ready to build',
  'In development · deployed to QA',
] as const;

const figure = z.object({ value: z.string().min(1), label: z.string().min(1) });

const cases = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/cases' }),
  schema: z.object({
    order: z.number().int().positive(),
    title: z.string().min(1),
    summary: z.string().min(1),
    status: z.enum(CASE_STATUSES),
    role: z.string().min(1),
    clientType: z.string().min(1),
    figures: z.array(figure).length(3),
    stack: z.array(z.string()).min(1),
    codeUrl: z.url().optional(),
    diagram: z.string().regex(/^\/diagrams\/[a-z0-9-]+\.png$/),
    diagramAlt: z.string().min(1),
  }),
});

export const collections = { cases };
