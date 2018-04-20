import React from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Button,
  CircularProgress,
  Typography,
  Paper
} from 'material-ui';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  ExitToApp as ExplorerIcon
} from 'material-ui-icons';

import * as C from 'constants/status';
import { elementIds, useBlackText } from 'constants/ui';

import { blackText } from 'static/styles/global.css';

import {
  backgroundColorHover,
  textColor
} from 'static/styles/coinStyles';

const {
  addressFormVerify,
} = elementIds;

// https://explorer.byteball.org/#TKT4UESIKTTRALRRLWS4SENSTJX6ODCW
const ExplorerButton = (props) => {
  const { code, text, explorerUrl } = props;
  const buttonProps = {
    classes: {
      root: backgroundColorHover(code),
      label: useBlackText.includes(code) && blackText
    },
    color: 'primary',
    variant: 'raised',
    'aria-label': text,
    href: explorerUrl,
    target: '_blank'
  };

  return (
    <Button {...buttonProps}>
      <ExplorerIcon className={props.classes.icons} />
      {text}
    </Button>
  );
};
ExplorerButton.propTypes = {
  classes: PropTypes.object.isRequired,
  code: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  explorerUrl: PropTypes.string.isRequired
};

const TryAgainButton = props => ((
  <Button
    id={addressFormVerify}
    color="default"
    variant="raised"
    onClick={props.onClick}
  >
    <RefreshIcon className={props.classes.icons} />
    Try Again
  </Button>
));
TryAgainButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func
};

const VerifyButton = (props) => {
  const { classes, code, onClick, disabled } = props;
  const buttonProps = {
    id: addressFormVerify,
    classes: {
      raised: backgroundColorHover(code),
      label: (!disabled && useBlackText.includes(code)) && blackText,
      disabled: classes.buttonDisabled
    },
    variant: 'raised',
    color: 'primary',
    disabled,
    onClick
  };

  return (
    <Button {...buttonProps}>
      <SearchIcon className={classes.icons} />
      Verify
    </Button>
  );
};
VerifyButton.propTypes = {
  disabled: PropTypes.bool,
  code: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const SuccessMessage = (props) => {
  const { classes, hasLookup } = props;
  const messageProps = {
    classes: {
      root: classes.message
    },
    type: 'subheading'
  };
  const submessageProps = {
    classes: {
      root: classes.submessage
    },
    type: 'body1'
  };
  return (
    <div>
      {[
        hasLookup && (
          <Typography {...messageProps} key="success-message">
            <CheckCircleIcon className={classes.icons} />
            Address Verified!
          </Typography>
        ),
        <Typography {...submessageProps} key="success-submessage">
          Please ensure you have typed accurately.
        </Typography>
      ]}
    </div>
  );
};
SuccessMessage.propTypes = {
  classes: PropTypes.object.isRequired,
  hasLookup: PropTypes.bool.isRequired
};

const Empty = (props) => {
  const { classes, actions, code, canVerify } = props;
  const buttonProps = {
    classes,
    code,
    onClick: actions.lookup,
    disabled: !canVerify,
  };
  return (
    <VerifyButton {...buttonProps} />
  );
};
Empty.propTypes = {
  actions: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  code: PropTypes.string.isRequired,
  canVerify: PropTypes.bool.isRequired,
};

const Loading = (props) => {
  const { code } = props;

  //console.log(coins[code]);

  const circularProgressProps = {
    classes: {
      colorPrimary: textColor(code)
    },
    size: 100
  };

  return (
    <CircularProgress {...circularProgressProps} />
  );
};
Loading.propTypes = {
  code: PropTypes.string.isRequired
};

const Err = (props) => {
  const { classes, actions } = props;
  const buttonProps = {
    classes,
    onClick: actions.lookup
  };
  return [
    <WarningIcon key="err-1" className={classes.errorIcon} color="error" />,
    <Typography key="err-2" type="subheading">Address not found</Typography>,
    <TryAgainButton key="err-3" {...buttonProps} />
  ];
};
Err.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

const Exists = (props) => {
  const { code, classes, icon, hasExplorer, hasLookup, explorerUrl } = props;
  const successMessageProps = {
    classes,
    hasLookup
  };
  const buttonProps = {
    code,
    classes,
    text: hasLookup ? 'View in Explorer' : 'Check in Explorer',
    explorerUrl
  };
  // const {ticker} = coin;
  // const toFloat = balance === 0 ? '0' : balance < 0.01 ? balance.toFixed(5) : balance.toFixed(2);
  return [
    <Paper
      key="exists-1"
      className={classes.identicon}
      component={props => <Avatar src={icon} {...props} />}
      elevation={10}
    />,
    <SuccessMessage {...successMessageProps} key="exists-2" />,
    hasExplorer && <ExplorerButton {...buttonProps} key="exists-3" />
  ];
};
Exists.propTypes = {
  classes: PropTypes.object.isRequired,
  icon: PropTypes.string,
  hasExplorer: PropTypes.bool.isRequired,
  explorerUrl: PropTypes.string,
};

const variants = {
  [C.EMPTY]: Empty,
  [C.LOADING]: Loading,
  [C.ERROR]: Err,
  [C.EXISTS]: Exists,
};

export default function LookupStatus(props) {
  const { status } = props;

  return (
    <div className={props.classes.lookupStatus}>
      {variants[status](props)}
    </div>
  );
}
LookupStatus.propTypes = {
  status: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};
