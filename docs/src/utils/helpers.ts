export const normalize = (value: string): string => value.trim().toLowerCase().replace(/\s+/g, ' ')
export const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1)

// Temporarily replace a button label's text, then restore it.
// Useful for copy/download feedback ("Copied!" → original text).
// @param button - The button containing the label element
// @param selector - CSS selector for the label element inside the button
// @param nextText - The temporary text to show
// @param duration - How long (ms) to show the temporary text (default 1400)
export function flashLabel(
  button: HTMLButtonElement,
  selector: string,
  nextText: string,
  duration = 1400,
): void {
  const label = button.querySelector<HTMLElement>(selector)
  if (!label)
    return
  const originalText = label.textContent || ''
  label.textContent = nextText
  window.setTimeout(() => {
    label.textContent = originalText
  }, duration)
}

// Lock the document body's scroll and compensate for scrollbar disappearance to prevent layout shift.
export function lockScroll() {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
  document.body.style.paddingRight = `${scrollbarWidth}px`
}

// Restore the document body's scroll and remove scrollbar compensation.
export function unlockScroll() {
  document.body.style.paddingRight = ''
}
