// Clamp a number between a minimum and maximum value
// @param value - The number to clamp
// @param min - The minimum value
// @param max - The maximum value
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// Safely parse an integer from a string
// @param value - The string to parse
// @param fallback - The fallback value if parsing fails
export function safeParseInt(value: string, fallback: number): number {
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? fallback : parsed
}
