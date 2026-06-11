import fs from 'node:fs/promises'
import path from 'node:path'
import * as cheerio from 'cheerio'
import { optimize } from 'svgo'

import { readIconFiles } from './icon-file-utils.js'

function serializeNode(el) {
  return {
    tag: el.tagName,
    attrs: Object.fromEntries(
      Object.entries(el.attribs || {}).map(([k, v]) => {
        const num = Number(v)
        return [k, Number.isNaN(num) ? v : num]
      }),
    ),
    ...(el.children?.length
      ? { children: el.children.filter(c => c.type === 'tag').map(serializeNode) }
      : {}),
  }
}

function extractNodes($svg) {
  return $svg.children()
    .toArray()
    .filter(el => el.type === 'tag')
    .map(serializeNode)
}

export function normalizeSvgContent(rawSvg, iconName, options) {
  const { svgoConfig, defaultSvgAttributes } = options
  const optimizedSvg = optimize(rawSvg, svgoConfig)

  const $ = cheerio.load(optimizedSvg.data, { xmlMode: true })
  const originalContent = $('svg').contents().toString()

  const $newSvg = cheerio.load('<svg></svg>', { xmlMode: true })('svg')

  for (const [attr, value] of Object.entries(defaultSvgAttributes)) {
    $newSvg.attr(attr, attr === 'class' ? `i i-${iconName}` : value)
  }

  $newSvg.append(originalContent)

  return {
    finalSvg: $newSvg.toString(),
    nodes: extractNodes($newSvg),
    innerContent: $newSvg.children().toString(),
  }
}

export async function processIconFile(filePath, options = {}) {
  const {
    writeNormalized = false,
    svgoConfig,
    defaultSvgAttributes,
  } = options

  const fileName = path.basename(filePath)
  const iconName = path.basename(fileName, '.svg')
  const rawSvg = await fs.readFile(filePath, 'utf8')

  const { finalSvg, nodes, innerContent } = normalizeSvgContent(rawSvg, iconName, {
    svgoConfig,
    defaultSvgAttributes,
  })

  if (writeNormalized && finalSvg !== rawSvg) {
    await fs.writeFile(filePath, finalSvg, 'utf8')
  }

  return {
    iconName,
    filePath,
    nodes,
    finalSvg,
    innerContent,
  }
}

export async function processAllIcons(options) {
  const {
    iconsDir,
    ...rest
  } = options

  const files = await readIconFiles(iconsDir)
  return Promise.all(files.map(filePath => processIconFile(filePath, rest)))
}
