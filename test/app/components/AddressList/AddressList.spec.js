import { expect } from 'chai';

import {
    OPEN_CREATE_ADDRESS_FORM,
    SWITCH_ADDRESS,
    SWAP_ADDRESSES
} from 'constants/actions';
import { elementIds } from 'constants/ui';

import AddressList from 'components/AddressList';
import {
  componentTemplate,
  setupOrm
} from 'test/utils';

const {
  addButtonId,
} = elementIds;

const startingCount = 5;

const setup = async (options = {}) => {
  const selectedCoinCode = 'bitcoin';
  const { session } = await setupOrm({
    coin: selectedCoinCode,
    ...options.orm
  });

  return componentTemplate({
    component: AddressList,
    store: {
      orm: session.state,
      ui: {
        list: {
          selectedAddressId: null
        },
        nav: {
          selectedCoinCode
        },
        form: {
          open: false
        },
        modals: {
          deleteDialog: false,
          qrCodeDialog: false
        }
      }
    }
  });
};


describe('AddressList', () => {
  it(': renders correctly', async () => {
    const { output } = (await setup())();
    expect(output.name()).to.equal('AddressList');
  });

  it(': toggles form when Add button(s) clicked', async () => {
    const { output, props } = (await setup())();
    const addButton = output.dive().find(`#${addButtonId}`);

    addButton.simulate('click');

    expect(
      props.store.isActionTypeDispatched(OPEN_CREATE_ADDRESS_FORM)
    ).to.equal(
      true
    );
  });

  it(': displays no items view for empty coin', async () => {
    const { output, props } = (await setup({
      orm: {
        count: 0
      }
    }))();

    const noItemsViewFind = output.dive().find(`#${elementIds.noItemsViewId}`);

    expect(
      noItemsViewFind.length
    ).to.equal(
      1
    );

    const addButtonEmptyFind = noItemsViewFind.find(`#${addButtonId}`);

    expect(
      addButtonEmptyFind.length
    ).to.equal(
      1
    );

    addButtonEmptyFind.at(0).simulate('click');

    expect(
      props.store.isActionTypeDispatched(OPEN_CREATE_ADDRESS_FORM)
    ).to.equal(
      true
    );
  });

  it(': updates state on sort start', async () => {
    const { output } = (await setup())();

    const instance = output.dive().instance();
    instance.onSortStart();
    await instance.forceUpdate();

    expect(
      instance.state.isDragging
    ).to.equal(
      true
    );
  });

  it(': updates state on sort end', async () => {
    const { output, props } = (await setup())();

    const oldIndex = Math.floor(Math.random() * startingCount);
    const newIndex = Math.floor(Math.random() * startingCount);

    const instance = output.dive().instance();
    instance.onSortStart();
    await instance.forceUpdate();

    expect(
      instance.state.isDragging
    ).to.equal(
      true
    );

    instance.onSortEnd({ oldIndex, newIndex });
    await instance.forceUpdate();

    expect(
      instance.state.isDragging
    ).to.equal(
      false
    );

    expect(
      props.store.isActionDispatched({
        type: SWAP_ADDRESSES,
        payload: {
          coin: 'bitcoin',
          rows: [oldIndex, newIndex]
        }
      })
    ).to.equal(
      true
    );
  });

  it(': sets and updates coinManager', async () => {
    const { output } = (await setup())();
    const instance = output.dive().instance();

    expect(
      instance.coinManager
    ).to.be.a(
      'CoinManager'
    );

    expect(
      instance.coinManager.currency.code
    ).to.equal(
      'bitcoin'
    );

    instance.setCoinManager({ code: 'ethereum' });

    expect(
      instance.coinManager.currency.code
    ).to.equal(
      'ethereum'
    );
  });

  it(': opens address options menu', async () => {
    const { output, props } = (await setup())();

    const instance = output.dive().instance();

    expect(
      instance.state.menuAnchor
    ).to.equal(
      null
    );

    const addressId = output.prop('addresses')[0].id;
    await instance.openAddressOptionsMenu(addressId)({ currentTarget: instance });

    expect(
      instance.state.menuAnchor
    ).to.equal(
      instance
    );

    expect(
      props.store.isActionDispatched({
        type: SWITCH_ADDRESS,
        payload: addressId
      })
    ).to.equal(
      true
    );
  });
});
