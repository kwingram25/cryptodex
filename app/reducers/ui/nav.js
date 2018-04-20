import move from 'lodash-move';

import {
  SWITCH_COIN,
  TOGGLE_COINS_MENU,
  TOGGLE_FAVORITE,
  SWAP_FAVORITES,
  HIDE_SORTING_HELP_MESSAGE
} from 'constants/actions';
import {
  initialFavorite,
  defaultFavorites
} from 'constants/ui';

export const defaultState = {
  selectedCoinCode: initialFavorite,
  favorites: defaultFavorites,
  isCoinsListOpen: false,
  sawSortingHelpMessage: false
};

export default function navReducer(state = defaultState, action) {
  const { type, payload } = action;
  switch (type) {
    case SWITCH_COIN:
      return {
        ...state,
        selectedCoinCode: payload
      };

    case TOGGLE_COINS_MENU:
      return {
        ...state,
        isCoinsListOpen: payload
      };

    case TOGGLE_FAVORITE:
      return {
        ...state,
        favorites: state.favorites.includes(payload) ?
          state.favorites.filter(code => code !== payload) :
          state.favorites.concat(payload)
      };

    case SWAP_FAVORITES:
      const [a, b] = payload;
      return {
        ...state,
        favorites: move(state.favorites, a, b)
      };

    case HIDE_SORTING_HELP_MESSAGE:
      return {
        ...state,
        sawSortingHelpMessage: true
      };

    default:
      return state;
  }
}
