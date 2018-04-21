import { expect } from 'chai';
import sinon from 'sinon';

import { AddressListItem } from 'components/AddressList/AddressListItem';

import {
  componentTemplate,
  setupOrm,
} from 'test/utils';

const setup = async () => {
  const selectedCoinCode = 'bitcoin';

  const { Address } = await setupOrm({
    coin: selectedCoinCode,
    count: 1
  });

  const address = Address.last();

  const store = {
    ui: {
      list: {
        selectedAddressId: address.id,
        copiedAddressId: -1
      }
    }
  };

  return componentTemplate({
    component: AddressListItem,
    store,
    props: {
      address,
      isButton: true,
      onClickOptionsButton: sinon.spy(),
    },
    // outputFn: output => (createShallow()(output)).dive()
  });
};

describe('AddressListItem', () => {
  it(': renders correctly', async () => {
    const { output } = (await setup())();
    expect(output.name()).to.equal('AddressListItem');
  });

  it('copies address string on click', async () => {
    const { output, props } = (await setup())();

    const dive = output.dive();

    expect(
      dive.state('isShowingTooltip')
    ).to.equal(
      false
    );

    dive.instance().onClick(props.address)();
    dive.update();
    //
    expect(
      dive.state('isShowingTooltip')
    ).to.equal(
      true
    );
  });
});
