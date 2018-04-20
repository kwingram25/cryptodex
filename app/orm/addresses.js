// import {PropTypes} from 'react'
import _ from 'lodash';
import move from 'lodash-move';
import { Model, attr } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';

const ValidatingModel = propTypesMixin(Model);

export default class Address extends ValidatingModel {

  static get modelName() {
    return 'Address';
  }

  static get fields() {
    return {
      name: attr(),
      string: attr(),
      icon: attr(),
      color: attr(),
      verified: attr(),
      coin: attr()
    };
  }

  static reducer(action, Address) {
    let existing;

    switch (action.type) {
      case 'CREATE_ADDRESS':
        const defaults = {
          verified: false
        };

        existing = Address.all().filter({ coin: action.payload.coin }).toModelArray();

        Address.create(Object.assign(defaults, action.payload, {
          order: 1 + existing.reduce((a, b) => Math.max(a, b.order), -1)
        }));
        break;

      case 'UPDATE_ADDRESS':
        const {
          id,
          ...data
        } = action.payload;

        if (!Address.withId(id)) {
          return;
        }

        Address.withId(id).update(_.omit(
          data,
          ['order']
        ));

        break;
      case 'REMOVE_ADDRESS':
        const toRemove = Address
            .withId(action.payload);
        existing = Address
            .all()
            .filter({ coin: toRemove.coin })
            .toModelArray();

        existing.forEach((obj) => {
          if (obj.order > toRemove.order) {
            obj.update({ order: obj.order - 1 });
          }
        });

        Address.withId(action.payload).delete();
        break;

      case 'SWAP_ADDRESSES':
        const { coin, rows: [o1, o2] } = action.payload;

        const records = Address
            .all()
            .filter(address => address.coin === coin)
            .orderBy('order', 'asc')
            .toModelArray();

        const reordered = move(records, o1, o2);

        reordered.forEach((object, index) => {
          if (object.order !== index) {
            object.update({ order: index });
          }
        });
        break;

      default:
        break;
    }
  }

  toString() {
    return `${this.name}`;
  }
}
