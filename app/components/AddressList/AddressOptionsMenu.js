import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
} from 'material-ui';
import {
  ExitToApp as ExplorerIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PhoneAndroid as QRCodeIcon
} from 'material-ui-icons';

import {
  getSelectedAddress
} from 'orm/selectors';

import {
  openEditAddressForm,
  toggleDeleteDialog,
  toggleQRCodeDialog
} from 'actions/ui';

import {
  elementIds
} from 'constants/ui';

const {
  addressOptionsExplorer,
  addressOptionsQRCode,
  addressOptionsEdit,
  addressOptionsDelete
} = elementIds;

@connect(
  state => ({
    address: getSelectedAddress(state)
  }),
  dispatch => ({
    actions: bindActionCreators({
      openEditAddressForm,
      toggleDeleteDialog,
      toggleQRCodeDialog
    }, dispatch)
  })
)
export default class AddressOptionsMenu extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    address: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ]),
    anchor: PropTypes.object,
    coinManager: PropTypes.object.isRequired,
    onClose: PropTypes.func,
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.anchor || this.props.anchor
    );
  }

  getMenuItems = (address) => {
    const {
      coinManager,
      onClose,
    } = this.props;

    const {
      openEditAddressForm,
      toggleQRCodeDialog,
      toggleDeleteDialog
    } = this.props.actions;

    return [
      ...(
        coinManager.has('explorer') ?
        [{
          icon: <ExplorerIcon />,
          text: 'View in Explorer',
          props: {
            id: addressOptionsExplorer,
            component: 'a',
            href: this.props.coinManager.getExplorerUrl(address.string),
            target: '_blank'
          }
        }] :
        []
      ),
      {
        icon: <QRCodeIcon />,
        text: 'QR Code',
        props: {
          id: addressOptionsQRCode,
          onClick: () => {
            toggleQRCodeDialog(true);
            onClose();
          }
        }
      }, {
        icon: <EditIcon />,
        text: 'Edit Address',
        props: {
          id: addressOptionsEdit,
          onClick: () => {
            openEditAddressForm({ address });
            onClose();
          }
        }
      }, {
        icon: <DeleteIcon />,
        text: 'Delete Address',
        props: {
          id: addressOptionsDelete,
          onClick: () => {
            toggleDeleteDialog(true);
            onClose();
          }
        }
      }];
  }

  render() {
    // console.log('AddressOptionsMenu');

    const {
      address,
      anchor,
      onClose
    } = this.props;

    const menuItems = this.getMenuItems(address);

    return (
      <Menu
        id="options-menu"
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={onClose}
      >
        {menuItems.map((item, index) => {
          const {
            icon,
            text,
            props
          } = item;

          return (
            <MenuItem
              key={`menu-${address}-${index}`}
              {...props}
            >
              <ListItemIcon>
                {icon}
              </ListItemIcon>
              <ListItemText primary={text} />
            </MenuItem>
          );
        })
      }
      </Menu>
    );
  }
}
