function saveState(state) {
  chrome.storage.local.set({ state: JSON.stringify(state) });
}

export default function () {
  return next => (reducer, initialState) => {
    const store = next(reducer, initialState);
    let state = store.getState();

    store.subscribe(() => {
      state = store.getState();
      saveState(state);
    });
    return store;
  };
}
