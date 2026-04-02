import fs from 'fs/promises'

const DEFAULT_ICONS_JSON = new URL('../../packages/core/exports/icons.json', import.meta.url)

export function toPascalCase (value) {
  return value
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

export async function resetDir (dirUrl) {
  await fs.rm(dirUrl, { recursive: true, force: true })
  await fs.mkdir(dirUrl, { recursive: true })
  await fs.writeFile(new URL('./.gitkeep', dirUrl), '')
}

export async function readIconMap (iconsJsonUrl = DEFAULT_ICONS_JSON) {
  const raw = await fs.readFile(iconsJsonUrl, 'utf8')
  return JSON.parse(raw)
}

export function getSortedIconNames (icons) {
  return Object.keys(icons).sort((a, b) => a.localeCompare(b))
}

export function jsLiteral (value) {
  if (typeof value === 'string') {
    return JSON.stringify(value)
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (Array.isArray(value)) {
    return `[${value.map(jsLiteral).join(', ')}]`
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
      .map(([key, nested]) => `${JSON.stringify(key)}: ${jsLiteral(nested)}`)
      .join(', ')

    return `{ ${entries} }`
  }

  return 'null'
}

export function escapeXmlAttr (value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
}

export function nodeToMarkup (node) {
  const attrs = Object.entries(node.attrs || {})
    .map(([key, value]) => `${key}="${escapeXmlAttr(value)}"`)
    .join(' ')

  const openTag = attrs.length ? `<${node.tag} ${attrs}>` : `<${node.tag}>`

  if (!node.children || node.children.length === 0) {
    return `${openTag}</${node.tag}>`
  }

  const children = node.children.map(nodeToMarkup).join('')
  return `${openTag}${children}</${node.tag}>`
}

export function buildNamedExportsIndex (iconNames, extension) {
  const exports = iconNames.map((name) => {
    const componentName = toPascalCase(name)
    return `export { default as ${componentName} } from './icons/${name}.${extension}'`
  })

  return exports.join('\n') + '\n'
}
