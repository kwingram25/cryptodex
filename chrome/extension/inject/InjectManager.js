/* eslint no-underscore-dangle: off */
import React from 'react';
import ReactDOM from 'react-dom';
// import Color from 'color';

import VerifyAddressBar from 'components/VerifyAddressBar';

import { coins, normalizers } from 'constants/coins';
import { verifyBar } from 'constants/ui';
import { getAllAddresses } from 'orm/selectors';

import styles from './inject.css';

const INJECT_CLASS = 'cryptodex-inject';
const textEventSelector = 'input:not([type]), input[type=text], input[type=search], textarea';

export default class InjectManager {

  _coin;
  _address;
  _popin = false;
  _addresses;
  _matchText;

  constructor(container) {
    this._container = container;
    this._container.classList.add(styles[INJECT_CLASS]);

    this._render();

    // document.addEventListener('mousedown', this._onMouseDown);
    document.addEventListener('mouseup', this._onMouseUp);

    // document.addEventListener('keydown', this._onKeyPress);
    this.textEventNodes = [];
    this.attachTextInputEvents();


    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.matches &&
            node.matches(textEventSelector)) {
            // console.log('new text input!');
            this.attachTextInputEvents(node);
          }
        });
      });
    });

    this.observer.observe(document, {
      subtree: true,
      childList: true
    });
  }

  get open() {
    return this._container.style.display !== 'none';
  }

  attachTextInputEvents = (target) => {
    (
      target ?
      [target] :
      document.querySelectorAll(textEventSelector)
    ).forEach((input) => {
      if (!this.textEventNodes.includes(input)) {
        // console.log(input);
        this.textEventNodes.push(input);

        input.removeEventListener('select', this._onSelect);
        input.removeEventListener('focus', this._onFocus);
        input.removeEventListener('blur', this._onBlur);

        input.addEventListener('select', this._onSelect);
        input.addEventListener('focus', this._onFocus);
        input.addEventListener('blur', this._onBlur);
      }
    });
  }

  updateAddresses = async (data) => {
    let res;
    if (data) {
      res = data;
    } else {
      const obj = await chrome.storage.local.get('state');

      if (obj.state) {
        const fetchedState = JSON.parse(obj.state);
        res = await getAllAddresses(fetchedState);
      } else {
        res = {
          byString: {}
        };
      }
    }

    this._addresses = res.byString;
  }

  show = ({ anchor, coin, address }) => {
    const { _update } = this;

    _update({
      coin,
      address,
      anchor,
      hidden: false,
    });

    _update({
      justShown: true
    });

    window.cryptodexPopin = setTimeout(() => {
      _update({
        justShown: false
      });
    }, 3000);
  }

  hide = () => {
    clearTimeout(window.cryptodexPopin);
    this._update({
      hidden: true,
      justShown: false
    });
  };

  _onFocus = (e) => {
    // console.log('_onFocus');
    const input = e.target;

    this._activeInput = input;
  };

  _onBlur = () => {
    // console.log('_onBlur');
    // if (this.open) {
    //   this.hide();
    // }

    delete this._activeInput;
  };

  _onSelect = async (e) => {
    // console.log('_onSelect');
    if (e.target !== this._activeInput) {
      this._activeInput = e.target;
    }

    const {
      open,
      _findAnchor,
      _evaluateString
    } = this;

    const proceed = _findAnchor();

    if (proceed && !open) {
      const { string, anchor } = proceed;
      _evaluateString(anchor, string);
    }
  };

  _onMouseUp = async (e) => {
    // console.log('_onMouseUp');
    const {
      hide,
      open,
      _container,
      _evaluateString
    } = this;

    const isInput = e.target.tagName === 'INPUT' ||
    e.target.tagName === 'TEXTAREA';

    if (isInput) {
      this.attachTextInputEvents(e.target);
    }

    const shouldBreak = (
      isInput ||
      (open && !_container.contains(e.target))
    );

    if (shouldBreak) {
      // console.log('shouldBreak');
      if (open) {
        hide();
      }
      return;
    }

    const proceed = this._findAnchor();

    if (proceed && !open) {
      const { string, anchor } = proceed;
      _evaluateString(anchor, string);
    }
  }

  _findAnchor = () => {
    // console.log('_findAnchor');
    const selection = window.getSelection();
    const string = selection.toString();

    if (string === '' || selection.rangeCount <= 0) {
      return false;
    }

    let anchor;

    if (this._activeInput) {
      anchor = this._activeInput;
    } else {
      anchor = selection.getRangeAt(0).startContainer;

      if (anchor.nodeType === Node.TEXT_NODE) {
        anchor = anchor.parentNode;
      }
    }
    return { string, anchor };
  }

  _evaluateString = async (anchor, string) => {
    // console.log('_evaluateString');

    const trimmed = string.trim();

    const { _isMatch } = this;

    if (!this._addresses) {
      await this.updateAddresses();
    }

    const normalizeds = Object.keys(normalizers)
      .map(code => ({
        coin: code,
        string: normalizers[code](trimmed)
      }));

    let success = _isMatch(anchor, { string: trimmed });
    // console.log(Object.keys(this._addresses));
    if (!success) {
      for (let i = 0; i < normalizeds.length; i += 1) {
        if (success) {
          break;
        }
        success = _isMatch(anchor, normalizeds[i]);
      }
    }
  }

  _isMatch = (anchor, { string, coin }) => {
    // console.log('_isMatch');
    const {
      show,
      _addresses,
    } = this;
    //console.log('checking for match w string: ' + string);
    if (string &&
      Object.keys(_addresses).includes(string) && (
        !coin ||
        _addresses[string].coin === coin
      )
    ) {
      const address = _addresses[string];
      const coin = coins[address.coin];

      this._matchText = string;

      show({
        anchor, address, coin
      });

      if (this._activeInput) {
        const hideOnChangeOnce = (e) => {
          this.hide();
          e.currentTarget.removeEventListener('input', hideOnChangeOnce);
        };
        this._activeInput.addEventListener('input', hideOnChangeOnce);
      }

      return true;
    }
    return false;
  };

  _render = () => {
    const {
      _coin: coin,
      _address: address,
      // _isDark: isDark
    } = this;

    const props = {
      coin,
      address,
      // isDark
    };

    if (coin && address) {
      ReactDOM.render(
        <VerifyAddressBar {...props} />,
        this._container
      );
    }
  }

  _update = ({ coin, address, anchor, hidden, justShown }) => {
    if (hidden !== undefined) {
      this._container.style.display = hidden ? 'none' : 'block';
    }

    if (justShown !== undefined) {
      this._container.classList[justShown ? 'add' : 'remove'](styles['just-shown']);
    }

    if (anchor) {
      const newStyle = {};
      const { top, left, right, width } = anchor.getBoundingClientRect();

      if (right < verifyBar.width) {
        newStyle.right = 0;
      } else {
        newStyle.left = `${left + (width / 2) + (-verifyBar.width / 2)}px`;
      }

      newStyle.top = `${top + anchor.offsetHeight}px`;

      Object.assign(this._container.style, newStyle);

      // this._checkIsDark(
      //   left + (width / 2),
      //   top + anchor.offsetHeight
      // );
    }

    if (coin || address) {
      this._coin = coin || this._coin;
      this._address = address || this._address;
      this._render();
    }
  }

  // _checkIsDark = () => {
  //   const body = document.querySelector('body');
  //   const colorBehind = window.getComputedStyle(body, null)
  //     .getPropertyValue('background-color');
  //   //console.log(Color(colorBehind).hsl().object());
  //
  //   this._isDark = Color(colorBehind).hsl().object().l < 50;
  // }

  destroy() {
    document.removeEventListener('mouseup', this._onMouseUp);
    this.observer.disconnect();
    ReactDOM.unmountComponentAtNode(this._container);
  }
}
