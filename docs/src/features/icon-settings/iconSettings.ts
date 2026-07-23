import type { IconCustomizeConfig } from '@shared/dom/iconCustomizeVars'
import { applyIconCustomizeVars } from '@shared/dom/iconCustomizeVars'
import { ICON_SETTINGS_CHANGE } from '@shared/events/iconSettingsChange'
import { clamp, safeParseInt } from '@shared/number'
import { SIZE_MAX, SIZE_MIN, sizeToSlider, sliderToSize } from './iconSizeScale'

// Initializes the icon settings panel functionality within a given root element.
// @param root - The root element containing the settings panel controls
export function initIconSettings(root: HTMLElement) {
  const colorInput = root.querySelector<HTMLInputElement>('[data-setting-color]')
  const colorValue = root.querySelector('[data-color-value]')
  const strokeInput = root.querySelector<HTMLInputElement>('[data-setting-stroke]')
  const strokeValue = root.querySelector('[data-stroke-value]')
  const sizeInput = root.querySelector<HTMLInputElement>('[data-setting-size]')
  const sizeValue = root.querySelector('[data-size-value]')
  const sizePresetButtons = root.querySelectorAll<HTMLButtonElement>('[data-size-preset]')
  const btnReset = root.querySelector('[data-reset-settings]')

  const DEFAULTS: IconCustomizeConfig = { color: 'currentColor', stroke: '2', size: '24' }
  let currentConfig: IconCustomizeConfig = { ...DEFAULTS }

  const updateSliderProgress = (input: HTMLInputElement | null) => {
    if (!input)
      return

    const min = Number(input.min)
    const max = Number(input.max)
    const value = Number(input.value)

    const progress = ((value - min) / (max - min)) * 100

    input.parentElement?.style.setProperty('--progress', `${progress}%`)
  }

  if (strokeInput)
    updateSliderProgress(strokeInput)

  if (sizeInput)
    updateSliderProgress(sizeInput)

  const syncSizePresetState = () => {
    const activeSize = safeParseInt(currentConfig.size, 24)

    sizePresetButtons.forEach((button) => {
      const presetSize = safeParseInt(button.dataset.sizePreset || '', -1)
      const isActive = presetSize === activeSize

      button.classList.toggle('size-chip-active', isActive)
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false')
    })
  }

  const syncSizeInput = () => {
    if (!sizeInput)
      return
    sizeInput.value = String(sizeToSlider(safeParseInt(currentConfig.size, 24)))
    updateSliderProgress(sizeInput)
  }

  const notifySettingsChange = () => {
    document.dispatchEvent(new CustomEvent(ICON_SETTINGS_CHANGE, {
      detail: { ...currentConfig },
    }))
  }

  const applySettings = () => {
    if (colorValue)
      colorValue.textContent = currentConfig.color
    if (strokeValue)
      strokeValue.textContent = `${currentConfig.stroke}px`
    if (sizeValue)
      sizeValue.textContent = `${currentConfig.size}px`
    if (sizeInput) {
      sizeInput.dataset.sizeActual = currentConfig.size
      sizeInput.setAttribute('aria-valuetext', `${currentConfig.size}px`)
    }
    if (colorInput)
      colorInput.dataset.colorActual = currentConfig.color

    syncSizeInput()
    syncSizePresetState()
    applyIconCustomizeVars(root, currentConfig)
    notifySettingsChange()
  }

  const handleChange = () => {
    if (strokeInput){
      currentConfig.stroke = strokeInput.value
      updateSliderProgress(strokeInput)
    }

    if (sizeInput) {
      const sliderValue = safeParseInt(sizeInput.value, sizeToSlider(safeParseInt(currentConfig.size, 24)))
      currentConfig.size = sliderToSize(sliderValue).toString()
      updateSliderProgress(sizeInput)
    }

    applySettings()
  }

  const reset = () => {
    currentConfig = { ...DEFAULTS }

    if (colorInput)
      colorInput.value = ''
    if (strokeInput) {
      strokeInput.value = currentConfig.stroke
      updateSliderProgress(strokeInput)
    }

    syncSizeInput()
    applySettings()
  }

  sizePresetButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const presetSize = safeParseInt(button.dataset.sizePreset || '', 24)
      currentConfig.size = clamp(presetSize, SIZE_MIN, SIZE_MAX).toString()
      applySettings()
    })
  })

  syncSizeInput()
  syncSizePresetState()

  colorInput?.addEventListener('input', () => {
    if (colorInput)
      currentConfig.color = colorInput.value
    applySettings()
  })

  strokeInput?.addEventListener('input', handleChange)
  sizeInput?.addEventListener('input', handleChange)
  btnReset?.addEventListener('click', reset)

  applySettings()
}
