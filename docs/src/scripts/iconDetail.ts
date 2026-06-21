import { bindCopyTextOnClick } from './clipboardActions'
import { initIconActions } from './iconActions'
import { initIconSettings } from './iconSettings'
import { initTabsFramework } from './tabsFramework'

export function initIconDetail(root: HTMLElement) {
  initIconSettings(root)
  initIconActions(root)

  const tabsWrapper = root.querySelector<HTMLElement>('[data-framework-tabs-container]')
  if (tabsWrapper)
    initTabsFramework(tabsWrapper)

  bindCopyTextOnClick(root.querySelector<HTMLButtonElement>('[data-copy-name]'), 'Name copied!')
  bindCopyTextOnClick(root.querySelector<HTMLButtonElement>('[data-copy-component-name]'), 'Component name copied!')
  bindCopyTextOnClick(root.querySelector<HTMLButtonElement>('[data-copy-html]'), 'HTML snippet copied!')
}
