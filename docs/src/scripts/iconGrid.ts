import { initIconActions } from './iconActions'
import { initIconModal } from './iconModal'
import { initIconSearch } from './iconSearch'
import { initIconSettings } from './iconSettings'

export function initIconGrid(root: HTMLElement) {
  initIconSearch(root)
  initIconSettings(root)
  initIconModal(root)
  initIconActions(root)
}
