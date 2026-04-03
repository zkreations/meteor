import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createIcons, icons, Star } from '../../packages/core/src/esm/index.js'

describe('core vanilla api', () => {
  it('renders svg elements from data-i using esm createIcons', () => {
    document.body.innerHTML = '<i data-i="star" class="my-class" width="32"></i>'

    createIcons()

    const svg = document.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('class')).toContain('i i-star')
    expect(svg?.getAttribute('class')).toContain('my-class')
    expect(svg?.getAttribute('width')).toBe('32')
    expect(svg?.querySelector('path')).not.toBeNull()
  })

  it('supports custom attribute name and selective icon set', () => {
    document.body.innerHTML = '<i data-icon="star"></i><i data-icon="missing"></i>'

    createIcons({
      nameAttr: 'data-icon',
      icons: { Star }
    })

    const rendered = document.querySelectorAll('svg')
    const stillMissing = document.querySelector('[data-icon="missing"]')

    expect(rendered.length).toBe(1)
    expect(rendered[0].getAttribute('class')).toContain('i i-star')
    expect(stillMissing).not.toBeNull()
  })

  it('exports icons map for full import usage', () => {
    expect(Array.isArray(icons.star)).toBe(true)
    expect(icons.star.length).toBeGreaterThan(0)
    expect(Array.isArray(icons['arrow-right'])).toBe(true)
  })

  it('browser bundle exposes meteorIcons global and renders', () => {
    const workspaceRoot = resolve(import.meta.dirname, '../..')
    const browserBundle = readFileSync(resolve(workspaceRoot, 'packages/core/exports/icons.js'), 'utf8')

    delete globalThis.meteorIcons
    document.body.innerHTML = '<i data-i="arrow-right"></i>'

    // eslint-disable-next-line no-new-func
    new Function(browserBundle)()

    expect(globalThis.meteorIcons).toBeDefined()
    expect(typeof globalThis.meteorIcons.createIcons).toBe('function')
    expect(globalThis.meteorIcons.icons).toBeDefined()

    globalThis.meteorIcons.createIcons()

    const svg = document.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('class')).toContain('i i-arrow-right')

    delete globalThis.meteorIcons
  })
})
