import fs from 'fs/promises'
import path from 'path'

import config from './icons.config.js'
import svgoConfig from './svgo.config.js'
import { processAllIcons } from './core/icons-pipeline.js'

async function generateSvgIncludableFile () {
  try {
    const processed = await processAllIcons({
      iconsDir: config.iconsDir,
      writeNormalized: false,
      svgoConfig,
      defaultSvgAttributes: config.defaultSvgAttributes
    })

    const items = processed.map(({ iconName, innerContent }) => {
      return `\n      <b:case value='${iconName}'/>${innerContent}`
    })

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
