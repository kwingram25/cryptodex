import { expect } from 'chai';
import * as types from 'constants/actions';
import modals, { defaultState } from 'reducers/ui/modals';

describe('ui/modals reducer', () => {
  it('should handle initial state', () => {
    expect(
      modals(undefined, {})
    ).to.eql(
      defaultState
    );
  });

  it('should handle TOGGLE_QR_CODE_DIALOG', () => {
    expect(
      modals(defaultState, {
        type: types.TOGGLE_QR_CODE_DIALOG,
        payload: true
      })
    ).to.eql({
      ...defaultState,
      qrCodeDialog: true
    });

    expect(
      modals(defaultState, {
        type: types.TOGGLE_DELETE_DIALOG,
        payload: false
      })
    ).to.eql({
      ...defaultState,
      qrCodeDialog: false
    });
  });

  it('should handle TOGGLE_DELETE_DIALOG', () => {
    expect(
      modals(defaultState, {
        type: types.TOGGLE_DELETE_DIALOG,
        payload: true
      })
    ).to.eql({
      ...defaultState,
      deleteDialog: true
    });

    expect(
      modals(defaultState, {
        type: types.DELETE_DIALOG,
        payload: false
      })
    ).to.eql({
      ...defaultState,
      deleteDialog: false
    });
  });
});
