import { takeEvery, select } from 'redux-saga/effects';

import { getAllAddresses } from 'orm/selectors';
import {
  CREATE_ADDRESS,
  UPDATE_ADDRESS,
  REMOVE_ADDRESS
} from 'constants/actions';
import { updateBrowserFeatures } from 'utils/messaging';

function* syncBrowserWithStore() {
  const data = yield select(getAllAddresses);

  yield updateBrowserFeatures(data);
}

export default function* rootSaga() {
  yield takeEvery(CREATE_ADDRESS, syncBrowserWithStore);
  yield takeEvery(UPDATE_ADDRESS, syncBrowserWithStore);
  yield takeEvery(REMOVE_ADDRESS, syncBrowserWithStore);
}
