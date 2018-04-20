import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  IconButton,
} from 'material-ui';
import {
  Favorite,
  FavoriteBorder
} from 'material-ui-icons';

import {
  toggleFavorite,
  toggleCoinsMenu,
  switchCoin
} from 'actions/ui';

import { getIcon } from 'utils/coins';

import { textColor } from 'static/styles/coinStyles';

import ListItemBase from './ListItemBase';
@connect(
  () => ({
  }),
  dispatch => ({
    actions: bindActionCreators({
      toggleFavorite,
      toggleCoinsMenu,
      switchCoin
    }, dispatch)
  })
)
export default class ListItemCoin extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    coin: PropTypes.object.isRequired,
    isFavorite: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    parentRef: PropTypes.func,
  }

  shouldComponentUpdate(next) {
    const { props: last } = this;
    return (
      (last.isFavorite !== next.isFavorite) ||
      (last.isSelected !== next.isSelected)
    );
  }

  onClick = code => () => {
    const {
      switchCoin,
      toggleCoinsMenu
    } = this.props.actions;

    switchCoin(code);
    toggleCoinsMenu(false);
  }

  render() {
    const {
      onClick
    } = this;

    const {
      actions,
      isSelected,
      isFavorite,
      coin,
      parentRef
    } = this.props;

    const {
      toggleFavorite
    } = actions;

    const {
      code,
      name,
    } = coin;

    const menuItemProps = {
      selected: isSelected
    };

    const listItemIconProps = {
      className: textColor(code)
    };

    const favoriteButtonProps = {
      color: 'secondary',
      'aria-label': 'Favorite',
      'data-favorite': isFavorite,
      onClick: () => { toggleFavorite(code); }
    };

    const navigationItemProps = {
      ref: parentRef,
      text: name,
      icon: getIcon(coin),
      onClick: onClick(coin.code),
      menuItemProps,
      listItemIconProps,
      secondaryAction: (
        <IconButton {...favoriteButtonProps}>
          {isFavorite ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
      )
    };

    return (
      <ListItemBase {...navigationItemProps} />
    );
  }
}
