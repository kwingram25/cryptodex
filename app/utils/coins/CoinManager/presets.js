import _ from 'lodash';
import web3utils from 'web3-utils';
import blockies from 'ethereum-blockies';

import { normalizers, explorers } from 'constants/coins';
import { bestColor } from 'utils/colors';


const blockCypherTemplate = ({ code, sym, regex, prefix }) => ({
  code,
  regex,
  prefix,
  lookup: {
    url: address => `https://api.blockcypher.com/v1/${sym}/main/addrs/${address}/balance`,
    success: data => _.get(data, ['final_balance']) !== undefined,
  },
});

const cryptoidTemplate = sym => ({
  url: () => `https://chainz.cryptoid.info/${sym}/api.dws`,
  options: address => ({
    params: {
      q: 'addressfirstseen',
      a: address
    }
  }),
  success: data => !((new RegExp('^ERROR: ')).test(data))
});

const ethereumTemplate = overrides => Object.assign({}, {
  regex: /^0x[a-fA-F0-9]{40}$/,
  prefix: '0x',
  getAvatar: ({ string }) => {
    // console.log('asdf');
    const [icon, colors] = blockies.create({
      seed: string.toLowerCase(),
      size: 8,
      scale: 16
    });

    return {
      icon: icon.toDataURL(),
      color: bestColor(colors)
    };
  }
}, overrides);

const insightApiTemplate = url => ({
  url,
  options: () => ({
    params: {
      noTxList: 1
    }
  }),
  success: data => data.addrStr !== undefined
});

