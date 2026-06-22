import { normalize } from '@shared/stringCase'
import { getCollection } from 'astro:content'

export interface IconPayload {
  name: string
  searchIndex: string
}

export interface CategoryPayload {
  name: string
  icon: string
}

export interface SearchAPIResponse {
  icons: IconPayload[]
  categories: CategoryPayload[]
}

export async function GET(): Promise<Response> {
  const entries = await getCollection('icons')

  const iconsPayload: IconPayload[] = []
  const categoriesMap = new Map<string, string>()

  entries.forEach((entry) => {
    const data = entry.data

    const searchIndex = normalize([
      data.name,
      data.title ?? '',
      ...(data.categories ?? []),
      ...(data.tags ?? []),
      ...(data.keywords ?? []),
    ].join(' '))

    iconsPayload.push({
      name: data.name,
      searchIndex,
    })

    if (data.categories) {
      data.categories.forEach((category: string) => {
        if (!categoriesMap.has(category)) {
          categoriesMap.set(category, data.name)
        }
      })
    }
  })

  const categoriesPayload: CategoryPayload[] = Array.from(categoriesMap.entries())
    .map(([name, icon]) => ({
      name,
      icon,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const payload: SearchAPIResponse = {
    icons: iconsPayload,
    categories: categoriesPayload,
  }

  return new Response(JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
