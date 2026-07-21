import fs from 'node:fs/promises'
import process from 'node:process'
import {
  buildNamedExportsIndex,
  getSortedIconNames,
  jsLiteral,
  readIconMap,
  resetDir,
  toPascalCase,
} from './core/framework-utils.js'

const VUE_DIR = new URL('../packages/vue/src/', import.meta.url)
const VUE_ICONS_DIR = new URL('../packages/vue/src/icons/', import.meta.url)

function buildCreateIconSource() {
  return `import { defineComponent, h } from 'vue'

function renderNodes (nodes) {
  return nodes.map((node) => {
    const children = node.children ? renderNodes(node.children) : []
    return h(node.tag, node.attrs || {}, children)
  })
}

export function createIcon (iconName, iconNode) {
  return defineComponent({
    name: iconName,
    inheritAttrs: false,
    props: {
      size: {
        type: [String, Number],
        default: 24
      },
      strokeWidth: {
        type: [String, Number],
        default: 2
      },
      color: {
        type: String,
        default: 'currentColor'
      },
      minimal: {
        type: Boolean,
        default: false
      }
    },
    setup (props, { attrs }) {
      return () => {
        const { class: attrsClass, ...restAttrs } = attrs
        const mergedClass = attrsClass
          ? ['i i-' + iconName, attrsClass]
          : 'i i-' + iconName

        const svgAttrs = props.minimal
          ? { viewBox: '0 0 24 24', class: mergedClass, ...restAttrs }
          : {
              xmlns: 'http://www.w3.org/2000/svg',
              width: props.size,
              height: props.size,
              viewBox: '0 0 24 24',
              fill: 'none',
              stroke: props.color,
              'stroke-width': props.strokeWidth,
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              class: mergedClass,
              ...restAttrs,
            }

        return h('svg', svgAttrs, renderNodes(iconNode))
      }
    }
  })
}
`
}

function buildCreateIconTypesSource() {
  return `import type { DefineComponent } from 'vue'

export type IconAttrs = Record<string, string | number | boolean>

export interface IconNode {
  tag: string
  attrs: IconAttrs
  children?: IconNode[]
}

export interface MeteorIconProps {
  size?: string | number
  strokeWidth?: string | number
  color?: string
}

export type MeteorIconComponent = DefineComponent<MeteorIconProps>

export declare function createIcon(iconName: string, iconNode: IconNode[]): MeteorIconComponent
`
}

function buildIconModuleSource(iconName, nodes) {
  const componentName = toPascalCase(iconName)
  const iconNodeLiteral = jsLiteral(nodes)

  return `import { createIcon } from '../create-icon.js'

const iconNode = ${iconNodeLiteral}

const ${componentName} = createIcon('${iconName}', iconNode)

export default ${componentName}
`
}

function buildIconTypesSource(iconName) {
  const componentName = toPascalCase(iconName)

  return `import type { MeteorIconComponent } from '../create-icon.js'

declare const ${componentName}: MeteorIconComponent

export default ${componentName}
`
}

async function generateVuePackage() {
  const icons = await readIconMap()
  const iconNames = getSortedIconNames(icons)

  await resetDir(VUE_ICONS_DIR)
  await fs.mkdir(VUE_DIR, { recursive: true })

  await fs.writeFile(new URL('./create-icon.js', VUE_DIR), buildCreateIconSource(), 'utf8')
  await fs.writeFile(new URL('./create-icon.d.ts', VUE_DIR), buildCreateIconTypesSource(), 'utf8')

  for (const iconName of iconNames) {
    const nodes = icons[iconName].nodes || []
    await fs.writeFile(
      new URL(`./${iconName}.js`, VUE_ICONS_DIR),
      buildIconModuleSource(iconName, nodes),
      'utf8',
    )

    await fs.writeFile(
      new URL(`./${iconName}.d.ts`, VUE_ICONS_DIR),
      buildIconTypesSource(iconName),
      'utf8',
    )
  }

  const indexSource = buildNamedExportsIndex(iconNames, 'js')
  await fs.writeFile(new URL('./index.js', VUE_DIR), indexSource, 'utf8')
  await fs.writeFile(new URL('./index.d.ts', VUE_DIR), indexSource, 'utf8')

  console.warn(`Vue package generated (${iconNames.length} icons)`)
}

generateVuePackage().catch((error) => {
  console.error('Error generating Vue package:', error.message)
  process.exit(1)
})
