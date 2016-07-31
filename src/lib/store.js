import {warning, error} from './util/debug';
import {uid, deepClone} from './util/fun';

// class store
class Store {

  // store constructor
  constructor({

    // initialState of the store
    initialState = {},

    // update store's state, mutation = {type,data}
    mutation = function(state, mutation) {
      return state;
    },

    // this child store modules, {childKey: childStore}
    modules = {},

    // middlewares
    middlewares = [],

    // store name
    name = 'store'
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

    Object.keys(modules).forEach(function(key) {
      var store = modules[key];

      if (typeof key != 'string') {
        this._error('The key of `modules` must be string!');
      }

      if (!store._isSFluxInstance) {
        this._error('The value of `modules` must be `Store instance`!');
      }

      modules[key] = store.clone();
    }.bind(this));

    this._callbacks = [];
    this._mutation = mutation;
    this._modules = modules;
    this._middlewares = middlewares;
    this._isSFluxInstance = true;

    this._isDispatching = false;
    this._isDispatched = false;

    // init state
    this._state = initialState;
    Object.keys(modules).forEach(function(key) {
      var store = modules[key];
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

  // mutation = {type, data}
  dispatch(mutation) {
    var state,
      nextState;

    if (this._isDispatching) {
      error('<Store> Can not make another dispatch in one dispatch in the store!');
    }

    this._isDispatching = true;
    this._isDispatched = true;
    Object.keys(this._modules).forEach(function(key) {
      var store = this._modules[key];
      store._isDispatched = false;
    }.bind(this));

    // middlewares
    this._middlewares.forEach(function(middleware) {
      if (typeof middleware.onBeforeMutation === 'function') {
        middleware.onBeforeMutation(mutation, this._state, this);
      }
    }.bind(this));

    state = this.getState();
    nextState = this._mutation(state, mutation);

    Object.keys(this._modules).forEach(function(key) {
      var store = this._modules[key];
      if (!store._isDispatched) {
        store.dispatch(mutation);
        this._state[key] = store.getState();
      }
    }.bind(this));

    // middlewares
    this._middlewares.forEach(function(middleware) {
      if (typeof middleware.onMutation === 'function') {
        middleware.onMutation(mutation, this._state, this);
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

  // 提前触发一个module
  module(key, mutation={}) {
    var store = this._mixins[key];
    if (!store) this._error('The modules<'+ key +'> not registed in the store!');
    if (store._isDispatched) return;
    store.dispatch(mutation);
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
