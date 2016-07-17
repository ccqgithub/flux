import {uid} from './util/fun';

// 创建一组action types
export function createActionTypes(types = []) {
  let typesObj = {};
  types.forEach(function(type) {
    typesObj[type] = uid('action-type-' + type);
  });
  return typesObj;
}

// 创建一个action types
export function createActionType(type) {
  return uid('action-type-' + type);
}
