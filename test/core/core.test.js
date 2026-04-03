import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const workspaceRoot = resolve(import.meta.dirname, '../..')
const coreRoot = resolve(workspaceRoot, 'packages/core')
const exportsRoot = resolve(coreRoot, 'exports')
const iconsRoot = resolve(coreRoot, 'icons')

describe('core package contract', () => {
  it('contains generated export files and raw icons', () => {
    expect(existsSync(resolve(exportsRoot, 'icons.json'))).toBe(true)
    expect(existsSync(resolve(exportsRoot, 'icons.svg'))).toBe(true)
    expect(existsSync(resolve(exportsRoot, 'icons.xml'))).toBe(true)
    expect(existsSync(resolve(iconsRoot, 'alarm-clock.svg'))).toBe(true)
    expect(existsSync(resolve(iconsRoot, 'arrow-right.svg'))).toBe(true)
    expect(existsSync(resolve(iconsRoot, 'github.svg'))).toBe(true)
  })

  it('exports a valid JSON icon map', () => {
    const iconsJson = JSON.parse(readFileSync(resolve(exportsRoot, 'icons.json'), 'utf8'))
    const iconNames = Object.keys(iconsJson)

    expect(iconNames.length).toBeGreaterThan(100)

    for (const iconName of ['alarm-clock', 'arrow-right', 'github']) {
      expect(iconsJson[iconName]).toBeDefined()
      expect(Array.isArray(iconsJson[iconName].nodes)).toBe(true)
      expect(iconsJson[iconName].nodes.length).toBeGreaterThan(0)
    }
  })

  it('keeps icons.json and icons folder in sync for sampled icons', () => {
    const iconsJson = JSON.parse(readFileSync(resolve(exportsRoot, 'icons.json'), 'utf8'))
    const iconFiles = readdirSync(iconsRoot).filter(file => file.endsWith('.svg'))

    expect(iconFiles.length).toBeGreaterThan(100)

    for (const sample of ['alarm-clock', 'arrow-right', 'github', 'google', 'youtube']) {
      expect(iconsJson[sample]).toBeDefined()
      expect(iconFiles).toContain(`${sample}.svg`)
    }
  })

  it('includes sampled icons in SVG sprite output', () => {
    const sprite = readFileSync(resolve(exportsRoot, 'icons.svg'), 'utf8')
    const symbolCount = (sprite.match(/<symbol\b/g) ?? []).length

    expect(sprite).toContain('<svg')
    expect(sprite).toContain('xmlns="http://www.w3.org/2000/svg"')
    expect(symbolCount).toBeGreaterThan(100)

    for (const sample of ['alarm-clock', 'arrow-right', 'github']) {
      expect(sprite).toContain(`id="${sample}"`)
    }
  })

  it('includes Blogger template switch and sampled cases', () => {
    const includable = readFileSync(resolve(exportsRoot, 'icons.xml'), 'utf8')

    expect(includable).toContain("<b:includable id='@meteor'>")
    expect(includable).toContain("<b:switch var='data:icon'>")

    for (const sample of ['alarm-clock', 'arrow-right', 'github']) {
      expect(includable).toContain(`<b:case value='${sample}'/>`)
    }
  })
})
