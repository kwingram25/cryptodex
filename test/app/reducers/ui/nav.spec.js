import _ from 'lodash';
import { expect } from 'chai';
import * as types from 'constants/actions';
import { coins } from 'constants/coins';

import nav, { defaultState } from 'reducers/ui/nav';
import { randomIndexKey, randomFavorite } from 'test/utils';

const codes = Object.keys(coins);

const randomNewCoin = ({ not } = {}) =>
  codes[randomIndexKey(codes, { not })];

const defaultFavorites = defaultState.favorites;

describe('ui/nav reducer', () => {
  it('should handle initial state', () => {
    expect(
      nav(undefined, {})
    ).to.eql(
      defaultState
    );
  });

  it('should handle SWITCH_COIN', () => {
    const code = randomNewCoin({
      not: [defaultState.selectedCoinCode]
    });
    expect(
      nav(defaultState, {
        type: types.SWITCH_COIN,
        payload: code
      })
    ).to.eql({
      ...defaultState,
      selectedCoinCode: code
    });
  });

  it('should handle TOGGLE_COINS_MENU', () => {
    expect(
      nav({
        ...defaultState,
        isCoinsListOpen: false
      }, {
        type: types.TOGGLE_COINS_MENU,
        payload: true
      })
    ).to.eql({
      ...defaultState,
      isCoinsListOpen: true
    });

    expect(
      nav({
        ...defaultState,
        isCoinsListOpen: true
      }, {
        type: types.TOGGLE_COINS_MENU,
        payload: false
      })
    ).to.eql({
      ...defaultState,
      isCoinsListOpen: false
    });
  });

  it('should handle TOGGLE_FAVORITE', () => {
    const favorite = randomNewCoin({
      not: defaultFavorites
    });

    expect(
      nav(defaultState, {
        type: types.TOGGLE_FAVORITE,
        payload: favorite
      })
    ).to.eql({
      ...defaultState,
      favorites: defaultFavorites.concat(favorite)
    });

    const unfavorite = randomFavorite(defaultFavorites);

    expect(
      nav(defaultState, {
        type: types.TOGGLE_FAVORITE,
        payload: unfavorite
      })
    ).to.eql({
      ...defaultState,
      favorites: defaultState.favorites.filter(
        code => code !== unfavorite
      )
    });
  });

  it('should handle SWAP_FAVORITES', () => {
    const favorites = (new Array(10).fill()).reduce(
      prev => prev.concat(randomNewCoin({
        not: prev
      })), []
    );

    const from = randomFavorite(favorites);
    const to = randomFavorite(favorites, {
      not: [from]
    });

    const expected = favorites.map((code, index) => {
      if (!_.inRange(index, from, to)) {
        return code;
      } else if (index === from) {
        return favorites[to];
      }
      return (
          from < to ?
          favorites[index - 1] :
          favorites[index + 1]
      );
    });

    const next = nav({
      ...defaultState,
      favorites
    }, {
      type: types.SWAP_FAVORITES,
      payload: [from, to]
    });

    next.favorites.forEach((code, index) => {
      expect(
        code
      ).to.equal(
        expected[index]
      );
    });
  });
});
