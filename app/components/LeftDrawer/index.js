import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
  Drawer,
  MenuList,
  Divider
} from 'material-ui';
import {
  Menu as TabMenuIcon,
  Settings as SettingsIcon
} from 'material-ui-icons';
import { withStyles } from 'material-ui/styles';

import { coins } from 'constants/coins';

import {
  switchCoin,
  toggleCoinsMenu,
  swapFavorites,
  toggleFavorite
} from 'actions/ui';

import {
  elementIds,
  drawerWidthFull,
  drawerWidthMini,
  // coinsListDrawerWidth
} from 'constants/ui';

import { borderRight } from 'static/styles/coinStyles';

import { FavoritesListSortable } from './FavoritesList';
import CoinsList from './CoinsList';
import { ListItemFavorite } from './ListItem/ListItemFavorite';

const { allCurrenciesItem } = elementIds;

const styles = theme => ({
  drawerPaper: {
    width: `${drawerWidthMini}px`,
    overflowX: 'hidden',
    position: 'fixed',
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      width: `${drawerWidthFull}px`
    },
    '& ::-webkit-scrollbar': {
      width: '0px',  /* remove scrollbar space */
      background: 'transparent'  /* optional: just make scrollbar invisible */
    },
    '& ::-webkit-scrollbar-thumb': {
      background: theme.palette.grey[300]
    },

    '&$pushed': {
    }
  },

  pushed: {

  },

  navigationTabDragging: {
    zIndex: 1201,
    listStyle: 'none',
    backgroundColor: theme.palette.grey[600],
    boxShadow: theme.shadows[20],
    maxWidth: `${drawerWidthMini}px`,
    overflowX: 'hidden',
    cursor: 'grabbing !important',
    fallbacks: {
      cursor: '-webkit-grabbing !important'
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: `${drawerWidthFull}px`
    },
  },

  favoritesListDragging: {
    cursor: 'grabbing !important',
    fallbacks: {
      cursor: '-webkit-grabbing !important'
    },
    '& *': {
      cursor: 'grabbing !important',
      fallbacks: {
        cursor: '-webkit-grabbing !important'
      }
    }
  },

  backdrop: {
    opacity: 0.25
  },

  divider: {
    backgroundColor: theme.palette.grey[700]
  },

});

const AllCurrenciesItem = props => ((
  <ListItemFavorite
    {...{
      id: allCurrenciesItem,
      text: 'All Currencies',
      icon: <TabMenuIcon />,
      onClick: props.onClick,
      disabled: true
    }}
  />
));
AllCurrenciesItem.propTypes = {
  onClick: PropTypes.func.isRequired
};

const SettingsItem = props => ((
  <ListItemFavorite
    {...{
      text: 'Settings',
      icon: <SettingsIcon />,
      onClick: props.onClick,
      disabled: true
    }}
  />
));
SettingsItem.propTypes = {
  onClick: PropTypes.func.isRequired
};


@withStyles(styles, { withTheme: true })
@connect(
  state => ({
    selectedCoinCode: state.ui.nav.selectedCoinCode,
  }),
  dispatch => ({
    actions: bindActionCreators({
      switchCoin,
      swapFavorites,
      toggleCoinsMenu,
      toggleFavorite
    }, dispatch)
  })
)
export default class LeftDrawer extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    selectedCoinCode: PropTypes.any.isRequired,
  }

  state = {
    isDragging: false,
    popoutDialogOpen: false
  }

  shouldComponentUpdate(next, nextState) {
    const { props: last } = this;
    return (
      (next.selectedCoinCode !== last.selectedCoinCode) ||
      (nextState.isDragging !== this.state.isDragging)
    );
  }

  render() {
    const {
      classes,
      actions,
      selectedCoinCode,
    } = this.props;

    const {
      isDragging
    } = this.state;

    const {
      drawerPaper,
    } = classes;

    const {
      swapFavorites,
      toggleCoinsMenu
    } = actions;

    const selectedCoin = coins[selectedCoinCode];

    const borderClass = (
      selectedCoin ?
      borderRight(selectedCoinCode) :
      ''
    );

    const drawerProps = {
      variant: 'permanent',
      classes: {
        paper: classNames(
         drawerPaper,
         borderClass,
       )
      }
    };

    const favoritesListProps = {
      isDragging,
      onSortStart: () => {
        this.setState({ isDragging: true });
      },
      onSortEnd: async ({ oldIndex, newIndex }) => {
        await swapFavorites([oldIndex, newIndex]);
        this.setState({ isDragging: false });
      },
      menuListProps: {
        className: isDragging ? classes.favoritesListDragging : null
      },
      helperClass: classes.navigationTabDragging,
      pressDelay: 300
    };

    const dividerProps = {
      classes: {
        root: classes.divider
      }
    };

    return (
      <Drawer {...drawerProps}>
        <MenuList>
          <AllCurrenciesItem onClick={() => { toggleCoinsMenu(true); }} />
          <Divider {...dividerProps} />
        </MenuList>
        <FavoritesListSortable {...favoritesListProps} />
        <CoinsList />
      </Drawer>
    );
  }
}
