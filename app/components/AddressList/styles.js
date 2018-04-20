import {
  drawerWidthMini,
  drawerWidthFull,
  watermarkSizeRem,
  globalStyles
} from '../../constants/ui';

const {
  inlineIcon
} = globalStyles;

const flexbox = {
  flexGrow: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
};

const background = theme => ({
  backgroundColor: theme.palette.background.default,
});

const adjustForDrawer = (theme, margin = true) => ({
  width: `calc(100% - ${drawerWidthMini}px)`,
  [margin ? 'marginLeft' : 'left']: `${drawerWidthMini}px`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(100% - ${drawerWidthFull}px)`,
    [margin ? 'marginLeft' : 'left']: `${drawerWidthFull}px`,
  },
});

const fullWidth = {
  width: '100%'
};

const fullHeight = {
  height: '100%'
};

const above = {
  zIndex: 2
};

const inner = {
  position: 'relative',
};

export default {
  index: theme => ({
    wrapperEmpty: {
      ...inner,
      ...background(theme),
      ...adjustForDrawer(theme),
      height: '100vh',
      '&:after': {
        display: 'none'
      }
    },

    wrapperNonEmpty: {
      ...inner,
      ...background(theme),
      ...adjustForDrawer(theme),

      '&:after': {
        // content: `'${
        //   theme.selectedCoin ?
        //   getIcon({ char: theme.selectedCoin.char }) :
        //   ''
        // }'`,
        ...adjustForDrawer(theme, false),
        ...background(theme),
        ...fullHeight,
        ...flexbox,
        position: 'fixed',
        top: 0,
        fontFamily: 'cryptocoins',
        fontSize: `${watermarkSizeRem}rem`,
        textAlign: 'center',
        color: theme.palette.grey[800],
        zIndex: 0,
      }
    },

    wrapperDragging: {
      cursor: 'grabbing !important',

      fallbacks: {
        cursor: '-webkit-grabbing !important'
      },

      '& *': {
        cursor: 'grabbing !important',

        fallbacks: {
          cursor: '-webkit-grabbing !important'
        }
      }
    },

    listItemDragging: {
      listStyle: 'none',
      backgroundColor: theme.palette.grey[600],
      zIndex: 2000,
      boxShadow: theme.shadows[20],
      cursor: 'grabbing !important',

      fallbacks: {
        cursor: '-webkit-grabbing !important'
      }
    },
    noItemsView: {
      textAlign: 'center',
      ...inner,
      ...above,
      ...flexbox,
      ...fullHeight,
    },
    noItemsViewIcon: {
      fontFamily: 'cryptocoins',
      fontSize: '7rem',
      color: theme.palette.grey[400],
      margin: '-1rem 0 2rem'
    },

    noTabSelectedView: {
      ...inner,
      ...fullHeight,
      ...fullWidth,
      ...background(theme)
    },

    addButton: {
      position: 'fixed',
      right: '2rem',
      bottom: '2rem',
      transition: 'transform 0.25s ease-in-out',
      ...above,

      '&$hidden': {
        transform: 'translateY(112px)'
      }
    },

    icon: {
      ...inlineIcon
    },

    hidden: { },

    bottomBuffer: {
      height: '80px',
      ...background(theme)
    },
    snackbar: {
      left: '24px',
      right: 'auto',
      bottom: '24px'
    }
  }),

  addressList: () => ({
    addressList: {
      ...inner,
      ...above,
      paddingBottom: '112px'
    },
  }),
};
