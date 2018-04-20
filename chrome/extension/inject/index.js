/* eslint no-underscore-dangle: off, no-console: off */
import 'chrome-extension-async';
import InjectManager from './InjectManager';
import { replaceSelectedText } from './utils';

// console.log('inject');

const INJECT_ID = 'cryptodex-inject-verify-address-bar';

const existing = document.querySelector(`#${INJECT_ID}`);

if (existing !== null) {
  existing.remove();
}

const injectDOM = document.createElement('div');

injectDOM.setAttribute('id', INJECT_ID);

Object.assign(injectDOM.style, {
  display: 'none',
});

document.body.appendChild(injectDOM);


const injectManager = new InjectManager(injectDOM);

console.log('Cryptodex address matching: active!');

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  switch (request.method) {
    case 'update':
      if (injectManager._addresses) {
        injectManager.updateAddresses(request.body.data);
      }
      break;

    case 'paste':
      replaceSelectedText(document.activeElement, request.body.string);
      break;

    default:
      break;
  }
  sendResponse(true);
});
