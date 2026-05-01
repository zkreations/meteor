import { initIconSearch } from './iconSearch';
import { initIconSettings } from './iconSettings';
import { initIconActions } from './iconActions';

export const initIconGrid = (root: HTMLElement) => {
  initIconSearch(root);
  initIconSettings(root);
  initIconActions(root);
};
