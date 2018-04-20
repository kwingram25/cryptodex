export default {
  drawerWidthFull: 200,
  drawerWidthMini: 60,
  coinsListDrawerWidth: 225,
  watermarkSizeRem: 13,
  qrCodeWidth: 250,

  globalStyles: {
    inlineIcon: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      verticalAlign: 'middle',
      marginRight: '0.5rem'
    },
  },

  initialFavorite: 'bitcoin',
  defaultFavorites: [
    'bitcoin',
    'ethereum',
    'litecoin'
  ],
  defaultTail: 6,
  useShortAddress: [
    'steem'
  ],
  useDifferentTail: {
    ardor: 5,
    nxt: 5,
    nem: 4
  },
  useBlackText: [
    'iota'
  ],
  formatMenuName: {
    Steem: ({ string }) => `@${string}`
  },

  verifyBar: {
    width: 250,
    height: 42,
    padding: 4,
    offOpacity: 0.35,
    transition: 0.3,
    shadow: 16
  },

  elementIds: {
    addButtonId: 'add-address-button',
    coinsList: 'coins-list',
    noItemsViewId: 'no-items-found',
    addressFormName: 'name',
    addressFormString: 'address',
    addressFormCancel: 'address-form-cancel',
    addressFormSubmit: 'address-form-submit',
    addressFormVerify: 'address-form-verify',
    addressListBase: 'address-list-base',
    addressListItemName: 'address-list-item-name',
    addressListItemString: 'address-list-item-string',
    addressOptionsExplorer: 'address-options-explorer',
    addressOptionsQRCode: 'address-options-qr-code',
    addressOptionsEdit: 'address-options-edit',
    addressOptionsDelete: 'address-options-delete',
    allCurrenciesItem: 'all-currencies',
    deleteDialog: 'delete-dialog',
    deleteDialogAddress: 'delete-dialog-address',
    deleteDialogConfirm: 'delete-dialog-confirm',
    deleteDialogCancel: 'delete-dialog-cancel',
    favoritesList: 'favorites-list',
    qrCodeDialog: 'qr-code-dialog',
    qrCodeDialogAddress: 'qr-code-dialog-address',
    qrCodeDialogImg: 'qr-code-dialog-img',
    qrCodeDialogClose: 'qr-code-dialog-close'
  }
};
