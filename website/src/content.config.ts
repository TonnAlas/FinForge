import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    description: z.string().optional(),
  }),
});

export const collections = { guides };
