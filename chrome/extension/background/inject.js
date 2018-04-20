/* eslint no-continue: off, no-console: off */
import 'chrome-extension-async';

const isInjected = tabId =>
  chrome.tabs.executeScriptAsync(tabId, {
    code: `var injected = window.cryptodexInjected;
      window.cryptodexInjected = true;
      injected;`,
    runAt: 'document_start'
  });

const loadScript = (name, tabId, cb) => {
  if (process.env.NODE_ENV === 'production') {
    chrome.tabs.executeScript(tabId, { file: `/js/${name}.bundle.js`, runAt: 'document_end' }, cb);
  } else {
    // dev: async fetch bundle
    fetch(`http://localhost:3000/js/${name}.bundle.js`)
    .then(res => res.text())
    .then((fetchRes) => {
      // Load redux-devtools-extension inject bundle,
      // because inject script and page is in a different context
      const request = new XMLHttpRequest();
      request.open('GET', 'chrome-extension://lmhkpmbekcpmknklioeibfkpmmfibljd/js/redux-devtools-extension.js');  // sync
      request.send();
      request.onload = () => {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
          chrome.tabs.executeScript(tabId, { code: request.responseText, runAt: 'document_start' });
        }
      };
      chrome.tabs.executeScript(tabId, { code: fetchRes, runAt: 'document_end' }, cb);
    });
  }
};

// const arrowURLs = ['^https://github\\.com'];

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const url = (await chrome.tabs.get(tabId)).url;

    //console.log(changeInfo.url.match(/^chrome(-extension)?:\/\//));
  if (url &&
        url.match(/^chrome(-.*)?:\/\//)) return;

  const result = await isInjected(tabId);
  if (chrome.runtime.lastError || result[0]) return;

  loadScript('inject', tabId, () => console.log('inject script success! (onActivated)'));
});


chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  // if (!changeInfo.url) {
  //   return;
  // }

  const url = changeInfo.url || (await chrome.tabs.get(tabId)).url;

  //console.log(changeInfo.url.match(/^chrome(-extension)?:\/\//));
  if (url &&
      url.match(/^chrome(-.*)?:\/\//)) return;

  const result = await isInjected(tabId);
  if (chrome.runtime.lastError || result[0]) return;

  loadScript('inject', tabId, () => console.log('inject script success! (onUpdated)'));
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({ active: true }, async (tabs) => {
    for (let i = 0; i < tabs.length; i += 1) {
      if (
        !tabs[i].url.match(/^chrome(-.*)?:\/\//) &&
        !chrome.runtime.lastError
      ) {
        loadScript('inject', tabs[i].id, () => console.log('inject script success! (onInstalled)'));
      }
    }
  });
});

chrome.runtime.onMessageExternal.addListener(async (request, sender, sendResponse) => {
  console.log(request);
  console.log(sender);
  if (!sender.url.match(/^https?:\/\/(www\.)?cryptodex\.rocks/)) {
    return;
  }
  switch (request.method) {
    case 'homepage':
      sendResponse({ isInstalled: true });
      break;

    default:
      break;
  }
});
