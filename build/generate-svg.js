import { optimize } from 'svgo'
import svgoConfig from './svgo.config.js'
import fs from 'fs/promises'
import path from 'path'
import * as cheerio from 'cheerio'
import { ESLint } from 'eslint'
import config from './icons.config.js'

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
  const contentOnly = $newSvg.children().toString()

  if (finalSvg !== rawSvg) {
    await fs.writeFile(filePath, finalSvg, 'utf8')
  }

  return { [iconName]: contentOnly }
}

async function formatWithESLint (code) {
  const eslint = new ESLint({ fix: true })
  const results = await eslint.lintText(code)
  return results[0]?.output || code
}

async function generateIconsFiles () {
  try {
    const files = await fs.readdir(config.iconsDir)
    const filePaths = files
      .filter(file => file.endsWith('.svg'))
      .map(file => path.join(config.iconsDir, file))

    const iconData = await Promise.all(filePaths.map(processFile))

    const iconMap = Object.assign({}, ...iconData)
    const jsonContent = JSON.stringify(iconMap)
    const jsContent = await formatWithESLint(`export default ${jsonContent};`)

    await fs.writeFile(`${config.outputDir}/${config.jsonFilename}`, jsonContent, 'utf8')
    await fs.writeFile(`${config.outputDir}/${config.jsFilename}`, jsContent, 'utf8')

    console.log('SVG files processed, icons.json and icons.js generated')
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

generateIconsFiles()
