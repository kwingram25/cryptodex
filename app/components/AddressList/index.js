import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Scrollbars from 'react-custom-scrollbars';

import {
  Button,
  Icon,
  Snackbar
} from 'material-ui';
import {
  Add as AddIcon,
} from 'material-ui-icons';
import { withStyles } from 'material-ui/styles';

import { coins } from 'constants/coins';
import { elementIds, useBlackText } from 'constants/ui';

import { getIcon } from 'utils/coins';
import CoinManager from 'utils/coins/CoinManager';

import {
  getAddressesForCoin,
  getSelectedAddress,
  getAddressCount,
} from 'orm/selectors';
import {
  removeAddress,
  swapAddresses
} from 'actions/addresses';
import {
  openCreateAddressForm,
  openEditAddressForm,
  toggleQRCodeDialog,
  toggleDeleteDialog,
  switchAddress,
  hideSortingHelpMessage
} from 'actions/ui';

import { backgroundColorHover, coinLogoAfter } from 'static/styles/coinStyles';
import { blackText } from 'static/styles/global.css';
import 'static/styles/coins.css';

import baseScrollbarProps from '../Scrollbars';

import AddressForm from '../AddressForm';
import { AddressListSortable } from './AddressListBase';
import AddressOptionsMenu from './AddressOptionsMenu';
import AddressDeleteDialog from './AddressDeleteDialog';
import AddressQRCodeDialog from './AddressQRCodeDialog';

import { index as styles } from './styles';

