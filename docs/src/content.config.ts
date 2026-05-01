import { glob } from 'astro/loaders'
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content'

const icons = defineCollection({
  loader: glob({
    pattern: '*.json',
    base: new URL('../../icons', import.meta.url),
  }),
  schema: z.object({
    name: z.string().min(1),
    title: z.string().optional(),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    keywords: z.array(z.string()).optional(),
  }).strict(),
})

export const collections = { icons }
