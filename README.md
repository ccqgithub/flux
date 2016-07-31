# s-flux：a simple flux lib (测试版)

## 介绍

> 一个简单的flux工具库，支持单页应用和多页应用，支持同步action和异步action。

## 安装

> 依赖'es6-promise', npm模块指向`dist/s-flux.common.js`。
> `dist/s-flux.js`和`dis/s-flux.min.js`为浏览器直接引用，为UMD模块，`es6-promise`已经打包在内。

- 浏览器直接引用：

``` html
<script src="s-flux/dist/s-flux.min.js"></script>
<script>
var Store = SFlux.Store;
var createAction = SFlux.createAction;
//...
</script>
```

- commonjs模块引用:

``` js
import {Store, createAction} form 's-flux';
// or
var SFlux = require('s-flux');
```

## API

- Store: 数据仓库基类

```javascript
// app-store.js
import {Store} from 's-flux';

// 创建一个store
var appStore = module.exports = new Store({
  // 初始化状态
  initialState = {},

  // 数据更新: mutation => {type: 'mutation type', data: 'mutation data'}
  mutation = function(state, mutation) {
    return state;
  },

  // 子模块：{key: childStore}
  modules = {},

  // 中间件
  middlewares = [],

  // store名，便于调试用
  name = 'store'
});
```

- createMutationTypes: 创建一组数据更新常量

``` javascript
// mutation-types.js
import {createMutationTypes} from 's-flux';

module.exports = createMutationTypes({
  'INCREMENT',
  'DECREMENT',
  'OTHER',
  'BEFORE_SUBMIT',
  'SUBMIT'
});
```

- createAction: 创建一个action

``` javascript
// actions.js
import {createAction} from 's-flux';

export var submit = createAction(function(params, {store, error, dispatch}) {
  dispatch({
    type: 'BEFORE_SUBMIT'
  }, true);

  //异步action
  setTimeout(function() {
    dispatch({
      type: 'SUBMIT',
      data: '111'
    });
  });
});

```

- setGlobalStore: 注册一个全局store, 这样不要每次调用action的时候传入

``` javascript
// app.js
import {setGlobalStore} from 's-flux';
import appStore from './app-store';
import mutationTypes from './mutation-types';
import {submit} from './actions';

// 注册全局store
setGlobalStore(appStore);

// 调用action
console.log('loading……')
submit({})
  .then(function(data) {
    console.log('success……')
  })
  .catch(function(error) {
    /console.log('error……')
  });
```
