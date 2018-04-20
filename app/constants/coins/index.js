import _ from 'lodash';
import { toChecksumAddress, isAddress } from 'web3-utils';

import data from './data.json';

export explorers from './explorers';

const normalize = string => string.trim();

const normalizeEth = string => (
  isAddress(string) ?
  toChecksumAddress(string) :
  string
);

export const normalizers = {
  ethereum: normalizeEth,
  'ethereum-classic': normalizeEth,
  nem: string => string.replace(/\-/g, '').toUpperCase()
};

export const coins = _.mapValues(data, (coin, code) =>
  Object.assign(
    coin,
    {
      normalize: normalizers[code] || normalize
    }
  )
);


export const coinsInMenuOrder = _.sortBy(Object.values(coins), 'name');
