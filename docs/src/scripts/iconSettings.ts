import { clamp, safeParseInt } from '../utils/iconUtils'

export const initIconSettings = (root: HTMLElement) => {
  const colorInput = root.querySelector<HTMLInputElement>('[data-setting-color]');
  const colorValue = root.querySelector('[data-color-value]');
  const strokeInput = root.querySelector<HTMLInputElement>('[data-setting-stroke]');
  const strokeValue = root.querySelector('[data-stroke-value]');
  const sizeInput = root.querySelector<HTMLInputElement>('[data-setting-size]');
  const sizeValue = root.querySelector('[data-size-value]');
  const sizePresetButtons = root.querySelectorAll<HTMLButtonElement>('[data-size-preset]');
  const btnReset = root.querySelector('[data-reset-settings]');

  const DEFAULTS = { color: 'currentColor', stroke: '2', size: '24' };
  const SIZE_SLIDER_MIN = 0;
  const SIZE_SLIDER_MAX = 340;
  const SIZE_EXACT_MAX = 256;
  const SIZE_EXACT_RANGE = SIZE_EXACT_MAX - 16;
  const SIZE_COMPRESSED_RANGE = SIZE_SLIDER_MAX - SIZE_EXACT_RANGE;
  const SIZE_MIN = 16;
  const SIZE_MAX = 1024;
  let currentConfig = { ...DEFAULTS };

  const sliderToSize = (sliderValue: number): number => {
    const v = clamp(sliderValue, SIZE_SLIDER_MIN, SIZE_SLIDER_MAX);

    if (v <= SIZE_EXACT_RANGE) {
      return SIZE_MIN + v;
    }

    const ratio = (v - SIZE_EXACT_RANGE) / SIZE_COMPRESSED_RANGE;
    return Math.round(256 + (SIZE_MAX - 256) * ratio);
  };

  const sizeToSlider = (sizeValue: number): number => {
    const s = clamp(sizeValue, SIZE_MIN, SIZE_MAX);

    if (s <= SIZE_EXACT_MAX) {
      return s - SIZE_MIN;
    }

    const ratio = (s - SIZE_EXACT_MAX) / (SIZE_MAX - SIZE_EXACT_MAX);
    return Math.round(SIZE_EXACT_RANGE + ratio * SIZE_COMPRESSED_RANGE);
  };

  const syncSizePresetState = () => {
    const activeSize = safeParseInt(currentConfig.size, 24);

    sizePresetButtons.forEach(button => {
      const presetSize = safeParseInt(button.dataset.sizePreset || '', -1);
      const isActive = presetSize === activeSize;

      button.classList.toggle('size-chip-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  };

  const syncSizeInput = () => {
    if (!sizeInput) return;
    sizeInput.value = String(sizeToSlider(safeParseInt(currentConfig.size, 24)));
  };

  const applySettings = () => {
    if (colorValue) colorValue.textContent = currentConfig.color;
    if (strokeValue) strokeValue.textContent = `${currentConfig.stroke}px`;
    if (sizeValue) sizeValue.textContent = `${currentConfig.size}px`;
    if (sizeInput) {
      sizeInput.dataset.sizeActual = currentConfig.size;
      sizeInput.setAttribute('aria-valuetext', `${currentConfig.size}px`);
    }
    if (colorInput) colorInput.dataset.colorActual = currentConfig.color;
    syncSizeInput();
    syncSizePresetState();

    const visualSize = clamp(safeParseInt(currentConfig.size, 24), 16, 48);

    root.style.setProperty('--icon-grid-preview-stroke-width', currentConfig.stroke);
    root.style.setProperty('--icon-grid-preview-size', `${visualSize}px`);

    if (currentConfig.color === 'currentColor') {
      root.style.removeProperty('--icon-grid-preview-color');
    } else {
      root.style.setProperty('--icon-grid-preview-color', currentConfig.color);
    }
  };

  const handleChange = () => {
    if (strokeInput) currentConfig.stroke = strokeInput.value;

    if (sizeInput) {
      const sliderValue = safeParseInt(sizeInput.value, sizeToSlider(safeParseInt(currentConfig.size, 24)));
      currentConfig.size = sliderToSize(sliderValue).toString();
    }

    applySettings();
  };

  const reset = () => {
    currentConfig = { ...DEFAULTS };

    if (colorInput) colorInput.value = '';
    if (strokeInput) strokeInput.value = currentConfig.stroke;
    syncSizeInput();

    applySettings();
  };

  sizePresetButtons.forEach(button => {
    button.addEventListener('click', () => {
      const presetSize = safeParseInt(button.dataset.sizePreset || '', 24);
      currentConfig.size = clamp(presetSize, SIZE_MIN, SIZE_MAX).toString();
      applySettings();
    });
  });

  syncSizeInput();
  syncSizePresetState();

  colorInput?.addEventListener('input', () => {
    if (colorInput) currentConfig.color = colorInput.value;
    applySettings();
  });

  strokeInput?.addEventListener('input', handleChange);
  sizeInput?.addEventListener('input', handleChange);
  btnReset?.addEventListener('click', reset);

  applySettings();
};
