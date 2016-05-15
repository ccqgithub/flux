var appStore;

// register app store
export function registerStore(store) {
  if (appStore)
    throw new Error('store has been registed, if you want regist another store, first call unregister() !');
  appStore = store;
}

// unregister app store
export function unregisterStore() {
  appStore = null;
}

// dispatch
export function dispatch(action) {
  if (!appStore)
    throw new Error('must first call `registerStore` tp register the store before call dispatch an action !');
  return appStore.dispatch(action);
}
