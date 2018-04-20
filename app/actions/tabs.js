import * as types from '../constants/actions';

export function swapFavorites(payload) {
  return { type: types.SWAP_COINS, payload };
}

export function showOrCreateTab(payload) {
  return { type: types.SHOW_OR_CREATE_COIN, payload };
}

export function hideTab(payload) {
  return { type: types.HIDE_COIN, payload };
}
