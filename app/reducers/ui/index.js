import { combineReducers } from 'redux';

import form, { defaultState as formState } from './form';
import list, { defaultState as listState } from './list';
import modals, { defaultState as modalsState } from './modals';
import nav, { defaultState as navState } from './nav';

export default combineReducers({
  form, list, modals, nav
});

export const state = {
  form: formState,
  list: listState,
  modals: modalsState,
  nav: navState
};
