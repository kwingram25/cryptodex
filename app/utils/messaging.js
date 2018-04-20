import _ from 'lodash';
import { defaultTail, useDifferentTail, formatMenuName } from 'constants/ui';

const CONTEXT_MENU_ROOT = 'cryptodex_paste_address';

const getDisplayName = ({ coin, address }) => {
  if (formatMenuName[coin]) {
    return formatMenuName[coin](address);
  }

  const { name, string } = address;

  const tail = useDifferentTail[coin] || defaultTail;

  let res;
  if (name && name !== '') {
    res = `${name} (${string.substr(-tail)})`;
  } else {
    res = string.length > (tail * 2) ?
      `${string.substr(0, tail)}...${string.substr(-tail)}` :
      string;
  }

  return res;
};

const updateAllTabs = (data) => {
  chrome.tabs.query({}, (tabs) => {
    for (let i = 0; i < tabs.length; i += 1) {
      chrome.tabs.sendMessage(tabs[i].id, {
        method: 'update',
        body: data
      });
    }
  });
};

export const updateContextMenuTree = async (byCoin) => {
  await chrome.contextMenus.removeAll();

  const coins = Object.keys(byCoin).sort();

  if (coins.length) {
    chrome.contextMenus.create({
      id: CONTEXT_MENU_ROOT,
      title: 'Paste crypto address',
      contexts: ['editable'],
    });

    coins.forEach((coin) => {
      chrome.contextMenus.create({
        id: coin,
        title: coin,
        contexts: ['editable'],
        parentId: CONTEXT_MENU_ROOT
      });

      _.sortBy(byCoin[coin], 'order').forEach((address) => {
        const addressMenuId = `${coin}/${address.string}`;

        chrome.contextMenus.create({
          id: addressMenuId,
          title: getDisplayName({ coin, address }),
          contexts: ['editable'],
          parentId: coin
        });
      });
    });
  }
};

export const updateBrowserFeatures = (data) => {
  updateAllTabs(data);
  updateContextMenuTree(data.byCoin);
};
