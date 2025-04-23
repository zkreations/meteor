// src/generateIncludable.js
import fs from 'fs/promises'
import path from 'path'
import { globSync } from 'glob'
import * as cheerio from 'cheerio'

import config from './icons.config.js'

async function processSvgFile (filePath) {
  const fileName = path.basename(filePath)
  const iconName = path.parse(fileName).name
  const svg = await fs.readFile(filePath, 'utf8')

  const $ = cheerio.load(svg, { xml: { xmlMode: true } })
  const svgContent = $('svg').children().toString()

  return `\n      <b:case value='${iconName}'/>${svgContent}`
}

async function generateSvgIncludableFile () {
  try {
    const files = globSync('*.svg', { cwd: config.iconsDir, absolute: true })
    const items = await Promise.all(files.map(processSvgFile))

    const includable = `<b:includable id='@meteor'>
  <svg expr:class='"i i-" + data:icon' viewBox='0 0 24 24'>
    <b:class cond='data:class' expr:name='data:class'/>
    <b:attr cond='data:viewbox' expr:value='data:viewbox' name='viewBox'/>
    <b:attr expr:value='data:fill' name='fill'/>
    <b:attr expr:value='data:width' name='width'/>
    <b:attr expr:value='data:height' name='height'/>
    <b:switch var='data:icon'>${items.join('')}
      <b:default/><b:attr expr:value='data:icon' name='data-i'/><circle cx="12" cy="12" r="10"/>
    </b:switch>
  </svg>
</b:includable>`

    const dist = path.join(config.outputDir, config.includableFilename)
    await fs.writeFile(dist, includable, 'utf8')

    console.log('Includable file generated successfully.')
  } catch (error) {
    console.error('Error generating includable file:', error.message)
    process.exit(1)
  }
}

generateSvgIncludableFile()
