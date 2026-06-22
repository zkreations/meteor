import { normalize } from '@shared/stringCase'

// Basic fuzzy matching: all query tokens must exist in the icon search index.
export function isIconMatch(searchIndex: string, query: string): boolean {
  const normalizedQuery = normalize(query)
  if (!normalizedQuery)
    return true

  const haystack = normalize(searchIndex)
  return normalizedQuery.split(' ').every(token => haystack.includes(token))
}

// Build a label for the icon counter based on the number of visible icons
// @param visibleCount - The number of icons currently visible after filtering
// @returns A string label indicating how many icons are being shown
export function buildCounterLabel(visibleCount: number): string {
  return `Showing ${visibleCount} icon${visibleCount === 1 ? '' : 's'}`
}
