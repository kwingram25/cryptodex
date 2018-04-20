/* eslint class-methods-use-this: off */
import factory from 'factory-girl';
import Chance from 'chance';
import testAddresses from './testAddresses';

const coin = (new Chance()).word();

export class Adapter {
  constructor(session) {
    this.session = session;
  }

  build(modelName, props) {
    // console.log(modelName);
    return this.session[modelName].create(props);
  }

  get(doc, attr) {
    return doc[attr];
  }

  set(props, doc) {
    doc.update(props);
  }

  save(doc, modelName, cb) {
    process.nextTick(cb || (() => {}));
  }

  destroy(doc, modelName, cb) {
    doc.delete();
    process.nextTick(cb);
  }
}

export const getFactory = (session) => {
  const f = new factory.FactoryGirl();

  f.setAdapter(new Adapter(session));

  f.define('Address', 'Address', {
    id: factory.sequence(n => n),
    name: factory.sequence(n => `Address ${n}`),
    string: factory.chance('string'),
    order: factory.sequence(n => n - 1),
    color: '#000000',
    icon: 'icon.jpg',
    verified: true,
    coin
  });

  f.extend('Address', 'ValidBitcoinAddress', {
    coin: 'bitcoin',
    string: factory.oneOf(testAddresses.bitcoin),
  });

  return f;
};
