import { getAllAddresses } from 'orm/selectors';
import { updateContextMenuTree } from 'utils/messaging';

const fetchDataAndSetupMenus = () => {
  chrome.storage.local.get('state', (obj) => {
    if (obj.state) {
      const { state } = obj;
      const fetchedState = JSON.parse(state || {});

      const { byCoin } = getAllAddresses(fetchedState);
      updateContextMenuTree(byCoin);
    }
  });
};

chrome.runtime.onStartup.addListener(() => {
  fetchDataAndSetupMenus();
});

chrome.runtime.onInstalled.addListener(() => {
  fetchDataAndSetupMenus();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const string = info.menuItemId.split('/')[1];
  chrome.tabs.sendMessage(tab.id, {
    method: 'paste',
    body: {
      string
    }
  });
});
