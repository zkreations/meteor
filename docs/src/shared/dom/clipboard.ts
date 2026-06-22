import { showToast } from '@shared/ui/toast'

// @param el Element whose text content to copy
// @param message Optional message to show on successful copy
export async function copyElementText(el: HTMLElement, message = 'Copied to clipboard!') {
  const text = el.textContent?.trim() ?? ''
  if (!text)
    return

  try {
    await navigator.clipboard.writeText(text)
    showToast(message)
  }
  catch {
    showToast('Failed to copy to clipboard.')
  }
}

// Bind a click event to a button that copies the text content of the button to the clipboard
// @param button Button element to bind the click event to
// @param message Optional message to show on successful copy
export function bindCopyTextOnClick(button: HTMLButtonElement | null, message?: string) {
  if (!button)
    return

  button.addEventListener('click', () => copyElementText(button, message))
}
