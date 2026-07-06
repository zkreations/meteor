import type { AstroComponentFactory } from 'astro/runtime/server/index.js'
import { toKebabCase } from '@shared/stringCase'

// Get a list of icons from a module, converting their names to kebab-case
// @param module - The module containing the icons
export function getIconList(module: Record<string, AstroComponentFactory>) {
  return Object.entries(module)
    .map(([name, IconComponent]) => ({ name: toKebabCase(name), IconComponent }))
    .sort((a, b) => a.name.localeCompare(b.name))
}
