import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { getWorkspaceRoot } from '../smoke-utils.js'

const workspaceRoot = getWorkspaceRoot(import.meta.url)

function readWorkspaceFile(relativePath) {
  return readFileSync(resolve(workspaceRoot, relativePath), 'utf8')
}

describe('astro icons contracts', () => {
  it('keeps expected icon component defaults and svg structure', () => {
    const alarmClock = readWorkspaceFile('packages/astro/src/icons/alarm-clock.astro')
    const arrowRight = readWorkspaceFile('packages/astro/src/icons/arrow-right.astro')

    expect(alarmClock).toContain('size = 24')
    expect(alarmClock).toContain('strokeWidth = 2')
    expect(alarmClock).toContain('color = \'currentColor\'')
    expect(alarmClock).toContain('minimal = false')
    expect(alarmClock).toContain('class: className = \'\'')
    expect(alarmClock).toContain('{minimal ? (')
    expect(alarmClock).toContain('<svg viewBox=\'0 0 24 24\' class={mergedClass} {...rest}>')
    expect(alarmClock).toContain('class={mergedClass}')
    expect(alarmClock).toContain('<circle cx="12" cy="12" r="10"></circle>')
    expect(alarmClock).toContain('<path d="m1 4 3-3m16 0 3 3M12 7v5l3 3"></path>')

    expect(arrowRight).toContain('size = 24')
    expect(arrowRight).toContain('strokeWidth = 2')
    expect(arrowRight).toContain('color = \'currentColor\'')
    expect(arrowRight).toContain('minimal = false')
    expect(arrowRight).toContain('{minimal ? (')
    expect(arrowRight).toContain('<svg viewBox=\'0 0 24 24\' class={mergedClass} {...rest}>')
    expect(arrowRight).toContain('class={mergedClass}')
    expect(arrowRight).toContain('<path d="m12 19 7-7-7-7m7 7H5"></path>')
  })

  it('exports generated icons from package index and subpath mapping', () => {
    const indexSource = readWorkspaceFile('packages/astro/src/index.js')
    const packageSource = JSON.parse(readWorkspaceFile('packages/astro/package.json'))

    expect(indexSource).toContain('export { default as AlarmClock } from \'./icons/alarm-clock.astro\'')
    expect(indexSource).toContain('export { default as ArrowRight } from \'./icons/arrow-right.astro\'')

    expect(packageSource.exports['.'].default).toBe('./src/index.js')
    expect(packageSource.exports['./icons/*'].default).toBe('./src/icons/*.astro')
  })
})
