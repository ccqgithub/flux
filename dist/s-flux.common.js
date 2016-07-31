/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Store = exports.createMutationTypes = exports.createAction = exports.getGlobalStore = exports.setGlobalStore = undefined;

	var _tool = __webpack_require__(1);

	var _action = __webpack_require__(2);

	var _store = __webpack_require__(5);

	var _type = __webpack_require__(7);

	exports.setGlobalStore = _tool.setGlobalStore;
	exports.getGlobalStore = _tool.getGlobalStore;
	exports.createAction = _action.createAction;
	exports.createMutationTypes = _type.createMutationTypes;
	exports.Store = _store.Store;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.setGlobalStore = setGlobalStore;
	exports.getGlobalStore = getGlobalStore;
	var globalStore;

	function setGlobalStore(store) {
	  globalStore = store;
	}

	function getGlobalStore() {
	  return globalStore;
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createAction = createAction;

	var _tool = __webpack_require__(1);

	var _debug = __webpack_require__(3);

	// promise
	var Promise = __webpack_require__(4).Promise;

	// create action
	function createAction(actionFn) {

	  return function (params, store) {
	    if (!store) store = (0, _tool.getGlobalStore)();
	    if (!store) {
	      (0, _debug.error)('No store related to this action! you can regist a global store or pass it to the action with the second argument.', 'action');
	    }

	    return new Promise(function (resolve, reject) {
	      actionFn(params, {
	        store: store,
	        dispatch: function dispatch(mutation) {
	          var waitFor = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	          store.dispatch(mutation);
	          if (!waitFor) resolve(mutation);
	        },
	        error: function error(_error) {
	          reject(_error);
	        }
	      });
	    });
	  };
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.warning = warning;
	exports.error = error;
	function warning(msg) {
	  var context = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

	  if (process.env.NODE_ENV !== 'production') {
	    if (typeof console !== 'undefined') {
	      console.error('[s-flux warn]: ' + msg + ' (' + context + ')');
	    }
	  }
	}

	function error(msg) {
	  var context = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

	  if (process.env.NODE_ENV !== 'production') {
	    if (typeof console !== 'undefined') {
	      throw new Error('[s-flux warn]: ' + msg + ' (' + context + ')');
	    }
	  }
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = es6-promise;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Store = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _debug = __webpack_require__(3);

	var _fun = __webpack_require__(6);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// class store
	var Store = function () {

	  // store constructor
	  function Store(_ref) {
	    var _ref$initialState = _ref.initialState;
	    var initialState = _ref$initialState === undefined ? {} : _ref$initialState;
	    var _ref$mutation = _ref.mutation;
	    var mutation = _ref$mutation === undefined ? function (state, mutation) {
	      return state;
	    } : _ref$mutation;
	    var _ref$modules = _ref.modules;
	    var modules = _ref$modules === undefined ? {} : _ref$modules;
	    var _ref$middlewares = _ref.middlewares;
	    var middlewares = _ref$middlewares === undefined ? [] : _ref$middlewares;
	    var _ref$name = _ref.name;
	    var name = _ref$name === undefined ? 'store' : _ref$name;

	    _classCallCheck(this, Store);

	    this.name = name;
	    this.id = (0, _fun.uid)('store-' + name);
	    this._cloneOptions = {};

	    // set options to clone
	    Object.keys(arguments[0]).forEach(function (key) {
	      this._cloneOptions = (0, _fun.deepClone)(arguments[0][key]);
	    }.bind(this));

	    // check
	    if ((typeof initialState === 'undefined' ? 'undefined' : _typeof(initialState)) != 'object') this._error('The `initialState` must be pure object!');

	    if (typeof mutation != 'function') this._error('The `mutation` must be pure function!');

	    Object.keys(modules).forEach(function (key) {
	      var store = modules[key];

	      if (typeof key != 'string') {
	        this._error('The key of `modules` must be string!');
	      }

	      if (!store._isSFluxInstance) {
	        this._error('The value of `modules` must be `Store instance`!');
	      }

	      modules[key] = store.clone();
	    }.bind(this));

	    this._callbacks = [];
	    this._mutation = mutation;
	    this._modules = modules;
	    this._middlewares = middlewares;
	    this._isSFluxInstance = true;

	    this._isDispatching = false;
	    this._isDispatched = false;

	    // init state
	    this._state = initialState;
	    Object.keys(modules).forEach(function (key) {
	      var store = modules[key];
	      this._state[key] = store.getState();
	    }.bind(this));

	    // middlewares
	    this._middlewares.forEach(function (middleware) {
	      if (typeof middleware.onInit === 'function') {
	        middleware.onInit(this._state, this);
	      }
	    }.bind(this));
	  }

	  // get store state


	  _createClass(Store, [{
	    key: 'getState',
	    value: function getState() {
	      return this._state;
	    }

	    // mutation = {type, params}

	  }, {
	    key: 'dispatch',
	    value: function dispatch(mutation) {
	      var state, nextState;

	      if (this._isDispatching) {
	        (0, _debug.error)('<Store> Can not make another dispatch in one dispatch in the store!');
	      }

	      this._isDispatching = true;
	      this._isDispatched = true;
	      Object.keys(this._modules).forEach(function (key) {
	        var store = this._modules[key];
	        store._isDispatched = false;
	      }.bind(this));

	      // middlewares
	      this._middlewares.forEach(function (middleware) {
	        if (typeof middleware.onBeforeMutation === 'function') {
	          middleware.onBeforeMutation(mutation, this._state, this);
	        }
	      }.bind(this));

	      state = this.getState();
	      nextState = this._mutation(state, mutation);

	      Object.keys(this._modules).forEach(function (key) {
	        var store = this._modules[key];
	        if (!store._isDispatched) {
	          store.dispatch(mutation);
	          this._state[key] = store.getState();
	        }
	      }.bind(this));

	      // middlewares
	      this._middlewares.forEach(function (middleware) {
	        if (typeof middleware.onMutation === 'function') {
	          middleware.onMutation(mutation, this._state, this);
	        }
	      }.bind(this));

	      this.emitChange();
	      this._isDispatching = false;
	    }

	    // emitChange

	  }, {
	    key: 'emitChange',
	    value: function emitChange() {
	      var store = this;
	      this._callbacks.forEach(function (callback) {
	        callback(store);
	      });
	    }

	    // subscribe

	  }, {
	    key: 'subscribe',
	    value: function subscribe(callback) {
	      var callbacks = this._callbacks;
	      var index = callbacks.indexOf(callback);
	      var isSubscribed = true;

	      if (index != -1) this._error('The callback function has been subscribed!');

	      callbacks.push(callback);

	      return function unsubscribe() {
	        var idx;

	        if (!isSubscribed) return;
	        idx = callbacks.indexOf(callback);
	        callbacks.splice(idx, 1);
	        isSubscribed = false;
	      };
	    }

	    // 提前触发一个module

	  }, {
	    key: 'module',
	    value: function module(key) {
	      var mutation = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	      var store = this._mixins[key];
	      if (!store) this._error('The modules<' + key + '> not registed in the store!');
	      if (store._isDispatched) return;
	      store.dispatch(mutation);
	      this._state[key] = store.getState();
	    }

	    // 从初始状态复制一个store

	  }, {
	    key: 'clone',
	    value: function clone() {
	      return new Store(this._cloneOptions);
	    }
	  }, {
	    key: '_error',
	    value: function _error(message) {
	      (0, _debug.error)('<Store: ' + this.id + '> ' + message);
	    }
	  }]);

	  return Store;
	}();

	exports.Store = Store;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.uid = uid;
	exports.deepClone = deepClone;
	var uidIndex = 0;

	// uid
	function uid(description) {
	  uidIndex++;
	  return 's-flux-[' + description + ']-' + uidIndex;
	}

	/**
	 * Deep clone an object. Faster than JSON.parse(JSON.stringify()).
	 *
	 * @param {*} obj
	 * @return {*}
	 */
	function deepClone(obj) {
	  if (Array.isArray(obj)) {
	    return obj.map(deepClone);
	  } else if (obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
	    var cloned = {};
	    var keys = Object.keys(obj);
	    for (var i = 0, l = keys.length; i < l; i++) {
	      var key = keys[i];
	      cloned[key] = deepClone(obj[key]);
	    }
	    return cloned;
	  } else {
	    return obj;
	  }
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createMutationTypes = createMutationTypes;
	exports.createMutationType = createMutationType;

	var _fun = __webpack_require__(6);

	// 创建一组mutation types
	function createMutationTypes() {
	  var types = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

	  var typesObj = {};
	  types.forEach(function (type) {
	    typesObj[type] = (0, _fun.uid)('mutation-type-' + type);
	  });
	  return typesObj;
	}

	// 创建一个mutation types
	function createMutationType(type) {
	  return (0, _fun.uid)('mutation-type-' + type);
	}

/***/ }
/******/ ]);
