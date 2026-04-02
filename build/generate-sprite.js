import SVGSpriter from 'svg-sprite'
import path from 'path'
import fs from 'fs'
import config from './icons.config.js'
import svgoConfig from './svgo.config.js'
import { processAllIcons } from './core/icons-pipeline.js'

const outputConfig = {
  symbol: {
    dest: config.outputDir,
    sprite: config.spriteFilename
  }
}

const spriter = new SVGSpriter({
  svg: {
    namespaceClassnames: false,
    xmlDeclaration: false,
    transform: [
      (svg) =>
        svg.replace(
          /<(symbol).*?id="([^"]*?)".*?>/g,
          '<symbol viewBox="0 0 24 24" id="$2">'
        )
    ]
  }
})

function addIconsToSpriter (spriter, icons) {
  icons.forEach(({ filePath, finalSvg }) => {
    const fileName = path.basename(filePath)
    spriter.add(filePath, fileName, finalSvg)
  })

  return spriter
}

function writeSprites (sprites) {
  Object.values(sprites.symbol).forEach((sprite) => {
    fs.mkdirSync(path.dirname(sprite.path), { recursive: true })
    fs.writeFileSync(sprite.path, sprite.contents)
  })
}

async function generateSprites () {
  try {
    const icons = await processAllIcons({
      iconsDir: config.iconsDir,
      writeNormalized: false,
      svgoConfig,
      defaultSvgAttributes: config.defaultSvgAttributes
    })

    addIconsToSpriter(spriter, icons).compile(outputConfig, (error, result) => {
      if (error) {
        console.error('Error generating sprites:', error.message)
        process.exit(1)
      }

      writeSprites(result)
      console.log('Sprites file generated successfully.')
    })
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

generateSprites()
