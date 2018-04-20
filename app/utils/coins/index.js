import _ from 'lodash';

const getIcon = ({ char }) => String.fromCharCode(parseInt(char.toUpperCase(), 16));

export default {
  getIcon,

  getCoinClasses: ({ theme, className, rules, attr }) => Object.keys(theme.palette.coins)
    .reduce((classes, code) => Object.assign(
      classes,
      {
        [className(code)]:
          _.mapValues(rules, rule => rule(theme.palette.coins[code][attr]))
      }
    ), {}),
};
