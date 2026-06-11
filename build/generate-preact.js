import fs from 'node:fs/promises'
import process from 'node:process'
import { writePackageManifest } from './core/create-packages.js'
import {
  buildNamedExportsIndex,
  getSortedIconNames,
  jsLiteral,
  readIconMap,
  resetDir,
  toPascalCase,
} from './core/framework-utils.js'
import { buildReactLikeCreateIconSource } from './core/react-like-icon-template.js'
import { buildPreactCreateIconTypesSource } from './core/react-like-icon-types.js'
import config from './icons.config.js'

const PREACT_DIR = new URL('../packages/preact/src/', import.meta.url)
const PREACT_ICONS_DIR = new URL('../packages/preact/src/icons/', import.meta.url)

function buildCreateIconSource() {
  return buildReactLikeCreateIconSource('preact/compat')
}

function buildCreateIconTypesSource() {
  return buildPreactCreateIconTypesSource()
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

async function generatePreactPackage() {
  const icons = await readIconMap()
  const iconNames = getSortedIconNames(icons)

  await writePackageManifest('preact', config.packages)

  await resetDir(PREACT_ICONS_DIR)
  await fs.mkdir(PREACT_DIR, { recursive: true })

  await fs.writeFile(new URL('./create-icon.js', PREACT_DIR), buildCreateIconSource(), 'utf8')
  await fs.writeFile(new URL('./create-icon.d.ts', PREACT_DIR), buildCreateIconTypesSource(), 'utf8')

  for (const iconName of iconNames) {
    const nodes = icons[iconName].nodes || []
    await fs.writeFile(
      new URL(`./${iconName}.js`, PREACT_ICONS_DIR),
      buildIconModuleSource(iconName, nodes),
      'utf8',
    )

    await fs.writeFile(
      new URL(`./${iconName}.d.ts`, PREACT_ICONS_DIR),
      buildIconTypesSource(iconName),
      'utf8',
    )
  }

  const indexSource = buildNamedExportsIndex(iconNames, 'js')
  await fs.writeFile(new URL('./index.js', PREACT_DIR), indexSource, 'utf8')
  await fs.writeFile(new URL('./index.d.ts', PREACT_DIR), indexSource, 'utf8')

  console.warn(`Preact package generated (${iconNames.length} icons)`)
}

generatePreactPackage().catch((error) => {
  console.error('Error generating Preact package:', error.message)
  process.exit(1)
})
