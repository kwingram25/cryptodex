import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { SortableContainer } from 'react-sortable-hoc';
import Scrollbars from 'react-custom-scrollbars';
import {
  MenuList
} from 'material-ui';
import { withStyles } from 'material-ui/styles';

import { coins } from 'constants/coins';
import { elementIds } from 'constants/ui';

import baseScrollbarProps from '../Scrollbars';
import { SortableListItemFavorite } from './ListItem/ListItemFavorite';

const { favoritesList } = elementIds;

const styles = theme => ({
  menuItem: {
    color: `${theme.palette.grey[300]} !important`,
  },
  menuItemSelected: {
    color: `${theme.palette.common.white} !important`
  },

  primary: {},
  icon: {},
  iconFont: {
    fontFamily: 'cryptocoins',
    fontSize: '1.25rem'
  }
});

@connect(
  state => ({
    favorites: state.ui.nav.favorites,
    selectedCoinCode: state.ui.nav.selectedCoinCode
  })
)
@withStyles(styles, { withTheme: true })
class FavoritesList extends Component {

  static propTypes = {
    favorites: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedCoinCode: PropTypes.string.isRequired,
    menuListProps: PropTypes.object,
  }

  static defaultProps = {
    menuListProps: {}
  }

  render() {
    // console.log('FavoritesList');
    const {
      favorites,
      selectedCoinCode,
      menuListProps
    } = this.props;

    let favoritesCopy = favorites;

    const scrollbarProps = Object.assign(
      baseScrollbarProps,
      {}
    );

    const favoritesListProps = {
      id: favoritesList,
      //classes: {
      ...menuListProps
      //}
    };

    if (!favorites.includes(selectedCoinCode)) {
      favoritesCopy = favorites.concat(selectedCoinCode);
    }

    return (
      <Scrollbars {...scrollbarProps}>
        <MenuList {...favoritesListProps}>
          {
            favoritesCopy.map((coin, index) => {
              const listItemProps = {
                coin: coins[coin],
              };

              if (index >= favorites.length) {
                listItemProps.disabled = true;
              }

              return (
                <SortableListItemFavorite index={index} key={`coin-tab-${index}`} {...listItemProps} />
              );
            })
          }
        </MenuList>
      </Scrollbars>
    );
  }
}

export default {
  FavoritesList,
  FavoritesListSortable: SortableContainer(FavoritesList)
};
