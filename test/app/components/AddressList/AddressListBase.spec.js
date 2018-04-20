import { expect } from 'chai';
import { createShallow } from 'material-ui/test-utils';
import sinon from 'sinon';

import { coins } from 'constants/coins';

import { AddressListBase } from 'components/AddressList/AddressListBase';
import { getAddressesForCoin } from 'orm/selectors';

import {
  componentTemplate,
  diveForComponent,
  setupOrm,
  startingCount
} from 'test/utils';

const listItemSelector = 'WithStyles(Connect(AddressListItem))';

const setup = async (options = {}) => {
  const selectedCoinCode = 'bitcoin';
  const { session } = await setupOrm({
    coin: selectedCoinCode,
    ...options.orm
  });

  const store = {
    orm: session.state,
    ui: {
      nav: {
        selectedCoinCode
      }
    }
  };

  return componentTemplate({
    component: AddressListBase,
    store,
    props: {
      sortable: false,
      addresses: getAddressesForCoin(store),
      selectedCoin: coins[selectedCoinCode],
      onClickOptionsButton: sinon.spy()
    },
    outputFn: output => createShallow()(output)
  });
};

describe('AddressListBase', () => {
  it(': renders correctly', async () => {
    const { output } = (await setup())();
    expect(output.name()).to.equal('AddressListBase');
  });

  it(' renders AddressListItem(s)', async () => {
    const { output } = (await setup())();

    expect(
      diveForComponent(output, 'List').find(listItemSelector).length
    ).to.equal(
      startingCount
    );
  });
});
