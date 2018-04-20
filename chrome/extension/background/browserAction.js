/* eslint prefer-const: off */
import 'chrome-extension-async';

let windowId;

const width = 360;
const heightMax = 500;
const heightMin = 350;

const getWindowData = tabId =>
  chrome.tabs.executeScriptAsync(tabId, {
    code: `
      var w = {
        innerHeight: Math.round(window.innerHeight),
        outerHeight: Math.round(window.outerHeight),
        outerWidth: Math.round(window.outerWidth),
        screenX: Math.round(window.screenX),
        screenY: Math.round(window.screenY)
      };
      w;
    `,
    runAt: 'document_start'
  });

chrome.windows.onRemoved.addListener((id) => {
  if (id === windowId) {
    windowId = undefined;
  }
});

chrome.browserAction.onClicked.addListener(async (tab) => {
  if (windowId === undefined) {
    const {
      availWidth,
      availHeight
    } = window.screen;

    const popupOpts = {
      url: chrome.runtime.getURL('app.html'),
      type: 'popup',
      width,
      height: heightMax,
    };

    try {
      let {
        innerHeight,
        outerHeight,
        outerWidth,
        screenX,
        screenY
      } = (await getWindowData(tab.id))[0];

      // console.log({
      //   availWidth,
      //   availHeight,
      //   width,
      //   innerHeight,
      //   outerHeight,
      //   outerWidth,
      //   screenX,
      //   screenY
      // });

      const canSideBySide = (
        /*
          if screen left edge is negative:
            remaining space := availWidth - ( outerWidth - abs(screenX) )
          else:
            remaining space := availWidth - ( screenX + outerWidth )

          return width < remainingSpace
        */
        availWidth - (outerWidth + screenX) >= width
      );

      // console.log(canSideBySide);

      let custom;
      let height;

      if (canSideBySide) {
        height = Math.max(
          heightMin,
          Math.min(
            heightMax,
            availHeight - screenY
          )
        );

        custom = {
          height,
          top: Math.max(
            0,
            (
              availHeight - screenY > height ?
              screenY :
              availHeight - height
            )
          ),
          left: outerWidth + screenX
        };
      } else {
        height = Math.max(
          heightMin,
          Math.min(
            heightMax,
            availHeight - (screenY + (outerHeight - innerHeight))
          )
        );

        custom = {
          height,
          top: Math.max(
            0,
            (
              availHeight - (screenY + (outerHeight - innerHeight)) < height ?
              0 :
              screenY + (outerHeight - innerHeight)
            )
          ),

          // top: Math.max(
          //     0, Math.min(
          //       screenY + (outerHeight - innerHeight),
          //       availHeight - (screenY + height)
          //     )
          //   ),
          left: Math.min(
            screenX + outerWidth,
            availWidth - width
          ),
        };
      }

      Object.assign(
        popupOpts,
        custom
      );
    } catch (e) {
      Object.assign(
        popupOpts,
        {
          top: 0,
          left: availWidth - width
        }
      );
    }

    // console.log({
    //   top: popupOpts.top,
    //   left: popupOpts.left,
    //   height: popupOpts.height
    // });

    chrome.windows.create(popupOpts, (win) => {
      windowId = win.id;
    });
  } else {
    chrome.windows.update(windowId, { focused: true });
  }
});
