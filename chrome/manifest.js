const base = require('./manifest.base.json');
const dev = require('./manifest.dev.json');
const prod = require('./manifest.prod.json');
const coins = Object.values(require('../app/constants/coins/data.json'));
//
// /* dev */
// "default-src 'self';
// font-src data:;
// script-src 'self' http://localhost:3000 https://localhost:3000 'unsafe-eval';
// connect-src http://localhost:3000 https://localhost:3000 ;
// style-src * 'unsafe-inline' 'self' blob:;
// img-src 'self' data:;"
//
// /* prod */
// "default-src 'self';
// font-src data:;
// script-src 'self' 'unsafe-eval';
// style-src * 'unsafe-inline';
// img-src 'self' data:;"

const manifests = { dev, prod };

const baseCsp = {
  'default-src': ["'self'"],
  'font-src': ['data:'],
  'script-src': ["'self'", "'unsafe-eval'"],
  'connect-src': [],
  'img-src': ["'self'", 'data:'],
  'style-src': ['*', "'unsafe-inline'", "'self'", 'blob:']
};

const csps = {
  dev: {
    'script-src': ["'self'", "'unsafe-eval'", 'http://localhost:3000', 'https://localhost:3000'],
    'connect-src': ['http://localhost:3000', 'https://localhost:3000'],
    'img-src': ['data:', 'http://localhost:3000', 'https://localhost:3000'],
  },
  prod: {

  }
};

module.exports = function getManifest(env) {
  const csp = Object.assign(baseCsp, csps[env]);

  const connectSrc = [...new Set(coins
    .filter(coin => coin.explorer)
    .map(({ explorer }) => explorer))]
    .join(' ');
  csp['connect-src'] = csp['connect-src'].concat(connectSrc);

  const contentSecurityPolicy = Object.keys(csp).reduce((p, c) => `${p}${c} ${csp[c].join(' ')}; `, '');

  return Object.assign({}, base, manifests[env], {
    content_security_policy: contentSecurityPolicy
  });
};
