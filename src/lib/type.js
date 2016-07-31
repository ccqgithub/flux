import {uid} from './util/fun';

// 创建一组mutation types
export function createMutationTypes(types = []) {
  let typesObj = {};
  types.forEach(function(type) {
    typesObj[type] = uid('mutation-type-' + type);
  });
  return typesObj;
}

// 创建一个mutation types
export function createMutationType(type) {
  return uid('mutation-type-' + type);
}
