import { initIconActions } from '../icon-export/iconActions'
import { initIconModal } from '../icon-modal/iconModal'
import { initIconSettings } from '../icon-settings/iconSettings'
import { initIconSearch } from './iconSearch'

export function initIconGrid(root: HTMLElement) {
  initIconSearch(root)
  initIconSettings(root)
  initIconModal(root)
  initIconActions(root)
}
