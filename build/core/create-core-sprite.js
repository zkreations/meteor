import fs from 'node:fs'
import path from 'node:path'
import SVGSpriter from 'svg-sprite'

import config from '../icons.config.js'
import svgoConfig from '../svgo.config.js'
import { processAllIcons } from './icons-pipeline.js'

const outputConfig = {
  symbol: {
    dest: config.outputDir,
    sprite: config.spriteFilename,
  },
}

function createSpriter() {
  return new SVGSpriter({
    svg: {
      namespaceClassnames: false,
      xmlDeclaration: false,
      transform: [
        svg =>
          svg.replace(
            /<(symbol).*?id="([^"]*)".*?>/g,
            '<symbol viewBox="0 0 24 24" id="$2">',
          ),
      ],
    },
  })
}

function addIconsToSpriter(spriter, icons) {
  icons.forEach(({ filePath, finalSvg }) => {
    const fileName = path.basename(filePath)
    spriter.add(filePath, fileName, finalSvg)
  })

  return spriter
}

function writeSprites(sprites) {
  Object.values(sprites.symbol).forEach((sprite) => {
    fs.mkdirSync(path.dirname(sprite.path), { recursive: true })
    fs.writeFileSync(sprite.path, sprite.contents)
  })
}

export async function generateCoreSprite() {
  const icons = await processAllIcons({
    iconsDir: config.iconsDir,
    writeNormalized: false,
    svgoConfig,
    defaultSvgAttributes: config.defaultSvgAttributes,
  })

  await new Promise((resolve, reject) => {
    addIconsToSpriter(createSpriter(), icons).compile(outputConfig, (error, result) => {
      if (error) {
        reject(error)
        return
      }

      writeSprites(result)
      resolve()
    })
  })

  console.warn('Sprites file generated successfully.')
}
