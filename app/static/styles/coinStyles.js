import rules from './coins.css';

export default [
  'borderRight',
  'backgroundColor',
  'backgroundColorHover',
  'backgroundColorAfter',
  'textColor',
  'textColorLight',
  'coinLogoAfter'
].reduce((fns, prefix) => ({
  ...fns,
  [prefix]: code => rules[`${prefix}-${code}`]
}), {});
