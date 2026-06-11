import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import { processAllIcons } from './core/icons-pipeline.js'
import config from './icons.config.js'
import svgoConfig from './svgo.config.js'

function toTitleFromIconName(iconName) {
  return iconName
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function getDefaultMetadata(iconName) {
  return {
    name: iconName,
    title: toTitleFromIconName(iconName),
    categories: [],
    tags: [],
    aliases: [],
    keywords: [],
  }
}

function sortCaseInsensitive(a, b) {
  return a.localeCompare(b, undefined, { sensitivity: 'base' })
}

async function syncIconMetadata(iconsDir, svgIconNames) {
  const svgIconSet = new Set(svgIconNames)
  const entries = await fs.readdir(iconsDir, { withFileTypes: true })

  const metadataIconNames = entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.json'))
    .map(entry => path.basename(entry.name, '.json'))

  const metadataSet = new Set(metadataIconNames)

  const missingMetadata = [...svgIconSet]
    .filter(iconName => !metadataSet.has(iconName))
    .sort(sortCaseInsensitive)

  for (const iconName of missingMetadata) {
    const metadataPath = path.join(iconsDir, `${iconName}.json`)
    const metadataContent = JSON.stringify(getDefaultMetadata(iconName), null, 2)

    await fs.writeFile(metadataPath, `${metadataContent}\n`, 'utf8')
  }

  const orphanMetadata = metadataIconNames
    .filter(iconName => !svgIconSet.has(iconName))
    .sort(sortCaseInsensitive)

  for (const iconName of orphanMetadata) {
    const metadataPath = path.join(iconsDir, `${iconName}.json`)
    await fs.unlink(metadataPath)
  }
}

async function generateIconsFiles() {
  try {
    const processed = await processAllIcons({
      iconsDir: config.iconsDir,
      writeNormalized: true,
      svgoConfig,
      defaultSvgAttributes: config.defaultSvgAttributes,
    })

    const svgIconNames = processed.map(({ iconName }) => iconName)
    await syncIconMetadata(config.iconsDir, svgIconNames)

    const iconData = processed.map(({ iconName, nodes }) => ({
      [iconName]: { nodes },
    }))
    const iconMap = Object.assign({}, ...iconData)
    const jsonContent = JSON.stringify(iconMap)

    await fs.writeFile(path.join(config.outputDir, config.jsonFilename), jsonContent, 'utf8')

    console.warn('SVG files processed, metadata synchronized, and icons.json generated')
  }
  catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

generateIconsFiles()
