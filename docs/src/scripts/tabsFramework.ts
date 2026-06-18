import { toPascalCase } from '../utils/iconUtils'
import { showToast } from './toast'

export type FwKey = 'astro' | 'react' | 'preact' | 'vue' | 'solid' | 'svelte'

export function snippet(name: string, fw: FwKey): string {
  const ComponentName = toPascalCase(name)
  if (fw === 'astro')
    return `import { ${ComponentName} } from '@meteor-icons/astro'\n\n<${ComponentName} size={24} />`
  if (fw === 'react')
    return `import { ${ComponentName} } from '@meteor-icons/react'\n\n<${ComponentName} size={24} />`
  if (fw === 'preact')
    return `import { ${ComponentName} } from '@meteor-icons/preact'\n\n<${ComponentName} size={24} />`
  if (fw === 'vue')
    return `import { ${ComponentName} } from '@meteor-icons/vue'\n\n<${ComponentName} size="24" />`
  if (fw === 'svelte')
    return `import { ${ComponentName} } from '@meteor-icons/svelte'\n\n<${ComponentName} size={24} />`

  return `import { ${ComponentName} } from '@meteor-icons/solid'\n\n<${ComponentName} size={24} />`
}

export function initTabsFramework(container: HTMLElement, initialName: string = '') {
  const implDisplay = container.querySelector<HTMLElement>('[data-impl-display]')
  const implButtons = Array.from(container.querySelectorAll<HTMLButtonElement>('[data-impl-toggle]'))
  const copyImplBtn = container.querySelector<HTMLButtonElement>('[data-copy-impl]')

  let currentName = initialName
  let currentFw: FwKey = (container.querySelector('[data-impl-toggle][aria-selected="true"]') as HTMLButtonElement)?.dataset.implToggle as FwKey || 'react'

  const updateDisplay = () => {
    if (implDisplay && currentName) {
      implDisplay.textContent = snippet(currentName, currentFw)
    }
  }

  const setFw = (key: FwKey) => {
    currentFw = key
    implButtons.forEach(b => b.setAttribute('aria-selected', String(b.dataset.implToggle === key)))
    updateDisplay()
  }

  implButtons.forEach(b =>
    b.addEventListener('click', () => setFw(b.dataset.implToggle as FwKey)),
  )

  copyImplBtn?.addEventListener('click', async () => {
    if (!currentName)
      return
    await navigator.clipboard.writeText(snippet(currentName, currentFw))
      .then(() => showToast('Implementation copied!'))
      .catch(() => showToast('Failed to copy implementation.'))
  })

  return {
    updateIconName: (newName: string) => {
      currentName = newName
      updateDisplay()
    },
    setFramework: setFw,
    getCurrentFramework: () => currentFw,
  }
}
