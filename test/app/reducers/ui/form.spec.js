import { expect } from 'chai';
import * as types from 'constants/actions';
import {
  CREATE,
  EDIT
} from 'constants/status';

import form, { defaultState } from 'reducers/ui/form';

describe('ui/form reducer', () => {
  it('should handle initial state', () => {
    expect(
      form(undefined, {})
    ).to.eql(
      defaultState
    );
  });

  it('should handle OPEN_CREATE_ADDRESS_FORM', () => {
    expect(
      form(defaultState, {
        type: types.OPEN_CREATE_ADDRESS_FORM,
      })
    ).to.eql({
      ...defaultState,
      mode: CREATE,
      string: '',
      name: ''
    });
  });

  it('should handle OPEN_EDIT_ADDRESS_FORM', () => {
    const name = 'Address Name';
    const string = 'Address String';
    const payload = {
      address: {
        name,
        string
      }
    };
    expect(
      form(defaultState, {
        type: types.OPEN_EDIT_ADDRESS_FORM,
        payload
      })
    ).to.eql({
      ...defaultState,
      mode: EDIT,
      string,
      name
    });
  });

  it('should handle CLOSE_FORM', () => {
    const name = 'Address Name';
    const string = 'Address String';
    expect(
      form({
        ...defaultState,
        mode: EDIT,
        name,
        string
      }, {
        type: types.CLOSE_FORM,
      })
    ).to.eql(defaultState);
  });

  it('should handle EDIT_NAME', () => {
    const name = 'Address Name';
    expect(
      form(defaultState, {
        type: types.EDIT_NAME,
        payload: name
      })
    ).to.eql({
      ...defaultState,
      name
    });
  });

  it('should handle EDIT_STRING', () => {
    const string = 'Address String';
    expect(
      form(defaultState, {
        type: types.EDIT_STRING,
        payload: string
      })
    ).to.eql({
      ...defaultState,
      string
    });
  });
});
