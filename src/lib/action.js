import {getGlobalStore} from './tool';
import {error} from './util/debug';

// promise
var Promise = require('es6-promise').Promise;

// create action
export function createAction(actionFn) {

  return function(params, store) {
    if (!store) store = getGlobalStore();
    if (!store) {
      error('No store related to this action! you can regist a global store or pass it to the action with the second argument.', 'action');
    }

    return new Promise(function(resolve, reject) {
      actionFn(params, {
        store,
        dispatch(mutation, waitFor=false) {
          store.dispatch(mutation);
          if (!waitFor) resolve(mutation);
        },
        error(error) {
          reject(error);
        }
      });
    });
  }
}
