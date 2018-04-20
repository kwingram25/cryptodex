import _ from 'lodash';

const blockCypherTemplate = sym => address => `https://live.blockcypher.com/${sym}/address/${address}/`;

export default {
  ...(
    _.mapValues({
      litecoin: 'ltc',
    }, sym => blockCypherTemplate(sym))
  ),
  bitcoin: address => `https://blockchain.info/address/${address}`,
  ardor: address => `https://ardor.tools/account/${address}`,
  ark: address => `https://explorer.ark.io/wallets/${address}`,
  'bitcoin-cash': address => `https://blockdozer.com/insight/address/${address}`,
  byteball: address => `https://explorer.byteball.org/#${address}`,
  cardano: address => `https://cardanoexplorer.com/address/${address}`,
  dash: address => `https://explorer.dash.org/address/${address}`,
  decred: address => `https://mainnet.decred.org/address/${address}`,
  digibyte: address => `https://digiexplorer.info/address/${address}`,
  dogecoin: address => `https://dogechain.info/address/${address}`,
  ethereum: address => `https://www.etherscan.io/address/${address}`,
  'ethereum-classic': address => `https://gastracker.io/addr/${address}`,
  iota: address => `https://thetangle.org/address/${address}`,
  lisk: address => `https://explorer.lisk.io/address/${address}`,
  nano: address => `https://nano.org/en/explore/account/${address}`,
  nxt: address => `https://nxtportal.org/accounts/${address}`,
  nem: address => `http://explorer.ournem.com/#/s_account?account=${address}`,
  neo: address => `https://neoscan.io/address/${address}`,
  pivx: address => `http://www.presstab.pw/phpexplorer/PIVX/address.php?address=${address}`,
  qtum: address => `https://explorer.qtum.org/address/${address}`,
  ripple: address => `https://xrpcharts.ripple.com/#/graph/${address}`,
  sia: address => `https://explore.sia.tech/hashes/${address}`,
  steem: address => `https://steemit.com/@${address}`,
  stellar: address => `https://stellar.expert/explorer/public/account/${address}`,
  stratis: address => `https://chainz.cryptoid.info/strat/address.dws?${address}.htm`,
  verge: address => `https://verge-blockchain.info/address/${address}`,
  waves: address => `http://wavesexplorer.com/address/${address}`,
  zcoin: address => `https://explorer.zcoin.io/address/${address}`,
  zcash: address => `https://explorer.zcha.in/accounts/${address}`,
};
