/* eslint no-unused-expressions: 0, func-names: off, no-extend-native: off */
import _ from 'lodash';
import move from 'lodash-move';
import { expect } from 'chai';
import {
    CREATE_ADDRESS,
    REMOVE_ADDRESS,
    UPDATE_ADDRESS,
    SWAP_ADDRESSES
} from 'constants/actions';

import {
  setupOrm,
  startingCount,
  randomIndex
} from 'test/utils';

describe('Addresses', () => {
  it('creates address', async () => {
    const { Address } = await setupOrm();

    const name = 'New Address!';
    const string = 'Address String';

    expect(Address.count()).to.equal(startingCount);

    const action = {
      type: CREATE_ADDRESS,
      payload: {
        name, string
      },
    };
    Address.reducer(action, Address);

    expect(Address.count()).to.equal(startingCount + 1);

    const newAddress = Address.last();

    expect(newAddress.name).to.equal(name);
    expect(newAddress.string).to.equal(string);
  });

  it('updates address', async () => {
    const { Address } = await setupOrm();
    const id = Address.last().id;

    const name = 'New Address Name';
    const string = 'New String';

    const action = {
      type: UPDATE_ADDRESS,
      payload: {
        id,
        name,
        string
      }
    };

    Address.reducer(action, Address);
    const updated = Address.withId(id).ref;

    expect(
      updated.name
    ).to.equal(
      name
    );

    expect(
      updated.string
    ).to.equal(
      string
    );
  });

  it('removes address', async () => {
    const { Address } = await setupOrm();

    expect(Address.count()).to.equal(startingCount);

    const index = randomIndex(0, startingCount);
    const toDelete = Address.at(index).ref;

    const expected = _.keyBy(
      Address.all().toRefArray()
        .filter(addr => addr.order !== toDelete.order)
        .map(({ id }, index) => ({ id, order: index }))
      , 'id');

    const action = {
      type: REMOVE_ADDRESS,
      payload: toDelete.id
    };
    Address.reducer(action, Address);
    expect(Address.count()).to.equal(startingCount - 1);

    Address.all().toRefArray().forEach(({ id, order }) => {
      expect(
        order
      ).to.equal(
        expected[id].order
      );
    });
  });

  it('swaps addresses', async () => {
    const { Address } = await setupOrm();

    const from = randomIndex(0, startingCount);
    const to = randomIndex(0, startingCount, {
      not: [from]
    });

    expect(Address.count()).to.equal(startingCount);
    const coin = Address.last().ref.coin;

    const expected = _.keyBy(
      move(Address.all().toRefArray(), from, to)
        .map(({ id }, index) => ({ id, order: index }))
      , 'id'
    );

    const action = {
      type: SWAP_ADDRESSES,
      payload: {
        coin,
        rows: [from, to]
      }
    };
    Address.reducer(action, Address);

    expect(Address.count()).to.equal(startingCount);

    Address.all().toRefArray().forEach(({ order, id }) => {
      expect(
        order
      ).to.equal(
        expected[id].order
      );
    });
  });
});
