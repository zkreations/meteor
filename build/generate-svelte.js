import fs from 'fs/promises'
import path from 'path'

const ROOT_DIR = new URL('..', import.meta.url)
const ICONS_JSON = new URL('../packages/core/exports/icons.json', import.meta.url)
const SVELTE_DIR = new URL('../packages/svelte/src/', import.meta.url)
const SVELTE_ICONS_DIR = new URL('../packages/svelte/src/icons/', import.meta.url)

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

function buildIconSvelteSource (iconName, nodes) {
  const markup = nodes.map(nodeToMarkup).join('\n  ')

  return `<script>
  export let size = 24
  export let strokeWidth = 2
  export let color = 'currentColor'
  let className = ''

  export { className as class }
</script>

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
  class={('i i-${iconName} ' + className).trim()}
  {...$$restProps}
>
  ${markup}
</svg>
`
}

function buildIconTypesSource (iconName) {
  const componentName = toPascalCase(iconName)

  return `import { SvelteComponentTyped } from 'svelte'

export interface MeteorSvelteIconProps {
  size?: string | number
  strokeWidth?: string | number
  color?: string
  class?: string
  [key: string]: unknown
}

export default class ${componentName} extends SvelteComponentTyped<MeteorSvelteIconProps> {}
`
}

function buildIndexSource (iconNames) {
  const exports = iconNames.map((name) => {
    const componentName = toPascalCase(name)
    return `export { default as ${componentName} } from './icons/${name}.svelte'`
  })

  return exports.join('\n') + '\n'
}

async function generateSveltePackage () {
  const icons = await readIconMap()
  const iconNames = Object.keys(icons).sort((a, b) => a.localeCompare(b))

  await resetDir(SVELTE_ICONS_DIR)
  await fs.mkdir(SVELTE_DIR, { recursive: true })

  for (const iconName of iconNames) {
    const nodes = icons[iconName].nodes || []

    await fs.writeFile(
      new URL(`./${iconName}.svelte`, SVELTE_ICONS_DIR),
      buildIconSvelteSource(iconName, nodes),
      'utf8'
    )

    await fs.writeFile(
      new URL(`./${iconName}.d.ts`, SVELTE_ICONS_DIR),
      buildIconTypesSource(iconName),
      'utf8'
    )
  }

  await fs.writeFile(new URL('./index.js', SVELTE_DIR), buildIndexSource(iconNames), 'utf8')
  await fs.writeFile(new URL('./index.d.ts', SVELTE_DIR), buildIndexSource(iconNames), 'utf8')

  const rootPath = path.normalize(ROOT_DIR.pathname)
  console.log(`Svelte package generated (${iconNames.length} icons) at ${rootPath}`)
}

generateSveltePackage().catch((error) => {
  console.error('Error generating Svelte package:', error.message)
  process.exit(1)
})
