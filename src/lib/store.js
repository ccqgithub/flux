class Store {

  // store constructor
  constructor({
    debug = process.env.NODE_ENV == 'production' ? true : false,

    // initialState of the store
    initialState = {},

    // update store's state, action = {type,params}
    mutation = function(state, action) {
      return state;
    },

    // this child store map, {childKey: childStore}
    children = {},

    // immutable the store's state, default just return the state
    immutable = function(state) {
      return state
    },

    name: 'SFlux Store'
  }) {
    // check
    if (typeof initialState != 'object')
      throw new Error('The `initialState` must be pure object!');

    if (typeof mutation != 'function')
      throw new Error('The `mutation` must be pure function!');

    if (typeof immutable != 'function')
      throw new Error('The `immutable` must be pure function!');

    Object.keys(children).forEach(function(key) {
      var store = children[key];

      if (typeof key != 'string') {
        throw new Error('The key of `children` must be string!');
      }

      if (!store._isSFluxInstance) {
        throw new Error('The value of `children` must be `Store instance`!');
      }
    });

    this.name = name;
    this._callbacks = [];
    this._isDispatching = false;
    this._mutation = mutation;
    this._children = children;
    this._immutable = immutable;
    this._isSFluxInstance = true;
    this._debug = debug;

    // init state
    this._state = initialState;
    Object.keys(children).forEach(function(key) {
      var store = children[key];
      this._state[key] = store.getState();
    });
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
      throw new Error('can not dispatch in the middle of another dispatch !');
    }

    this._isDispatching = true;

    Object.keys(this._children).forEach(function(key) {
      var store = this._children[key];
      store.dispatch(key);
      this._state[key] = store.getState();
    });

    state = this.getState();
    nextState = this._mutation(state, action);
    this._state = this._immutable(nextState);
    this.emitChange();
    this._isDispatching = false;
    state = nextState = null;
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
      throw new Error('the callback function has been subscribed !');

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

  // 打印调试信息
  log(type, data) {
    if (!this._debug) return;

    switch(type) {
      case 'before action':
        console.log();
        break;
      case 'action':
        console.log();
        break;
      case 'after action':
        console.log();
        break;
      default:
        console.log(this.getState());
    }
  }
}

export {Store};
