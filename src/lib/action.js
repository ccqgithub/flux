import {dispatch} from './dispatcher';

// create action
export function createAction(actionType, actionFn) {
  return function(...args) {
    var result;

    // 执行action函数
    result = actionFn(...args);

    // 每个action 执行后会得到一个promise对象
    return new Promise(function(resolve, reject) {
      if (typeof result === 'object' && result !== null && typeof result.then === 'function') {
        // 异步action
        result.then(function(data) {
          dispatch({type: actionType, data: data});
          resolve();
        }).catch(reject);
      } else {
        // 同步action
        dispatch({type: actionType, data: result});
        resolve();
      }
    });
  }
}
