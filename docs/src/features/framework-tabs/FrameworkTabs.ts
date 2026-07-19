import { toPascalCase } from '@shared/stringCase'
import { showToast } from '@shared/ui/toast'

export type FwKey = 'astro' | 'react' | 'preact' | 'vue' | 'solid' | 'svelte' | 'hamlet'

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
  if (fw === 'hamlet')
    return `{{> Meteor.svg icon="${name}" size=24 }}`

  return `import { ${ComponentName} } from '@meteor-icons/solid'\n\n<${ComponentName} size={24} />`
}

export function initTabsFramework(container: HTMLElement, initialName: string = '') {
  const implDisplay = container.querySelector<HTMLElement>('[data-impl-display]')
  const staticContents = Array.from(container.querySelectorAll<HTMLElement>('[data-impl-content]'))
  const implButtons = Array.from(container.querySelectorAll<HTMLButtonElement>('[data-impl-toggle]'))
  const copyImplBtn = container.querySelector<HTMLButtonElement>('[data-copy-impl]')

  let currentName = initialName
  let currentFw: FwKey = (container.querySelector('[data-impl-toggle][aria-selected="true"]') as HTMLButtonElement)?.dataset.implToggle as FwKey || 'react'

  const updateDisplay = () => {
    if (implDisplay) {
      if (currentName)
        implDisplay.textContent = snippet(currentName, currentFw)
      return
    }

    staticContents.forEach((el) => {
      el.classList.toggle('hidden', el.dataset.implFw !== currentFw)
    })
  }

  const getActiveContent = (): string => {
    if (implDisplay)
      return implDisplay.textContent ?? ''

    return staticContents.find(el => el.dataset.implFw === currentFw)?.textContent ?? ''
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
    const content = getActiveContent()
    if (!content)
      return

    await navigator.clipboard.writeText(content)
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
