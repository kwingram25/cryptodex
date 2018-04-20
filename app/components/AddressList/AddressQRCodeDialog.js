import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Scrollbars from 'react-custom-scrollbars';

import QRCode from 'qrcode';

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  Paper
} from 'material-ui';
import { withStyles } from 'material-ui/styles';

import { getSelectedAddress } from 'orm/selectors';
import {
  toggleQRCodeDialog
} from 'actions/ui';

import {
  qrCodeWidth as width,
  elementIds,
} from 'constants/ui';
import {
  LOADING,
  DONE
} from 'constants/status';

import { XButton } from 'components/shared';

import baseScrollbarProps from '../Scrollbars';
import { AddressListItemBase } from './AddressListItem';

const {
  qrCodeDialog,
  qrCodeDialogAddress,
  qrCodeDialogImg,
  qrCodeDialogClose
} = elementIds;

@withStyles(theme => ({
  qrCodeDialog: {
    maxWidth: `${width + (6 * theme.spacing.unit)}px`
  },
  addressDisplay: {
    paddingLeft: 0,
    paddingRight: 0
  },

  dialogContent: {
    paddingTop: '0 !important'
  }

  // qrCode: {
  //   width: '100%'
  // }
}), { withTheme: true })
@connect(
  state => ({
    selectedAddress: getSelectedAddress(state),
    open: state.ui.modals.qrCodeDialog,
  }),
  dispatch => ({
    actions: bindActionCreators({
      toggleQRCodeDialog
    }, dispatch)
  })
)
export default class AddressQRCodeDialog extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool,
    selectedAddress: PropTypes.any,
  }

  state = {
    status: LOADING,
    qrCode: null
  }

  componentDidMount() {
    const { open } = this.props;
    const { qrCode } = this.state;

    if (open && !qrCode) {
      this.getQRCode();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      selectedAddress
    } = nextProps;
    // this.setState({ open, selectedAddress });

    if (selectedAddress) {
      this.setState({
        qrCode: null,
        status: LOADING
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.open || this.props.open;
  }

  componentDidUpdate() {
    const { open } = this.props;
    const { qrCode } = this.state;

    if (open && !qrCode) {
      this.getQRCode();
    }
  }

  onClose = () => {
    this.props.actions.toggleQRCodeDialog(false);
  }

  getQRCode = async () => {
    const { selectedAddress } = this.props;

    if (!selectedAddress) {
      return;
    }

    const qrCode = await QRCode.toDataURL(selectedAddress.string, { width });

    this.setState({
      status: DONE,
      qrCode
    });
  }

  render() {
    // console.log('AddressQRCodeDialog');
    const {
      classes,
      open,
      selectedAddress
    } = this.props;

    const {
      qrCode,
      status,
    } = this.state;

    const {
      onClose
    } = this;

    const dialogProps = {
      id: qrCodeDialog,
      fullScreen: true,
      classes: {
        paper: classes.qrCodeDialog
      },
      open: open || false,
      onClose
    };

    const dialogContentProps = {
      classes: {
        root: classes.dialogContent
      }
    };

    const qrCodeProps = {
      id: qrCodeDialogImg,
      src: qrCode,
      className: classes.qrCode,
    };

    const xButtonProps = {
      onClick: onClose
    };

    const closeButtonProps = {
      id: qrCodeDialogClose,
      color: 'default',
      onClick: onClose
    };

    return (
      <Dialog {...dialogProps}>
        <DialogTitle>
          QR Code
        </DialogTitle>
        <XButton {...xButtonProps} />
        <Scrollbars {...baseScrollbarProps}>
          <DialogContent {...dialogContentProps}>
            <List>
              {
                selectedAddress && (() => {
                  const addressListItemProps = {
                    id: qrCodeDialogAddress,
                    address: selectedAddress,
                    hasTooltip: false,
                    isButton: false,
                    noPadding: true
                  };

                  return (
                    <AddressListItemBase {...addressListItemProps} />
                  );
                })()
              }
            </List>
            {
              (() => {
                switch (status) {
                  case LOADING:
                    return (
                      <CircularProgress />
                    );
                  case DONE:
                    return (
                      <Paper elevation={12}>
                        <img alt="QR Code" {...qrCodeProps} />
                      </Paper>
                    );
                  default:
                    return <div />;
                }
              })()
            }
          </DialogContent>
        </Scrollbars>
        <DialogActions>
          <Button {...closeButtonProps}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
