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
import { buildReactLikeCreateIconSource } from './core/react-like-icon-template.js'
import { buildReactCreateIconTypesSource } from './core/react-like-icon-types.js'

const REACT_DIR = new URL('../packages/react/src/', import.meta.url)
const REACT_ICONS_DIR = new URL('../packages/react/src/icons/', import.meta.url)

function buildCreateIconSource() {
  return buildReactLikeCreateIconSource('react')
}

function buildCreateIconTypesSource() {
  return buildReactCreateIconTypesSource()
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

async function generateReactPackage() {
  const icons = await readIconMap()
  const iconNames = getSortedIconNames(icons)

  await resetDir(REACT_ICONS_DIR)
  await fs.mkdir(REACT_DIR, { recursive: true })

  await fs.writeFile(new URL('./create-icon.js', REACT_DIR), buildCreateIconSource(), 'utf8')
  await fs.writeFile(new URL('./create-icon.d.ts', REACT_DIR), buildCreateIconTypesSource(), 'utf8')

  for (const iconName of iconNames) {
    const nodes = icons[iconName].nodes || []
    await fs.writeFile(
      new URL(`./${iconName}.js`, REACT_ICONS_DIR),
      buildIconModuleSource(iconName, nodes),
      'utf8',
    )

    await fs.writeFile(
      new URL(`./${iconName}.d.ts`, REACT_ICONS_DIR),
      buildIconTypesSource(iconName),
      'utf8',
    )
  }

  const indexSource = buildNamedExportsIndex(iconNames, 'js')
  await fs.writeFile(new URL('./index.js', REACT_DIR), indexSource, 'utf8')
  await fs.writeFile(new URL('./index.d.ts', REACT_DIR), indexSource, 'utf8')

  console.warn(`React package generated (${iconNames.length} icons)`)
}

generateReactPackage().catch((error) => {
  console.error('Error generating React package:', error.message)
  process.exit(1)
})
