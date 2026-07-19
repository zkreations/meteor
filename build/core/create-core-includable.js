import fs from 'node:fs/promises'
import path from 'node:path'

import config from '../icons.config.js'
import svgoConfig from '../svgo.config.js'
import { processAllIcons } from './icons-pipeline.js'

export async function generateCoreIncludable() {
  const processed = await processAllIcons({
    iconsDir: config.iconsDir,
    writeNormalized: false,
    svgoConfig,
    defaultSvgAttributes: config.defaultSvgAttributes,
  })

  const items = processed.map(({ iconName, innerContent }) => {
    return `\n      <b:case value='${iconName}'/>${innerContent}`
  })

  const includable = `<b:includable id='@meteor'>
  <svg expr:class='"i i-" + data:icon' viewBox='0 0 24 24'>
    <b:class cond='data:class' expr:name='data:class'/>
    <b:attr expr:value='data:color' name='stroke'/>
    <b:attr expr:value='data:size' name='width'/>
    <b:attr expr:value='data:size' name='height'/>
    <b:attr expr:value='data:strokeWidth' name='stroke-width'/>
    <b:switch var='data:icon'>${items.join('')}
      <b:default/><b:attr expr:value='data:icon' name='data-i'/><circle cx="12" cy="12" r="10"/>
    </b:switch>
  </svg>
</b:includable>`

  const dist = path.join(config.outputDir, config.includableFilename)
  await fs.writeFile(dist, includable, 'utf8')

  console.warn('Includable file generated successfully.')
}
