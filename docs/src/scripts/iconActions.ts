import { getIconSvgFromContainer } from '../utils/iconRegistry'
import { bindIconActionButtons } from './iconActionButtons'

// Initialize icon action buttons (copy/download) in icon cards
// @param root Root element to attach listeners to (e.g. document.body)
export function initIconActions(root: HTMLElement) {
  bindIconActionButtons(root, (trigger) => {
    const container = trigger.closest<HTMLElement>('[data-name]')

    return {
      svg: getIconSvgFromContainer(container),
      name: container?.getAttribute('data-name') || 'icon',
    }
  })
}
