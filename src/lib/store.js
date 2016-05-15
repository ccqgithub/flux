// store Class
function StoreClass(initialState, reducer) {
  this._callbacks = [];
  this._isDispatching = false;
  this._state = initialState;
  this._reducer = reducer;
}

StoreClass.prototype = {
  // get state
  getState() {
    return this._state;
  },

  // 分配action action = {type, data}
  dispatch(action) {
    var state,
      nextState;

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
  _immutable(state) {
    return state;
  },

  // emitChange
  emitChange() {
    this._callbacks.forEach(function(callback) {
      callback();
    });
  },

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
}

// store creator
export function createStore(initialState, reducer) {
  var storeInstance;

  if (typeof initialState != 'object')
    throw new Error('the first argument `initialState` must be a pure object !');

  if (typeof reducer != 'function')
    throw new Error('the second argument `reducer` must be a pure function !');

  storeInstance = new StoreClass(initialState, reducer);

  return storeInstance;
}
