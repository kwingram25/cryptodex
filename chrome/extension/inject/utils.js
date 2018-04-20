import { getAllAddresses } from 'orm/selectors';

export const replaceSelectedText = (elem, text) => {
  const element = elem;

  const value = elem.value || '';
  const start = element.selectionStart;
  const end = element.selectionEnd;

  element.value = value.slice(0, start) + text + value.substr(end);
  element.selectionStart = start + text.length;
  element.selectionEnd = elem.selectionStart;
};

export const fetchAddressData = async (data) => {
  let addressData = data;
  if (!addressData || !addressData.byString) {
    const obj = await chrome.storage.local.get('state');

    if (obj.state) {
      const fetchedState = JSON.parse(obj.state);
      addressData = await getAllAddresses(fetchedState);
    } else {
      addressData = {
        byString: {}
      };
    }
  }

  return addressData.byString;
};
