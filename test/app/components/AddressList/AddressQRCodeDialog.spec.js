import { expect } from 'chai';
import QRCode from 'qrcode';

import {
  TOGGLE_QR_CODE_DIALOG
} from 'constants/actions';
import {
  qrCodeWidth as width,
  elementIds
} from 'constants/ui';
import {
  DONE
} from 'constants/status';

import AddressQRCodeDialog from 'components/AddressList/AddressQRCodeDialog';

import {
  componentTemplate,
  setupOrm
} from 'test/utils';

const {
  qrCodeDialogAddress,
  qrCodeDialogClose
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

  return {
    address,
    fn: componentTemplate({
      component: AddressQRCodeDialog,
      store,
      // outputFn: output => createShallow()(output)
    })
  };
};

describe('AddressQRCodeDialog', () => {
  it('renders correctly', async () => {
    const { output } = (await setup()).fn();
    expect(output.name()).to.equal('AddressQRCodeDialog');
  });

  it('opens and closes in response to state', async () => {
    const { output } = (await setup()).fn({
      store: {
        'ui.modals.qrCodeDialog': false
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

    const addressItem = output.dive().find(`#${qrCodeDialogAddress}`);

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

  it('renders and displays qr code for address', async () => {
    const { address, fn } = await setup();
    const { output } = fn();

    const instance = output.dive().instance();
    const qrCompare = await QRCode.toDataURL(address.string, { width });

    await instance.getQRCode();

    await output.update();
    await output.render();

    expect(
      instance.state.status
    ).to.equal(
      DONE
    );

    expect(
      instance.state.qrCode
    ).to.equal(
      qrCompare
    );
  });

  it('closes dialog on button click', async () => {
    const { output, props } = (await setup()).fn();

    expect(
      props.store.isActionTypeDispatched(
        TOGGLE_QR_CODE_DIALOG
      )
    ).to.equal(
      false
    );

    output.dive().find(`#${qrCodeDialogClose}`).simulate('click');

    expect(
      props.store.isActionDispatched({
        type: TOGGLE_QR_CODE_DIALOG,
        payload: false
      })
    ).to.equal(
      true
    );
  });
});
