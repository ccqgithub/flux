import {uid} from './util/fun';

// 创建一组action types
export function createActionTypes(types = []) {
  let typesObj = {};
  types.forEach(function(type) {
    typesObj[type] = uid('action-type-' + type);
  });
  return typesObj;
}
