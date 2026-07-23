type Theme = 'dark' | 'light'

const STORAGE_KEY = 'meteor-theme'
const DARK_CLASS = 'dark'
const NO_TRANSITION_CLASS = 'no-transitions'

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'dark' || stored === 'light' ? stored : null
  }
  catch {
    return null
  }
}

function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle(DARK_CLASS, theme === 'dark')
}

function applyThemeWithoutTransitions(theme: Theme): void {
  document.documentElement.classList.add(NO_TRANSITION_CLASS)
  applyTheme(theme)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove(NO_TRANSITION_CLASS)
    })
  })
}

function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  }
  catch {}
}

export function initThemeToggle(button: HTMLElement): void {
  const updateButton = (isDark: boolean): void => {
    button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode')
    button.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }

  const isDark = document.documentElement.classList.contains(DARK_CLASS)
  updateButton(isDark)

  button.addEventListener('click', () => {
    const nowDark = document.documentElement.classList.toggle(DARK_CLASS)
    document.documentElement.classList.toggle(DARK_CLASS, !nowDark)
    const theme: Theme = nowDark ? 'dark' : 'light'
    applyThemeWithoutTransitions(theme)
    saveTheme(theme)
    updateButton(nowDark)
  })

  window.addEventListener('storage', (e) => {
    if (e.key !== STORAGE_KEY) return
    const theme = (e.newValue === 'dark' || e.newValue === 'light') ? e.newValue : getSystemTheme()
    applyThemeWithoutTransitions(theme)
    updateButton(theme === 'dark')
  })
}

export function initTheme(): void {
  const theme = getStoredTheme() ?? getSystemTheme()
  applyTheme(theme)
}
