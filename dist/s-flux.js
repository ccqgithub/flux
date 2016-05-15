/*!
 * s-flux.js v0.0.1
 * (c) 2016 Season Chen
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.sFlux = global.sFlux || {})));
}(this, function (exports) { 'use strict';

  var appStore;

  // register app store

  function registerStore(store) {
    if (appStore) throw new Error('store has been registed, if you want regist another store, first call unregister() !');
    appStore = store;
  }

  // unregister app store

  function unregisterStore() {
    appStore = null;
  }

  // dispatch

  function dispatch(action) {
    if (!appStore) throw new Error('must first call `registerStore` tp register the store before call dispatch an action !');
    return appStore.dispatch(action);
  }

  // create action

  function createAction(actionType, actionFn) {
    return function () {
      var result;

      // 执行action函数
      result = actionFn.apply(undefined, arguments);

      // 每个action 执行后会得到一个promise对象
      return new Promise(function (resolve, reject) {
        if (typeof result === 'object' && result !== null && typeof result.then === 'function') {
          // 异步action
          result.then(function (data) {
            dispatch({ type: actionType, data: data });
            resolve();
          })['catch'](reject);
        } else {
          // 同步action
          dispatch({ type: actionType, data: result });
          resolve();
        }
      });
    };
  }

  function StoreClass(initialState, reducer) {
    this._callbacks = [];
    this._isDispatching = false;
    this._state = initialState;
    this._reducer = reducer;
  }

  StoreClass.prototype = {
    // get state
    getState: function getState() {
      return this._state;
    },

    // 分配action action = {type, data}
    dispatch: function dispatch(action) {
      var state, nextState;

      if (this._isDispatching) {
        throw new Error('can not dispatch in the middle of another dispatch !');
      }

      this._isDispatching = true;
      state = this.getState();
      nextState = this._reducer(state, action);
      this._state = this._immutable(nextState);
      this.emitChange();
      this._isDispatching = false;
      state = nextState = null;
    },

    // immutable
    _immutable: function _immutable(state) {
      return state;
    },

    // emitChange
    emitChange: function emitChange() {
      this._callbacks.forEach(function (callback) {
        callback();
      });
    },

    // subscribe
    subscribe: function subscribe(callback) {
      var callbacks = this._callbacks;
      var index = callbacks.indexOf(callback);
      var isSubscribed = true;

      if (index != -1) throw new Error('the callback function has been subscribed !');

      callbacks.push(callback);

      return function unsubscribe() {
        var idx;

        if (!isSubscribed) return;
        idx = callbacks.indexOf(callback);
        callbacks.splice(idx, 1);
        isSubscribed = false;
      };
    }
  };

  // store creator

  function createStore(initialState, reducer) {
    var storeInstance;

    if (typeof initialState != 'object') throw new Error('the first argument `initialState` must be a pure object !');

    if (typeof reducer != 'function') throw new Error('the second argument `reducer` must be a pure function !');

    storeInstance = new StoreClass(initialState, reducer);

    return storeInstance;
  }

  exports.registerStore = registerStore;
  exports.unregisterStore = unregisterStore;
  exports.createAction = createAction;
  exports.createStore = createStore;

}));