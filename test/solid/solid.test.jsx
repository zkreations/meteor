import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@solidjs/testing-library'

import AlarmClock from '../../packages/solid/src/icons/alarm-clock.jsx'
import ArrowRight from '../../packages/solid/src/icons/arrow-right.jsx'

import {
  AlarmClock as AlarmClockFromIndex,
  ArrowRight as ArrowRightFromIndex
} from '../../packages/solid/src/index.jsx'

import { createIcon } from '../../packages/solid/src/create-icon.jsx'

afterEach(() => {
  cleanup()
})

describe('solid icons', () => {
  it('renders icons with default svg attributes', () => {
    const cases = [
      {
        Icon: AlarmClock,
        expectedClass: 'i i-alarm-clock',
        expectedPathD: 'm1 4 3-3m16 0 3 3M12 7v5l3 3',
        extraSelector: 'circle'
      },
      {
        Icon: ArrowRight,
        expectedClass: 'i i-arrow-right',
        expectedPathD: 'm12 19 7-7-7-7m7 7H5'
      }
    ]

    for (const { Icon, expectedClass, expectedPathD, extraSelector } of cases) {
      const { container, unmount } = render(() => Icon({}))
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

  it('applies size, color, strokeWidth, class and passthrough attributes', () => {
    const { container } = render(() => (
      <ArrowRight
        size={48}
        color='red'
        strokeWidth={1.5}
        class='extra-class'
        data-testid='arrow-right-icon'
      />
    ))

    const svg = container.querySelector('svg')

    expect(svg.getAttribute('width')).toBe('48')
    expect(svg.getAttribute('height')).toBe('48')
    expect(svg.getAttribute('stroke')).toBe('red')
    expect(svg.getAttribute('stroke-width')).toBe('1.5')
    expect(svg.getAttribute('data-testid')).toBe('arrow-right-icon')
    expect(svg.getAttribute('class')).toBe('i i-arrow-right extra-class')
  })

  it('renders nested children with createIcon and keeps dashed attributes', () => {
    const CustomIcon = createIcon('custom-shape', [
      {
        tag: 'g',
        attrs: {
          class: 'node-group',
          'stroke-width': '3',
          'fill-rule': 'evenodd',
          'stroke-dasharray': '4 2'
        },
        children: [
          {
            tag: 'path',
            attrs: { d: 'M0 0h1' }
          },
          {
            tag: 'path',
            attrs: {
              d: 'M1 1h1',
              'clip-rule': 'evenodd'
            }
          }
        ]
      }
    ])

    const { container } = render(() => CustomIcon({}))
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

  it('exports the same generated icons from index', () => {
    expect(AlarmClockFromIndex).toBe(AlarmClock)
    expect(ArrowRightFromIndex).toBe(ArrowRight)
  })
})
