import {
  green
} from 'material-ui/colors';
import { verifyBar } from 'constants/ui';

const {
  width,
  height,
  padding,
  offOpacity,
  transition,
  shadow
} = verifyBar;
const totalHeight = height + (2 * padding);

export default theme => ({
  root: {
    opacity: 0,
    transition: `opacity ${transition}s ease`,
    '-webkit-font-smoothing': 'antialiased',

    '&$settled': {
      opacity: offOpacity
    },

    '&:hover, &$justMounted': {
      opacity: 1
    },
  },

  justMounted: {},
  settled: {},

  list: {
    background: theme.palette.grey[800],
    width: `${width}px`,
    padding: `${padding}px`,
    boxShadow: theme.shadows[shadow],
    borderRadius: `${totalHeight / 2}px !important`,
  },

  borderRadiusFix: {
    borderRadius: '50% !important'
  },

  matched: {
    width: '100%',
    color: green[600],
    fontSize: '13px',
    fontWeight: 'bold',
    lineHeight: '20px',
    display: 'flex',
    justifyContent: 'center',
    verticalAlign: 'middle',
    marginBottom: '3px',

    '& svg': {
      width: '20px',
      height: '20px',
      marginRight: '4px'
    },
  },

  tooltip: {
    fontSize: '11px !important'
  },

  // dark: {
  //   color: green[800]
  // },
  //
  // light: {
  //   color: green[500]
  // }
});
