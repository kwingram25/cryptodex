/* eslint import/extensions: off */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import 'typeface-roboto';

import {
  List,
  Tooltip,
  Typography
} from 'material-ui';
import {
  CheckCircle as Matched
} from 'material-ui-icons';
import {
  MuiThemeProvider,
  withStyles
} from 'material-ui/styles';

import {
  baseTheme
} from 'utils/colors';
import { explorers } from 'constants/coins';

import { AddressListItemBase } from '../AddressList/AddressListItem';
import styles from './styles';

@withStyles(styles, { withTheme: true })
export default class VerifyAddressBar extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    address: PropTypes.object.isRequired,
  }

  static defaultProps = {
    isDark: false
  }

  state = {
    justMounted: false,
    settled: false
  }

  getExplorerHref = (fn) => {
    const { string } = this.props.address;

    return fn(string);
  };

  render() {
    const {
      props: {
        classes,
        address,
        address: {
          coin,
          string
        },
        // onClick,
        // isDark
      }
    } = this;

    const hasExplorer = explorers[coin] !== undefined;

    const listProps = {
      className: classes.list,

    };

    const addressListItemProps = {
      address,
      isButton: hasExplorer,
      href: hasExplorer && (explorers[coin])(string),
      isInjected: true,
      hasCoinAvatar: true,
      avatarProps: {
        classes: {
          root: classes.borderRadiusFix
        }
      },
      coinAvatarProps: {
        classes: {
          root: classes.borderRadiusFix
        }
      }
    };

    const textProps = {
      variant: 'body2',
      align: 'center'
    };

    const matchedProps = {
      ...textProps,
      component: 'div',
      className: classNames(
        classes.matched,
        // isDark ? classes.light : classes.dark
      ),
    };

    const tooltipProps = {
      title: 'Click to view in explorer',
      classes: {
        tooltip: classes.tooltip
      },
      ...(
        !hasExplorer ?
        {
          disableTriggerHover: true,
          disableTriggerFocus: true,
          disableTriggerTouch: true
        } :
        { }
      )
    };

    return (
      <MuiThemeProvider theme={baseTheme}>
        <div>
          <Typography {...matchedProps}>
            <Matched /> Matched!
          </Typography>
          <Tooltip {...tooltipProps}>
            <List {...listProps}>
              <AddressListItemBase {...addressListItemProps} />
            </List>
          </Tooltip>
        </div>
      </MuiThemeProvider>
    );
  }
}
