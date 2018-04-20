import _ from 'lodash';
import axios from 'axios';

import { ERROR, EXISTS } from 'constants/status';
import { bestColor } from 'utils/colors';

import presets from './presets';

const jdenticon = require('jdenticon');

jdenticon.config = {
  lightness: {
    grayscale: [0.7, 0.9]
  },
};

export default class CoinManager {

  [Symbol.toStringTag] = 'CoinManager'

  hasCurrency = () => this.currency !== undefined

  has = field => _.get(this.currency, field) !== undefined

  setCurrency = (code) => {
    this.currency = presets[code];
    // console.log(this.prefix);
  }

  get prefix() {
    return this.has('prefix') ? this.currency.prefix : '';
  }

  get regex() {
    return this.has('regex') ? this.currency.regex : /.*/;
  }

  validate = (string) => {
    if (!this.hasCurrency()) {
      // console.log('address is empty');
      return string !== '' && string !== undefined;
    }

    // const { validate: customValidate, regex } = this.currency;
    // const hasValidator = _.get(this.currency, 'validate');

    //// console.log(customValidate);

    return (this.has('validate') && this.currency.validate(string)) ||
        (this.has('regex') && this.currency.regex.test(string));
  }

  lookup = async (string) => {
    // console.log('looking up');

    if (!this.hasCurrency() || !this.has('lookup')) {
      // console.log('No preset lookup fcn');
      return Promise.resolve(EXISTS);
    }

    try {
      const {
        url,
        method,
        success,
      } = this.currency.lookup;

      let {
        options
      } = this.currency.lookup;

      if (!options) {
        options = () => ({});
      }
      const res =
        await axios({
          method: method || 'GET',
          url: url(string),
          ...options(string)
        });

      let foundResult = success(res.data);

      if (this.has('validate')) {
        foundResult = foundResult && this.validate(string);
      }

      return foundResult ? EXISTS : ERROR;
    } catch (e) {
      throw new Error(e);
    }
  }

  getAvatar = ({ width = 32, string }) => {
    if (this.has('getAvatar')) {
      return this.currency.getAvatar({ string, width });
    }

    const [icon, colors] = jdenticon.toSvg(string, width);
    return {
      icon: `data:image/svg+xml;utf8,${icon}`,
      color: bestColor(colors)
    };
  }

  getExplorerUrl = string => (
      this.has('explorer') ?
      this.currency.explorer(string) :
      undefined
    );

  normalize = string => (
    this.has('normalize') ?
      this.currency.normalize(string) :
      string
    )
}
