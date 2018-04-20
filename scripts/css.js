 const cssForCoin = (prefix, rule, pseudo = '') => (code, prop) => `
  .${prefix}-${code}${pseudo} {
    ${rule(prop)}
  }
`;

 const borderRight = cssForCoin(
  'borderRight',
  color => `border-right: 2px solid ${color} !important;`
);

 const textColor = cssForCoin(
  'textColor',
  color => `color: ${color} !important;`
);

 const textColorLight = cssForCoin(
  'textColorLight',
  color => `color: ${color} !important;`
);

 const backgroundColor = (prefix, pseudo) => cssForCoin(
  prefix,
  color => `background-color: ${color} !important;`,
  pseudo
);

 const coinLogoAfter = cssForCoin(
  'coinLogoAfter',
  char => `content: '${char}';`,
  ':after'
);

 module.exports = {
   cssForCoin,
   borderRight,
   textColor,
   textColorLight,
   backgroundColor,
   coinLogoAfter
 };


//
// @mixin backgroundColor($code, $color, $prefix) {
//   .#{$prefix}-#{$code} {
//     background-color: $color !important;
//   }
// }
//
// @mixin backgroundColorHover($code, $color, $prefix) {
//   .#{$prefix}-#{$code}:hover {
//     background-color: $color !important;
//   }
// }
//
// @mixin backgroundColorAfter($code, $color) {
//   @if $color {
//     .backgroundColorAfter-#{$code}:after {
//       background-color: $color !important;
//     }
//   }
// }
//
// @mixin coinLogoAfter($code, $char) {
//   @if $char {
//     .coinLogoAfter-#{$code}:after {
//       content: $char;
//     }
//   }
// }
//
// @each $code, $props in $coins {
//     @include textColor($code, map-get($props, color))
//     @include textColorLight($code, map-get($props, colorLight))
//     @include backgroundColor($code, map-get($props, color), 'backgroundColor')
//     @include backgroundColor($code, map-get($props, color), 'backgroundColorHover')
//     @include backgroundColorHover($code, map-get($props, colorDark), 'backgroundColorHover')
//     @include backgroundColor($code, map-get($props, colorLight), 'backgroundColorLight')
//     @include backgroundColor($code, map-get($props, colorDark), 'backgroundColorDark')
//     @include backgroundColorAfter($code, map-get($props, color))
//     @include borderRight($code, map-get($props, color))
//     @include coinLogoAfter($code, map-get($props, char))
// }
// `;
//
// module.exports = scss;
