import {
  OPEN_CREATE_ADDRESS_FORM,
  OPEN_EDIT_ADDRESS_FORM,
  CLOSE_FORM,
  EDIT_NAME,
  EDIT_STRING
} from 'constants/actions';
import {
  CREATE,
  EDIT
} from 'constants/status';

export const defaultState = {
  mode: null,
  name: '',
  string: ''
};

export default function formReducer(state = defaultState, action) {
  const { type, payload } = action;

  switch (type) {

    case OPEN_CREATE_ADDRESS_FORM:
      return {
        ...state,
        mode: CREATE,
        string: '',
        name: ''
      };

    case OPEN_EDIT_ADDRESS_FORM:
      const {
        address: {
          name,
          string
        },
      } = payload;
      return {
        ...state,
        mode: EDIT,
        string,
        name
      };

    case CLOSE_FORM:
      return {
        ...defaultState
      };

    case EDIT_NAME:
      return {
        ...state,
        name: payload
      };

    case EDIT_STRING:
      return {
        ...state,
        string: payload
      };

    default:
      return state;
  }
}
