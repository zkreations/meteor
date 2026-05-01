import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

// Create kebab-case from PascalCase or camelCase
// @param str - The string to convert to kebab-case
export function toKebabCase(str: string) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

// Get a list of icons from a module, converting their names to kebab-case
// @param module - The module containing the icons
export function getIconList(module: Record<string, AstroComponentFactory>) {
  return Object.entries(module)
    .map(([name, IconComponent]) => ({ name: toKebabCase(name), IconComponent }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Clamp a number between a minimum and maximum value
// @param value - The number to clamp
// @param min - The minimum value
// @param max - The maximum value
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

// Safely parse an integer from a string
// @param value - The string to parse
// @param fallback - The fallback value if parsing fails
export const safeParseInt = (value: string, fallback: number): number => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
};
