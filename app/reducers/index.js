import { combineReducers } from 'redux';
import { createReducer } from 'redux-orm';

import orm from '../orm';
import ui from './ui';

export default combineReducers({
  orm: createReducer(orm),
  ui
});
