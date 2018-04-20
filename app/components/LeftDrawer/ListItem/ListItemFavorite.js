import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { SortableElement } from 'react-sortable-hoc';

import { withStyles } from 'material-ui/styles';

import {
  switchCoin,
} from 'actions/ui';

import { useBlackText } from 'constants/ui';

import { getIcon } from 'utils/coins';

import { backgroundColor } from 'static/styles/coinStyles';

import { whiteText, blackText } from 'static/styles/global.css';

import ListItemBase from './ListItemBase';

@connect(
  state => ({
    selectedCoinCode: state.ui.nav.selectedCoinCode,
  }),
  dispatch => ({
    actions: bindActionCreators({
      switchCoin,
    }, dispatch)
  })
)
@withStyles((theme) => {
  const breakpoint = theme.breakpoints.down('xs');

  return {
    tabList: {
      '& $hideListItemText': {
        [breakpoint]: {
          display: 'none'
        }
      },
    },

    menuItem: {
      // transition: 'transform 0.3s',
    },

    menuItemSelected: {
      color: `${theme.palette.common.white} !important`,
      boxShadow: theme.shadows[20]
    },

    textColor: {
      color: `${theme.palette.grey[500]}`
    },

    hideListItemText: {},

  };
}, { withTheme: true })
class ListItemFavorite extends Component {

  static propTypes = {
    id: PropTypes.string,
    classes: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    selectedCoinCode: PropTypes.any,
    coin: PropTypes.object,
    icon: PropTypes.object,
    text: PropTypes.string,
    onClick: PropTypes.func
  }

  shouldComponentUpdate(next) {
    const { props: last } = this;
    const { coin } = this.props;
    // console.log(this.props.coin);
    // console.log(next.coin);
    return (
      coin !== undefined && ((
        last.selectedCoinCode === coin.code ||
        next.selectedCoinCode === coin.code
      ) || (
        last.coin !== next.coin
      )
    )
    );
  }

  prepareCoinProps = (props) => {
    const {
      classes,
      actions: {
        switchCoin
      },
      selectedCoinCode,
      coin,
      coin: {
        code,
        name,
      }
    } = props;

    const selectedTextColor = useBlackText.includes(code) ? blackText : whiteText;

    const isSelected = selectedCoinCode === code;

    const menuItemProps = {
      className: classes.tabList,
      classes: {
        root: classes.menuItem,
        selected: classNames(
            backgroundColor(code),
            classes.menuItemSelected
          )
      },
      selected: isSelected
    };

    const listItemTextProps = {
      className: classes.hideListItemText,
      classes: {
        primary: isSelected ? selectedTextColor : classes.textColor
      }
    };

    const listItemIconProps = {
      classes: {
        root: isSelected ? selectedTextColor : classes.textColor
      }
    };

    return {
      text: name,
      icon: getIcon(coin),
      onClick: () => {
        switchCoin(code);
      },
      menuItemProps,
      listItemTextProps,
      listItemIconProps
    };
  }


  prepareSpecialProps = (props) => {
    const {
      id,
      icon,
      text,
      onClick,
      classes,
    } = props;

    const menuItemProps = {
      className: classes.menuItem,
    };

    const listItemTextProps = {
      className: classes.hideListItemText,
    };

    return {
      id,
      text,
      icon,
      onClick: () => { onClick(); },
      menuItemProps,
      listItemTextProps,
      listItemIconProps: {}
    };
  }


  render() {
    // console.log('ListItemFavorite');
    const {
      props,
      prepareCoinProps,
      prepareSpecialProps
    } = this;

    const {
      coin
    } = props;

    let navigationItemProps;
    if (coin) {
      navigationItemProps = prepareCoinProps(props);
    } else {
      navigationItemProps = prepareSpecialProps(props);
    }

    return (
      <ListItemBase {...navigationItemProps} />
    );
  }
}

export default {
  ListItemFavorite,
  SortableListItemFavorite: SortableElement(props => <ListItemFavorite {...props} />)
};
