import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';

import {
  Button,
  CircularProgress,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip
} from 'material-ui';
import { withStyles } from 'material-ui/styles';
import green from 'material-ui/colors/green';

import { coins } from 'constants/coins';
// import CoinManager from 'utils/coins/CoinManager';
import {
  textColor,
  backgroundColorHover,
  backgroundColorAfter
} from 'static/styles/coinStyles';

import {
  getSelectedAddress,
  getAddressesForCoin
} from 'orm/selectors';

import {
  createAddress,
  updateAddress
} from 'actions/addresses';

import {
  switchAddress,
  closeForm,
  editName,
  editString
} from 'actions/ui';

import {
  CLEAN, VALID, INVALID, DUPLICATE,
  EMPTY, LOADING, ERROR, EXISTS,
  CREATE, EDIT
} from 'constants/status';
import {
  elementIds,
  useBlackText,
  globalStyles
} from 'constants/ui';

import { XButton } from 'components/shared';

import { blackText } from 'static/styles/global.css';

import LookupStatus from './LookupStatus';
import baseScrollbarProps from '../Scrollbars';

const {
  addressFormName,
  addressFormString,
  addressFormCancel,
  addressFormSubmit
} = elementIds;

const {
  inlineIcon,
  closeButton
} = globalStyles;

const styles = theme => ({
  icons: {
    ...inlineIcon
  },
  dialogPaper: {
    overflow: 'hidden'
  },
  closeButton: {
    ...closeButton
  },
  dialogContent: {
    paddingTop: '0 !important',
    paddingBottom: '0 !important'
  },
  lookupStatus: {
    textAlign: 'center',
    padding: '1em',

    '& > *:not(:last-child)': {
      marginBottom: '14px'
    }
  },
  identicon: {
    width: '80px',
    height: '80px',
    margin: '0px auto'
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
  errorIcon: {
    width: '64px',
    height: '64px',
    margin: '0px auto',
    display: 'block'
  },

  message: {
    color: green[400],
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '0 !important'
  },

  submessage: {
    color: theme.palette.grey[500]
  },

  buttonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.12) !important'
  }
});

const defaultState = {
  icon: undefined,
  commit: false,
  // isValidName: CLEAN,
  isValidString: CLEAN,
  isSubmitting: false,
  isVerified: false,
  lookupStatus: EMPTY,
};

const justOpenedEditForm = (next, last) =>
  next.mode === EDIT &&
  (
    last === undefined ||
    last.mode !== EDIT
  );

const justClosedForm = (next, last) => !next.mode && last.mode;

