import { expect } from 'chai';
import Chance from 'chance';

import { coins } from 'constants/coins';
import { EXISTS } from 'constants/status';

import CoinManager from 'utils/coins/CoinManager';
import presets from 'utils/coins/CoinManager/presets';

import testAddresses from 'test/testAddresses';

const chance = new Chance();

const setup = (coin) => {
  const coinManager = new CoinManager();

  if (coin) {
    coinManager.setCurrency(coin);
  }

  return coinManager;
};


describe('CoinManager', () => {
  it('initializes correctly', async () => {
    const coinManager = setup();
    // console.log(coinManager);
    expect(coinManager).to.be.a('CoinManager');
  });

  it('sets currency', () => {
    const coinManager = setup();

    expect(coinManager.currency).to.equal(undefined);

    coinManager.setCurrency('bitcoin');

    expect(coinManager.currency).to.equal(presets.bitcoin);
  });

  it('functions with no preset', async () => {
    const coinManager = setup();

    expect(coinManager.has('validate')).to.equal(false);
    expect(coinManager.has('prefix')).to.equal(false);
    expect(coinManager.has('regex')).to.equal(false);

    expect(coinManager.validate('')).to.equal(false);
    expect(coinManager.validate('test')).to.equal(true);
    expect(await coinManager.lookup('test')).to.equal(EXISTS);
  });

  const codes = Object.keys(coins);

  for (let i = 0; i < codes.length; i += 1) {
    const code = codes[i];

    if (testAddresses[code]) {
      it(`validates ${coins[code].name} addresses`, () => {
        const coinManager = setup(code);

        testAddresses[code].forEach((address) => {
          const valid = address;
          const invalid = chance.string();

          expect(coinManager.validate(valid)).to.equal(true);
          expect(coinManager.validate(invalid)).to.equal(false);
        });
      });

      if (presets[code].lookup) {
        it(`verifies ${coins[code].name} addresses on remote service`, async () => {
          const coinManager = setup(code);

          const status = await coinManager.lookup(testAddresses[code][0]);

          expect(status).to.equal(EXISTS);
        });
      }
    }
  }
});
