import { expect } from 'chai';
import * as types from 'constants/actions';

import list, { defaultState } from 'reducers/ui/list';

describe('ui/list reducer', () => {
  it('should handle initial state', () => {
    expect(
      list(undefined, {})
    ).to.eql(
      defaultState
    );
  });

  it('should handle SWITCH_ADDRESS', () => {
    expect(
      list(defaultState, {
        type: types.SWITCH_ADDRESS,
        payload: 5
      })
    ).to.eql({
      ...defaultState,
      selectedAddressId: 5
    });
  });
});
