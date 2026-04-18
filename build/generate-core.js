import fs from 'fs'
import path from 'path'

import config from './icons.config.js'
import { generateCoreVanilla } from './core/create-core-vanilla.js'
import { generateCoreSprite } from './core/create-core-sprite.js'
import { generateCoreIncludable } from './core/create-core-includable.js'

const SRC_ICONS = config.iconsDir
const DIST_ICONS = config.coreIconsDir

function resetDir (dir) {
  fs.rmSync(dir, { recursive: true, force: true })
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, '.gitkeep'), '')
}

function copyDir (src, dest) {
  fs.mkdirSync(dest, { recursive: true })

  for (const entry of fs.readdirSync(src)) {
    const srcPath = path.join(src, entry)
    const destPath = path.join(dest, entry)

    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath)
    } else if (path.extname(entry).toLowerCase() === '.svg') {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

async function generateCorePackage () {
  console.log('Building meteor-icons core package')

  resetDir(DIST_ICONS)
  copyDir(SRC_ICONS, DIST_ICONS)

  await generateCoreVanilla()
  await generateCoreSprite()
  await generateCoreIncludable()

  console.log('Core package ready')
}

generateCorePackage().catch((error) => {
  console.error('Error generating core package:', error.message)
  process.exit(1)
})
