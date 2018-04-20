import _ from 'lodash';
import React from 'react';
import { ORM } from 'redux-orm';
import { createMockStore } from 'redux-test-utils';
import { shallow } from 'enzyme';

import Address from 'orm/addresses';
import { getFactory } from './factories';

export const startingCount = 5;

export function randomIndex(min, max, { not = [] } = {}) {
  const fn = () => Math.floor(Math.random() * (max - min)) + min;
  let res = fn();
  while (not.includes(res)) {
    res = fn();
  }
  return res;
}

export function randomIndexKey(arr, {
  min = 0,
  max = arr.length,
  not = []
}) {
  let res = randomIndex(min, max);
  while (not.includes(arr[res])) {
    res = randomIndex(min, max);
  }
  return res;
}

export function randomFavorite(favorites, { not } = {}) {
  return favorites[randomIndexKey(favorites, { not })];
}

export function applyActionAndGetNextSession(orm, state, action) {
  const nextState = orm.from(state, action).reduce();
  return orm.from(nextState);
}

export function diveForComponent(node, name) {
  let thisNode = node;
  if (thisNode.name() === name) {
    return thisNode;
  }
  if (node.name().substr(name) < 0) {
    throw new Error('Invalid component name');
  }
  while (node.name() !== name) {
    if (thisNode.name() === name) {
      return thisNode;
    }
    thisNode = thisNode.dive();
  }
}


export async function setupOrm({
  count = startingCount,
  coin = false
} = {}) {
  const orm = new ORM();
  orm.register(Address);

  const state = orm.getEmptyState();
  let session = orm.mutableSession(state);

  const factory = getFactory(session);

  let modelName;
  switch (coin) {
    case 'bitcoin':
      modelName = 'ValidBitcoinAddress';
      break;
    default:
      modelName = 'Address';
      break;
  }

  if (count) {
    await factory.createMany(modelName, count);
  }

  session = orm.session(state);

  return {
    state,
    session,
    Address: session.Address
  };
}

export function componentTemplate(options = {}) {
  const {
    component: Component,
    store: storeShape,
    props: propsShape,
    outputFn
  } = options;

  return ({
    store: storeOverride = {},
    props: propsOverride = {}
  } = {}) => {
    const props = {
      ...propsShape || {},
      ...propsOverride || {}
    };

    if (storeShape) {
      const store = storeShape;

      Object.keys(storeOverride).forEach((path) => {
        _.set(store, path.split('.'), storeOverride[path]);
      });

      props.store = createMockStore(store);
    }

    const render = <Component {...props} />;
    const output = outputFn ?
        outputFn(render) :
        shallow(render).dive();

    return { props, output };
  };
}
