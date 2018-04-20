/* eslint react/no-find-dom-node: off */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Scrollbars from 'react-custom-scrollbars';

import {
  Drawer, MenuList
} from 'material-ui';
import { withStyles } from 'material-ui/styles';

import {
  switchCoin,
  toggleCoinsMenu,
  toggleFavorite
} from 'actions/ui';

import { elementIds, coinsListDrawerWidth } from 'constants/ui';
import { coinsInMenuOrder as coins } from 'constants/coins';

import ListItemCoin from './ListItem/ListItemCoin';
import baseScrollbarProps from '../Scrollbars';

const { coinsList } = elementIds;

@connect(
  state => ({
    open: state.ui.nav.isCoinsListOpen,
    selectedCoinCode: state.ui.nav.selectedCoinCode,
    favorites: state.ui.nav.favorites,
  }),
  dispatch => ({
    actions: bindActionCreators({
      switchCoin,
      toggleCoinsMenu,
      toggleFavorite
    }, dispatch)
  })
)
@withStyles({
  container: {
    height: '100vh'
  },
  coinsListDrawer: {
    position: 'absolute',
    width: `${coinsListDrawerWidth}px`
  },
  coinsListDrawerPaper: {
    position: 'initial'
  }
})
export default class CoinsList extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    favorites: PropTypes.array.isRequired,
    selectedCoinCode: PropTypes.string.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.open || nextProps.open;
  }

  scrollToSelectedCoin = () => {
    const thisRect = ReactDOM.findDOMNode(this.container).getBoundingClientRect();
    const selectedRect = ReactDOM.findDOMNode(this.selectedItem).getBoundingClientRect();

    this.scrollbars.scrollTop(
      selectedRect.top - ((thisRect.height - selectedRect.height) / 2)
    );
  }

  render() {
    // console.log('CoinsList');
    const {
      scrollToSelectedCoin
    } = this;

    const {
      // open,
      open,
      classes,
      actions: {
        toggleCoinsMenu
      },
      favorites,
      selectedCoinCode,
    } = this.props;

    const drawerProps = {
      open,
      className: classes.coinsListDrawer,
      classes: {
        paper: classes.coinsListDrawerPaper
      },
      // ref: (drawer) => {
      //   this.drawer = drawer;
      // },
      onRendered: () => {
        scrollToSelectedCoin();
      },
      onClose: () => {
        toggleCoinsMenu(false);
      }
    };


    const menuListProps = {
      id: coinsList,
    };

    const containerProps = {
      className: classes.container,
      ref: (container) => {
        this.container = container;
      }
    };

    const scrollbarProps = Object.assign(
      baseScrollbarProps,
      {
        ref: (scrollbars) => {
          this.scrollbars = scrollbars;
        },
        width: `${coinsListDrawerWidth}px`,
      }
    );

    return (
      <Drawer {...drawerProps}>
        <div {...containerProps}>
          <Scrollbars {...scrollbarProps}>
            <MenuList {...menuListProps}>
              {
              coins.map((coin, index) => {
                const isFavorite = favorites.includes(coin.code);
                const isSelected = coin.code === selectedCoinCode;

                const listItemProps = {
                  coin,
                  // actions,
                  // selectedCoinCode,
                  isSelected,
                  isFavorite,
                  parentRef: isSelected ? (item) => { this.selectedItem = item; } : null
                };

                return (
                  <ListItemCoin key={`coins-drawer-${index}`} {...listItemProps} />
                );
              })
            }
            </MenuList>
          </Scrollbars>
        </div>
      </Drawer>
    );
  }
}
