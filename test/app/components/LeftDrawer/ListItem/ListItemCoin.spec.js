import { expect } from 'chai';
import sinon from 'sinon';
import { createShallow } from 'material-ui/test-utils';

import ListItemCoin from 'components/LeftDrawer/ListItem/ListItemCoin';

import { getIcon } from 'utils/coins';

import {
  componentTemplate,
  diveForComponent
} from 'test/utils';
import getCoin from './utils';

const secondaryActionSelector = 'WithStyles(IconButton)';

const setup = (code) => {
  const coin = getCoin(code);

  const spies = {
    toggleFavorite: sinon.spy(),
    toggleCoinsMenu: sinon.spy(),
    switchCoin: sinon.spy()
  };

  return componentTemplate({
    component: ListItemCoin,
    store: {
      ui: {
        nav: {
          selectedCoinCode: code
        }
      }
    },
    props: {
      coin,
      actions: spies
    },
    outputFn: output => createShallow()(output)
  });
};

describe('ListItemCoin', () => {
  it('should render correctly', () => {
    const { output } = setup()();
    expect(output.dive().dive().name()).to.equal('ListItemBase');
  });


  it('should pass down coin properties', () => {
    const { output, props } = setup()();
    const listItemBase = diveForComponent(output, 'ListItemBase');

    expect(
      listItemBase.prop('text')
    ).to.equal(
      props.coin.name
    );

    expect(
      listItemBase.prop('icon')
    ).to.equal(
      getIcon(props.coin)
    );
  });

  it('should update UI in response to clicks', () => {
    const { props, output } = setup()();
    const listItemBase = diveForComponent(output, 'ListItemBase');

    expect(
      props.actions.switchCoin.calledOnce
    ).to.equal(
      false
    );

    expect(
      props.actions.toggleCoinsMenu.calledOnce
    ).to.equal(
      false
    );

    listItemBase.at(0).simulate('click');

    expect(
      props.actions.switchCoin.calledOnce
    ).to.equal(
      true
    );

    expect(
      props.actions.toggleCoinsMenu.calledOnce
    ).to.equal(
      true
    );
  });

  it('should update UI in response to secondary action click', () => {
    const { props, output } = setup()();
    const listItemBase = diveForComponent(output, 'li');
    const secondaryAction = listItemBase.find(secondaryActionSelector);

    expect(
      props.actions.toggleFavorite.calledOnce
    ).to.equal(
      false
    );

    secondaryAction.at(0).simulate('click');

    expect(
      props.actions.toggleFavorite.calledOnce
    ).to.equal(
      true
    );
  });
});
