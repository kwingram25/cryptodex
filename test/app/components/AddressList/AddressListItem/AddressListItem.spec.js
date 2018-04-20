import { expect } from 'chai';
import sinon from 'sinon';

import {
    COPY_ADDRESS
} from 'constants/actions';

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
      props.store.isActionTypeDispatched(COPY_ADDRESS)
    ).to.equal(
      false
    );

    expect(
      dive.state('isShowingTooltip')
    ).to.equal(
      false
    );

    dive.instance().onClick(props.address)();
    dive.update();

    expect(
      props.store.isActionDispatched({
        type: COPY_ADDRESS,
        payload: props.address.id
      })
    ).to.equal(
      true
    );
    //
    expect(
      dive.state('isShowingTooltip')
    ).to.equal(
      true
    );
  });
});
