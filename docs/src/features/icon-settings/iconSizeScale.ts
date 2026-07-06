import { clamp } from '@shared/number'

export const SIZE_SLIDER_MIN = 0
export const SIZE_SLIDER_MAX = 340
export const SIZE_MIN = 16
export const SIZE_MAX = 1024

const SIZE_EXACT_MAX = 256
const SIZE_EXACT_RANGE = SIZE_EXACT_MAX - SIZE_MIN
const SIZE_COMPRESSED_RANGE = SIZE_SLIDER_MAX - SIZE_EXACT_RANGE

// Converts a slider value (0-340) to an icon size (16-1024)
// @param sliderValue - The value from the slider input
// @returns The corresponding icon size
export function sliderToSize(sliderValue: number): number {
  const v = clamp(sliderValue, SIZE_SLIDER_MIN, SIZE_SLIDER_MAX)

  if (v <= SIZE_EXACT_RANGE) {
    return SIZE_MIN + v
  }

  const ratio = (v - SIZE_EXACT_RANGE) / SIZE_COMPRESSED_RANGE
  return Math.round(SIZE_EXACT_MAX + (SIZE_MAX - SIZE_EXACT_MAX) * ratio)
}

// Converts an icon size (16-1024) to a slider value (0-340)
// @param sizeValue - The icon size
// @returns The corresponding slider value
export function sizeToSlider(sizeValue: number): number {
  const s = clamp(sizeValue, SIZE_MIN, SIZE_MAX)

  if (s <= SIZE_EXACT_MAX) {
    return s - SIZE_MIN
  }

  const ratio = (s - SIZE_EXACT_MAX) / (SIZE_MAX - SIZE_EXACT_MAX)
  return Math.round(SIZE_EXACT_RANGE + ratio * SIZE_COMPRESSED_RANGE)
}
