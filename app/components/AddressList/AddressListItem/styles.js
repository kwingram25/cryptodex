import yellow from 'material-ui/colors/yellow';
import { verifyBar } from 'constants/ui';

const { height } = verifyBar;

const smaller = {
  width: '65%',
  height: '65%'
};

const muchSmaller = {
  width: '50%',
  height: '50%'
};

const nudgeUp = {
  top: '-2px'
};

const nudgeLeft = {
  left: '-1px'
};

const normalizeInject = {
  paddingTop: '0 !important',
  paddingBottom: '0 !important',
  marginTop: '0 !important',
  marginBottom: '0 !important'
};

export default theme =>
  // let coinColor = theme.selectedCoin ?
  // theme.selectedCoin.color :
  // '#000000';
  //
  // if (coinColor.toLowerCase() === '#ffffff') {
  //   coinColor = '#222';
  // }

   ({
     listItem: {
       height: '64px',
     },

     cursorGrab: {
       cursor: 'grab'
     },

     listItemText: {

     },

     textPrimary: {
       display: 'flex',
       alignItems: 'center',

       '& > span': {
         textOverflow: 'ellipsis',
         whiteSpace: 'nowrap',
         overflowX: 'hidden',
       }
     },

     textSecondary: {

     },

     addressField: {
       display: 'flex',
       fontFamily: 'monospace !important',
       fontSize: '1.25rem',

       '& span': {
       },

       '& span:first-child': {
         flex: '0 1 auto',
         whiteSpace: 'nowrap',
         overflow: 'hidden',
         textOverflow: 'ellipsis'
       },

       '& span:nth-child(2)': {
         flex: '0 1 3rem'
       },

       '& span:nth-child(2), & span:only-child': {
         fontWeight: 'bold'
       }

     },

     injected: {
       ...normalizeInject,
       height: `${height}px !important`,
       width: 'initial !important',
       letterSpacing: 'initial !important',
       padding: '0 !important',
       borderRadius: `${Math.round(height / 2)}px !important`,
       WebkitTapHighlightColor: 'transparent !important',
       cursor: 'pointer !important',

       '& *': {
         borderStyle: 'none !important'
       },

       '&:focus': {
         outline: 0,
         textDecoration: 'none !important',
         userSelect: 'none !important'
       },

       '& $listItemText': {
         ...normalizeInject,
         height: '100%',
         position: 'relative',
         top: '-2px',
         display: 'flex',
         flexDirection: 'column',
         justifyContent: 'center'
       },

       '& $textPrimary': {
         ...normalizeInject,
         color: '#FFF !important',
         textAlign: 'center',
         fontSize: '14px !important',
         lineHeight: 'initial !important',
         justifyContent: 'center',
       },

       '& $textSecondary': {
         ...normalizeInject
       },

       '& $addressField': {
         display: 'flex',
         justifyContent: 'center',
         fontSize: '14px !important',
         lineHeight: 'initial !important',
       },

       '& span:nth-child(2)': {
         flex: 'initial !important',
         whiteSpace: 'nowrap'
       },

       '& $warningIcon': {
         position: 'relative',
         top: '-2px'
       },
     },


     warningIcon: {
       color: yellow[500],
       marginLeft: '8px',
       height: '19px',
       width: '19px'
     },

     optionsMenuButton: {
       opacity: 0.5,
       transition: 'all 0.2s ease',
      // color: theme.palette.grey[500],

       '&:hover': {
         opacity: 1,
        // color: theme.palette.common.white
       }
     },

     fixedAvatarSize: {
       width: `${height}px`,
       height: `${height}px`
     },

     coinAvatar: {
       fontFamily: 'cryptocoins',
       color: theme.palette.common.white,
       fontSize: '29px',
       borderRadius: '50% !important',
      // backgroundColor: coinColor
     },

     coinAvatarImg: {
       width: '75%',
       height: '75%',
       position: 'relative',

       '&.ardor': {
         ...nudgeUp,
         ...smaller
       },

       '&.ripple': {
         ...nudgeLeft,
         ...smaller
       },

       '&.ark, &.nxt': {
         ...nudgeUp
       },

       '&.decred, &.dogecoin, &.litecoin, &.nem, &.pivx, &.stellar, &.zcoin': {
         ...smaller
       },

       '&.sia': {
         ...muchSmaller
       }
     },

     popper: {
       top: '12px !important',
     },
     tooltip: {
       margin: '12px 0',
     },
     tooltipTextForce: {
       padding: '8px !important',
       fontSize: '0.875rem !important',
       lineHeight: '1.14286em !important'
     },
     noPadding: {
       paddingLeft: 0,
       paddingRight: 0
     }
   });
