/* eslint import/prefer-default-export: "off" */
import React from 'react';

import {
  IconButton
} from 'material-ui';
import { Close } from 'material-ui-icons';
import { withStyles } from 'material-ui/styles';

export const XButton = withStyles({
  root: {
    position: 'absolute',
    right: '12px',
    top: '12px'
  }
})(({ onClick, classes }) => {
  const props = {
    onClick,
    className: classes.root,
    'aria-label': 'Close'
  };

  return (
    <IconButton {...props}>
      <Close />
    </IconButton>
  );
}
);
