let activeToast: HTMLDivElement | null = null
let toastTimeoutId: number | null = null

export function showToast(message: string, duration = 1500) {
  if (activeToast) {
    activeToast.remove()
    activeToast = null
  }
  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId)
    toastTimeoutId = null
  }

  let container = document.getElementById('toast-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'toast-container'
    document.body.appendChild(container)
  }

  container.classList.add('toast-container')

  const toast = document.createElement('div')
  toast.className = 'toast-item'
  toast.textContent = message

  container.appendChild(toast)
  activeToast = toast

  requestAnimationFrame(() => {
    toast.classList.add('is-visible')
  })

  toastTimeoutId = window.setTimeout(() => {
    toast.classList.remove('is-visible')

    toast.addEventListener('transitionend', () => {
      toast.remove()
      if (activeToast === toast) {
        activeToast = null
      }

      if (container && container.children.length === 0) {
        container.remove()
      }
    })
  }, duration)
}
