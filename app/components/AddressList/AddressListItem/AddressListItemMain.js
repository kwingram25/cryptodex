import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SortableElement } from 'react-sortable-hoc';
import copy from 'copy-to-clipboard';

import { withStyles } from 'material-ui/styles';

import styles from './styles';
import AddressListItemBase from './AddressListItemBase';

const ADDRESS_UNVERIFIED = 'Address not verified';
const COPIED_TO_CLIPBOARD = 'Copied to clipboard!';

const defaultState = {
  isShowingTooltip: false,
  tooltipText: COPIED_TO_CLIPBOARD
};

@withStyles(styles)
@connect(
  state => ({
    selectedAddressId: state.ui.list.selectedAddressId
  })
)
export class AddressListItem extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    address: PropTypes.object.isRequired,
    selectedAddressId: PropTypes.number,
    isButton: PropTypes.bool.isRequired,
    onClickOptionsButton: PropTypes.func,
  }

  state = defaultState

  onClick = address => () => {
    const { string } = address;

    if (process.env.NODE_ENV !== 'test') {
      copy(string);
    }

    this.setState({
      isShowingTooltip: true,
      tooltipText: COPIED_TO_CLIPBOARD
    });

    clearTimeout(window.hideTooltip);

    window.hideTooltip = setTimeout(() => {
      this.setState({
        isShowingTooltip: false,
        tooltipText: this.getDefaultTooltip()
      });
    }, 3000);
  }

  onMouseEnter = () => {
    const { verified } = this.props.address;
    if (!verified) {
      this.setState({
        isShowingTooltip: true,
        tooltipText: ADDRESS_UNVERIFIED
      });
    }
  }

  onMouseLeave = () => {
    this.setState({ isShowingTooltip: false });
  }

  getDefaultTooltip = () => {
    const { verified } = this.props.address;
    return verified ?
      defaultState.tooltipText :
      ADDRESS_UNVERIFIED;
  }


  render() {
    const {
      onClick,
      onMouseEnter,
      onMouseLeave
    } = this;

    const {
      isShowingTooltip,
      tooltipText
    } = this.state;

    const {
      classes,
      selectedAddressId,
      address,
      address: {
        verified
      },
      isButton,
      onClickOptionsButton,
    } = this.props;

    const addressListItemProps = {
      address,
      isButton,
      isSelected: address.id === selectedAddressId,
      hasOptionsMenu: true,
      hasWarning: address.verified === false,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onClickOptionsButton,
      hasTooltip: true,
      isShowingTooltip,
      tooltipText,
      tooltipProps: {
        classes: {
          tooltipBottom: classes.tooltip,
          popper: classes.popper
        },
        onMouseEnter: verified ? () => {
          this.setState({ hasTooltip: false });
        } : null
      }
    };

    return (
      <AddressListItemBase {...addressListItemProps} />
    );
  }
}

export const AddressListItemSortable = SortableElement(props => <AddressListItem {...props} />);
