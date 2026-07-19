import { describe, expect, it } from 'vitest'
import hamletPlugin from '../../packages/hamlet/index.js'

describe('hamlet plugin', () => {
  it('returns a plugin object with the Meteor namespace and three partials', () => {
    const plugin = hamletPlugin()

    expect(plugin.namespace).toBe('Meteor')
    expect(typeof plugin.partials.includable).toBe('string')
    expect(typeof plugin.partials.include).toBe('string')
    expect(typeof plugin.partials.svg).toBe('string')
  })

  describe('includable partial', () => {
    it('contains the @meteor includable root', () => {
      const { partials } = hamletPlugin()
      expect(partials.includable).toContain('<b:includable id=\'@meteor\'>')
    })

    it('contains the b:switch block keyed on data:icon', () => {
      const { partials } = hamletPlugin()
      expect(partials.includable).toContain('<b:switch var=\'data:icon\'>')
    })

    it('contains sampled icon cases', () => {
      const { partials } = hamletPlugin()
      expect(partials.includable).toContain('<b:case value=\'alarm-clock\'/>')
      expect(partials.includable).toContain('<b:case value=\'arrow-right\'/>')
      expect(partials.includable).toContain('<b:case value=\'github\'/>')
    })

    it('contains b:default fallback with data-i attribute', () => {
      const { partials } = hamletPlugin()
      expect(partials.includable).toContain('<b:default/>')
      expect(partials.includable).toContain('expr:value=\'data:icon\' name=\'data-i\'')
    })

    it('contains optional attribute bindings for class, color, size and strokeWidth', () => {
      const { partials } = hamletPlugin()
      expect(partials.includable).toContain('expr:name=\'data:class\'')
      expect(partials.includable).toContain('expr:value=\'data:color\' name=\'stroke\'')
      expect(partials.includable).toContain('expr:value=\'data:size\' name=\'width\'')
      expect(partials.includable).toContain('expr:value=\'data:size\' name=\'height\'')
      expect(partials.includable).toContain('expr:value=\'data:strokeWidth\' name=\'stroke-width\'')
    })
  })

  describe('include partial', () => {
    it('produces a b:include tag referencing the @meteor includable', () => {
      const { partials } = hamletPlugin()
      expect(partials.include).toContain('b:include name=\'@meteor\'')
    })

    it('passes the icon name as data', () => {
      const { partials } = hamletPlugin()
      expect(partials.include).toContain('icon: "{{icon}}"')
    })

    it('conditionally passes class, size, strokeWidth and color', () => {
      const { partials } = hamletPlugin()
      expect(partials.include).toContain('class: "{{class}}"')
      expect(partials.include).toContain('size: "{{size}}"')
      expect(partials.include).toContain('strokeWidth: "{{strokeWidth}}"')
      expect(partials.include).toContain('color: "{{color}}"')
    })
  })

  describe('svg partial', () => {
    it('contains an svg element with the expected static attributes', () => {
      const { partials } = hamletPlugin()
      expect(partials.svg).toContain('<svg')
      expect(partials.svg).toContain('xmlns="http://www.w3.org/2000/svg"')
      expect(partials.svg).toContain('viewBox="0 0 24 24"')
      expect(partials.svg).toContain('fill="none"')
      expect(partials.svg).toContain('stroke-linecap="round"')
      expect(partials.svg).toContain('stroke-linejoin="round"')
    })

    it('builds the icon class from the icon name', () => {
      const { partials } = hamletPlugin()
      expect(partials.svg).toContain('i i-{{icon}}')
    })

    it('falls back to currentColor when color is not provided', () => {
      const { partials } = hamletPlugin()
      expect(partials.svg).toContain('{{#if color}}{{color}}{{else}}currentColor{{/if}}')
    })

    it('falls back to stroke-width 2 when strokeWidth is not provided', () => {
      const { partials } = hamletPlugin()
      expect(partials.svg).toContain('{{#if strokeWidth}}{{strokeWidth}}{{else}}2{{/if}}')
    })

    it('conditionally sets width and height from size', () => {
      const { partials } = hamletPlugin()
      expect(partials.svg).toContain('{{#if size}}')
      expect(partials.svg).toContain('width="{{size}}"')
      expect(partials.svg).toContain('height="{{size}}"')
    })

    it('conditionally appends extra class', () => {
      const { partials } = hamletPlugin()
      expect(partials.svg).toContain('{{#if class}} {{class}}{{/if}}')
    })

    it('uses a switch block keyed on the icon variable', () => {
      const { partials } = hamletPlugin()
      expect(partials.svg).toContain('{{#switch icon}}')
    })

    it('contains sampled icon cases with their svg path data', () => {
      const { partials } = hamletPlugin()
      expect(partials.svg).toContain('{{#case "alarm-clock"}}')
      expect(partials.svg).toContain('{{#case "arrow-right"}}')
      expect(partials.svg).toContain('{{#case "github"}}')
    })
  })
})