const presets = {
  bitcoin: blockCypherTemplate({
    code: 'bitcoin',
    prefix: '1',
    sym: 'btc',
    regex: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
  }),

  'bitcoin-cash': {
    code: 'bitcoin-cash',
    regex: /^(bitcoincash:q[a-np-z0-9]{40,}|[13C][a-km-zA-HJ-NP-Z1-9]{25,34})$/,
    explorer: address => `https://blockdozer.com/insight/address/${address}`,
    lookup: insightApiTemplate(address => `https://blockdozer.com/insight-api/addr/${address}`)
  },

  ardor: {
    code: 'ardor',
    regex: /^ARDOR\-([A-NP-Z1-9]{4}\-){3}[A-NP-Z1-9]{5}$/,
    prefix: 'ARDOR-',
    explorer: address => `https://ardor.tools/account/${address}`,
    lookup: {
      url: () => 'https://ardor.tools/ardor/nxt',
      options: address => ({
        params: {
          requestType: 'getAccount',
          account: address,
        }
      }),
      success: data => data.errorCode === undefined
    }
  },

  cardano: {
    code: 'cardano',
    regex: /^D[A-NP-Za-km-z1-9]{35,}$/,
    prefix: 'D',
    explorer: address => `https://cardanoexplorer.com/address/${address}`,
    lookup: {
      url: address => `https://cardanoexplorer.com/api/addresses/summary/${address}`,
      success: data => data.Right !== undefined && data.Left === undefined
    }
  },

  digibyte: {
    code: 'digibyte',
    regex: /^D[A-NP-Z1-9][A-NP-Za-km-z1-9]{32}$/,
    prefix: 'D',
    explorer: address => `https://digiexplorer.info/address/${address}`,
    lookup: insightApiTemplate(address => `https://digiexplorer.info/api/addr/${address}`)
  },

  nxt: {
    code: 'nxt',
    regex: /^NXT\-([A-NP-Z1-9]{4}\-){3}[A-NP-Z1-9]{5}$/,
    prefix: 'NXT-',
    explorer: address => `https://nxtportal.org/accounts/${address}`,
    lookup: {
      url: () => 'https://ardor.tools/ardor/nxt',
      options: address => ({
        params: {
          requestType: 'getAccount',
          account: address,
        }
      }),
      success: data => data.errorCode === undefined
    }
  },

  ark: {
    code: 'ark',
    regex: /^A[a-km-zA-HJ-NP-Z][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
    prefix: 'A',
    explorer: address => `https://explorer.ark.io/wallets/${address}`,
    lookup: {
      url: () => 'https://explorer.ark.io:8443/api/accounts/',
      options: address => ({
        params: {
          address
        }
      }),
      success: ({ success }) => success === true
    }
  },

  byteball: {
    code: 'byteball',
    regex: /^[A-Z0-9]{30,}$/,
    explorer: address => `https://explorer.byteball.org/#${address}`,
  },

  dash: blockCypherTemplate({
    code: 'dash',
    sym: 'dash',
    prefix: 'X',
    regex: /^X[a-km-zA-HJ-NP-Z1-9]{25,34}$/,
  }),

  decred: {
    code: 'decred',
    regex: /^D[sc][a-km-zA-HJ-NP-Z1-9]{24,33}$/,
    prefix: 'D',
    explorer: address => `https://mainnet.decred.org/address/${address}`,
    lookup: insightApiTemplate(address => `https://mainnet.decred.org/api/addr/${address}`),
  },

  dogecoin: blockCypherTemplate({
    code: 'dogecoin',
    sym: 'doge',
    prefix: 'D',
    regex: /^[D9][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
  }),

  litecoin: blockCypherTemplate({
    code: 'litecoin',
    sym: 'ltc',
    prefix: 'L',
    regex: /^L[a-km-zA-HJ-NP-Z1-9]{26,33}$/
  }),

  neo: {
    code: 'neo',
    regex: /^A[a-zA-Z][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
    prefix: 'A',
    lookup: {
      url: address => `https://neoscan.io/api/main_net/v1/get_address/${address}`,
      success: data => data.address !== 'not found'
    },
    explorer: address => `https://neoscan.io/address/${address}`
  },

  ethereum: ethereumTemplate({
    code: 'ethereum',
    validate: address => web3utils.isAddress(address),
    explorer: address => `https://www.etherscan.io/address/${address}`,
    lookup: {
      url: () => 'https://api.etherscan.io/api',
      options: address => ({
        params: {
          address,
          apikey: 'P52M5C4TUUR6293TZGY6UJHPMQAY86ITF5',
          module: 'account',
          action: 'balance',
          tag: 'latest'
        }
      }),
      success: data => data.result !== undefined,
    },
  }),

  'ethereum-classic': ethereumTemplate({
    code: 'ethereum-classic',
    explorer: address => `https://gastracker.io/addr/${address}`,
    lookup: {
      url: address => `https://api.gastracker.io/v1/addr/${address}`,
      success: data => data.success !== false
    }
  }),

  iota: {
    code: 'iota',
    regex: /^[A-Z9]{90}$/,
    explorer: address => `https://thetangle.org/address/${address}`,
    lookup: {
      url: address => `https://api.thetangle.org/v1/addresses/${address}`,
      success: () => true
    }
  },

  lisk: {
    code: 'lisk',
    regex: /^[0-9]{19,20}L$/,
    explorer: address => `https://explorer.lisk.io/address/${address}`,
    lookup: {
      url: () => 'https://explorer.lisk.io/api/getAccount',
      options: address => ({
        params: {
          address
        }
      }),
      success: data => data.success === true
    }
  },

  nano: {
    code: 'nano',
    regex: /^xrb_[13][a-km-z1-9]{59}$/,
    prefix: 'xrb_',
    explorer: address => `https://nano.org/en/explore/account/${address}`
  },

  nem: {
    code: 'nem',
    regex: /^[Nn][A-Da-d]([A-Za-z2-7]{4}-([A-Za-z2-7]{6}-){5}[A-Za-z2-7]{4}|[A-Za-z2-7]{38})$/,
    prefix: 'N',
    explorer: address => `http://explorer.ournem.com/#/s_account?account=${address}`,
    lookup: {
      method: 'POST',
      url: () => 'http://explorer.ournem.com/account/detail',
      options: address => ({
        data: ({ address }),
        headers: {
          // Accept: 'application/json',
          // Origin: 'http://explorer.ournem.com',
          'Content-Type': 'application/json'
        }
      }),
      success: data => data !== {}
    }
  },

  pivx: {
    code: 'pivx',
    regex: /^D[a-km-zA-HJ-NP-Z1-9]{29,}$/,
    prefix: 'D',
    explorer: address => `http://www.presstab.pw/phpexplorer/PIVX/address.php?address=${address}`,
    lookup: cryptoidTemplate('pivx')
  },

  qtum: {
    code: 'qtum',
    regex: /^[QM][A-NP-Za-km-z][A-NP-Za-km-z1-9]{32}$/,
    prefix: 'Q',
    explorer: address => `https://explorer.qtum.org/address/${address}`,
    lookup: insightApiTemplate(address => `https://explorer.qtum.org/insight-api/addr/${address}`)
  },

  ripple: {
    code: 'ripple',
    regex: /^r[a-km-zA-NP-Z1-9]{27,35}$/,
    prefix: 'r',
    lookup: {
      url: address => `https://data.ripple.com/v2/accounts/${address}`,
      success: data => (
        _.get(data, 'result') === 'success' &&
        _.get(data, 'account_data') !== undefined
      )
    },
    explorer: address => `https://xrpcharts.ripple.com/#/graph/${address}`
  },

  monero: {
    code: 'monero',
    prefix: '4',
    regex: /^4[AB0-9][A-Za-z0-9]{93}$/
  },

  sia: {
    code: 'sia',
    regex: /^[a-f0-9]{76}/,
    explorer: address => `https://explore.sia.tech/hashes/${address}`
  },

  steem: {
    code: 'steem',
    regex: /^[a-z][a-z0-9\-\.]{1,14}[a-z0-9]$/,
    explorer: address => `https://steemit.com/@${address}`,
    lookup: {
      url: () => 'https://api.steemjs.com/getAccounts',
      options: address => ({
        params: {
          'names[]': address
        }
      }),
      success: data => data.length === 1
    }
  },

  stellar: {
    code: 'stellar',
    regex: /^G[A-D][A-Z2-7]{54}$/,
    explorer: address => `https://stellar.expert/explorer/public/account/${address}`,
    lookup: {
      url: address => `https://horizon.stellar.org/accounts/${address}`,
      success: data => data.account_id !== undefined
    }
  },

  waves: {
    code: 'waves',
    regex: /^3P[A-NP-Za-km-z1-9]{33}$/,
    prefix: '3P',
    explorer: address => `http://wavesexplorer.com/address/${address}`,
    lookup: {
      url: address => `https://nodes.wavesnodes.com/addresses/balance/details/${address}`,
      success: data => data.error === undefined
    }
  },

  stratis: {
    code: 'stratis',
    regex: /^S[A-NP-Za-km-z][A-NP-Za-km-z1-9]{32}$/,
    prefix: 'S',
    explorer: address => `https://chainz.cryptoid.info/strat/address.dws?${address}.htm`,
    lookup: cryptoidTemplate('strat')
  },

  verge: {
    code: 'verge',
    regex: /^D[A-NP-Z1-9][A-NP-Za-km-z1-9]{32}$/,
    prefix: 'D',
    explorer: address => `https://verge-blockchain.info/address/${address}`,
    lookup: {
      url: address => `https://verge-blockchain.info/ext/getBalance/${address}`,
      success: data => data.error === undefined
    }
  },

  zcoin: {
    code: 'zcoin',
    regex: /^[a4Z][A-NP-Z1-9][A-NP-Za-km-z1-9]{32}$/,
    prefix: 'a',
    explorer: address => `https://explorer.zcoin.io/address/${address}`,
    lookup: {
      url: address => `https://explorer.zcoin.io/ext/getaddress/${address}`,
      success: data => data.error === undefined
    }
  },

  zcash: {
    code: 'zcash',
    regex: /^t[A-NP-Za-km-z1-9]{34}$/,
    prefix: 't',
    explorer: address => `https://explorer.zcha.in/accounts/${address}`,
    lookup: {
      url: address => `https://api.zcha.in/v2/mainnet/accounts/${address}`,
      success: data => data !== null
    }
  }
};

export default _.mapValues(presets,
  (preset, code) => (
    Object.assign(
      preset,
      {
        explorer: explorers[code],
        normalize: normalizers[code]
      }
    )
  )
);
