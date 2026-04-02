import fs from 'fs/promises'
import path from 'path'

import config from './icons.config.js'
import svgoConfig from './svgo.config.js'
import { processAllIcons } from './core/icons-pipeline.js'

async function generateIconsFiles () {
  try {
    const processed = await processAllIcons({
      iconsDir: config.iconsDir,
      writeNormalized: true,
      svgoConfig,
      defaultSvgAttributes: config.defaultSvgAttributes
    })

    const iconData = processed.map(({ iconName, nodes }) => ({
      [iconName]: { nodes }
    }))
    const iconMap = Object.assign({}, ...iconData)
    const jsonContent = JSON.stringify(iconMap)

    await fs.writeFile(path.join(config.outputDir, config.jsonFilename), jsonContent, 'utf8')

    console.log('SVG files processed and icons.json generated')
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

generateIconsFiles()
