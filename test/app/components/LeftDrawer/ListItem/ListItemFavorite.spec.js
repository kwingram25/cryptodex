import { expect } from 'chai';
import { createShallow } from 'material-ui/test-utils';
import sinon from 'sinon';

import { ListItemFavorite } from 'components/LeftDrawer/ListItem/ListItemFavorite';
import { getIcon } from 'utils/coins';

import {
  componentTemplate,
  diveForComponent
} from 'test/utils';
import getCoin from './utils';

const specialIcon = 'SPECIAL_ICON';
const specialText = 'SPECIAL_TEXT';

const setup = ({ code, special = false } = {}) => {
  const coin = getCoin(code);

  return componentTemplate({
    component: ListItemFavorite,
    store: {
      ui: {
        nav: {
          selectedCoinCode: code
        }
      }
    },
    props: special ?
    {
      icon: specialIcon,
      text: specialText,
      onClick: sinon.spy()
    } :
    {
      coin
    },
    outputFn: output => createShallow()(output)
  });
};

describe('ListItemFavorite component', () => {
  it('should render correctly', () => {
    const { output } = setup()();
    expect(output.dive().name()).to.equal('ListItemFavorite');
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
      props.store.isActionTypeDispatched('SWITCH_COIN')
    ).to.equal(
      false
    );


    // expect(
    //   props.store.isActionTypeDispatched
    // );

    listItemBase.at(0).simulate('click');

    const action = {
      type: 'SWITCH_COIN',
      payload: props.coin.code
    };

    expect(
      props.store.isActionDispatched(action)
    ).to.equal(
      true
    );
  });

  it('should pass down special variant props', () => {
    const { props, output } = setup({ special: true })();
    const listItemBase = diveForComponent(output, 'ListItemBase');

    expect(
      listItemBase.prop('text')
    ).to.equal(
      specialText
    );

    expect(
      listItemBase.prop('icon')
    ).to.equal(
      specialIcon
    );

    listItemBase.simulate('click');

    expect(
      props.onClick.calledOnce
    ).to.equal(
      true
    );
  });
});
