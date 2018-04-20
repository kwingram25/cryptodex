import Color from 'color';

import { createMuiTheme } from 'material-ui/styles';
import red from 'material-ui/colors/red';

const poor = color => (
  (color.s < 50) ||
  (color.s > 70 && color.l < 50)
);

const gray = color => color.h === 0;

const goodness = color => color.s;

const compare = (a, b) => {
  if ((poor(a) && !poor(b)) || gray(a)) {
    return b;
  } else if ((poor(b) && !poor(a)) || gray(b)) {
    return a;
  }
  return goodness(a) <= goodness(b) ? b : a;
};

const fix = color => Object.assign(color, {
  l: Math.max(65, color.l),
  s: Math.min(80, color.s)
});

export const baseTheme = createMuiTheme({
  palette: {
    type: 'dark',
    secondary: red
  }
});

export const bestColor = (arr) => {
  const colors = arr.map(color => Color(color).hsl().object());
  const res = colors.reduce(
    (prev, curr) => compare(prev, curr),
    colors[0]
  );
  return Color(fix(res)).hex();
};
