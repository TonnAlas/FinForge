import { getCollection } from 'astro:content';

export interface Guide {
  id: string;
  slug: string;
  title: string;
  order: number;
  description?: string;
}

export function slugify(id: string): string {
  return id.toLowerCase().replace(/_/g, '-');
}

export async function getGuides(): Promise<Guide[]> {
  const entries = await getCollection('guides');
  return entries
    .map((entry) => ({
      id: entry.id,
      slug: slugify(entry.id),
      title: entry.data.title,
      order: entry.data.order,
      description: entry.data.description,
    }))
    .sort((a, b) => a.order - b.order);
}
