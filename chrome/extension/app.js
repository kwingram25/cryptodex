import React from 'react';
import ReactDOM from 'react-dom';
import Root from 'containers/Root';
import orm from 'orm';
import bootstrap from 'store/bootstrap';
import './app.css';

chrome.storage.local.get('state', (obj) => {
  const { state } = obj;
  // console.log(orm);
  const initialState = state ? JSON.parse(state || '{}') : bootstrap(orm);
  // console.log(initialState);
  const createStore = require('store/configureStore');

  ReactDOM.render(
    <Root store={createStore(initialState)} />,
    document.querySelector('#root')
  );
});
