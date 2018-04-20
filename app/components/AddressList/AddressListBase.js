import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SortableContainer } from 'react-sortable-hoc';

import {
  List
} from 'material-ui';
import { withStyles } from 'material-ui/styles';

import { elementIds } from 'constants/ui';

import {
  AddressListItem,
  AddressListItemSortable
} from './AddressListItem';
import { addressList as styles } from './styles';

@withStyles(styles, { withTheme: true })
class AddressListBase extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    addresses: PropTypes.array.isRequired,
    onClickOptionsButton: PropTypes.func,
    through: PropTypes.object,
    sortable: PropTypes.bool,
  }

  static defaultProps = {
    sortable: true
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.addresses !== this.props.addresses
    );
  }

  render() {
    // console.log('AddressListBase');

    const {
      classes,
      addresses,
      onClickOptionsButton,
      through,
      sortable
    } = this.props;

    const listProps = {
      id: elementIds.addressListBase,
      component: 'nav',
      className: classes.addressList
    };

    return (
      <List {...listProps}>
        {
          addresses.map((address, index) => {
            const key = `address-list-${index}`;

            const addressListItemProps = {
              address,
              through,
              onClickOptionsButton,
              isButton: true
              //listItemButtons,
            };

            const Item = sortable ?
              AddressListItemSortable :
              AddressListItem;

            return <Item {...{ index, key, ...addressListItemProps }} />;
          })
        }
      </List>
    );
  }
}

export default {
  AddressListBase,
  AddressListSortable: SortableContainer(props => <AddressListBase {...props} />)
};
