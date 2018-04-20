import { expect } from 'chai';

import { FavoritesList } from 'components/LeftDrawer/FavoritesList';
import { componentTemplate } from 'test/utils';

const setup = componentTemplate({
  component: FavoritesList,
  store: {
    ui: {
      nav: {
        selectedCoinCode: 'bitcoin',
        favorites: [
          'bitcoin',
          'ethereum',
          'litecoin'
        ]
      }
    }
  }
});

describe('FavoritesList component', () => {
  it('should render correctly', () => {
    const { output } = setup();
    expect(output.name()).to.equal('FavoritesList');
  });

  it('should render FavoritesListItem(s)', () => {
    const { output } = setup();
    expect(output.dive().find('sortableElement').length).to.equal(3);
  });

  it('should add selected coin if not in favorites', () => {
    const { output } = setup({
      store: {
        'ui.nav.selectedCoinCode': 'neo'
      }
    });

    expect(output.dive().find('sortableElement').length).to.equal(4);
    expect(output.dive().find('sortableElement').at(3).prop('disabled')).to.equal(true);
  });
});
