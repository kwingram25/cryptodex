import _ from 'lodash';
import { createSelector } from 'reselect';
import { createSelector as ormCreateSelector } from 'redux-orm';
import orm from './index';

import { coins } from '../constants/coins';

export const ormSelector = state => state.orm;

export const getAllAddresses = createSelector(
  ormSelector,
  ormCreateSelector(orm, (session) => {
    const addresses = session.Address.all().orderBy('string', 'asc').toRefArray();
    return {
      ids: addresses.map(({ string, coin }) => `${coins[coin].name}-${string}`),
      byString: _.keyBy(addresses, 'string'),
      byCoin: _.groupBy(addresses, obj => coins[obj.coin].name)
    };
  })
);

export const getAddressCount = createSelector(
  ormSelector,
   ormCreateSelector(orm, session => session.Address.all().count())
);

export const getAddressesForCoin = createSelector(
    ormSelector,
    state => state.ui.nav.selectedCoinCode,
    ormCreateSelector(orm, (session, selectedCoinCode) => {
      const addresses = _.orderBy(
        session.Address
          .filter({ coin: selectedCoinCode })
          .toRefArray()
        , 'order', 'asc');
      return addresses;
    })
);

export const getSelectedAddress = createSelector(
    ormSelector,
    state => state.ui.list.selectedAddressId,
    ormCreateSelector(orm, (session, selectedAddressId) => {
      if (selectedAddressId < 0 || selectedAddressId === null) {
        return false;
      }
      return session.Address.withId(selectedAddressId).ref;
    })
);
