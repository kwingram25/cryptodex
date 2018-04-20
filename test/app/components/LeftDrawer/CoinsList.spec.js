import { expect } from 'chai';
import sinon from 'sinon';
import { createShallow } from 'material-ui/test-utils';

import CoinsList from 'components/LeftDrawer/CoinsList';
import { coins } from 'constants/coins';
import { initialFavorite, defaultFavorites } from 'constants/ui';

import {
  componentTemplate
} from 'test/utils';

const setup = componentTemplate({
  component: CoinsList,
  props: {
    open: true,
    favorites: defaultFavorites,
    selectedCoinCode: initialFavorite,
    onClose: sinon.spy()
  },
  outputFn: output => createShallow()(output)
});

describe('CoinsList component', () => {
  it('should render correctly', () => {
    const { output } = setup();
    expect(output.dive().name()).to.equal('div');
  });

  it('should render ListItemCoin(s)', () => {
    const { output } = setup();
    expect(
      output.dive().find('MenuList').children().length
    ).to.equal(
      Object.keys(coins).length
    );
  });

  it('should pass isFavorite to list items', () => {
    const { output } = setup();

    expect(
      output.dive().find('MenuList').find('[isFavorite=true]').length
    ).to.equal(
      3
    );
  });
});
