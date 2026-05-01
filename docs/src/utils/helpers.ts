export const normalize = (value: string): string => value.trim().toLowerCase().replace(/\s+/g, ' ')
export const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1)
