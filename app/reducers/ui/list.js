import {
  SWITCH_ADDRESS,
} from 'constants/actions';

export const defaultState = {
  selectedAddressId: -1,
};

export default function listReducer(state = defaultState, action) {
  const { type, payload } = action;

  switch (type) {
    case SWITCH_ADDRESS:
      return {
        ...state,
        selectedAddressId: payload
      };

    default:
      return state;
  }
}
