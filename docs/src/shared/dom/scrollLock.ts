let cachedScrollbarWidth: number | null = null

// Get the width of the scrollbar in pixels.
export function getScrollbarWidth(): number {
  if (cachedScrollbarWidth !== null) {
    return cachedScrollbarWidth
  }

  const div = document.createElement('div')

  div.style.cssText = `
    position: absolute;
    visibility: hidden;
    overflow: scroll;
    width: 100px;
    height: 100px;
  `

  document.body.appendChild(div)

  cachedScrollbarWidth = div.offsetWidth - div.clientWidth
  div.remove()

  return cachedScrollbarWidth
}

// Lock the document body's scroll and compensate for scrollbar disappearance to prevent layout shift.
export function lockScroll() {
  const scrollbarWidth = getScrollbarWidth()

  document.body.style.overflow = 'hidden'

  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`
  }
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
    document.body.style.overflow = ''
  })
}
