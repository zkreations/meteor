export const normalize = (value: string): string => value.trim().toLowerCase().replace(/\s+/g, ' ')
export const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1)

// Lock the document body's scroll and compensate for scrollbar disappearance to prevent layout shift.
export function lockScroll() {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
  document.body.style.paddingRight = `${scrollbarWidth}px`
}

// Restore the document body's scroll and remove scrollbar compensation.
// @param element - Optional element to wait for transitionend
export async function unlockScroll(element?: HTMLElement) {
  return new Promise<void>((resolve) => {
    if (!element || getComputedStyle(element).transitionDuration === '0s') {
      resolve()
      return
    }

    element.addEventListener('transitionend', () => {
      resolve()
    }, { once: true })
  }).then(() => {
    document.body.style.paddingRight = ''
  })
}
