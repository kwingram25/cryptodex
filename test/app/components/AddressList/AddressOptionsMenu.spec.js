import { expect } from 'chai';
import { createShallow } from 'material-ui/test-utils';
import sinon from 'sinon';

import {
  OPEN_EDIT_ADDRESS_FORM,
  TOGGLE_DELETE_DIALOG,
  TOGGLE_QR_CODE_DIALOG
} from 'constants/actions';
import {
  elementIds
} from 'constants/ui';

import AddressOptionsMenu from 'components/AddressList/AddressOptionsMenu';
import CoinManager from 'utils/coins/CoinManager';

import {
  componentTemplate,
  setupOrm
} from 'test/utils';

const {
  addressOptionsExplorer,
  addressOptionsQRCode,
  addressOptionsEdit,
  addressOptionsDelete
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
        qrCodeDialog: true
      }
    }
  };

  const coinManager = new CoinManager();
  coinManager.setCurrency('bitcoin');

  return {
    address,
    fn: componentTemplate({
      component: AddressOptionsMenu,
      store,
      props: {
        anchor: true,
        coinManager,
        onClose: sinon.spy()
      },
      outputFn: output => createShallow()(output)
    })
  };
};

describe('AddressOptionsMenu', () => {
  it('renders correctly', async () => {
    const { output } = (await setup()).fn();
    expect(output.name()).to.equal('AddressOptionsMenu');
  });

  it('opens and closes in response to state', async () => {
    const { output } = (await setup()).fn({
      props: {
        anchor: false
      }
    });

    expect(
      output.dive().prop('open')
    ).to.equal(
      false
    );
  });

  it('opens explorer', async () => {
    const { address, fn } = await setup();
    const { output, props } = fn();

    const openInExplorer = output.dive().find(`#${addressOptionsExplorer}`);

    // console.log(output.dive().debug());

    expect(
      openInExplorer.length
    ).to.equal(
      1
    );

    // openInExplorer.at(0).simulate('click');

    expect(
      openInExplorer.at(0).prop('href')
    ).to.equal(
      props.coinManager.getExplorerUrl(address.string)
    );
  });

  it('toggles QR code and closes', async () => {
    const { output, props } = (await setup()).fn();

    const qrCode = output.dive().find(`#${addressOptionsQRCode}`);

    expect(
      props.store.isActionTypeDispatched(
        TOGGLE_QR_CODE_DIALOG
      )
    ).to.equal(
      false
    );

    qrCode.at(0).simulate('click');

    expect(
      props.store.isActionDispatched({
        type: TOGGLE_QR_CODE_DIALOG,
        payload: true
      })
    ).to.equal(
      true
    );

    expect(
      props.onClose.calledOnce
    ).to.equal(
      true
    );
  });

  it('opens edit address form and closes', async () => {
    const { address, fn } = await setup();
    const { output, props } = fn();

    const editAddress = output.dive().find(`#${addressOptionsEdit}`);

    expect(
      props.store.isActionTypeDispatched(
        OPEN_EDIT_ADDRESS_FORM
      )
    ).to.equal(
      false
    );

    editAddress.at(0).simulate('click');

    expect(
      props.store.isActionDispatched({
        type: OPEN_EDIT_ADDRESS_FORM,
        payload: {
          address
        }
      })
    ).to.equal(
      true
    );

    expect(
      props.onClose.calledOnce
    ).to.equal(
      true
    );
  });

  it('opens delete dialog and closes', async () => {
    const { output, props } = (await setup()).fn();

    const deleteAddress = output.dive().find(`#${addressOptionsDelete}`);

    expect(
      props.store.isActionTypeDispatched(
        TOGGLE_DELETE_DIALOG
      )
    ).to.equal(
      false
    );

    deleteAddress.at(0).simulate('click');

    expect(
      props.store.isActionDispatched({
        type: TOGGLE_DELETE_DIALOG,
        payload: true
      })
    ).to.equal(
      true
    );

    expect(
      props.onClose.calledOnce
    ).to.equal(
      true
    );
  });
});
