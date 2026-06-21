// Create kebab-case from PascalCase or camelCase
// @param str - The string to convert to kebab-case
export function toKebabCase(str: string) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

// Create PascalCase from kebab-case (e.g. "my-icon" → "MyIcon")
// @param str - The kebab-case string to convert
export function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}
