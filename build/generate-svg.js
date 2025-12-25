import fs from 'fs/promises'
import path from 'path'
import * as cheerio from 'cheerio'
import { optimize } from 'svgo'

import config from './icons.config.js'
import svgoConfig from './svgo.config.js'
import { readIcons } from './utils.js'

function serializeNode (el) {
  return {
    tag: el.tagName,
    attrs: Object.fromEntries(
      Object.entries(el.attribs || {}).map(([k, v]) => {
        const num = Number(v)
        return [k, Number.isNaN(num) ? v : num]
      })
    ),
    ...(el.children?.length
      ? { children: el.children.filter(c => c.type === 'tag').map(serializeNode) }
      : {})
  }
}

function extractNodes ($svg) {
  return $svg.children()
    .toArray()
    .filter(el => el.type === 'tag')
    .map(serializeNode)
}

async function processFile (filePath) {
  const fileName = path.basename(filePath)
  const iconName = path.basename(fileName, '.svg')
  const rawSvg = await fs.readFile(filePath, 'utf8')

  const optimizedSvg = optimize(rawSvg, svgoConfig)

  const $ = cheerio.load(optimizedSvg.data, { xmlMode: true })
  const originalContent = $('svg').contents().toString()

  const $newSvg = cheerio.load('<svg></svg>', { xmlMode: true })('svg')

  for (const [attr, value] of Object.entries(config.defaultSvgAttributes)) {
    $newSvg.attr(attr, attr === 'class' ? `i i-${iconName}` : value)
  }

  $newSvg.append(originalContent)

  const finalSvg = $newSvg.toString()

  if (finalSvg !== rawSvg) {
    await fs.writeFile(filePath, finalSvg, 'utf8')
  }

  const nodes = extractNodes($newSvg)

  return {
    [iconName]: { nodes }
  }
}

async function generateIconsFiles () {
  try {
    const files = await readIcons(config.iconsDir)
    const iconData = await Promise.all(files.map(processFile))
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
