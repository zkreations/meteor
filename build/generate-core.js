import fs from 'fs'
import path from 'path'

import config from './icons.config.js'

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
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

console.log('Building meteor-icons core package')

resetDir(DIST_ICONS)
copyDir(SRC_ICONS, DIST_ICONS)

console.log('Core package ready')
