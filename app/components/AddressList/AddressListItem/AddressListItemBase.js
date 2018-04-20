import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  Avatar,
  IconButton,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Typography
} from 'material-ui';
import {
  MoreVert as OptionsIcon,
  Warning as WarningIcon
} from 'material-ui-icons';
import { withStyles } from 'material-ui/styles';

import { coins } from 'constants/coins';
import {
  useShortAddress,
  useDifferentTail,
  useBlackText,
  elementIds
} from 'constants/ui';

import { backgroundColor } from 'static/styles/coinStyles';

import { transparentBg } from 'static/styles/global.css';
import styles from './styles';

const suffixLength = 6;

@withStyles(styles)
export default class AddressListItemBase extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    address: PropTypes.object.isRequired,
    isButton: PropTypes.bool.isRequired,
    isInjected: PropTypes.bool,
    isSelected: PropTypes.bool,
    isShowingTooltip: PropTypes.bool,
    hasOptionsMenu: PropTypes.bool,
    hasCoinAvatar: PropTypes.bool,
    tooltipText: PropTypes.string,
    noPadding: PropTypes.bool,
    onClick: PropTypes.func,
    onClickOptionsButton: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    href: PropTypes.string,
    listItemProps: PropTypes.object,
    listItemTextProps: PropTypes.object,
    avatarProps: PropTypes.object,
    coinAvatarProps: PropTypes.object,
    tooltipProps: PropTypes.object,
  }

  static defaultProps = {
    isButton: false,
    isInjected: false,
    isSelected: false,
    isShortAddress: false,
    isShowingTooltip: false,
    hasWarning: false,
    hasOptionsMenu: false,
    hasCoinAvatar: false,
    hasTooltip: false,
    tooltipText: '',
    showTooltipOnHover: false,
    noPadding: false,
    listItemProps: {},
    listItemTextProps: {},
    avatarProps: {},
    coinAvatarProps: {},
    tooltipProps: {},
  }

  // componentWillMount() {
  //   const {
  //     isButton,
  //     isInjected
  //   } = this.props;
  //
  //   if (isButton && isInjected) {
  //     ButtonBase.defaultProps.disableRipple = true;
  //   }
  // }

  getBaseAvatarProps = () => ({
    classes: {
      root: this.props.isInjected ?
        this.props.classes.fixedAvatarSize :
        ''
    }
  })

  getTitle = () => `${this.props.address.string}${this.isVerified() ? '' : ' (Unverified)'}`

  getStringDisplay = () => {
    const {
      hasName,
      isVerified
    } = this;
    const {
      address,
      classes: {
        addressField,
      }
    } = this.props;
    const {
      string,
      color,
      coin
    } = address;

    const suffixStyle = {
      color
    };

    const className = addressField;
    const tailSize = useDifferentTail[coin] || suffixLength;
    const isShortAddress = useShortAddress.includes(coin);

    const spanProps = {
      id: elementIds.addressListItemString,
      className
    };

    return (
      <Tooltip {...this.getTooltipProps()}>
        <span {...spanProps}>
          {
            isShortAddress || string.length <= suffixLength ?
            (
              <span style={suffixStyle}>{string}</span>
            ) : ([
              <span key="address-field-1">{string.substr(0, string.length - tailSize)}</span>,
              <span key="address-field-2" style={suffixStyle}>{string.substr(-tailSize)}</span>,
            ])
          }
          {
            (!isVerified() && !hasName()) && (
              this.getWarning()
            )
          }
        </span>
      </Tooltip>
    );
  }

  getListItemProps = () => {
    const {
      classes,
      href,
      address,
      isButton,
      isSelected,
      noPadding,
      isInjected,
      onClick,
      onMouseLeave,
      onMouseEnter,
      listItemProps
    } = this.props;

    return Object.assign(
    {},
    listItemProps || {},
      {
        button: isButton,
        selected: isSelected,
        classes: {
          root: classNames(
            classes.listItem,
            isButton ? classes.cursorGrab : null,
            noPadding ? classes.noPadding : null,
            isInjected ? classes.injected : null
          )
        },
        onClick: onClick ? onClick(address) : null,
        onMouseLeave: onMouseLeave ? () => { onMouseLeave(); } : null,
        onMouseEnter: onMouseEnter ? () => { onMouseEnter(); } : null,
        ...(
          isInjected && isButton ? {
            href,
            target: '_blank',
            component: 'a',
          } : { }
        )
      }
  );
  };

  getTooltipProps = () => Object.assign(
    {},
    this.props.tooltipProps || {},
    {
      disableTriggerHover: true,
      open: this.props.isShowingTooltip,
      title: this.props.tooltipText,
      classes: {
        tooltip: this.props.classes.tooltipTextForce
      }
    }
  )

  getListItemTextProps = () => {
    const { classes } = this.props;

    const primaryProps = {
      classes: {
        subheading: classes.textPrimary
      },
      variant: 'subheading'
    };

    const secondaryProps = {
      classes: {
        body1: classes.textSecondary
      },
      variant: 'body1',
      component: 'div',
      color: 'textSecondary'
    };

    return Object.assign(
      {},
      this.props.listItemTextProps || {},
      {
        // 'aria-label': this.props.address.string,
        disableTypography: true,
        title: this.getTitle(),
        primary: this.hasName() && (
          <Typography {...primaryProps}>
            <span
              id={elementIds.addressListItemName}
              key="address-name-1"
            >
              {this.props.address.name}
            </span>
            {(!this.isVerified() && this.hasName()) && (
                this.getWarning()
            )}
          </Typography>
        ),
        secondary: (
          <Typography {...secondaryProps}>
            {this.getStringDisplay()}
          </Typography>
        ),
        classes: {
          root: this.props.classes.listItemText
        }
      }
    );
  };

  getOptionsMenuAction = () => ((
    <ListItemSecondaryAction>
      <IconButton
        className={this.props.classes.optionsMenuButton}
        id={`optionsButton${this.props.address.id}`}
        aria-label="Options"
        aria-haspopup="true"
        onClick={this.props.onClickOptionsButton(this.props.address.id)}
      >
        <OptionsIcon />
      </IconButton>
    </ListItemSecondaryAction>
  ))

  getWarning = () => ((
    <WarningIcon
      key="warning"
      className={this.props.classes.warningIcon}
    />
  ))

  getAvatar = () => {
    const avatarProps = Object.assign(
      this.getBaseAvatarProps(),
      this.props.avatarProps || {},
      {
        title: this.getTitle(),
        src: this.props.address.icon,
      }
    );

    return (
      <Avatar {...avatarProps} />
    );
  };

  getCoinAvatar = () => {
    const coin = coins[this.props.address.coin];
    const src = require('constants/coins/svg.json')[coin.code];

    const avatarProps = Object.assign(
      this.getBaseAvatarProps(),
      this.props.coinAvatarProps || {},
      {
        src,
        title: coin.name,
        classes: {
          root: classNames(
            this.props.classes.coinAvatar,
            useBlackText.includes(coin.code) ?
              transparentBg :
              backgroundColor(coin.code)
          ),
          img: classNames(
            coin.code,
            this.props.classes.coinAvatarImg
          )
        }
      }
    );

    return (
      <Avatar {...avatarProps} />
    );
  }

  hasName = () =>
    this.props.address.name &&
    this.props.address.name !== ''

  isVerified = () => this.props.address.verified === true

  render() {
    const {
      props,
      props: {
        isButton,
        hasOptionsMenu,
        hasCoinAvatar
      },
      getListItemProps,
      getListItemTextProps,
      getAvatar,
      getCoinAvatar,
      getOptionsMenuAction
    } = this;

    return (
      <ListItem {...getListItemProps()}>
        {getAvatar(props)}
        <ListItemText {...getListItemTextProps()} />
        {isButton && hasOptionsMenu &&
            getOptionsMenuAction()
          }
        {hasCoinAvatar && getCoinAvatar()}
      </ListItem>
    );
  }
}
