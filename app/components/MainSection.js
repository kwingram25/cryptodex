import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  MuiThemeProvider,
  withStyles
} from 'material-ui/styles';

import AddressList from './AddressList';
import LeftDrawer from './LeftDrawer';

import { drawerWidthFull, coinsListDrawerWidth } from '../constants/ui';

import { baseTheme } from '../utils/colors';

const styles = theme => ({
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100vh',
    transition: theme.transitions.create(
      'transform',
      {
        duration: theme.transitions.duration.short
      }
    ),
    '&$pushed': {
      transform: `translateX(${coinsListDrawerWidth}px)`
    }
  },
  pushed: {

  },
  drawerPaper: {
    width: `${drawerWidthFull}px`,
    overflowX: 'hidden',
    position: 'fixed',
    height: '100%',
  },
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    },
  },
  primary: {},
  icon: {},

});

// const selectedCoin = code => coins[code];

@withStyles(styles, { withTheme: true })
export default class MainSection extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const {
      classes: {
        appFrame,
      }
    } = this.props;

    const containerProps = {
      className: appFrame // isCoinsListOpen ? classNames(appFrame, pushed) : appFrame
    };

    return (
      <MuiThemeProvider theme={baseTheme}>
        <div {...containerProps}>
          <LeftDrawer />
          <AddressList />
        </div>
      </MuiThemeProvider>
    );
  }
}
