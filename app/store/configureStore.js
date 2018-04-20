/* eslint import/no-named-as-default-member: off */
import { compose as prodCompose, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers';
import storage from '../utils/storage';
import rootSaga from './sagas';

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle */

const isProd = process.env.NODE_ENV === 'production';
const devCompose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

let compose;
if (isProd || !devCompose) {
  compose = prodCompose;
} else {
  compose = devCompose({});
}
//
// const compose = isProd ?
//   Redux.compose :
//
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
//   window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
//     // Options: http://zalmoxisuFs.github.io/redux-devtools-extension/API/Arguments.html
//   }) :
//   compose;
// /* eslint-enable no-underscore-dangle */

const sagaMiddleware = createSagaMiddleware();

const enhancers = compose(
  storage(),
  applyMiddleware(
    thunk,
    sagaMiddleware
  ),
);

module.exports = (initialState) => {
  const store = createStore(rootReducer, initialState, enhancers);

  sagaMiddleware.run(rootSaga);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');

      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
};
