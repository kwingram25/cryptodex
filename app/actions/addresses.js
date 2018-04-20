import * as types from '../constants/actions';

export function createAddress(payload) {
  return { type: types.CREATE_ADDRESS, payload };
}

export function removeAddress(payload) {
  return { type: types.REMOVE_ADDRESS, payload };
}

export function updateAddress(payload) {
  return { type: types.UPDATE_ADDRESS, payload };
}

export function swapAddresses(payload) {
  return { type: types.SWAP_ADDRESSES, payload };
}
