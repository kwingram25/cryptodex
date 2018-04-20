import { expect } from 'chai';
import { createShallow } from 'material-ui/test-utils';

import {
  REMOVE_ADDRESS,
  TOGGLE_DELETE_DIALOG
} from 'constants/actions';
import { elementIds } from 'constants/ui';

import {
  componentTemplate,
  setupOrm
} from 'test/utils';

import AddressDeleteDialog from 'components/AddressList/AddressDeleteDialog';

const {
  deleteDialogAddress,
  deleteDialogConfirm,
  deleteDialogCancel
} = elementIds;

const setup = async () => {
  const selectedCoinCode = 'bitcoin';

  const { session, Address } = await setupOrm({
    coin: selectedCoinCode,
    count: 1
  });

  const address = Address.last().ref;

  const store = {
    orm: session.state,
    ui: {
      list: {
        selectedAddressId: address.id
      },
      modals: {
        deleteDialog: true
      }
    }
  };

  return {
    address,
    fn: componentTemplate({
      component: AddressDeleteDialog,
      store,
      outputFn: output => createShallow()(output)
    })
  };
};


// async function setup(options = {}) {
//   const selectedCoinCode = 'bitcoin';
//
//   const { state: orm } = await setupOrm({
//     coin: selectedCoinCode,
//     ...options.orm
//   });
//
//   const state = {
//     orm,
//     ui: {
//       nav: {
//         selectedCoinCode
//       }
//     }
//   };
//
//   const shallow = createShallow();
//
//   const props = {
//     addresses: getAddressesForCoin(state),
//     selectedCoin: coins[selectedCoinCode],
//     onClickOptionsButton: sinon.spy()
//   };
//   const output = shallow(<AddressListBase {...props} />).dive();
//   return { props, output };
// }


describe('AddressDeleteDialog', () => {
  it('renders correctly', async () => {
    const { output } = (await setup()).fn();
    expect(output.name()).to.equal('AddressDeleteDialog');
  });

  it('opens and closes in response to state', async () => {
    const { output } = (await setup()).fn({
      store: {
        'ui.modals.deleteDialog': false
      }
    });

    expect(
      output.dive().prop('open')
    ).to.equal(
      false
    );
  });

  it('renders selected address', async () => {
    const { address, fn } = await setup();
    const { output } = fn();

    const addressItem = output.dive().find(`#${deleteDialogAddress}`);

    expect(
      addressItem.length
    ).to.equal(
      1
    );

    expect(
      addressItem.at(0).prop('address')
    ).to.equal(
      address
    );
  });

  it('closes dialog on cancel', async () => {
    const { output, props } = (await setup()).fn();

    expect(
      props.store.isActionTypeDispatched(
        TOGGLE_DELETE_DIALOG
      )
    ).to.equal(
      false
    );

    output.dive().find(`#${deleteDialogCancel}`).simulate('click');

    expect(
      props.store.isActionDispatched({
        type: TOGGLE_DELETE_DIALOG,
        payload: false
      })
    ).to.equal(
      true
    );
  });

  it('delets address and closes on submit', async () => {
    const { address, fn } = await setup();
    const { output, props } = fn();

    expect(
      props.store.isActionTypeDispatched(
        TOGGLE_DELETE_DIALOG
      )
    ).to.equal(
      false
    );

    expect(
      props.store.isActionTypeDispatched(
        REMOVE_ADDRESS
      )
    ).to.equal(
      false
    );

    output.dive().find(`#${deleteDialogConfirm}`).simulate('click');

    expect(
      props.store.isActionDispatched({
        type: REMOVE_ADDRESS,
        payload: address.id
      })
    ).to.equal(
      true
    );

    expect(
      props.store.isActionDispatched({
        type: TOGGLE_DELETE_DIALOG,
        payload: false
      })
    ).to.equal(
      true
    );
  });
});