@connect(
  state => ({
    addresses: getAddressesForCoin(state),
    addressCount: getAddressCount(state),
    selectedAddress: getSelectedAddress(state),
    selectedCoinCode: state.ui.nav.selectedCoinCode,
    selectedCoin: coins[state.ui.nav.selectedCoinCode],
    sawSortingHelpMessage: state.ui.nav.sawSortingHelpMessage,
    showingAddressForm: state.ui.form.open,
    showingDeleteDialog: state.ui.modals.deleteDialog,
    showingQRCodeDialog: state.ui.modals.qrCodeDialog,
  }),
  dispatch => ({
    actions: bindActionCreators({
      openCreateAddressForm,
      openEditAddressForm,
      toggleDeleteDialog,
      toggleQRCodeDialog,
      switchAddress,
      removeAddress,
      swapAddresses,
      hideSortingHelpMessage
    }, dispatch)
  })
)
@withStyles(styles, { withTheme: true })
export default class AddressList extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    addresses: PropTypes.array.isRequired,
    addressCount: PropTypes.number.isRequired,
    selectedCoin: PropTypes.any.isRequired,
    selectedAddress: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ]),
    sawSortingHelpMessage: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this.switchingButton = false;

    const { selectedCoin } = this.props;

    if (selectedCoin) {
      this.setCoinManager(selectedCoin);
    }
  }

  state = {
    copiedAddressId: null,
    menuAnchor: null,
    isDragging: false,
    isButtonHidden: false
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillReceiveProps(next) {
    const { props: last } = this;

    const lastCoin = last.selectedCoin;
    const nextCoin = next.selectedCoin;
    const lastAddress = _.get(last, 'selectedAddress.id', -1);
    const nextAddress = _.get(next, 'selectedAddress.id', -1);

    if (nextCoin.ticker && nextCoin.ticker !== lastCoin.ticker) {
      this.setCoinManager(nextCoin);
    }

    if ((
      !lastCoin || lastCoin !== nextCoin
    ) || (
      lastAddress > 0 && nextAddress < 0
    )) {
      this.setState({ isButtonHidden: false });
    }
    //
    // if (next.selectedCoin &&
    //   (!last.selectedCoin ||
    //   (!last.selectedCoin.ticker ||
    //     last.selectedCoin.ticker !== next.selectedCoin.ticker))) {
    //   this.setCoinManager(next.selectedCoin);
    //   this.setState({ isButtonHidden: false });
    // }

    // this.updateDimensions();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.switchingButton ?
      this.state.isButtonHidden !== nextState.isButtonHidden :
      true
    );
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (this.scrollbars === null) {
  //     this.setState({ isButtonHidden: false });
  //   }
  // }

  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.updateDimensions);
  // }

  onSortStart = () => {
    this.setState({ isDragging: true });
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({ isDragging: false });

    const { selectedCoin } = this.props;

    this.props.actions.swapAddresses({
      coin: selectedCoin.code,
      rows: [oldIndex, newIndex]
    });
  }

  setCoinManager = ({ code }) => {
    if (!this.coinManager) {
      this.coinManager = new CoinManager();
    }
    this.coinManager.setCurrency(code);
  }

  updateDimensions = async () => {
    // console.log('updateDimensions');
    // <MuiThemeProvider theme={getMuiTheme(selectedCoin)}>
    //console.log('updateDimensions');
    // console.log(e);
    const scrollbars = this.scrollbars;

    if (scrollbars === null) {
      this.forceUpdate();
      return;
    }

    //console.log('asdf');

    if (
      scrollbars.getScrollHeight() - 28 > scrollbars.getClientHeight() + scrollbars.getScrollTop()
    ) {
      this.switchingButton = true;
      await this.setState({ isButtonHidden: true });
      this.switchingButton = false;
    } else {
      this.switchingButton = true;
      await this.setState({ isButtonHidden: false });
      this.switchingButton = false;
    }
  }

  openAddressOptionsMenu = addressId => (e) => {
    this.props.actions.switchAddress(addressId);
    this.setState({
      menuAnchor: e.currentTarget,
    });
  }

  render() {
    // console.log('render');
    if (this.props.selectedCoin === false) {
      return (
        <div className={this.props.classes.noTabSelectedView} />
      );
    }

    const {
      openAddressOptionsMenu,
      closeMenu,
      onClickListItem,
      coinManager,
      onSortStart,
      onSortEnd,
      state: {
        menuAnchor,
        isDragging,
        isButtonHidden
      },
      props: {
        actions: {
          openCreateAddressForm,
          hideSortingHelpMessage
        },
        classes,
        classes: {
          wrapperEmpty,
          wrapperNonEmpty,
          wrapperDragging,
          listItemDragging,
          noItemsView,
          noItemsViewIcon,
          icon
        },
        addresses,
        addressCount,
        selectedCoin,
        selectedCoin: {
          code
        },
        sawSortingHelpMessage,
        selectedAddress
      }
    } = this;

    //console.log(rules)

    const wrapperProps = {
      //ref: (wrapper) => { this.wrapper = wrapper; },
      className:
        classNames(
          addresses.length > 0 ? wrapperNonEmpty : wrapperEmpty,
          isDragging && wrapperDragging,
          coinLogoAfter(code)
        )
    };

    const listProps = {
      addresses,
      selectedCoin,
      selectedAddress,
      closeMenu,
      menuAnchor,
      onClickListItem,
      onClickOptionsButton: openAddressOptionsMenu,
      onSortStart,
      onSortEnd,
      helperClass: listItemDragging,
      pressDelay: 300,
      through: {
        classes: {
          root: classes.listItem
        }
      }
    };

    const noItemsViewProps = {
      id: elementIds.noItemsViewId,
      className: noItemsView
    };

    const addressOptionsMenuProps = {
      anchor: menuAnchor,
      onClose: () => {
        this.setState({
          menuAnchor: null
        });
      },
      coinManager
    };

    const addressFormProps = {
      coinManager
    };

    const addButtonProps = {
      id: elementIds.addButtonId,
      classes: {
        label: useBlackText.includes(code) && blackText,
        raised: backgroundColorHover(code)
      },
      color: 'primary',
      onClick: () => {
        openCreateAddressForm();
      },
      'aria-label': 'Add',
    };

    const addButtonFabProps = {
      ...addButtonProps,
      className: classNames(
        classes.addButton,
        isButtonHidden && classes.hidden
      ),
      variant: 'fab',
    };

    const scrollbarProps = Object.assign(
          baseScrollbarProps,
      {
        ref: (scrollbars) => {
          this.scrollbars = scrollbars;
        },
        onScroll: this.updateDimensions
      }
    );

    const addButtonHeroProps = {
      ...addButtonProps,
      variant: 'raised'
    };

    //console.log(addresses.count);

    const snackbarProps = {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
      },
      open: (
        addressCount >= 2 &&
        !sawSortingHelpMessage
      ),
      onClose: () => {
        hideSortingHelpMessage();
      },
      SnackbarContentProps: {
        'aria-describedby': 'message-id',
      },
      message: (
        <span id="message-id">You can rearrange your addresses and favorites by <b>clicking and holding</b> them!</span>
      ),
      action: (
        <Button color="secondary" size="small" onClick={() => { hideSortingHelpMessage(); }}>
          Got it
        </Button>
      )
    };

    return (
      <Scrollbars {...scrollbarProps}>
        <div {...wrapperProps}>
          {
              addresses.length > 0 ? (
                <AddressListSortable {...listProps} />
              ) : (
                <div {...noItemsViewProps}>
                  <Icon className={noItemsViewIcon}>
                    {getIcon(selectedCoin)}
                  </Icon>
                  <Button {...addButtonHeroProps}>
                    <AddIcon className={icon} /> Add {selectedCoin.ticker} Address
                    </Button>
                </div>
                )
              }
          {addresses.length > 0 &&
            <Button {...addButtonFabProps}>
              <AddIcon />
            </Button>
              }
          <AddressOptionsMenu {...addressOptionsMenuProps} />
          <AddressForm {...addressFormProps} />
          <AddressDeleteDialog />
          <AddressQRCodeDialog />
        </div>
        <Snackbar {...snackbarProps} />
      </Scrollbars>
    );
  }
}
