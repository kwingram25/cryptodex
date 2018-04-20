import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List
} from 'material-ui';

import { getSelectedAddress } from 'orm/selectors';
import {
  removeAddress,
} from 'actions/addresses';
import {
  toggleDeleteDialog,
  switchAddress
} from 'actions/ui';

import { elementIds } from 'constants/ui';

import { XButton } from 'components/shared';

import { AddressListItemBase } from './AddressListItem';

const {
  deleteDialog,
  deleteDialogAddress,
  deleteDialogConfirm,
  deleteDialogCancel
} = elementIds;

@connect(
  state => ({
    address: getSelectedAddress(state),
    open: state.ui.modals.deleteDialog
  }),
  dispatch => ({
    actions: bindActionCreators({
      switchAddress,
      removeAddress,
      toggleDeleteDialog
    }, dispatch)
  })
)
export default class AddressDeleteDialog extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    address: PropTypes.any,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.open || nextProps.open;
  }

  onClose = () => {
    this.props.actions.toggleDeleteDialog(false);
  }

  onConfirm = async () => {
    const {
      address,
      actions: {
        switchAddress,
        removeAddress
      }
    } = this.props;

    await this.onClose();

    switchAddress(-1);
    removeAddress(address.id);
  }

  render() {
    // console.log('AddressDeleteDialog');
    const {
      onClose,
      onConfirm
    } = this;

    const {
      open,
      address,
    } = this.props;

    const dialogProps = {
      id: deleteDialog,
      open,
      onClose
    };

    const xButtonProps = {
      onClick: onClose
    };

    const cancelButtonProps = {
      id: deleteDialogCancel,
      onClick: onClose,
      color: 'default'
    };

    const submitButtonProps = {
      id: deleteDialogConfirm,
      onClick: onConfirm,
      color: 'secondary',
      variant: 'raised'
    };

    return (
      <Dialog {...dialogProps}>
        <DialogTitle>
          Delete Address?
        </DialogTitle>
        <XButton {...xButtonProps} />
        <DialogContent>
          <List>
            {
              address && (() => {
                const addressListItemProps = {
                  id: deleteDialogAddress,
                  address,
                  isButton: false,
                  noPadding: true
                };

                return (
                  <AddressListItemBase {...addressListItemProps} />
                );
              })()
            }
          </List>
        </DialogContent>

        <DialogActions>
          <Button {...cancelButtonProps}>
            Cancel
          </Button>
          <Button {...submitButtonProps}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
