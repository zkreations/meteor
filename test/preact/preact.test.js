import { cleanup, render } from '@testing-library/preact'
import { createRef, h } from 'preact'
import { afterEach, describe, expect, it } from 'vitest'

import { createIcon } from '../../packages/preact/src/create-icon.js'
import AlarmClock from '../../packages/preact/src/icons/alarm-clock.js'

import ArrowRight from '../../packages/preact/src/icons/arrow-right.js'

import {
  AlarmClock as AlarmClockFromIndex,
  ArrowRight as ArrowRightFromIndex,
} from '../../packages/preact/src/index.js'

afterEach(() => {
  cleanup()
})

describe('preact icons', () => {
  it('renders icons with default svg attributes', () => {
    const cases = [
      {
        Icon: AlarmClock,
        expectedClass: 'i i-alarm-clock',
        expectedPathD: 'm1 4 3-3m16 0 3 3M12 7v5l3 3',
        extraSelector: 'circle',
      },
      {
        Icon: ArrowRight,
        expectedClass: 'i i-arrow-right',
        expectedPathD: 'm12 19 7-7-7-7m7 7H5',
      },
    ]

    for (const { Icon, expectedClass, expectedPathD, extraSelector } of cases) {
      const { container, unmount } = render(h(Icon, {}))
      const svg = container.querySelector('svg')

      expect(svg).not.toBeNull()
      expect(svg.getAttribute('width')).toBe('24')
      expect(svg.getAttribute('height')).toBe('24')
      expect(svg.getAttribute('stroke')).toBe('currentColor')
      expect(svg.getAttribute('stroke-width')).toBe('2')
      expect(svg.getAttribute('fill')).toBe('none')
      expect(svg.getAttribute('class')).toBe(expectedClass)

      const path = container.querySelector('path')
      expect(path).not.toBeNull()
      expect(path.getAttribute('d')).toBe(expectedPathD)

      if (extraSelector) {
        expect(container.querySelector(extraSelector)).not.toBeNull()
      }

      unmount()
    }
  })

  it('applies size, color, strokeWidth, className and passthrough attributes', () => {
    const { container } = render(
      h(ArrowRight, {
        'size': 48,
        'color': 'red',
        'strokeWidth': 1.5,
        'className': 'extra-class',
        'data-testid': 'arrow-right-icon',
      }),
    )

    const svg = container.querySelector('svg')

    expect(svg.getAttribute('width')).toBe('48')
    expect(svg.getAttribute('height')).toBe('48')
    expect(svg.getAttribute('stroke')).toBe('red')
    expect(svg.getAttribute('stroke-width')).toBe('1.5')
    expect(svg.getAttribute('data-testid')).toBe('arrow-right-icon')
    expect(svg.getAttribute('class')).toBe('i i-arrow-right extra-class')
  })

  it('renders minimal svg attributes when minimal is enabled', () => {
    const { container } = render(
      h(AlarmClock, {
        'minimal': true,
        'className': 'icon-lg',
        'data-testid': 'alarm-minimal',
      }),
    )

    const svg = container.querySelector('svg')

    expect(svg).not.toBeNull()
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24')
    expect(svg.getAttribute('class')).toBe('i i-alarm-clock icon-lg')
    expect(svg.getAttribute('data-testid')).toBe('alarm-minimal')

    expect(svg.hasAttribute('xmlns')).toBe(false)
    expect(svg.hasAttribute('width')).toBe(false)
    expect(svg.hasAttribute('height')).toBe(false)
    expect(svg.hasAttribute('fill')).toBe(false)
    expect(svg.hasAttribute('stroke')).toBe(false)
    expect(svg.hasAttribute('stroke-width')).toBe(false)
    expect(svg.hasAttribute('stroke-linecap')).toBe(false)
    expect(svg.hasAttribute('stroke-linejoin')).toBe(false)

    expect(container.querySelector('circle')).not.toBeNull()
    expect(container.querySelector('path')).not.toBeNull()
  })

  it('forwards refs to the svg element', () => {
    const ref = createRef()
    const { container } = render(h(AlarmClock, { ref }))
    const svg = container.querySelector('svg')
    const refTarget = ref.current && ref.current.base ? ref.current.base : ref.current

    expect(refTarget).toBe(svg)
    expect(refTarget.tagName.toLowerCase()).toBe('svg')
  })

  it('normalizes node attributes and renders nested children with createIcon', () => {
    const CustomIcon = createIcon('custom-shape', [
      {
        tag: 'g',
        attrs: {
          'class': 'node-group',
          'stroke-width': '3',
          'fill-rule': 'evenodd',
          'stroke-dasharray': '4 2',
        },
        children: [
          {
            tag: 'path',
            attrs: { d: 'M0 0h1' },
          },
          {
            tag: 'path',
            attrs: {
              'd': 'M1 1h1',
              'clip-rule': 'evenodd',
            },
          },
        ],
      },
    ])

    const { container } = render(h(CustomIcon, {}))
    const group = container.querySelector('g')
    const paths = container.querySelectorAll('path')

    expect(group).not.toBeNull()
    expect(group.getAttribute('class')).toBe('node-group')
    expect(group.getAttribute('stroke-width')).toBe('3')
    expect(group.getAttribute('fill-rule')).toBe('evenodd')
    expect(group.getAttribute('stroke-dasharray')).toBe('4 2')

    expect(paths.length).toBe(2)
    expect(paths[1].getAttribute('clip-rule')).toBe('evenodd')
  })

  it('sets a stable displayName on generated components', () => {
    const Dynamic = createIcon('display-icon', [])

    expect(Dynamic.displayName).toBe('display-icon')
  })

  it('exports the same generated icons from index', () => {
    expect(AlarmClockFromIndex).toBe(AlarmClock)
    expect(ArrowRightFromIndex).toBe(ArrowRight)
  })
})