@withStyles(styles, { withTheme: true })
@connect(
  (state) => {
    const mode = state.ui.form.mode;
    const selectedAddress = getSelectedAddress(state);
    const addresses = getAddressesForCoin(state)
      .reduce((output, { string }) => [
        ...output,
        ...(
          mode === EDIT && typeof selectedAddress === 'object' ? (
            string === selectedAddress.string ?
            [] :
            [string]
          ) :
          [string]
        )
      ], []);

    // if (mode === EDIT && typeof selectedAddress === 'object') {
    //   addresses = addresses.filter(string => string !== selectedAddress.string;
    // }

    return {
      addresses,
      selectedAddress,
      mode,
      selectedCoin: coins[state.ui.nav.selectedCoinCode],
      name: state.ui.form.name,
      string: state.ui.form.string
    };
  },
  dispatch => ({
    actions: bindActionCreators({
      switchAddress,
      closeForm,
      createAddress,
      updateAddress,
      editName,
      editString
    }, dispatch
    )
  })
)
export default class AddressForm extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    mode: PropTypes.any,
    name: PropTypes.string,
    string: PropTypes.string,
    addresses: PropTypes.array.isRequired,
    coinManager: PropTypes.object.isRequired,
    selectedAddress: PropTypes.any,
    selectedCoin: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = defaultState;

    const { mode, selectedAddress, actions } = this.props;
    if (mode === EDIT && selectedAddress !== null) {
      const { name, string } = this.props;

      actions.editName(name);
      actions.editString(string);

      if (string === selectedAddress.string) {
        this.needsLookup = true;
      }
    }
  }

  state = defaultState

  componentDidMount() {
    if (this.props.string !== '') {
      this.validateString(this.props.string, '');
    }

    if (this.needsLookup) {
      // this.setState({
      //   isValidString: VALID
      // });

      this.needsLookup = false;
      this.lookup(this.props.string);
    }
  }

  componentWillReceiveProps(next) {
    const { props: last } = this;

    if (!next.mode) {
      return;
    }

    if (next.string !== last.string) {
      this.validateString(next.string, last.string);
    }

    if (justOpenedEditForm(next, last)) {
      this.setState({
        isValidString: VALID
      });

      if (next.selectedAddress.verified) {
        this.needsLookup = true;
      }
    } else if (justClosedForm(next, last)) {
      this.setState(defaultState);
    }
  }

  shouldComponentUpdate(nextProps) {
    return Boolean(nextProps.mode) || Boolean(this.props.mode);
  }

  componentDidUpdate() {
    if (this.needsLookup) {
      this.needsLookup = false;
      this.lookup(this.props.string);
    }
  }

  onNameChange = () => (e) => {
    const name = e.target.value;
    this.props.actions.editName(name);
  }

  onStringChange = () => (e) => {
    const string = e.target.value;
    const { string: oldString } = this.props;

    this.props.actions.editString(string);
    this.validateString(string, oldString);
  }

  onSubmitAttempt = async () => {
    let {
      icon,
      color
    } = this.state;

    const {
      isVerified
    } = this.state;

    const {
      mode,
      addresses,
      selectedCoin,
      selectedAddress,
      coinManager,
      name,
      actions: {
        createAddress,
        updateAddress,
        closeForm
      }
    } = this.props;

    const string = coinManager.normalize(this.props.string);

    await this.setState({
      isSubmitting: true
    });

    if (!coinManager.validate(string)) {
      this.setState({
        isSubmitting: false,
        isValidString: INVALID
      });
      return;
    }
    //
    if (addresses.includes(coinManager.normalize(string))) {
      this.setState({
        isSubmitting: false,
        isValidString: DUPLICATE
      });
      return;
    }

    if (!icon || !color) {
      const avatar = await coinManager.getAvatar({ string });
      icon = avatar.icon;
      color = avatar.color;
    }

    const data = {
      name,
      string,
      icon,
      color,
      verified: coinManager.has('lookup') ?
        isVerified :
        true
    };

    switch (mode) {
      case CREATE:
        await createAddress({
          ...data,
          coin: selectedCoin.code
        });
        break;
      case EDIT:
        await updateAddress({
          id: selectedAddress.id,
          ...data
        });
        await switchAddress({
          selectedAddress: null
        });
        break;
      default:
        break;
    }
    closeForm();
  }

  onExited = () => {
    this.setState(defaultState);
  }

  onCancel = () => {
    this.setState(defaultState);
    this.props.actions.closeForm();
    if (this.props.selectedAddress) {
      this.props.actions.switchAddress(-1);
    }
  }

  getSubmitButton = () => {
    const {
      isSubmitEnabled,
      onSubmitAttempt,
      props: {
        classes,
        selectedCoin: {
          code
        }
      },
      state: {
        isSubmitting
      }
    } = this;

    const submitButtonProps = {
      id: addressFormSubmit,
      color: 'primary',
      classes: {
        raised: backgroundColorHover(code),
        label: (isSubmitEnabled() && useBlackText.includes(code)) && blackText,
        disabled: classes.buttonDisabled
      },
      variant: 'raised',
      disabled: !isSubmitEnabled(),
      onClick: onSubmitAttempt,
    };

    return (
      <Button {...submitButtonProps}>
        {
          isSubmitting ?
            <CircularProgress size={14} /> :
          'Submit'
        }
      </Button>
    );
  }


  validateString = (string, oldString = '') => {
    const {
      addresses,
      coinManager
    } = this.props;
    const { lookupStatus } = this.state;

    const mutations = {};

    if ([EXISTS, ERROR].includes(lookupStatus) && oldString !== string) {
      mutations.lookupStatus = EMPTY;
      mutations.icon = undefined;
      mutations.color = undefined;
      mutations.isVerified = false;
    }

    const normalized = coinManager.normalize(string);
    if (addresses.includes(normalized)) {
      mutations.isValidString = DUPLICATE;
    } else {
      mutations.isValidString = coinManager.validate(normalized) ? VALID : INVALID;
    }

    this.setState(mutations);
  }


  isSubmitEnabled = () => {
    const {
      isValidString
    } = this.state;

    return isValidString === VALID;
  }
    // const {
    //   isValidString,
    //   lookupStatus
    // } = this.state;
    //
    // return [UNABLE, EXISTS].includes(lookupStatus) &&
    //   [VALID, CLEAN].includes(isValidString);

  async lookup() {
    const { coinManager, string } = this.props;

    const fail = () => {
      this.setState({
        lookupStatus: ERROR,
        isVerified: false
      });
    };

    try {
      this.setState({
        lookupStatus: LOADING,
        isVerified: false
      });

      const verify = await coinManager.lookup(string);

      this.setState({
        lookupStatus: verify
      });

      if (verify === EXISTS) {
        const { icon, color } = await coinManager.getAvatar({ string });
        this.setState({
          icon,
          color,
          isVerified: true
        });
      }
    } catch (err) {
      return fail();
    }
  }

  render() {
    // console.log('AddressForm');
    const {
      getSubmitButton,
      onNameChange,
      onStringChange,
      onCancel,
      onExited,
      isSubmitEnabled,
      props: {
        classes,
        name,
        string,
        mode,
        selectedCoin: {
          code,
          ticker,
          name: coinName
        },
        coinManager,
      },
      state: {
        lookupStatus,
        isValidString,
        isVerified,
        icon
      }
    } = this;

    const hasExplorer = coinManager.has('explorer');
    const hasLookup = coinManager.has('lookup');

    const titleId = 'form-dialog-title';

    const dialogProps = {
      classes: {
        paper: classes.dialogPaper
      },
      open: Boolean(mode),
      onExited: () => { onExited(); },
      fullScreen: true,
    };

    const dialogContentProps = {
      classes: {
        root: classes.dialogContent
      }
    };

    const fieldProps = {
      fullWidth: true,
      margin: 'dense',
      //labelClassName: textColorClass(code)
      InputLabelProps: {
        FormControlClasses: {
          focused: textColor(code)
        }
      },
      InputProps: {
        classes: {
          underline: backgroundColorAfter(code)
        }
      }
    };

    const nameFieldProps = {
      autoFocus: true,
      id: addressFormName,
      label: 'Name (optional)',
      value: name,
      placeholder: `My ${coinName} Wallet`,
      onChange: onNameChange(),
    };

    const stringFieldProps = {
      id: addressFormString,
      label: 'Address',
      value: string,
      placeholder: coinManager.prefix,
      error: [DUPLICATE, INVALID].includes(isValidString),
      helperText: (() => {
        switch (isValidString) {
          case INVALID:
            return 'Invalid address format';
          case DUPLICATE:
            return 'Address already stored';
          default:
            return '';
        }
      })(),
      onChange: onStringChange(),
      inputProps: {
        style: {
          fontFamily: 'monospace',
          fontSize: '1.2rem'
        }
      }
    };

    const lookupStatusProps = {
      classes,
      actions: {
        lookup: () => { this.lookup(string); },
      },
      hasExplorer,
      hasLookup,
      canVerify: isValidString === VALID,
      explorerUrl: coinManager.getExplorerUrl(string),
      status: lookupStatus,
      icon,
      string,
      code
    };

    const cancelButtonProps = {
      id: addressFormCancel,
      onClick: onCancel,
      color: 'default'
    };

    const xButtonProps = {
      onClick: onCancel
    };

    const tooltipProps = {
      id: 'submit-warning',
      title: isVerified || !hasLookup ? '' : 'Address has not been verified',
      disableTriggerHover: isVerified ? true : null,
      placement: 'left'
    };

    return (
      <Dialog {...dialogProps}>
        <DialogTitle
          id={titleId}
        >
          {mode === EDIT ? 'Edit' : 'New'} {ticker} Address
        </DialogTitle>
        <XButton {...xButtonProps} />
        <Scrollbars {...baseScrollbarProps}>
          <DialogContent {...dialogContentProps}>
            <TextField {...fieldProps} {...nameFieldProps} />
            <TextField {...fieldProps} {...stringFieldProps} />
            {coinManager.lookup && <LookupStatus {...lookupStatusProps} />}
          </DialogContent>
        </Scrollbars>
        <DialogActions>
          <Button {...cancelButtonProps}>
            Cancel
          </Button>
          {
            isSubmitEnabled() ?
              <Tooltip {...tooltipProps}>
                {getSubmitButton()}
              </Tooltip> :
            getSubmitButton()
          }
        </DialogActions>
      </Dialog>
    );
  }
}
