import fs from 'node:fs/promises'
import process from 'node:process'
import { getSortedIconNames, nodeToMarkup, readIconMap } from './core/framework-utils.js'

const HAMLET_DIR = new URL('../packages/hamlet/', import.meta.url)
const HAMLET_LIB_DIR = new URL('../packages/hamlet/lib/', import.meta.url)
const ICONS_XML_URL = new URL('../packages/core/exports/icons.xml', import.meta.url)

function buildSvgPartialSource(iconNames, iconMap) {
  const cases = iconNames.map((name) => {
    const nodes = iconMap[name]?.nodes || []
    const markup = nodes.map(nodeToMarkup).join('')
    return `{{#case "${name}"}}${markup}{{/case}}`
  }).join('')

  const template = [
    `<svg`,
    ` class="i i-{{icon}}{{#if class}} {{class}}{{/if}}"`,
    ` viewBox="0 0 24 24"`,
    `{{#unless (or useMinimalSvgAttributes minimal)}}`,
    ` xmlns="http://www.w3.org/2000/svg"`,
    ` fill="none"`,
    ` stroke="{{#if color}}{{color}}{{else}}currentColor{{/if}}"`,
    ` stroke-width="{{#if strokeWidth}}{{strokeWidth}}{{else}}2{{/if}}"`,
    ` stroke-linecap="round"`,
    ` stroke-linejoin="round"`,
    `{{#if size}} width="{{size}}" height="{{size}}"{{/if}}`,
    `{{/unless}}`,
    `>`,
    `{{#switch icon}}${cases}{{/switch}}`,
    `</svg>`,
  ].join('')

  return `// This file is auto-generated. Do not edit it manually.\nexport const svg = ${JSON.stringify(template)}\n`
}

function buildIncludableLibSource(includableContent) {
  return `// This file is auto-generated. Do not edit it manually.\nexport const includable = ${JSON.stringify(includableContent)}\n`
}

function buildIncludeSource() {
  return `// This file is auto-generated. Do not edit it manually.\nexport const include = \`<b:include name='@meteor' data='{ icon: "{{icon}}"{{#if class}}, class: "{{class}}"{{/if}}{{#if size}}, size: "{{size}}"{{/if}}{{#if strokeWidth}}, strokeWidth: "{{strokeWidth}}"{{/if}}{{#if color}}, color: "{{color}}"{{/if}} }'/>\`\n`
}

function buildIndexSource() {
  return `import { includable } from './lib/includable.js'
import { include } from './lib/include.js'
import { svg } from './lib/svg.js'

export default function hamletPlugin() {
  return {
    namespace: 'Meteor',
    partials: {
      includable,
      include,
      svg,
    },
  }
}
`
}

async function generateHamletPackage() {
  const iconMap = await readIconMap()
  const iconNames = getSortedIconNames(iconMap)
  const includableContent = await fs.readFile(ICONS_XML_URL, 'utf8')

  await fs.mkdir(HAMLET_LIB_DIR, { recursive: true })

  await fs.writeFile(
    new URL('./includable.js', HAMLET_LIB_DIR),
    buildIncludableLibSource(includableContent),
    'utf8',
  )

  await fs.writeFile(
    new URL('./include.js', HAMLET_LIB_DIR),
    buildIncludeSource(),
    'utf8',
  )

  await fs.writeFile(
    new URL('./svg.js', HAMLET_LIB_DIR),
    buildSvgPartialSource(iconNames, iconMap),
    'utf8',
  )

  await fs.writeFile(
    new URL('./index.js', HAMLET_DIR),
    buildIndexSource(),
    'utf8',
  )

  await fs.writeFile(new URL('./.gitkeep', HAMLET_LIB_DIR), '', 'utf8')

  console.warn(`Hamlet package generated (${iconNames.length} icons)`)
}

generateHamletPackage().catch((error) => {
  console.error('Error generating Hamlet package:', error.message)
  process.exit(1)
})
