import {warning, error} from './util/debug';
import {uid, deepClone} from './util/fun';

// class store
class Store {

  // store constructor
  constructor({

    // initialState of the store
    initialState = {},

    // update store's state, action = {type,params}
    mutation = function(state, action) {
      return state;
    },

    // this child store map, {childKey: childStore}
    mixins = {},

    // middlewares
    middlewares: [],

    // store name
    name: 'store'
  }) {
    this.name = name;
    this.id = uid('store-' + name);
    this._cloneOptions = {};

    // set options to clone
    Object.keys(arguments[0]).forEach(function(key) {
      this._cloneOptions = deepClone(arguments[0][key]);
    }.bind(this));

    // check
    if (typeof initialState != 'object')
      this._error('The `initialState` must be pure object!');

    if (typeof mutation != 'function')
      this._error('The `mutation` must be pure function!');

    if (typeof immutable != 'function')
      this._error('The `immutable` must be pure function!');

    Object.keys(mixins).forEach(function(key) {
      var store = mixins[key];

      if (typeof key != 'string') {
        this._error('The key of `mixins` must be string!');
      }

      if (!store._isSFluxInstance) {
        this._error('The value of `mixins` must be `Store instance`!');
      }

      mixins[key] = store.clone();
    }.bind(this));

    this._callbacks = [];
    this._mutation = mutation;
    this._mixins = mixins;
    this._middlewares = middlewares;
    this._isSFluxInstance = true;

    this._isDispatching = false;
    this._isDispatched = false;

    // init state
    this._state = initialState;
    Object.keys(children).forEach(function(key) {
      var store = children[key];
      this._state[key] = store.getState();
    }.bind(this));

    // middlewares
    this._middlewares.forEach(function(middleware) {
      if (typeof middleware.onInit === 'function') {
        middleware.onInit(this._state, this);
      }
    }.bind(this));
  }

  // get store state
  getState() {
    return this._state;
  }

  // action = {type, params}
  dispatch(action) {
    var state,
      nextState;

    if (this._isDispatching) {
      error('<Store> Can not make another dispatch in one dispatch in the store!');
    }

    this._isDispatching = true;
    this._isDispatched = true;
    Object.keys(this._children).forEach(function(key) {
      var store = this._children[key];
      store._isDispatched = false;
    }.bind(this));

    // middlewares
    this._middlewares.forEach(function(middleware) {
      if (typeof middleware.beforeMutation === 'function') {
        middleware.beforeMutation(action, this._state, this);
      }
    }.bind(this));

    state = this.getState();
    nextState = this._mutation(state, action);

    Object.keys(this._children).forEach(function(key) {
      var store = this._children[key];
      if (!store._isDispatched) {
        store.dispatch(key);
        this._state[key] = store.getState();
      }
    });

    // middlewares
    this._middlewares.forEach(function(middleware) {
      if (typeof middleware.onMutation === 'function') {
        middleware.onMutation(action, this._state, this);
      }
    }.bind(this));

    this.emitChange();
    this._isDispatching = false;
  }

  // emitChange
  emitChange() {
    var store = this;
    this._callbacks.forEach(function(callback) {
      callback(store);
    });
  }

  // subscribe
  subscribe(callback) {
    var callbacks = this._callbacks;
    var index = callbacks.indexOf(callback);
    var isSubscribed = true;

    if (index != -1)
      this._error('The callback function has been subscribed!');

    callbacks.push(callback);

    return function unsubscribe() {
      var idx;

      if (!isSubscribed)
        return;
      idx = callbacks.indexOf(callback);
      callbacks.splice(idx, 1);
      isSubscribed = false;
    }
  }

  // 提前触发一个mixin
  mixin(key, action={}) {
    var store = this._mixins[key];
    if (!store) this._error('The mixin<'+ key +'> not registed in the store!');
    if (store._isDispatched) return;
    store.dispatch(action);
    this._state[key] = store.getState();
  }

  // 从初始状态复制一个store
  clone() {
    return new Store(this._cloneOptions);
  }

  _error(message) {
    error('<Store: ' + this.id + '> ' + message);
  }
}

export {Store};
