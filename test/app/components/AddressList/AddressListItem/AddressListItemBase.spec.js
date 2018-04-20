import _ from 'lodash';
import { expect } from 'chai';
import { createShallow } from 'material-ui/test-utils';
import sinon from 'sinon';

import { AddressListItemBase } from 'components/AddressList/AddressListItem';

import {
  componentTemplate,
  setupOrm,
} from 'test/utils';

const listItemTextSelector = 'WithStyles(ListItemText)';
const avatarSelector = 'WithStyles(Avatar)';
const optionsButtonSelector = 'WithStyles(IconButton)';

const setup = async () => {
  const selectedCoinCode = 'bitcoin';

  const { Address } = await setupOrm({
    coin: selectedCoinCode,
    count: 1
  });

  const address = Address.last();

  const spies = {
    onClick: sinon.spy(),
    onMouseLeave: sinon.spy(),
    onClickOptionsButton: sinon.spy()
  };

  return {
    spies,
    fn: componentTemplate({
      component: AddressListItemBase,
      props: {
        address,
        onClick: () => spies.onClick(),
        onMouseLeave: spies.onMouseLeave,
        onClickOptionsButton: () => spies.onClickOptionsButton
      },
      outputFn: output => createShallow()(output)
    })
  };
};

describe('AddressListItemBase', () => {
  it('renders correctly', async () => {
    const { output } = (await setup()).fn();
    expect(output.name()).to.equal('AddressListItemBase');
  });

  it('renders address data', async () => {
    const extractString = dive =>
      dive
        .find(listItemTextSelector)
          .prop('secondary')
            .props.children.props.children
              .map(child => _.get(child, 'props.children', ''))
                .join('');


    const { output, props } = (await setup()).fn();

    const dive = output.dive();


    expect(
      dive.find(listItemTextSelector).prop('primary').props.children[0].props.children
    ).to.equal(
      props.address.name
    );

    expect(
      extractString(dive)
    ).to.equal(
      props.address.string
    );

    expect(
      dive.find(avatarSelector).prop('src')
    ).to.equal(
      props.address.icon
    );
  });

  it('responds to passed onClick', async () => {
    const { spies, fn } = await setup();
    const { output } = fn();

    output.simulate('click');

    expect(
      spies.onClick.calledOnce
    ).to.equal(
      true
    );
  });

  it('responds to passed onMouseLeave', async () => {
    const { spies, fn } = await setup();
    const { output } = fn();

    output.simulate('mouseLeave');

    expect(
      spies.onMouseLeave.calledOnce
    ).to.equal(
      true
    );
  });

  it('renders options button', async () => {
    const { output } = (await setup()).fn({
      props: {
        isButton: true,
        hasOptionsMenu: true
      }
    });

    expect(
      output.dive().find(optionsButtonSelector).length
    ).to.equal(
      1
    );
  });

  it('responds to passed onClickOptionsButton', async () => {
    const { spies, fn } = await setup();
    const { output } = fn({
      props: {
        isButton: true,
        hasOptionsMenu: true
      }
    });

    output.dive().find(optionsButtonSelector).simulate('click');

    expect(
      spies.onClickOptionsButton.calledOnce
    ).to.equal(
      true
    );
  });

  it('renders coin avatar', async () => {
    const { output, props } = (await setup()).fn({
      props: {
        hasCoinAvatar: true
      }
    });

    expect(
      output.dive().find(avatarSelector).length
    ).to.equal(
      2
    );

    expect(
      output.dive().find(avatarSelector).at(1)
        .prop('src')
    ).to.equal(
      require('constants/coins/svg.json')[props.address.coin]
    );
  });
});
