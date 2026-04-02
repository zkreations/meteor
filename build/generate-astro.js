import fs from 'fs/promises'
import path from 'path'

const ROOT_DIR = new URL('..', import.meta.url)
const ICONS_JSON = new URL('../packages/core/exports/icons.json', import.meta.url)
const ASTRO_DIR = new URL('../packages/astro/src/', import.meta.url)
const ASTRO_ICONS_DIR = new URL('../packages/astro/src/icons/', import.meta.url)

function toPascalCase (value) {
  return value
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

async function resetDir (dirUrl) {
  await fs.rm(dirUrl, { recursive: true, force: true })
  await fs.mkdir(dirUrl, { recursive: true })
}

async function readIconMap () {
  const raw = await fs.readFile(ICONS_JSON, 'utf8')
  return JSON.parse(raw)
}

function escapeXmlAttr (value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
}

function nodeToMarkup (node) {
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

function buildIconAstroSource (iconName, nodes) {
  const markup = nodes.map(nodeToMarkup).join('\n  ')

  return `---
export interface Props {
  size?: string | number
  strokeWidth?: string | number
  color?: string
  class?: string
  [key: string]: unknown
}

const {
  size = 24,
  strokeWidth = 2,
  color = 'currentColor',
  class: className = '',
  ...rest
} = Astro.props

const mergedClass = ('i i-${iconName} ' + className).trim()
---

<svg
  xmlns='http://www.w3.org/2000/svg'
  width={size}
  height={size}
  viewBox='0 0 24 24'
  fill='none'
  stroke={color}
  stroke-width={strokeWidth}
  stroke-linecap='round'
  stroke-linejoin='round'
  class={mergedClass}
  {...rest}
>
  ${markup}
</svg>
`
}

function buildIconTypesSource (iconName) {
  const componentName = toPascalCase(iconName)

  return `export interface MeteorAstroIconProps {
  size?: string | number
  strokeWidth?: string | number
  color?: string
  class?: string
  [key: string]: unknown
}

declare const ${componentName}: (props: MeteorAstroIconProps) => any

export default ${componentName}
`
}

function buildIndexSource (iconNames) {
  const exports = iconNames.map((name) => {
    const componentName = toPascalCase(name)
    return `export { default as ${componentName} } from './icons/${name}.astro'`
  })

  return exports.join('\n') + '\n'
}

async function generateAstroPackage () {
  const icons = await readIconMap()
  const iconNames = Object.keys(icons).sort((a, b) => a.localeCompare(b))

  await resetDir(ASTRO_ICONS_DIR)
  await fs.mkdir(ASTRO_DIR, { recursive: true })

  for (const iconName of iconNames) {
    const nodes = icons[iconName].nodes || []

    await fs.writeFile(
      new URL(`./${iconName}.astro`, ASTRO_ICONS_DIR),
      buildIconAstroSource(iconName, nodes),
      'utf8'
    )

    await fs.writeFile(
      new URL(`./${iconName}.d.ts`, ASTRO_ICONS_DIR),
      buildIconTypesSource(iconName),
      'utf8'
    )
  }

  await fs.writeFile(new URL('./index.js', ASTRO_DIR), buildIndexSource(iconNames), 'utf8')
  await fs.writeFile(new URL('./index.d.ts', ASTRO_DIR), buildIndexSource(iconNames), 'utf8')

  const rootPath = path.normalize(ROOT_DIR.pathname)
  console.log(`Astro package generated (${iconNames.length} icons) at ${rootPath}`)
}

generateAstroPackage().catch((error) => {
  console.error('Error generating Astro package:', error.message)
  process.exit(1)
})
