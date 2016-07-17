import {getGlobalStore} from './tool';

// create action
export function createAction(actionFn) {
  return function(params, store) {
    var doneCallbacks = [],
      errorCallbacks = [],
      finallyCallbacks = [];
      eventCallbacks = {},
      doneData = null,
      errorData = null,
      proc,
      result;

    _process = {
      done(data) {
        if (_doneData) return;
        _doneData = data;
        if (_doneCallback) _doneCallback(_doneData);
        if (_finallyCallback) _finallyCallback();
      },
      error(error) {
        if (_errorData) return;
        _errorData = error;
        if (_errorCallback) _errorCallback(_doneData);
        if (_finallyCallback) _finallyCallback();
      },
      trigger(event, data) {

      }
    }

    // 执行action函数
    actionFn(params, store, _process);

    result = {
      done(fn) {
        _doneCallback = fn;
        if (_doneData) _doneCallback(_doneData);
      },
      error() {
        _errorCallback = fn;
        if (_errorData) _errorCallback(_errorData);
      },
      finally() {
        _finallyCallback = fn;
        if (_doneData || _errorData) _finallyCallback();
      },
      on() {

      }
    }

    return result;
  }
}
