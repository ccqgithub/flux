# flux：a simple flux lib

## 介绍

> 一个简单的flux工具库，支持单页应用和多页应用，支持同步action和异步action。

> flux结构：Actions + pageStore + Reducers + Components。

- Actions: 分为页面action和公用action。页面action为每个页面独自使用，公用action一般被公用的组件调用。页面也可以调用公用的action，但组件必须调用公用action。所有action都会返回一个promsie对象。

- pageStore：一个页面有且只有一个store。

- reducer：公用的辅助store的**pure function**, 用于辅助更新state的一个分支。

- Components：组件，一般不直接使用store，而是通过父组件传属性的方式使用store中的数据。在组件中，可以调用公用action，公用action会被分配到当前页面的store。

# 依赖

依赖 ES6 的`Promise`，如果你采用es6语法，不需要另外加载依赖。如果不是使用es6语法，需要调用之前引入相应的polyfill，推荐`es-promise`模块。

# 安装

- npm 安装

`dist/s-flux.common.js`是CommonJS模块。`dist/s-flux.js`和`dist/s-flux.min.js`是UMD规范的模块，可以在浏览器直接使用。

```javascript
npm install 's-flux';

//===
import {createAction, createStore} from 's-flux'
```

- 直接引入js, 支持

```javascript
<script src="dist/s-flux.js"></script>
<script>
  var createAction = sFlux.createAction;
</script>
```

# 使用方法

- `createStore(initialState, reducer)`, 创建一个全局store，返回一个store实例。对于单页app，整个应用只有一个store。对于普通的多页应用，每个页面对于一个全局store。参数`initialState`表示store初始状态，`reducer`为所有action的入口，它的返回值为store的下一个状态。具体见下方示例：

```javascript
// IndexStore.js
import objectAssign from 'object-assign';
import {createSotre} from 's-flux';
import * as IndexActions from './actions/IndexActions';
import * as FeedActions from './actions/FeedActions';
import {filterFeeds} from './reducers/FeedReducers';

// 为首页创建一个store
// 第一个参数initialState应该为一个`pure object`。
// 第二个参数reducer负责在每一个action发生时更新store的状态，它的返回值为store的下一个状态。
// 注意：整个reducer执行过程中是同步的，期间不能调用其他action。
var IndexStore = createSotre({
  user: {
    name: 'season',
    age: 18
  },
  feeds: [],
  showFeeds: [],
}, function(state, action) {
  // reducer 接受两个参数，第一个为当前的store的状态，第二个为action。
  // action.type: action类型
  // action.data: action参数

  // 注意：这里不直接操作store的state，而是返回一个新的对象, 对象可以用Object.assign()，数组用Array.map();
  var data = action.data;

  switch (action.type) {
    case IndexActions.CHG_USER_NAME:
      // 此处的data为新的user name
      return objectAssign({}, state, {
        user: objectAssign({}, state.user, {
          name: data
        })
      });
      break;
    case IndexActions.FILTER_FEEDS:
      // 此处的data为filter condition
      return objectAssign({}, state, {
        showFeeds: filterFeeds(state.feeds, data)
      });
      break;
    default:
      return state;
  }
});
```

- `createAction(actionType, actionFn)`: 创建一个action。

```javascript
// IndexActions.js
import {createAction} from 's-flux';

export const CHG_USER_NAME = 'CHG_USER_NAME';
export const FETCH_FEEDS = 'FETCH_FEEDS';

// 同步action, 返回的值会传给`action.data`
export var changeUserName = createAction(CHG_USER_NAME, function(name) {
  return name;
});

// 异步action, 返回一个promise，它的resolve值会传给`action.data`
export var fetchFeeds = createAction(FETCH_FEEDS, function(page, count) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve([{}]); //
    }, 300);
  });
});

```

- `registerStore(store)`: 为当前页面注册一个全局store。注意：在任何action被调用之前注册store，否则action不知道dispatch去哪个store。

```javascript
// index.jsx
import {registerStore} from 's-flux';
import IndexStore from './stores/IndexStore';
import IndexActions from './actions/IndexActions';

// register store
registerStore(IndexStore);

// 调用action
IndexActions
  .changeUserName('ddd')
  .then(function() {
    // success
  })
  .catch(function(reason) {
    // error
  });

```

- reducers:

```javascript
// FeedReducers.js

export function filterFeeds(fees, condition) {
  return feeds.filter(function(item) {
    return item.tag == condition;
  });
}

```
