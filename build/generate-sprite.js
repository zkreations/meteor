import SVGSpriter from 'svg-sprite'
import path from 'path'
import fs from 'fs'
import { globSync } from 'glob'
import config from './icons.config.js'

const cwd = config.iconsDir
const files = globSync('*.svg', { cwd })

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

function addIconsToSpriter (spriter, cwd, files) {
  files.forEach((file) => {
    const filePath = path.join(cwd, file)
    const svgContent = fs.readFileSync(filePath, 'utf-8')
    spriter.add(filePath, file, svgContent)
  })
  return spriter
}

function writeSprites (sprites) {
  Object.entries(sprites.symbol).forEach(([_, sprite]) => {
    const spritePath = sprite.path
    fs.mkdirSync(path.dirname(spritePath), { recursive: true })
    fs.writeFileSync(spritePath, sprite.contents)
  })
}

function generateSprites () {
  addIconsToSpriter(spriter, cwd, files).compile(outputConfig, (error, result) => {
    if (error) {
      console.error('Error generating sprites:', error.message)
      process.exit(1)
    }

    writeSprites(result)
    console.log('Sprites file generated successfully.')
  })
}

generateSprites()
