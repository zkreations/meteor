type IconCardMeta = {
  name?: string
  category?: string
}

// Check if an icon card matches the search query and selected category
// @param meta - The metadata of the icon card, including its name and category
// @param query - The search query to match against the icon name
// @param category - The selected category to match against the icon category (or 'all' for no category filter)
// @returns true if the icon matches the query and category, false otherwise
export const isIconMatch = (meta: IconCardMeta, query: string, category: string): boolean => {
  const name = meta.name ?? ''
  const cardCategory = meta.category ?? ''
  return name.includes(query) && (category === 'all' || cardCategory === category)
}

// Build a label for the icon counter based on the number of visible icons
// @param visibleCount - The number of icons currently visible after filtering
// @returns A string label indicating how many icons are being shown
export const buildCounterLabel = (visibleCount: number): string =>
  `Showing ${visibleCount} icon${visibleCount === 1 ? '' : 's'}`
