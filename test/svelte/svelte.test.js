import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/svelte'

import AlarmClock from '../../packages/svelte/src/icons/alarm-clock.svelte'
import ArrowRight from '../../packages/svelte/src/icons/arrow-right.svelte'

import {
  AlarmClock as AlarmClockFromIndex,
  ArrowRight as ArrowRightFromIndex
} from '../../packages/svelte/src/index.js'

afterEach(() => {
  cleanup()
})

describe('svelte icons', () => {
  it('renders icons with default svg attributes', () => {
    const cases = [
      {
        Component: AlarmClock,
        expectedClass: 'i i-alarm-clock',
        expectedPathD: 'm1 4 3-3m16 0 3 3M12 7v5l3 3',
        extraSelector: 'circle'
      },
      {
        Component: ArrowRight,
        expectedClass: 'i i-arrow-right',
        expectedPathD: 'm12 19 7-7-7-7m7 7H5'
      }
    ]

    for (const { Component, expectedClass, expectedPathD, extraSelector } of cases) {
      const { container, unmount } = render(Component)
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
    const { container } = render(ArrowRight, {
      props: {
        size: 48,
        color: 'red',
        strokeWidth: 1.5,
        class: 'extra-class',
        'data-testid': 'arrow-right-icon'
      }
    })

    const svg = container.querySelector('svg')

    expect(svg.getAttribute('width')).toBe('48')
    expect(svg.getAttribute('height')).toBe('48')
    expect(svg.getAttribute('stroke')).toBe('red')
    expect(svg.getAttribute('stroke-width')).toBe('1.5')
    expect(svg.getAttribute('data-testid')).toBe('arrow-right-icon')
    expect(svg.getAttribute('class')).toBe('i i-arrow-right extra-class')
  })

  it('exports the same generated icons from index', () => {
    expect(AlarmClockFromIndex).toBe(AlarmClock)
    expect(ArrowRightFromIndex).toBe(ArrowRight)
  })
})
