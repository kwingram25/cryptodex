import {
  TOGGLE_DELETE_DIALOG,
  TOGGLE_QR_CODE_DIALOG,
} from 'constants/actions';

export const defaultState = {
  deleteDialog: false,
  qrCodeDialog: false
};

export default function modalsReducer(state = defaultState, action) {
  const { type, payload } = action;
  switch (type) {
    case TOGGLE_DELETE_DIALOG:
      return {
        ...state,
        deleteDialog: payload
      };

    case TOGGLE_QR_CODE_DIALOG:
      return {
        ...state,
        qrCodeDialog: payload
      };

    default:
      return state;
  }
}
