import * as types from '../constants/actions';

export function switchCoin(payload) {
  return { type: types.SWITCH_COIN, payload };
}

export function switchAddress(payload) {
  return { type: types.SWITCH_ADDRESS, payload };
}

export function toggleAddressOptionsMenu(payload) {
  return { type: types.TOGGLE_ADDRESS_OPTIONS_MENU, payload };
}

export function openCreateAddressForm(payload) {
  return { type: types.OPEN_CREATE_ADDRESS_FORM, payload };
}

export function openEditAddressForm(payload) {
  return { type: types.OPEN_EDIT_ADDRESS_FORM, payload };
}

export function closeForm(payload) {
  return { type: types.CLOSE_FORM, payload };
}

export function editName(payload) {
  return { type: types.EDIT_NAME, payload };
}

export function editString(payload) {
  return { type: types.EDIT_STRING, payload };
}

export function toggleCoinsMenu(payload) {
  return { type: types.TOGGLE_COINS_MENU, payload };
}

export function toggleFavorite(payload) {
  return { type: types.TOGGLE_FAVORITE, payload };
}

export function swapFavorites(payload) {
  return { type: types.SWAP_FAVORITES, payload };
}

export function toggleDeleteDialog(payload) {
  return { type: types.TOGGLE_DELETE_DIALOG, payload };
}

export function toggleQRCodeDialog(payload) {
  return { type: types.TOGGLE_QR_CODE_DIALOG, payload };
}

export function hideSortingHelpMessage(payload) {
  return { type: types.HIDE_SORTING_HELP_MESSAGE, payload };
}
