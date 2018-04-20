import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  MenuItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Icon,
} from 'material-ui';
import { withStyles } from 'material-ui/styles';

@withStyles(theme => ({

  menuItem: {
    color: `${theme.palette.grey[300]}`,
  },
  menuItemSelected: {
    color: `${theme.palette.common.white} !important`
  },

  primary: {},
  icon: {},

  listItemIcon: {
    fontFamily: 'cryptocoins',
    fontSize: '1.25rem',
    marginRight: '0',
    textAlign: 'center'
  },

  listItemText: {
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis'
  },

}), { withTheme: true })
export default class ListItemBase extends Component {
  static propTypes = {
    // classes: PropTypes.object.isRequired,
    icon: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string
    ]),
    secondaryAction: PropTypes.object
  }

  static defaultProps = {
    listItemTextProps: {
      className: ''
    },
    listItemIconProps: {
      className: ''
    }
  }

  getMenuItemProps = props => Object.assign(
    {},
    {
      id: props.id,
      button: true,
      onClick: props.onClick,
      classes: {
        root: props.classes.menuItem,
      }
    },
    props.menuItemProps || {}
  )

  getListItemTextProps = props => Object.assign(
    {},
    _.merge({
      primary: props.text,
      secondary: props.secondary,
      className: props.listItemTextProps.className,
      classes: {
        primary: props.classes.listItemText,
      },
    }, props.listItemTextProps)
  )

  getListItemIconProps = props => Object.assign(
    {},
    props.listItemIconProps || {},
    {
      className: classNames(
        props.classes.listItemIcon,
        props.listItemIconProps.className
      )
    }
  )

  render() {
    const {
      props,
      getMenuItemProps,
      getListItemIconProps,
      getListItemTextProps
    } = this;

    const {
      icon,
      secondaryAction,
    } = this.props;

    return (
      <MenuItem {...getMenuItemProps(props)}>
        <ListItemIcon {...getListItemIconProps(props)}>
          <Icon>
            {icon}
          </Icon>
        </ListItemIcon>
        <ListItemText {...getListItemTextProps(props)} />
        {secondaryAction &&
          <ListItemSecondaryAction>
            {secondaryAction}
          </ListItemSecondaryAction>
        }
      </MenuItem>
    );
  }
}
