(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],{

/***/ 1:
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|restoreGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== 'onPush';
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          var promise = this.constructor;
          return this.then(
          function (value) {return promise.resolve(callback()).then(function () {return value;});},
          function (reason) {return promise.resolve(callback()).then(function () {
              throw reason;
            });});

        };
      }
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _wx$getSystemInfoSync =




  wx.getSystemInfoSync(),platform = _wx$getSystemInfoSync.platform,pixelRatio = _wx$getSystemInfoSync.pixelRatio,windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime ??????????????? uni ???????????????????????????????????? uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };




var baseApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor });


var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(
      function (item, index) {return index < currentIndex ? item !== urls[currentIndex] : true;});

    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false };

  } };


var protocols = {
  previewImage: previewImage };

var todos = [
'vibrate'];

var canIUses = [];

var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// ?????? api ???????????????
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue ??? false ???????????????????????????????????????????????????????????????????????????
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// ??????????????????
          console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// ???????????? key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}????????????????????? key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// ???????????? returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// ??????????????? api
      return function () {
        console.error("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// ?????? api ??????????????????
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = wx[options.name || methodName].apply(wx, args);
      if (isSyncApi(methodName)) {// ?????? api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'onTabBarMidButtonTap',
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:??????[' + service + ']?????????' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });




var api = /*#__PURE__*/Object.freeze({
  __proto__: null });


var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  {
    if (!wx.canIUse('nextTick')) {
      return;
    }
  }
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {args[_key3 - 1] = arguments[_key3];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

function initHook(name, options) {
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      return oldHook.apply(this, args);
    };
  }
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('onLoad', options);
  return MPPage(options);
};

Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('created', options);
  return MPComponent(options);
};

var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // ?????? Vue.prototype ???????????????
    } catch (e) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('?????? Vue ??? data ???????????????????????? data ???????????????????????? data ?????????????????? vm ??????????????????????????????????????????????????????', data);
      }
    }
  } else {
    try {
      // ??? data ?????????
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // ????????????????????? render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions['behaviors'];
  var vueExtends = vueOptions['extends'];
  var vueMixins = vueOptions['mixins'];

  var vueProps = vueOptions['props'];

  if (!vueProps) {
    vueOptions['props'] = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps['name'] = {
            type: String,
            default: '' };

          vueProps['value'] = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // ??????????????????????????? $slots ??? props??????????????? vueSlots ????????? $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO ???????????? mpvue ??? mp ??????
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for ???????????????????????????', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent ????????????????????? event ??????
  if (isCustom) {// ???????????????
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// ???????????????????????? event ??? detail ??????
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent ?????????????????????
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // ????????? web-view ?????? dataset ?????????
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao ?????????????????? scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          if (methodName === '$emit') {
            handlerCtx.$emit.apply(handlerCtx,
            processEventArgs(
            _this.$vm,
            event,
            eventArray[1],
            eventArray[2],
            isCustom,
            methodName));

            return;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref3)


{var mocks = _ref3.mocks,initRefs = _ref3.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-weixin";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// ?????????????????????????????????????????????????????? onShow ??? onLaunch ??????
        return;
      }
      {
        if (!wx.canIUse('nextTick')) {// ?????? ???2.2.3 ????????????????????? 2.3.0 ??? nextTick ??????
          console.error('?????????????????????????????????????????? ?????????????????????-??????-????????????-????????????????????? ?????????`2.3.0`??????');
        }
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;
      // vm ???????????? globalData
      this.$vm.globalData = this.globalData;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // ??????????????? globalData
  appOptions.globalData = vm.$options.globalData || {};
  // ??? methods ?????????????????? getApp() ???
  var methods = vm.$options.methods;
  if (methods) {
    Object.keys(methods).forEach(function (name) {
      appOptions[name] = methods[name];
    });
  }

  initHooks(appOptions, hooks);

  return appOptions;
}

var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // ??????????????????(????????????:https://github.com/dcloudio/uni-app/issues/1200)
  for (var i = $children.length - 1; i >= 0; i--) {
    var childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  // ??????????????????
  var parentVm;
  for (var _i = $children.length - 1; _i >= 0; _i--) {
    parentVm = findVmByVueId($children[_i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function initBehavior(options) {
  return Behavior(options);
}

function isPage() {
  return !!this.route;
}

function initRelation(detail) {
  this.triggerEvent('__l', detail);
}

function initRefs(vm) {
  var mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

function handleLink(event) {var _ref4 =



  event.detail || event.value,vuePid = _ref4.vuePid,vueOptions = _ref4.vueOptions; // detail ?????????,value ?????????(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

function parseBaseComponent(vueComponentOptions)


{var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},isPage = _ref5.isPage,initRelation = _ref5.initRelation;var _initVueComponent =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var options = {
    multipleSlots: true,
    addGlobalClass: true };


  {
    // ?????? multipleSlots ??????????????? bug??????????????????????????? ??? u-list?????????????????????
    if (vueOptions['mp-weixin'] && vueOptions['mp-weixin']['options']) {
      Object.assign(options, vueOptions['mp-weixin']['options']);
    }
  }

  var componentOptions = {
    options: options,
    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;

        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties };


        initVueIds(properties.vueId, this);

        // ??????????????????
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options });


        // ????????? vue ??????
        this.$vm = new VueComponent(options);

        // ??????$slots,$scopedSlots???????????????????????????$slots???
        initSlots(this.$vm, properties.vueSlots);

        // ???????????? setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // ????????? props ???????????? true????????????????????? false ????????? created,ready ??????, ??? attached ?????????
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __l: handleLink,
      __e: handleEvent } };



  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }

  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}

function parseComponent(vueComponentOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

var hooks$1 = [
'onShow',
'onHide',
'onUnload'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parseBasePage(vuePageOptions, _ref6)


{var isPage = _ref6.isPage,initRelation = _ref6.initRelation;
  var pageOptions = parseComponent(vuePageOptions);

  initHooks(pageOptions.methods, hooks$1, vuePageOptions);

  pageOptions.methods.onLoad = function (args) {
    this.$vm.$mp.query = args; // ?????? mpvue
    this.$vm.__call_hook('onLoad', args);
  };

  return pageOptions;
}

function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}

function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),

/***/ 14:
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode, /* vue-cli only */
  components, // fixed by xxxxxx auto components
  renderjs // fixed by xxxxxx renderjs
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // fixed by xxxxxx auto components
  if (components) {
    options.components = Object.assign(components, options.components || {})
  }
  // fixed by xxxxxx renderjs
  if (renderjs) {
    (renderjs.beforeCreate || (renderjs.beforeCreate = [])).unshift(function() {
      this[renderjs.__module] = this
    });
    (options.mixins || (options.mixins = [])).push(renderjs)
  }

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ 15:
/*!*****************************************************************!*\
  !*** C:/Users/admin/Desktop/change1/change/shops/config/api.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });Object.defineProperty(exports, "apiBaseUrl", { enumerable: true, get: function get() {return _config.apiBaseUrl;} });exports.deleteCoupon = exports.isFlashGoods = exports.getOrderListcompleted = exports.shopping = exports.getGoodsInfoCardById = exports.getGoodsInfoById = exports.getAddressBydefault = exports.DeleteaddressUser = exports.UpadtaaddressUser = exports.getAddressById = exports.AddaddressUser = exports.getAddressList = exports.getGoodsCoupon = exports.getGoodsById = exports.getCouponByUser = exports.userRecharge = exports.getbeginMoneyUser = exports.addCouponByUser = exports.getCouponList = exports.getGoodsInfoByType = exports.getCategoryList = exports.getGoodsDataIndex = exports.getCategoryinfoIndex = exports.gethotSaleList = exports.getimgSlideDataHot = exports.getFlashList = exports.getimgSlideDataFlash = exports.getNoticeListIndex = exports.GetimgSlideIndex = exports.userInfoById = exports.userInfoInit = exports.upinfoLogin = exports.login = void 0;var common = _interopRequireWildcard(__webpack_require__(/*! ./common.js */ 16));
var db = _interopRequireWildcard(__webpack_require__(/*! ./db.js */ 17));
var _config = __webpack_require__(/*! ./config.js */ 20);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};if (desc.get || desc.set) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}}newObj.default = obj;return newObj;}}



// ????????????????????????????????????????????????????????????????????????
var methodsToken = [
'userInfoInit',
'userInfoById',
'addCouponByUser',
'getbeginMoneyUser',
'userRecharge',
'getCouponByUser',
'getAddressList',
'AddaddressUser',
'getAddressBydefault',
'getGoodsInfoCardById',
'shopping',
'getOrderListcompleted',
'isFlashGoods'];


var post = function post(url, data, callback) {
  uni.showLoading({
    title: '?????????' });


  // ??????token????????????
  if (methodsToken.indexOf(url) >= 0) {
    // ????????????token
    var userToken = db.get("userToken");
    if (!userToken) {
      common.jumpToLogin();
      return false;
    } else {
      data.userToken = userToken;
    }
  }

  uni.request({
    url: _config.apiBaseUrl + url,
    data: data,
    header: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded', //????????????????????????
    },
    method: 'POST',
    success: function success(response) {
      uni.hideLoading();
      var result = response.data;
      callback(result);
    },
    complete: function complete() {
      uni.hideLoading();
    },
    fail: function fail(error) {
      uni.hideLoading();
      if (error && error.response) {
        showError(error.response);
      }
    } });


};

var get = function get(url, callback) {
  uni.showLoading({
    title: '?????????' });

  uni.request({
    url: _config.apiBaseUrl + url,
    header: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded' //????????????????????????
    },
    method: 'GET',
    success: function success(response) {
      uni.hideLoading();
      callback(response.data);
    },
    fail: function fail(error) {
      uni.hideLoading();
      if (error && error.response) {
        showError(error.response);
      }
    },
    complete: function complete() {
      setTimeout(function () {
        uni.hideLoading();
      }, 250);
    } });

};

/**
    * ???????????????
    */
//????????????
var login = function login(data, callback) {return post('login', data, callback);};
//??????????????????????????????
exports.login = login;var upinfoLogin = function upinfoLogin(data, callback) {return post('upinfoLogin', data, callback);};
//?????????????????????????????????
exports.upinfoLogin = upinfoLogin;var userInfoInit = function userInfoInit(data, callback) {return post('userInfoInit', data, callback);};
//??????????????????
exports.userInfoInit = userInfoInit;var userInfoById = function userInfoById(data, callback) {return post('userInfoById', data, callback);};
//?????????????????????
exports.userInfoById = userInfoById;var GetimgSlideIndex = function GetimgSlideIndex(callback) {return get('GetimgSlideIndex', callback);};
//????????????????????????
exports.GetimgSlideIndex = GetimgSlideIndex;var getNoticeListIndex = function getNoticeListIndex(callback) {return get('getNoticeListIndex', callback);};
//??????????????????????????????
exports.getNoticeListIndex = getNoticeListIndex;var getimgSlideDataFlash = function getimgSlideDataFlash(callback) {return get('getimgSlideDataFlash', callback);};
//????????????????????????
exports.getimgSlideDataFlash = getimgSlideDataFlash;var getFlashList = function getFlashList(callback) {return get('getFlashList', callback);};
//??????????????????????????????
exports.getFlashList = getFlashList;var getimgSlideDataHot = function getimgSlideDataHot(callback) {return get('getimgSlideDataHot', callback);};
//????????????????????????
exports.getimgSlideDataHot = getimgSlideDataHot;var gethotSaleList = function gethotSaleList(callback) {return get('gethotSaleList', callback);};
//????????????????????????
exports.gethotSaleList = gethotSaleList;var getCategoryinfoIndex = function getCategoryinfoIndex(callback) {return get('getCategoryinfoIndex', callback);};
//????????????????????????
exports.getCategoryinfoIndex = getCategoryinfoIndex;var getGoodsDataIndex = function getGoodsDataIndex(callback) {return get('getGoodsDataIndex', callback);};
//????????????????????????
exports.getGoodsDataIndex = getGoodsDataIndex;var getCategoryList = function getCategoryList(callback) {return get('getCategoryList', callback);};
//??????????????????????????????
exports.getCategoryList = getCategoryList;var getGoodsInfoByType = function getGoodsInfoByType(data, callback) {return post('getGoodsInfoByType', data, callback);};
//?????????????????????
exports.getGoodsInfoByType = getGoodsInfoByType;var getCouponList = function getCouponList(data, callback) {return post('getCouponList', data, callback);};
//?????????????????????
exports.getCouponList = getCouponList;var addCouponByUser = function addCouponByUser(data, callback) {return post('addCouponByUser', data, callback);};
//??????????????????
exports.addCouponByUser = addCouponByUser;var getbeginMoneyUser = function getbeginMoneyUser(data, callback) {return post('getbeginMoneyUser', data, callback);};
//??????
exports.getbeginMoneyUser = getbeginMoneyUser;var userRecharge = function userRecharge(data, callback) {return post('userRecharge', data, callback);};
//???????????????????????????
exports.userRecharge = userRecharge;var getCouponByUser = function getCouponByUser(data, callback) {return post('getCouponByUser', data, callback);};
//???????????????????????????
exports.getCouponByUser = getCouponByUser;var getGoodsById = function getGoodsById(data, callback) {return post('getGoodsById', data, callback);};
//??????????????????????????????
exports.getGoodsById = getGoodsById;var getGoodsCoupon = function getGoodsCoupon(data, callback) {return post('getGoodsCoupon', data, callback);};
//?????????????????????????????????
exports.getGoodsCoupon = getGoodsCoupon;var getAddressList = function getAddressList(data, callback) {return post('getAddressList', data, callback);};
//??????????????????
exports.getAddressList = getAddressList;var AddaddressUser = function AddaddressUser(data, callback) {return post('AddaddressUser', data, callback);};
//????????????id?????????????????????
exports.AddaddressUser = AddaddressUser;var getAddressById = function getAddressById(data, callback) {return post('getAddressById', data, callback);};
//??????????????????
exports.getAddressById = getAddressById;var UpadtaaddressUser = function UpadtaaddressUser(data, callback) {return post('UpadtaaddressUser', data, callback);};
//??????????????????
exports.UpadtaaddressUser = UpadtaaddressUser;var DeleteaddressUser = function DeleteaddressUser(data, callback) {return post('DeleteaddressUser', data, callback);};
//????????????????????????
exports.DeleteaddressUser = DeleteaddressUser;var getAddressBydefault = function getAddressBydefault(data, callback) {return post('getAddressBydefault', data, callback);};
//???????????????????????????
exports.getAddressBydefault = getAddressBydefault;var getGoodsInfoById = function getGoodsInfoById(data, callback) {return post('getGoodsInfoById', data, callback);};
//?????????????????????????????????????????????
exports.getGoodsInfoById = getGoodsInfoById;var getGoodsInfoCardById = function getGoodsInfoCardById(data, callback) {return post('getGoodsInfoCardById', data, callback);};
//??????
exports.getGoodsInfoCardById = getGoodsInfoCardById;var shopping = function shopping(data, callback) {return post('shopping', data, callback);};
//???????????????????????????
exports.shopping = shopping;var getOrderListcompleted = function getOrderListcompleted(data, callback) {return post('getOrderListcompleted', data, callback);};
//??????????????????????????????
exports.getOrderListcompleted = getOrderListcompleted;var isFlashGoods = function isFlashGoods(data, callback) {return post('isFlashGoods', data, callback);};
//?????????????????????
exports.isFlashGoods = isFlashGoods;var deleteCoupon = function deleteCoupon(data, callback) {return post('deleteCoupon', data, callback);};exports.deleteCoupon = deleteCoupon;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 16:
/*!********************************************************************!*\
  !*** C:/Users/admin/Desktop/change1/change/shops/config/common.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.errorToShow = errorToShow;exports.successToShow = successToShow;exports.jumpToLogin = jumpToLogin;exports.throttle = throttle;exports.timestampToTime = timestampToTime;exports.navigateTo = navigateTo;exports.tabbarTime = tabbarTime;exports.getFlashTime = getFlashTime;exports.GetPercent = GetPercent;exports.filterNum = filterNum;var db = _interopRequireWildcard(__webpack_require__(/*! ./db.js */ 17));
var _moment = _interopRequireDefault(__webpack_require__(/*! ../static/js/moment.js */ 18));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};if (desc.get || desc.set) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}}newObj.default = obj;return newObj;}}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};var ownKeys = Object.keys(source);if (typeof Object.getOwnPropertySymbols === 'function') {ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {return Object.getOwnPropertyDescriptor(source, sym).enumerable;}));}ownKeys.forEach(function (key) {_defineProperty(target, key, source[key]);});}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}
//???????????????????????????
function errorToShow() {var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '????????????';var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  uni.showToast({
    title: msg,
    icon: 'none',
    duration: 1500 });

  setTimeout(function () {
    callback();
  }, 1500);
}

//?????????????????????????????????
function successToShow() {var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '????????????';var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  uni.showToast({
    title: msg,
    icon: 'success',
    duration: 1000 });

  setTimeout(function () {
    callback();
  }, 500);
}
//?????????????????????
function jumpToLogin(method) {
  var now_time = Date.parse(new Date());
  var value = db.get('jump_to_login');
  if (!value) {
    value = 0;
  }
  if (now_time - value > 3000) {
    db.set('jump_to_login', now_time); //??????????????????????????????
    uni.showToast({
      title: '????????????!',
      icon: 'none',
      duration: 1000,
      success: function success(res) {
        setTimeout(function () {
          uni.hideToast();
          uni.switchTab({
            url: '/pages/member/member',
            animationType: 'pop-in',
            animationDuration: 200 });

        }, 500);
      } });

  }
}

function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500;
  }

  var _lastTime = null;

  // ??????????????????
  return function () {
    var _nowTime = +new Date();
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments); //???this????????????????????????
      _lastTime = _nowTime;
    }
  };
}

function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y + M + D + h + m + s;
}
/**
   * ????????????
   */
function navigateTo(url) {
  uni.navigateTo({
    url: url,
    animationType: 'pop-in',
    animationDuration: 300 });

}

function tabbarTime() {var tabbarData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];var startTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;var endTime = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 23;var flog = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2;
  var list = [];
  var tabbarDataList = [];
  var now = (0, _moment.default)();
  var data = null;
  var end = null;
  var startTimeStr = "",
  endTimeStr = "";
  var FlashGoods = [];
  for (var i = startTime; i <= endTime; i += flog) {
    data = (0, _moment.default)().hour(i).minutes(0).seconds(0);
    end = (0, _moment.default)().hour(i + 2).minutes(0).seconds(0).subtract(1, 'second');
    var ListGoods = [];
    if (now.isBefore(data, 'hour')) {
      list.push({
        time: data.format('HH:mm'),
        state: "????????????" });

      for (var _i = 0; _i < tabbarData.length; _i++) {
        var item = tabbarData[_i];
        var index = _i;
        var tabbarNow = (0, _moment.default)(item.flashtime, "HH:mm").minutes(0);
        if (tabbarNow.isBetween(data, end)) {
          ListGoods.push(_objectSpread({},
          tabbarData.splice(index, 1)[0], {
            state: "????????????" }));

          --_i;
        }
      }
      tabbarDataList.push({
        time: data.format('HH:mm'),
        List: ListGoods,
        state: "????????????" });

    } else {
      if (now.isBetween(data, end)) {
        endTimeStr = end.format('HH:mm');
        startTimeStr = data.format('HH:mm');
        list.push({
          time: data.format('HH:mm'),
          state: "?????????" });

        for (var _i2 = 0; _i2 < tabbarData.length; _i2++) {
          var _item = tabbarData[_i2];
          var _index = _i2;
          var _tabbarNow = (0, _moment.default)(_item.flashtime, "HH:mm").minutes(0);
          if (_tabbarNow.isBetween(data, end)) {
            ListGoods.push(_objectSpread({},
            tabbarData.splice(_index, 1)[0], {
              state: "?????????" }));

            --_i2;
          }
        }
        tabbarDataList.push({
          time: data.format('HH:mm'),
          List: ListGoods,
          state: "?????????" });

        FlashGoods = ListGoods;
      } else {
        list.push({
          time: data.format('HH:mm'),
          state: "?????????" });

        for (var _i3 = 0; _i3 < tabbarData.length; _i3++) {
          var _item2 = tabbarData[_i3];
          var _index2 = _i3;
          var _tabbarNow2 = (0, _moment.default)(_item2.flashtime, "HH:mm").minutes(0);
          if (_tabbarNow2.isBetween(data, end)) {
            ListGoods.push(_objectSpread({},
            tabbarData.splice(_index2, 1)[0], {
              state: "?????????" }));

            --_i3;
          }
        }
        tabbarDataList.push({
          time: data.format('HH:mm'),
          List: ListGoods,
          state: "?????????" });

      }
    }

  }
  return {
    list: list,
    startTime: startTimeStr,
    endTime: endTimeStr,
    tabbarDataList: tabbarDataList };

}


/**
   * ?????????????????????
   */
function getFlashTime(endtime) {
  if (endtime == '00:00') {
    endtime = '24:00';
  }
  var data = (0, _moment.default)(endtime, "HH:mm");
  var data1 = (0, _moment.default)();
  return (0, _moment.default)(data).diff(data1, 'second');
}
/**
   * ???????????????
   */
function GetPercent(num, total) {
  num = parseFloat(num);
  total = parseFloat(total);
  if (isNaN(num) || isNaN(total)) {
    return "-";
  }
  return total <= 0 ? "0%" : Math.round(num / total * 10000) / 100.00 + "%";
}
/**
   *  ??????????????????
   */
function filterNum(i) {
  var num = i.charAt(i.length - 1);
  var reg = new RegExp("^[0-9]*$");
  if (!reg.test(num)) {
    return i.slice(0, -1);
  } else {
    return i;
  }
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 17:
/*!****************************************************************!*\
  !*** C:/Users/admin/Desktop/change1/change/shops/config/db.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.get = get;exports.set = set;exports.del = del;exports.clear = clear;exports.userToken = userToken;var common = _interopRequireWildcard(__webpack_require__(/*! ./common.js */ 16));function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};if (desc.get || desc.set) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}}newObj.default = obj;return newObj;}} //??????common

//??????
function get(key) {var sync = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  try {
    if (sync) {
      return uni.getStorageSync(key);
    } else {
      var data = '';
      uni.getStorage({
        key: key,
        success: function success(res) {
          data = res.data;
        } });

      return data;
    }
  } catch (e) {
    return false;
  }
}

//??????
function set(key, value) {var sync = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  try {
    if (sync) {
      return uni.setStorageSync(key, value);
    } else {
      uni.setStorage({
        key: key,
        data: value });

    }
  } catch (e) {

  }
}

//??????
function del(key) {var sync = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  try {
    if (sync) {
      return uni.removeStorageSync(key);
    } else {
      uni.removeStorage({
        key: key });

    }
  } catch (e) {
    return false;
  }
}

//??????
function clear() {var sync = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  try {
    if (sync) {
      return uni.clearStorageSync();
    } else {
      uni.clearStorage();
    }
  } catch (e) {
    return false;
  }
}

//????????????token????????????????????????????????????????????????????????????????????????????????????????????????????????????token
function userToken(callback) {
  var token = get('userToken');
  if (token) {
    callback(token);
  } else {
    //?????????????????????????????????
    common.jumpToLogin();
  }
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 18:
/*!***********************************************************************!*\
  !*** C:/Users/admin/Desktop/change1/change/shops/static/js/moment.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) { //! moment.js
//! version : 2.10.6
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (global, factory) {
   true ? module.exports = factory() :
  undefined;
})(void 0, function () {'use strict';

  var hookCallback;

  function utils_hooks__hooks() {
    return hookCallback.apply(null, arguments);
  }

  // This is done to register the method called with moment()
  // without creating circular dependencies.
  function setHookCallback(callback) {
    hookCallback = callback;
  }

  function isArray(input) {
    return Object.prototype.toString.call(input) === '[object Array]';
  }

  function isDate(input) {
    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
  }

  function map(arr, fn) {
    var res = [],i;
    for (i = 0; i < arr.length; ++i) {
      res.push(fn(arr[i], i));
    }
    return res;
  }

  function hasOwnProp(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
  }

  function extend(a, b) {
    for (var i in b) {
      if (hasOwnProp(b, i)) {
        a[i] = b[i];
      }
    }

    if (hasOwnProp(b, 'toString')) {
      a.toString = b.toString;
    }

    if (hasOwnProp(b, 'valueOf')) {
      a.valueOf = b.valueOf;
    }

    return a;
  }

  function create_utc__createUTC(input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, true).utc();
  }

  function defaultParsingFlags() {
    // We need to deep clone this object.
    return {
      empty: false,
      unusedTokens: [],
      unusedInput: [],
      overflow: -2,
      charsLeftOver: 0,
      nullInput: false,
      invalidMonth: null,
      invalidFormat: false,
      userInvalidated: false,
      iso: false };

  }

  function getParsingFlags(m) {
    if (m._pf == null) {
      m._pf = defaultParsingFlags();
    }
    return m._pf;
  }

  function valid__isValid(m) {
    if (m._isValid == null) {
      var flags = getParsingFlags(m);
      m._isValid = !isNaN(m._d.getTime()) &&
      flags.overflow < 0 &&
      !flags.empty &&
      !flags.invalidMonth &&
      !flags.invalidWeekday &&
      !flags.nullInput &&
      !flags.invalidFormat &&
      !flags.userInvalidated;

      if (m._strict) {
        m._isValid = m._isValid &&
        flags.charsLeftOver === 0 &&
        flags.unusedTokens.length === 0 &&
        flags.bigHour === undefined;
      }
    }
    return m._isValid;
  }

  function valid__createInvalid(flags) {
    var m = create_utc__createUTC(NaN);
    if (flags != null) {
      extend(getParsingFlags(m), flags);
    } else
    {
      getParsingFlags(m).userInvalidated = true;
    }

    return m;
  }

  var momentProperties = utils_hooks__hooks.momentProperties = [];

  function copyConfig(to, from) {
    var i, prop, val;

    if (typeof from._isAMomentObject !== 'undefined') {
      to._isAMomentObject = from._isAMomentObject;
    }
    if (typeof from._i !== 'undefined') {
      to._i = from._i;
    }
    if (typeof from._f !== 'undefined') {
      to._f = from._f;
    }
    if (typeof from._l !== 'undefined') {
      to._l = from._l;
    }
    if (typeof from._strict !== 'undefined') {
      to._strict = from._strict;
    }
    if (typeof from._tzm !== 'undefined') {
      to._tzm = from._tzm;
    }
    if (typeof from._isUTC !== 'undefined') {
      to._isUTC = from._isUTC;
    }
    if (typeof from._offset !== 'undefined') {
      to._offset = from._offset;
    }
    if (typeof from._pf !== 'undefined') {
      to._pf = getParsingFlags(from);
    }
    if (typeof from._locale !== 'undefined') {
      to._locale = from._locale;
    }

    if (momentProperties.length > 0) {
      for (i in momentProperties) {
        prop = momentProperties[i];
        val = from[prop];
        if (typeof val !== 'undefined') {
          to[prop] = val;
        }
      }
    }

    return to;
  }

  var updateInProgress = false;

  // Moment prototype object
  function Moment(config) {
    copyConfig(this, config);
    this._d = new Date(config._d != null ? config._d.getTime() : NaN);
    // Prevent infinite loop in case updateOffset creates new moment
    // objects.
    if (updateInProgress === false) {
      updateInProgress = true;
      utils_hooks__hooks.updateOffset(this);
      updateInProgress = false;
    }
  }

  function isMoment(obj) {
    return obj instanceof Moment || obj != null && obj._isAMomentObject != null;
  }

  function absFloor(number) {
    if (number < 0) {
      return Math.ceil(number);
    } else {
      return Math.floor(number);
    }
  }

  function toInt(argumentForCoercion) {
    var coercedNumber = +argumentForCoercion,
    value = 0;

    if (coercedNumber !== 0 && isFinite(coercedNumber)) {
      value = absFloor(coercedNumber);
    }

    return value;
  }

  function compareArrays(array1, array2, dontConvert) {
    var len = Math.min(array1.length, array2.length),
    lengthDiff = Math.abs(array1.length - array2.length),
    diffs = 0,
    i;
    for (i = 0; i < len; i++) {
      if (dontConvert && array1[i] !== array2[i] ||
      !dontConvert && toInt(array1[i]) !== toInt(array2[i])) {
        diffs++;
      }
    }
    return diffs + lengthDiff;
  }

  function Locale() {
  }

  var locales = {};
  var globalLocale;

  function normalizeLocale(key) {
    return key ? key.toLowerCase().replace('_', '-') : key;
  }

  // pick the locale from the array
  // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
  // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
  function chooseLocale(names) {
    var i = 0,j,next,locale,split;

    while (i < names.length) {
      split = normalizeLocale(names[i]).split('-');
      j = split.length;
      next = normalizeLocale(names[i + 1]);
      next = next ? next.split('-') : null;
      while (j > 0) {
        locale = loadLocale(split.slice(0, j).join('-'));
        if (locale) {
          return locale;
        }
        if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
          //the next array item is better than a shallower substring of this one
          break;
        }
        j--;
      }
      i++;
    }
    return null;
  }

  function loadLocale(name) {
    var oldLocale = null;
    // TODO: Find a better way to register and load all the locales in Node
    if (!locales[name] && typeof module !== 'undefined' &&
    module && module.exports) {
      try {
        oldLocale = globalLocale._abbr;
        !(function webpackMissingModule() { var e = new Error("Cannot find module 'undefined'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
        // because defineLocale currently also sets the global locale, we
        // want to undo that for lazy loaded locales
        locale_locales__getSetGlobalLocale(oldLocale);
      } catch (e) {}
    }
    return locales[name];
  }

  // This function will load locale and then set the global locale.  If
  // no arguments are passed in, it will simply return the current global
  // locale key.
  function locale_locales__getSetGlobalLocale(key, values) {
    var data;
    if (key) {
      if (typeof values === 'undefined') {
        data = locale_locales__getLocale(key);
      } else
      {
        data = defineLocale(key, values);
      }

      if (data) {
        // moment.duration._locale = moment._locale = data;
        globalLocale = data;
      }
    }

    return globalLocale._abbr;
  }

  function defineLocale(name, values) {
    if (values !== null) {
      values.abbr = name;
      locales[name] = locales[name] || new Locale();
      locales[name].set(values);

      // backwards compat for now: also set the locale
      locale_locales__getSetGlobalLocale(name);

      return locales[name];
    } else {
      // useful for testing
      delete locales[name];
      return null;
    }
  }

  // returns locale data
  function locale_locales__getLocale(key) {
    var locale;

    if (key && key._locale && key._locale._abbr) {
      key = key._locale._abbr;
    }

    if (!key) {
      return globalLocale;
    }

    if (!isArray(key)) {
      //short-circuit everything else
      locale = loadLocale(key);
      if (locale) {
        return locale;
      }
      key = [key];
    }

    return chooseLocale(key);
  }

  var aliases = {};

  function addUnitAlias(unit, shorthand) {
    var lowerCase = unit.toLowerCase();
    aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
  }

  function normalizeUnits(units) {
    return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
  }

  function normalizeObjectUnits(inputObject) {
    var normalizedInput = {},
    normalizedProp,
    prop;

    for (prop in inputObject) {
      if (hasOwnProp(inputObject, prop)) {
        normalizedProp = normalizeUnits(prop);
        if (normalizedProp) {
          normalizedInput[normalizedProp] = inputObject[prop];
        }
      }
    }

    return normalizedInput;
  }

  function makeGetSet(unit, keepTime) {
    return function (value) {
      if (value != null) {
        get_set__set(this, unit, value);
        utils_hooks__hooks.updateOffset(this, keepTime);
        return this;
      } else {
        return get_set__get(this, unit);
      }
    };
  }

  function get_set__get(mom, unit) {
    return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
  }

  function get_set__set(mom, unit, value) {
    return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
  }

  // MOMENTS

  function getSet(units, value) {
    var unit;
    if (typeof units === 'object') {
      for (unit in units) {
        this.set(unit, units[unit]);
      }
    } else {
      units = normalizeUnits(units);
      if (typeof this[units] === 'function') {
        return this[units](value);
      }
    }
    return this;
  }

  function zeroFill(number, targetLength, forceSign) {
    var absNumber = '' + Math.abs(number),
    zerosToFill = targetLength - absNumber.length,
    sign = number >= 0;
    return (sign ? forceSign ? '+' : '' : '-') +
    Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
  }

  var formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

  var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

  var formatFunctions = {};

  var formatTokenFunctions = {};

  // token:    'M'
  // padded:   ['MM', 2]
  // ordinal:  'Mo'
  // callback: function () { this.month() + 1 }
  function addFormatToken(token, padded, ordinal, callback) {
    var func = callback;
    if (typeof callback === 'string') {
      func = function func() {
        return this[callback]();
      };
    }
    if (token) {
      formatTokenFunctions[token] = func;
    }
    if (padded) {
      formatTokenFunctions[padded[0]] = function () {
        return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
      };
    }
    if (ordinal) {
      formatTokenFunctions[ordinal] = function () {
        return this.localeData().ordinal(func.apply(this, arguments), token);
      };
    }
  }

  function removeFormattingTokens(input) {
    if (input.match(/\[[\s\S]/)) {
      return input.replace(/^\[|\]$/g, '');
    }
    return input.replace(/\\/g, '');
  }

  function makeFormatFunction(format) {
    var array = format.match(formattingTokens),i,length;

    for (i = 0, length = array.length; i < length; i++) {
      if (formatTokenFunctions[array[i]]) {
        array[i] = formatTokenFunctions[array[i]];
      } else {
        array[i] = removeFormattingTokens(array[i]);
      }
    }

    return function (mom) {
      var output = '';
      for (i = 0; i < length; i++) {
        output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
      }
      return output;
    };
  }

  // format date using native date object
  function formatMoment(m, format) {
    if (!m.isValid()) {
      return m.localeData().invalidDate();
    }

    format = expandFormat(format, m.localeData());
    formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

    return formatFunctions[format](m);
  }

  function expandFormat(format, locale) {
    var i = 5;

    function replaceLongDateFormatTokens(input) {
      return locale.longDateFormat(input) || input;
    }

    localFormattingTokens.lastIndex = 0;
    while (i >= 0 && localFormattingTokens.test(format)) {
      format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
      localFormattingTokens.lastIndex = 0;
      i -= 1;
    }

    return format;
  }

  var match1 = /\d/; //       0 - 9
  var match2 = /\d\d/; //      00 - 99
  var match3 = /\d{3}/; //     000 - 999
  var match4 = /\d{4}/; //    0000 - 9999
  var match6 = /[+-]?\d{6}/; // -999999 - 999999
  var match1to2 = /\d\d?/; //       0 - 99
  var match1to3 = /\d{1,3}/; //       0 - 999
  var match1to4 = /\d{1,4}/; //       0 - 9999
  var match1to6 = /[+-]?\d{1,6}/; // -999999 - 999999

  var matchUnsigned = /\d+/; //       0 - inf
  var matchSigned = /[+-]?\d+/; //    -inf - inf

  var matchOffset = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z

  var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

  // any word (or two) characters or numbers including two/three word month in arabic.
  var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

  var regexes = {};

  function isFunction(sth) {
    // https://github.com/moment/moment/issues/2325
    return typeof sth === 'function' &&
    Object.prototype.toString.call(sth) === '[object Function]';
  }


  function addRegexToken(token, regex, strictRegex) {
    regexes[token] = isFunction(regex) ? regex : function (isStrict) {
      return isStrict && strictRegex ? strictRegex : regex;
    };
  }

  function getParseRegexForToken(token, config) {
    if (!hasOwnProp(regexes, token)) {
      return new RegExp(unescapeFormat(token));
    }

    return regexes[token](config._strict, config._locale);
  }

  // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
  function unescapeFormat(s) {
    return s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
      return p1 || p2 || p3 || p4;
    }).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  var tokens = {};

  function addParseToken(token, callback) {
    var i,func = callback;
    if (typeof token === 'string') {
      token = [token];
    }
    if (typeof callback === 'number') {
      func = function func(input, array) {
        array[callback] = toInt(input);
      };
    }
    for (i = 0; i < token.length; i++) {
      tokens[token[i]] = func;
    }
  }

  function addWeekParseToken(token, callback) {
    addParseToken(token, function (input, array, config, token) {
      config._w = config._w || {};
      callback(input, config._w, config, token);
    });
  }

  function addTimeToArrayFromToken(token, input, config) {
    if (input != null && hasOwnProp(tokens, token)) {
      tokens[token](input, config._a, config, token);
    }
  }

  var YEAR = 0;
  var MONTH = 1;
  var DATE = 2;
  var HOUR = 3;
  var MINUTE = 4;
  var SECOND = 5;
  var MILLISECOND = 6;

  function daysInMonth(year, month) {
    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  }

  // FORMATTING

  addFormatToken('M', ['MM', 2], 'Mo', function () {
    return this.month() + 1;
  });

  addFormatToken('MMM', 0, 0, function (format) {
    return this.localeData().monthsShort(this, format);
  });

  addFormatToken('MMMM', 0, 0, function (format) {
    return this.localeData().months(this, format);
  });

  // ALIASES

  addUnitAlias('month', 'M');

  // PARSING

  addRegexToken('M', match1to2);
  addRegexToken('MM', match1to2, match2);
  addRegexToken('MMM', matchWord);
  addRegexToken('MMMM', matchWord);

  addParseToken(['M', 'MM'], function (input, array) {
    array[MONTH] = toInt(input) - 1;
  });

  addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
    var month = config._locale.monthsParse(input, token, config._strict);
    // if we didn't find a month name, mark the date as invalid.
    if (month != null) {
      array[MONTH] = month;
    } else {
      getParsingFlags(config).invalidMonth = input;
    }
  });

  // LOCALES

  var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
  function localeMonths(m) {
    return this._months[m.month()];
  }

  var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
  function localeMonthsShort(m) {
    return this._monthsShort[m.month()];
  }

  function localeMonthsParse(monthName, format, strict) {
    var i, mom, regex;

    if (!this._monthsParse) {
      this._monthsParse = [];
      this._longMonthsParse = [];
      this._shortMonthsParse = [];
    }

    for (i = 0; i < 12; i++) {
      // make the regex if we don't have it already
      mom = create_utc__createUTC([2000, i]);
      if (strict && !this._longMonthsParse[i]) {
        this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
        this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
      }
      if (!strict && !this._monthsParse[i]) {
        regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
        this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
      }
      // test the regex
      if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
        return i;
      } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
        return i;
      } else if (!strict && this._monthsParse[i].test(monthName)) {
        return i;
      }
    }
  }

  // MOMENTS

  function setMonth(mom, value) {
    var dayOfMonth;

    // TODO: Move this out of here!
    if (typeof value === 'string') {
      value = mom.localeData().monthsParse(value);
      // TODO: Another silent failure?
      if (typeof value !== 'number') {
        return mom;
      }
    }

    dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
    mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
    return mom;
  }

  function getSetMonth(value) {
    if (value != null) {
      setMonth(this, value);
      utils_hooks__hooks.updateOffset(this, true);
      return this;
    } else {
      return get_set__get(this, 'Month');
    }
  }

  function getDaysInMonth() {
    return daysInMonth(this.year(), this.month());
  }

  function checkOverflow(m) {
    var overflow;
    var a = m._a;

    if (a && getParsingFlags(m).overflow === -2) {
      overflow =
      a[MONTH] < 0 || a[MONTH] > 11 ? MONTH :
      a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
      a[HOUR] < 0 || a[HOUR] > 24 || a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0) ? HOUR :
      a[MINUTE] < 0 || a[MINUTE] > 59 ? MINUTE :
      a[SECOND] < 0 || a[SECOND] > 59 ? SECOND :
      a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
      -1;

      if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
        overflow = DATE;
      }

      getParsingFlags(m).overflow = overflow;
    }

    return m;
  }

  function warn(msg) {
    if (utils_hooks__hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
      console.warn('Deprecation warning: ' + msg);
    }
  }

  function deprecate(msg, fn) {
    var firstTime = true;

    return extend(function () {
      if (firstTime) {
        warn(msg + '\n' + new Error().stack);
        firstTime = false;
      }
      return fn.apply(this, arguments);
    }, fn);
  }

  var deprecations = {};

  function deprecateSimple(name, msg) {
    if (!deprecations[name]) {
      warn(msg);
      deprecations[name] = true;
    }
  }

  utils_hooks__hooks.suppressDeprecationWarnings = false;

  var from_string__isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

  var isoDates = [
  ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
  ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
  ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
  ['GGGG-[W]WW', /\d{4}-W\d{2}/],
  ['YYYY-DDD', /\d{4}-\d{3}/]];


  // iso time formats and regexes
  var isoTimes = [
  ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
  ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
  ['HH:mm', /(T| )\d\d:\d\d/],
  ['HH', /(T| )\d\d/]];


  var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

  // date from iso format
  function configFromISO(config) {
    var i,l,
    string = config._i,
    match = from_string__isoRegex.exec(string);

    if (match) {
      getParsingFlags(config).iso = true;
      for (i = 0, l = isoDates.length; i < l; i++) {
        if (isoDates[i][1].exec(string)) {
          config._f = isoDates[i][0];
          break;
        }
      }
      for (i = 0, l = isoTimes.length; i < l; i++) {
        if (isoTimes[i][1].exec(string)) {
          // match[6] should be 'T' or space
          config._f += (match[6] || ' ') + isoTimes[i][0];
          break;
        }
      }
      if (string.match(matchOffset)) {
        config._f += 'Z';
      }
      configFromStringAndFormat(config);
    } else {
      config._isValid = false;
    }
  }

  // date from iso format or fallback
  function configFromString(config) {
    var matched = aspNetJsonRegex.exec(config._i);

    if (matched !== null) {
      config._d = new Date(+matched[1]);
      return;
    }

    configFromISO(config);
    if (config._isValid === false) {
      delete config._isValid;
      utils_hooks__hooks.createFromInputFallback(config);
    }
  }

  utils_hooks__hooks.createFromInputFallback = deprecate(
  'moment construction falls back to js Date. This is ' +
  'discouraged and will be removed in upcoming major ' +
  'release. Please refer to ' +
  'https://github.com/moment/moment/issues/1407 for more info.',
  function (config) {
    config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
  });


  function createDate(y, m, d, h, M, s, ms) {
    //can't just apply() to create a date:
    //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
    var date = new Date(y, m, d, h, M, s, ms);

    //the date constructor doesn't accept years < 1970
    if (y < 1970) {
      date.setFullYear(y);
    }
    return date;
  }

  function createUTCDate(y) {
    var date = new Date(Date.UTC.apply(null, arguments));
    if (y < 1970) {
      date.setUTCFullYear(y);
    }
    return date;
  }

  addFormatToken(0, ['YY', 2], 0, function () {
    return this.year() % 100;
  });

  addFormatToken(0, ['YYYY', 4], 0, 'year');
  addFormatToken(0, ['YYYYY', 5], 0, 'year');
  addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

  // ALIASES

  addUnitAlias('year', 'y');

  // PARSING

  addRegexToken('Y', matchSigned);
  addRegexToken('YY', match1to2, match2);
  addRegexToken('YYYY', match1to4, match4);
  addRegexToken('YYYYY', match1to6, match6);
  addRegexToken('YYYYYY', match1to6, match6);

  addParseToken(['YYYYY', 'YYYYYY'], YEAR);
  addParseToken('YYYY', function (input, array) {
    array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
  });
  addParseToken('YY', function (input, array) {
    array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
  });

  // HELPERS

  function daysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
  }

  function isLeapYear(year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  }

  // HOOKS

  utils_hooks__hooks.parseTwoDigitYear = function (input) {
    return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
  };

  // MOMENTS

  var getSetYear = makeGetSet('FullYear', false);

  function getIsLeapYear() {
    return isLeapYear(this.year());
  }

  addFormatToken('w', ['ww', 2], 'wo', 'week');
  addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

  // ALIASES

  addUnitAlias('week', 'w');
  addUnitAlias('isoWeek', 'W');

  // PARSING

  addRegexToken('w', match1to2);
  addRegexToken('ww', match1to2, match2);
  addRegexToken('W', match1to2);
  addRegexToken('WW', match1to2, match2);

  addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
    week[token.substr(0, 1)] = toInt(input);
  });

  // HELPERS

  // firstDayOfWeek       0 = sun, 6 = sat
  //                      the day of the week that starts the week
  //                      (usually sunday or monday)
  // firstDayOfWeekOfYear 0 = sun, 6 = sat
  //                      the first week is the week that contains the first
  //                      of this day of the week
  //                      (eg. ISO weeks use thursday (4))
  function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
    var end = firstDayOfWeekOfYear - firstDayOfWeek,
    daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
    adjustedMoment;


    if (daysToDayOfWeek > end) {
      daysToDayOfWeek -= 7;
    }

    if (daysToDayOfWeek < end - 7) {
      daysToDayOfWeek += 7;
    }

    adjustedMoment = local__createLocal(mom).add(daysToDayOfWeek, 'd');
    return {
      week: Math.ceil(adjustedMoment.dayOfYear() / 7),
      year: adjustedMoment.year() };

  }

  // LOCALES

  function localeWeek(mom) {
    return weekOfYear(mom, this._week.dow, this._week.doy).week;
  }

  var defaultLocaleWeek = {
    dow: 0, // Sunday is the first day of the week.
    doy: 6 // The week that contains Jan 1st is the first week of the year.
  };

  function localeFirstDayOfWeek() {
    return this._week.dow;
  }

  function localeFirstDayOfYear() {
    return this._week.doy;
  }

  // MOMENTS

  function getSetWeek(input) {
    var week = this.localeData().week(this);
    return input == null ? week : this.add((input - week) * 7, 'd');
  }

  function getSetISOWeek(input) {
    var week = weekOfYear(this, 1, 4).week;
    return input == null ? week : this.add((input - week) * 7, 'd');
  }

  addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

  // ALIASES

  addUnitAlias('dayOfYear', 'DDD');

  // PARSING

  addRegexToken('DDD', match1to3);
  addRegexToken('DDDD', match3);
  addParseToken(['DDD', 'DDDD'], function (input, array, config) {
    config._dayOfYear = toInt(input);
  });

  // HELPERS

  //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
  function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
    var week1Jan = 6 + firstDayOfWeek - firstDayOfWeekOfYear,janX = createUTCDate(year, 0, 1 + week1Jan),d = janX.getUTCDay(),dayOfYear;
    if (d < firstDayOfWeek) {
      d += 7;
    }

    weekday = weekday != null ? 1 * weekday : firstDayOfWeek;

    dayOfYear = 1 + week1Jan + 7 * (week - 1) - d + weekday;

    return {
      year: dayOfYear > 0 ? year : year - 1,
      dayOfYear: dayOfYear > 0 ? dayOfYear : daysInYear(year - 1) + dayOfYear };

  }

  // MOMENTS

  function getSetDayOfYear(input) {
    var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
    return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
  }

  // Pick the first defined of two or three arguments.
  function defaults(a, b, c) {
    if (a != null) {
      return a;
    }
    if (b != null) {
      return b;
    }
    return c;
  }

  function currentDateArray(config) {
    var now = new Date();
    if (config._useUTC) {
      return [now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()];
    }
    return [now.getFullYear(), now.getMonth(), now.getDate()];
  }

  // convert an array to a date.
  // the array should mirror the parameters below
  // note: all values past the year are optional and will default to the lowest possible value.
  // [year, month, day , hour, minute, second, millisecond]
  function configFromArray(config) {
    var i,date,input = [],currentDate,yearToUse;

    if (config._d) {
      return;
    }

    currentDate = currentDateArray(config);

    //compute day of the year from weeks and weekdays
    if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
      dayOfYearFromWeekInfo(config);
    }

    //if the day of the year is set, figure out what it is
    if (config._dayOfYear) {
      yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

      if (config._dayOfYear > daysInYear(yearToUse)) {
        getParsingFlags(config)._overflowDayOfYear = true;
      }

      date = createUTCDate(yearToUse, 0, config._dayOfYear);
      config._a[MONTH] = date.getUTCMonth();
      config._a[DATE] = date.getUTCDate();
    }

    // Default to current date.
    // * if no year, month, day of month are given, default to today
    // * if day of month is given, default month and year
    // * if month is given, default only year
    // * if year is given, don't default anything
    for (i = 0; i < 3 && config._a[i] == null; ++i) {
      config._a[i] = input[i] = currentDate[i];
    }

    // Zero out whatever was not defaulted, including time
    for (; i < 7; i++) {
      config._a[i] = input[i] = config._a[i] == null ? i === 2 ? 1 : 0 : config._a[i];
    }

    // Check for 24:00:00.000
    if (config._a[HOUR] === 24 &&
    config._a[MINUTE] === 0 &&
    config._a[SECOND] === 0 &&
    config._a[MILLISECOND] === 0) {
      config._nextDay = true;
      config._a[HOUR] = 0;
    }

    config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
    // Apply timezone offset from input. The actual utcOffset can be changed
    // with parseZone.
    if (config._tzm != null) {
      config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
    }

    if (config._nextDay) {
      config._a[HOUR] = 24;
    }
  }

  function dayOfYearFromWeekInfo(config) {
    var w, weekYear, week, weekday, dow, doy, temp;

    w = config._w;
    if (w.GG != null || w.W != null || w.E != null) {
      dow = 1;
      doy = 4;

      // TODO: We need to take the current isoWeekYear, but that depends on
      // how we interpret now (local, utc, fixed offset). So create
      // a now version of current config (take local/utc/offset flags, and
      // create now).
      weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
      week = defaults(w.W, 1);
      weekday = defaults(w.E, 1);
    } else {
      dow = config._locale._week.dow;
      doy = config._locale._week.doy;

      weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
      week = defaults(w.w, 1);

      if (w.d != null) {
        // weekday -- low day numbers are considered next week
        weekday = w.d;
        if (weekday < dow) {
          ++week;
        }
      } else if (w.e != null) {
        // local weekday -- counting starts from begining of week
        weekday = w.e + dow;
      } else {
        // default to begining of week
        weekday = dow;
      }
    }
    temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

    config._a[YEAR] = temp.year;
    config._dayOfYear = temp.dayOfYear;
  }

  utils_hooks__hooks.ISO_8601 = function () {};

  // date from string and format string
  function configFromStringAndFormat(config) {
    // TODO: Move this to another part of the creation flow to prevent circular deps
    if (config._f === utils_hooks__hooks.ISO_8601) {
      configFromISO(config);
      return;
    }

    config._a = [];
    getParsingFlags(config).empty = true;

    // This array is used to make a Date, either with `new Date` or `Date.UTC`
    var string = '' + config._i,
    i,parsedInput,tokens,token,skipped,
    stringLength = string.length,
    totalParsedInputLength = 0;

    tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

    for (i = 0; i < tokens.length; i++) {
      token = tokens[i];
      parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
      if (parsedInput) {
        skipped = string.substr(0, string.indexOf(parsedInput));
        if (skipped.length > 0) {
          getParsingFlags(config).unusedInput.push(skipped);
        }
        string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
        totalParsedInputLength += parsedInput.length;
      }
      // don't parse if it's not a known token
      if (formatTokenFunctions[token]) {
        if (parsedInput) {
          getParsingFlags(config).empty = false;
        } else
        {
          getParsingFlags(config).unusedTokens.push(token);
        }
        addTimeToArrayFromToken(token, parsedInput, config);
      } else
      if (config._strict && !parsedInput) {
        getParsingFlags(config).unusedTokens.push(token);
      }
    }

    // add remaining unparsed input length to the string
    getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
    if (string.length > 0) {
      getParsingFlags(config).unusedInput.push(string);
    }

    // clear _12h flag if hour is <= 12
    if (getParsingFlags(config).bigHour === true &&
    config._a[HOUR] <= 12 &&
    config._a[HOUR] > 0) {
      getParsingFlags(config).bigHour = undefined;
    }
    // handle meridiem
    config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

    configFromArray(config);
    checkOverflow(config);
  }


  function meridiemFixWrap(locale, hour, meridiem) {
    var isPm;

    if (meridiem == null) {
      // nothing to do
      return hour;
    }
    if (locale.meridiemHour != null) {
      return locale.meridiemHour(hour, meridiem);
    } else if (locale.isPM != null) {
      // Fallback
      isPm = locale.isPM(meridiem);
      if (isPm && hour < 12) {
        hour += 12;
      }
      if (!isPm && hour === 12) {
        hour = 0;
      }
      return hour;
    } else {
      // this is not supposed to happen
      return hour;
    }
  }

  function configFromStringAndArray(config) {
    var tempConfig,
    bestMoment,

    scoreToBeat,
    i,
    currentScore;

    if (config._f.length === 0) {
      getParsingFlags(config).invalidFormat = true;
      config._d = new Date(NaN);
      return;
    }

    for (i = 0; i < config._f.length; i++) {
      currentScore = 0;
      tempConfig = copyConfig({}, config);
      if (config._useUTC != null) {
        tempConfig._useUTC = config._useUTC;
      }
      tempConfig._f = config._f[i];
      configFromStringAndFormat(tempConfig);

      if (!valid__isValid(tempConfig)) {
        continue;
      }

      // if there is any input that was not parsed add a penalty for that format
      currentScore += getParsingFlags(tempConfig).charsLeftOver;

      //or tokens
      currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

      getParsingFlags(tempConfig).score = currentScore;

      if (scoreToBeat == null || currentScore < scoreToBeat) {
        scoreToBeat = currentScore;
        bestMoment = tempConfig;
      }
    }

    extend(config, bestMoment || tempConfig);
  }

  function configFromObject(config) {
    if (config._d) {
      return;
    }

    var i = normalizeObjectUnits(config._i);
    config._a = [i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond];

    configFromArray(config);
  }

  function createFromConfig(config) {
    var res = new Moment(checkOverflow(prepareConfig(config)));
    if (res._nextDay) {
      // Adding is smart enough around DST
      res.add(1, 'd');
      res._nextDay = undefined;
    }

    return res;
  }

  function prepareConfig(config) {
    var input = config._i,
    format = config._f;

    config._locale = config._locale || locale_locales__getLocale(config._l);

    if (input === null || format === undefined && input === '') {
      return valid__createInvalid({ nullInput: true });
    }

    if (typeof input === 'string') {
      config._i = input = config._locale.preparse(input);
    }

    if (isMoment(input)) {
      return new Moment(checkOverflow(input));
    } else if (isArray(format)) {
      configFromStringAndArray(config);
    } else if (format) {
      configFromStringAndFormat(config);
    } else if (isDate(input)) {
      config._d = input;
    } else {
      configFromInput(config);
    }

    return config;
  }

  function configFromInput(config) {
    var input = config._i;
    if (input === undefined) {
      config._d = new Date();
    } else if (isDate(input)) {
      config._d = new Date(+input);
    } else if (typeof input === 'string') {
      configFromString(config);
    } else if (isArray(input)) {
      config._a = map(input.slice(0), function (obj) {
        return parseInt(obj, 10);
      });
      configFromArray(config);
    } else if (typeof input === 'object') {
      configFromObject(config);
    } else if (typeof input === 'number') {
      // from milliseconds
      config._d = new Date(input);
    } else {
      utils_hooks__hooks.createFromInputFallback(config);
    }
  }

  function createLocalOrUTC(input, format, locale, strict, isUTC) {
    var c = {};

    if (typeof locale === 'boolean') {
      strict = locale;
      locale = undefined;
    }
    // object construction must be done this way.
    // https://github.com/moment/moment/issues/1423
    c._isAMomentObject = true;
    c._useUTC = c._isUTC = isUTC;
    c._l = locale;
    c._i = input;
    c._f = format;
    c._strict = strict;

    return createFromConfig(c);
  }

  function local__createLocal(input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, false);
  }

  var prototypeMin = deprecate(
  'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
  function () {
    var other = local__createLocal.apply(null, arguments);
    return other < this ? this : other;
  });


  var prototypeMax = deprecate(
  'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
  function () {
    var other = local__createLocal.apply(null, arguments);
    return other > this ? this : other;
  });


  // Pick a moment m from moments so that m[fn](other) is true for all
  // other. This relies on the function fn to be transitive.
  //
  // moments should either be an array of moment objects or an array, whose
  // first element is an array of moment objects.
  function pickBy(fn, moments) {
    var res, i;
    if (moments.length === 1 && isArray(moments[0])) {
      moments = moments[0];
    }
    if (!moments.length) {
      return local__createLocal();
    }
    res = moments[0];
    for (i = 1; i < moments.length; ++i) {
      if (!moments[i].isValid() || moments[i][fn](res)) {
        res = moments[i];
      }
    }
    return res;
  }

  // TODO: Use [].sort instead?
  function min() {
    var args = [].slice.call(arguments, 0);

    return pickBy('isBefore', args);
  }

  function max() {
    var args = [].slice.call(arguments, 0);

    return pickBy('isAfter', args);
  }

  function Duration(duration) {
    var normalizedInput = normalizeObjectUnits(duration),
    years = normalizedInput.year || 0,
    quarters = normalizedInput.quarter || 0,
    months = normalizedInput.month || 0,
    weeks = normalizedInput.week || 0,
    days = normalizedInput.day || 0,
    hours = normalizedInput.hour || 0,
    minutes = normalizedInput.minute || 0,
    seconds = normalizedInput.second || 0,
    milliseconds = normalizedInput.millisecond || 0;

    // representation for dateAddRemove
    this._milliseconds = +milliseconds +
    seconds * 1e3 + // 1000
    minutes * 6e4 + // 1000 * 60
    hours * 36e5; // 1000 * 60 * 60
    // Because of dateAddRemove treats 24 hours as different from a
    // day when working around DST, we need to store them separately
    this._days = +days +
    weeks * 7;
    // It is impossible translate months into days without knowing
    // which months you are are talking about, so we have to store
    // it separately.
    this._months = +months +
    quarters * 3 +
    years * 12;

    this._data = {};

    this._locale = locale_locales__getLocale();

    this._bubble();
  }

  function isDuration(obj) {
    return obj instanceof Duration;
  }

  function offset(token, separator) {
    addFormatToken(token, 0, 0, function () {
      var offset = this.utcOffset();
      var sign = '+';
      if (offset < 0) {
        offset = -offset;
        sign = '-';
      }
      return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~offset % 60, 2);
    });
  }

  offset('Z', ':');
  offset('ZZ', '');

  // PARSING

  addRegexToken('Z', matchOffset);
  addRegexToken('ZZ', matchOffset);
  addParseToken(['Z', 'ZZ'], function (input, array, config) {
    config._useUTC = true;
    config._tzm = offsetFromString(input);
  });

  // HELPERS

  // timezone chunker
  // '+10:00' > ['10',  '00']
  // '-1530'  > ['-15', '30']
  var chunkOffset = /([\+\-]|\d\d)/gi;

  function offsetFromString(string) {
    var matches = (string || '').match(matchOffset) || [];
    var chunk = matches[matches.length - 1] || [];
    var parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
    var minutes = +(parts[1] * 60) + toInt(parts[2]);

    return parts[0] === '+' ? minutes : -minutes;
  }

  // Return a moment from input, that is local/utc/zone equivalent to model.
  function cloneWithOffset(input, model) {
    var res, diff;
    if (model._isUTC) {
      res = model.clone();
      diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - +res;
      // Use low-level api, because this fn is low-level api.
      res._d.setTime(+res._d + diff);
      utils_hooks__hooks.updateOffset(res, false);
      return res;
    } else {
      return local__createLocal(input).local();
    }
  }

  function getDateOffset(m) {
    // On Firefox.24 Date#getTimezoneOffset returns a floating point.
    // https://github.com/moment/moment/pull/1871
    return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
  }

  // HOOKS

  // This function will be called whenever a moment is mutated.
  // It is intended to keep the offset in sync with the timezone.
  utils_hooks__hooks.updateOffset = function () {};

  // MOMENTS

  // keepLocalTime = true means only change the timezone, without
  // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
  // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
  // +0200, so we adjust the time as needed, to be valid.
  //
  // Keeping the time actually adds/subtracts (one hour)
  // from the actual represented time. That is why we call updateOffset
  // a second time. In case it wants us to change the offset again
  // _changeInProgress == true case, then we have to adjust, because
  // there is no such time in the given timezone.
  function getSetOffset(input, keepLocalTime) {
    var offset = this._offset || 0,
    localAdjust;
    if (input != null) {
      if (typeof input === 'string') {
        input = offsetFromString(input);
      }
      if (Math.abs(input) < 16) {
        input = input * 60;
      }
      if (!this._isUTC && keepLocalTime) {
        localAdjust = getDateOffset(this);
      }
      this._offset = input;
      this._isUTC = true;
      if (localAdjust != null) {
        this.add(localAdjust, 'm');
      }
      if (offset !== input) {
        if (!keepLocalTime || this._changeInProgress) {
          add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
        } else if (!this._changeInProgress) {
          this._changeInProgress = true;
          utils_hooks__hooks.updateOffset(this, true);
          this._changeInProgress = null;
        }
      }
      return this;
    } else {
      return this._isUTC ? offset : getDateOffset(this);
    }
  }

  function getSetZone(input, keepLocalTime) {
    if (input != null) {
      if (typeof input !== 'string') {
        input = -input;
      }

      this.utcOffset(input, keepLocalTime);

      return this;
    } else {
      return -this.utcOffset();
    }
  }

  function setOffsetToUTC(keepLocalTime) {
    return this.utcOffset(0, keepLocalTime);
  }

  function setOffsetToLocal(keepLocalTime) {
    if (this._isUTC) {
      this.utcOffset(0, keepLocalTime);
      this._isUTC = false;

      if (keepLocalTime) {
        this.subtract(getDateOffset(this), 'm');
      }
    }
    return this;
  }

  function setOffsetToParsedOffset() {
    if (this._tzm) {
      this.utcOffset(this._tzm);
    } else if (typeof this._i === 'string') {
      this.utcOffset(offsetFromString(this._i));
    }
    return this;
  }

  function hasAlignedHourOffset(input) {
    input = input ? local__createLocal(input).utcOffset() : 0;

    return (this.utcOffset() - input) % 60 === 0;
  }

  function isDaylightSavingTime() {
    return (
      this.utcOffset() > this.clone().month(0).utcOffset() ||
      this.utcOffset() > this.clone().month(5).utcOffset());

  }

  function isDaylightSavingTimeShifted() {
    if (typeof this._isDSTShifted !== 'undefined') {
      return this._isDSTShifted;
    }

    var c = {};

    copyConfig(c, this);
    c = prepareConfig(c);

    if (c._a) {
      var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
      this._isDSTShifted = this.isValid() &&
      compareArrays(c._a, other.toArray()) > 0;
    } else {
      this._isDSTShifted = false;
    }

    return this._isDSTShifted;
  }

  function isLocal() {
    return !this._isUTC;
  }

  function isUtcOffset() {
    return this._isUTC;
  }

  function isUtc() {
    return this._isUTC && this._offset === 0;
  }

  var aspNetRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;

  // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
  // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
  var create__isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;

  function create__createDuration(input, key) {
    var duration = input,
    // matching against regexp is expensive, do it on demand
    match = null,
    sign,
    ret,
    diffRes;

    if (isDuration(input)) {
      duration = {
        ms: input._milliseconds,
        d: input._days,
        M: input._months };

    } else if (typeof input === 'number') {
      duration = {};
      if (key) {
        duration[key] = input;
      } else {
        duration.milliseconds = input;
      }
    } else if (!!(match = aspNetRegex.exec(input))) {
      sign = match[1] === '-' ? -1 : 1;
      duration = {
        y: 0,
        d: toInt(match[DATE]) * sign,
        h: toInt(match[HOUR]) * sign,
        m: toInt(match[MINUTE]) * sign,
        s: toInt(match[SECOND]) * sign,
        ms: toInt(match[MILLISECOND]) * sign };

    } else if (!!(match = create__isoRegex.exec(input))) {
      sign = match[1] === '-' ? -1 : 1;
      duration = {
        y: parseIso(match[2], sign),
        M: parseIso(match[3], sign),
        d: parseIso(match[4], sign),
        h: parseIso(match[5], sign),
        m: parseIso(match[6], sign),
        s: parseIso(match[7], sign),
        w: parseIso(match[8], sign) };

    } else if (duration == null) {// checks for null or undefined
      duration = {};
    } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
      diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

      duration = {};
      duration.ms = diffRes.milliseconds;
      duration.M = diffRes.months;
    }

    ret = new Duration(duration);

    if (isDuration(input) && hasOwnProp(input, '_locale')) {
      ret._locale = input._locale;
    }

    return ret;
  }

  create__createDuration.fn = Duration.prototype;

  function parseIso(inp, sign) {
    // We'd normally use ~~inp for this, but unfortunately it also
    // converts floats to ints.
    // inp may be undefined, so careful calling replace on it.
    var res = inp && parseFloat(inp.replace(',', '.'));
    // apply sign while we're at it
    return (isNaN(res) ? 0 : res) * sign;
  }

  function positiveMomentsDifference(base, other) {
    var res = { milliseconds: 0, months: 0 };

    res.months = other.month() - base.month() +
    (other.year() - base.year()) * 12;
    if (base.clone().add(res.months, 'M').isAfter(other)) {
      --res.months;
    }

    res.milliseconds = +other - +base.clone().add(res.months, 'M');

    return res;
  }

  function momentsDifference(base, other) {
    var res;
    other = cloneWithOffset(other, base);
    if (base.isBefore(other)) {
      res = positiveMomentsDifference(base, other);
    } else {
      res = positiveMomentsDifference(other, base);
      res.milliseconds = -res.milliseconds;
      res.months = -res.months;
    }

    return res;
  }

  function createAdder(direction, name) {
    return function (val, period) {
      var dur, tmp;
      //invert the arguments, but complain about it
      if (period !== null && !isNaN(+period)) {
        deprecateSimple(name, 'moment().' + name + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
        tmp = val;val = period;period = tmp;
      }

      val = typeof val === 'string' ? +val : val;
      dur = create__createDuration(val, period);
      add_subtract__addSubtract(this, dur, direction);
      return this;
    };
  }

  function add_subtract__addSubtract(mom, duration, isAdding, updateOffset) {
    var milliseconds = duration._milliseconds,
    days = duration._days,
    months = duration._months;
    updateOffset = updateOffset == null ? true : updateOffset;

    if (milliseconds) {
      mom._d.setTime(+mom._d + milliseconds * isAdding);
    }
    if (days) {
      get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
    }
    if (months) {
      setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
    }
    if (updateOffset) {
      utils_hooks__hooks.updateOffset(mom, days || months);
    }
  }

  var add_subtract__add = createAdder(1, 'add');
  var add_subtract__subtract = createAdder(-1, 'subtract');

  function moment_calendar__calendar(time, formats) {
    // We want to compare the start of today, vs this.
    // Getting start-of-today depends on whether we're local/utc/offset or not.
    var now = time || local__createLocal(),
    sod = cloneWithOffset(now, this).startOf('day'),
    diff = this.diff(sod, 'days', true),
    format = diff < -6 ? 'sameElse' :
    diff < -1 ? 'lastWeek' :
    diff < 0 ? 'lastDay' :
    diff < 1 ? 'sameDay' :
    diff < 2 ? 'nextDay' :
    diff < 7 ? 'nextWeek' : 'sameElse';
    return this.format(formats && formats[format] || this.localeData().calendar(format, this, local__createLocal(now)));
  }

  function clone() {
    return new Moment(this);
  }

  function isAfter(input, units) {
    var inputMs;
    units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
    if (units === 'millisecond') {
      input = isMoment(input) ? input : local__createLocal(input);
      return +this > +input;
    } else {
      inputMs = isMoment(input) ? +input : +local__createLocal(input);
      return inputMs < +this.clone().startOf(units);
    }
  }

  function isBefore(input, units) {
    var inputMs;
    units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
    if (units === 'millisecond') {
      input = isMoment(input) ? input : local__createLocal(input);
      return +this < +input;
    } else {
      inputMs = isMoment(input) ? +input : +local__createLocal(input);
      return +this.clone().endOf(units) < inputMs;
    }
  }

  function isBetween(from, to, units) {
    return this.isAfter(from, units) && this.isBefore(to, units);
  }

  function isSame(input, units) {
    var inputMs;
    units = normalizeUnits(units || 'millisecond');
    if (units === 'millisecond') {
      input = isMoment(input) ? input : local__createLocal(input);
      return +this === +input;
    } else {
      inputMs = +local__createLocal(input);
      return +this.clone().startOf(units) <= inputMs && inputMs <= +this.clone().endOf(units);
    }
  }

  function diff(input, units, asFloat) {
    var that = cloneWithOffset(input, this),
    zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4,
    delta,output;

    units = normalizeUnits(units);

    if (units === 'year' || units === 'month' || units === 'quarter') {
      output = monthDiff(this, that);
      if (units === 'quarter') {
        output = output / 3;
      } else if (units === 'year') {
        output = output / 12;
      }
    } else {
      delta = this - that;
      output = units === 'second' ? delta / 1e3 : // 1000
      units === 'minute' ? delta / 6e4 : // 1000 * 60
      units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
      units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
      units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
      delta;
    }
    return asFloat ? output : absFloor(output);
  }

  function monthDiff(a, b) {
    // difference in months
    var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),
    // b is in (anchor - 1 month, anchor + 1 month)
    anchor = a.clone().add(wholeMonthDiff, 'months'),
    anchor2,adjust;

    if (b - anchor < 0) {
      anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
      // linear across the month
      adjust = (b - anchor) / (anchor - anchor2);
    } else {
      anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
      // linear across the month
      adjust = (b - anchor) / (anchor2 - anchor);
    }

    return -(wholeMonthDiff + adjust);
  }

  utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

  function toString() {
    return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
  }

  function moment_format__toISOString() {
    var m = this.clone().utc();
    if (0 < m.year() && m.year() <= 9999) {
      if ('function' === typeof Date.prototype.toISOString) {
        // native implementation is ~50x faster, use it when we can
        return this.toDate().toISOString();
      } else {
        return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
      }
    } else {
      return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }
  }

  function format(inputString) {
    var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
    return this.localeData().postformat(output);
  }

  function from(time, withoutSuffix) {
    if (!this.isValid()) {
      return this.localeData().invalidDate();
    }
    return create__createDuration({ to: this, from: time }).locale(this.locale()).humanize(!withoutSuffix);
  }

  function fromNow(withoutSuffix) {
    return this.from(local__createLocal(), withoutSuffix);
  }

  function to(time, withoutSuffix) {
    if (!this.isValid()) {
      return this.localeData().invalidDate();
    }
    return create__createDuration({ from: this, to: time }).locale(this.locale()).humanize(!withoutSuffix);
  }

  function toNow(withoutSuffix) {
    return this.to(local__createLocal(), withoutSuffix);
  }

  function locale(key) {
    var newLocaleData;

    if (key === undefined) {
      return this._locale._abbr;
    } else {
      newLocaleData = locale_locales__getLocale(key);
      if (newLocaleData != null) {
        this._locale = newLocaleData;
      }
      return this;
    }
  }

  var lang = deprecate(
  'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
  function (key) {
    if (key === undefined) {
      return this.localeData();
    } else {
      return this.locale(key);
    }
  });


  function localeData() {
    return this._locale;
  }

  function startOf(units) {
    units = normalizeUnits(units);
    // the following switch intentionally omits break keywords
    // to utilize falling through the cases.
    switch (units) {
      case 'year':
        this.month(0);
      /* falls through */
      case 'quarter':
      case 'month':
        this.date(1);
      /* falls through */
      case 'week':
      case 'isoWeek':
      case 'day':
        this.hours(0);
      /* falls through */
      case 'hour':
        this.minutes(0);
      /* falls through */
      case 'minute':
        this.seconds(0);
      /* falls through */
      case 'second':
        this.milliseconds(0);}


    // weeks are a special case
    if (units === 'week') {
      this.weekday(0);
    }
    if (units === 'isoWeek') {
      this.isoWeekday(1);
    }

    // quarters are also special
    if (units === 'quarter') {
      this.month(Math.floor(this.month() / 3) * 3);
    }

    return this;
  }

  function endOf(units) {
    units = normalizeUnits(units);
    if (units === undefined || units === 'millisecond') {
      return this;
    }
    return this.startOf(units).add(1, units === 'isoWeek' ? 'week' : units).subtract(1, 'ms');
  }

  function to_type__valueOf() {
    return +this._d - (this._offset || 0) * 60000;
  }

  function unix() {
    return Math.floor(+this / 1000);
  }

  function toDate() {
    return this._offset ? new Date(+this) : this._d;
  }

  function toArray() {
    var m = this;
    return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
  }

  function toObject() {
    var m = this;
    return {
      years: m.year(),
      months: m.month(),
      date: m.date(),
      hours: m.hours(),
      minutes: m.minutes(),
      seconds: m.seconds(),
      milliseconds: m.milliseconds() };

  }

  function moment_valid__isValid() {
    return valid__isValid(this);
  }

  function parsingFlags() {
    return extend({}, getParsingFlags(this));
  }

  function invalidAt() {
    return getParsingFlags(this).overflow;
  }

  addFormatToken(0, ['gg', 2], 0, function () {
    return this.weekYear() % 100;
  });

  addFormatToken(0, ['GG', 2], 0, function () {
    return this.isoWeekYear() % 100;
  });

  function addWeekYearFormatToken(token, getter) {
    addFormatToken(0, [token, token.length], 0, getter);
  }

  addWeekYearFormatToken('gggg', 'weekYear');
  addWeekYearFormatToken('ggggg', 'weekYear');
  addWeekYearFormatToken('GGGG', 'isoWeekYear');
  addWeekYearFormatToken('GGGGG', 'isoWeekYear');

  // ALIASES

  addUnitAlias('weekYear', 'gg');
  addUnitAlias('isoWeekYear', 'GG');

  // PARSING

  addRegexToken('G', matchSigned);
  addRegexToken('g', matchSigned);
  addRegexToken('GG', match1to2, match2);
  addRegexToken('gg', match1to2, match2);
  addRegexToken('GGGG', match1to4, match4);
  addRegexToken('gggg', match1to4, match4);
  addRegexToken('GGGGG', match1to6, match6);
  addRegexToken('ggggg', match1to6, match6);

  addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
    week[token.substr(0, 2)] = toInt(input);
  });

  addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
    week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
  });

  // HELPERS

  function weeksInYear(year, dow, doy) {
    return weekOfYear(local__createLocal([year, 11, 31 + dow - doy]), dow, doy).week;
  }

  // MOMENTS

  function getSetWeekYear(input) {
    var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
    return input == null ? year : this.add(input - year, 'y');
  }

  function getSetISOWeekYear(input) {
    var year = weekOfYear(this, 1, 4).year;
    return input == null ? year : this.add(input - year, 'y');
  }

  function getISOWeeksInYear() {
    return weeksInYear(this.year(), 1, 4);
  }

  function getWeeksInYear() {
    var weekInfo = this.localeData()._week;
    return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
  }

  addFormatToken('Q', 0, 0, 'quarter');

  // ALIASES

  addUnitAlias('quarter', 'Q');

  // PARSING

  addRegexToken('Q', match1);
  addParseToken('Q', function (input, array) {
    array[MONTH] = (toInt(input) - 1) * 3;
  });

  // MOMENTS

  function getSetQuarter(input) {
    return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
  }

  addFormatToken('D', ['DD', 2], 'Do', 'date');

  // ALIASES

  addUnitAlias('date', 'D');

  // PARSING

  addRegexToken('D', match1to2);
  addRegexToken('DD', match1to2, match2);
  addRegexToken('Do', function (isStrict, locale) {
    return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
  });

  addParseToken(['D', 'DD'], DATE);
  addParseToken('Do', function (input, array) {
    array[DATE] = toInt(input.match(match1to2)[0], 10);
  });

  // MOMENTS

  var getSetDayOfMonth = makeGetSet('Date', true);

  addFormatToken('d', 0, 'do', 'day');

  addFormatToken('dd', 0, 0, function (format) {
    return this.localeData().weekdaysMin(this, format);
  });

  addFormatToken('ddd', 0, 0, function (format) {
    return this.localeData().weekdaysShort(this, format);
  });

  addFormatToken('dddd', 0, 0, function (format) {
    return this.localeData().weekdays(this, format);
  });

  addFormatToken('e', 0, 0, 'weekday');
  addFormatToken('E', 0, 0, 'isoWeekday');

  // ALIASES

  addUnitAlias('day', 'd');
  addUnitAlias('weekday', 'e');
  addUnitAlias('isoWeekday', 'E');

  // PARSING

  addRegexToken('d', match1to2);
  addRegexToken('e', match1to2);
  addRegexToken('E', match1to2);
  addRegexToken('dd', matchWord);
  addRegexToken('ddd', matchWord);
  addRegexToken('dddd', matchWord);

  addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config) {
    var weekday = config._locale.weekdaysParse(input);
    // if we didn't get a weekday name, mark the date as invalid
    if (weekday != null) {
      week.d = weekday;
    } else {
      getParsingFlags(config).invalidWeekday = input;
    }
  });

  addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
    week[token] = toInt(input);
  });

  // HELPERS

  function parseWeekday(input, locale) {
    if (typeof input !== 'string') {
      return input;
    }

    if (!isNaN(input)) {
      return parseInt(input, 10);
    }

    input = locale.weekdaysParse(input);
    if (typeof input === 'number') {
      return input;
    }

    return null;
  }

  // LOCALES

  var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
  function localeWeekdays(m) {
    return this._weekdays[m.day()];
  }

  var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
  function localeWeekdaysShort(m) {
    return this._weekdaysShort[m.day()];
  }

  var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
  function localeWeekdaysMin(m) {
    return this._weekdaysMin[m.day()];
  }

  function localeWeekdaysParse(weekdayName) {
    var i, mom, regex;

    this._weekdaysParse = this._weekdaysParse || [];

    for (i = 0; i < 7; i++) {
      // make the regex if we don't have it already
      if (!this._weekdaysParse[i]) {
        mom = local__createLocal([2000, 1]).day(i);
        regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
        this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
      }
      // test the regex
      if (this._weekdaysParse[i].test(weekdayName)) {
        return i;
      }
    }
  }

  // MOMENTS

  function getSetDayOfWeek(input) {
    var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
    if (input != null) {
      input = parseWeekday(input, this.localeData());
      return this.add(input - day, 'd');
    } else {
      return day;
    }
  }

  function getSetLocaleDayOfWeek(input) {
    var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
    return input == null ? weekday : this.add(input - weekday, 'd');
  }

  function getSetISODayOfWeek(input) {
    // behaves the same as moment#day except
    // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
    // as a setter, sunday should belong to the previous week.
    return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
  }

  addFormatToken('H', ['HH', 2], 0, 'hour');
  addFormatToken('h', ['hh', 2], 0, function () {
    return this.hours() % 12 || 12;
  });

  function meridiem(token, lowercase) {
    addFormatToken(token, 0, 0, function () {
      return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
    });
  }

  meridiem('a', true);
  meridiem('A', false);

  // ALIASES

  addUnitAlias('hour', 'h');

  // PARSING

  function matchMeridiem(isStrict, locale) {
    return locale._meridiemParse;
  }

  addRegexToken('a', matchMeridiem);
  addRegexToken('A', matchMeridiem);
  addRegexToken('H', match1to2);
  addRegexToken('h', match1to2);
  addRegexToken('HH', match1to2, match2);
  addRegexToken('hh', match1to2, match2);

  addParseToken(['H', 'HH'], HOUR);
  addParseToken(['a', 'A'], function (input, array, config) {
    config._isPm = config._locale.isPM(input);
    config._meridiem = input;
  });
  addParseToken(['h', 'hh'], function (input, array, config) {
    array[HOUR] = toInt(input);
    getParsingFlags(config).bigHour = true;
  });

  // LOCALES

  function localeIsPM(input) {
    // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
    // Using charAt should be more compatible.
    return (input + '').toLowerCase().charAt(0) === 'p';
  }

  var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
  function localeMeridiem(hours, minutes, isLower) {
    if (hours > 11) {
      return isLower ? 'pm' : 'PM';
    } else {
      return isLower ? 'am' : 'AM';
    }
  }


  // MOMENTS

  // Setting the hour should keep the time, because the user explicitly
  // specified which hour he wants. So trying to maintain the same hour (in
  // a new timezone) makes sense. Adding/subtracting hours does not follow
  // this rule.
  var getSetHour = makeGetSet('Hours', true);

  addFormatToken('m', ['mm', 2], 0, 'minute');

  // ALIASES

  addUnitAlias('minute', 'm');

  // PARSING

  addRegexToken('m', match1to2);
  addRegexToken('mm', match1to2, match2);
  addParseToken(['m', 'mm'], MINUTE);

  // MOMENTS

  var getSetMinute = makeGetSet('Minutes', false);

  addFormatToken('s', ['ss', 2], 0, 'second');

  // ALIASES

  addUnitAlias('second', 's');

  // PARSING

  addRegexToken('s', match1to2);
  addRegexToken('ss', match1to2, match2);
  addParseToken(['s', 'ss'], SECOND);

  // MOMENTS

  var getSetSecond = makeGetSet('Seconds', false);

  addFormatToken('S', 0, 0, function () {
    return ~~(this.millisecond() / 100);
  });

  addFormatToken(0, ['SS', 2], 0, function () {
    return ~~(this.millisecond() / 10);
  });

  addFormatToken(0, ['SSS', 3], 0, 'millisecond');
  addFormatToken(0, ['SSSS', 4], 0, function () {
    return this.millisecond() * 10;
  });
  addFormatToken(0, ['SSSSS', 5], 0, function () {
    return this.millisecond() * 100;
  });
  addFormatToken(0, ['SSSSSS', 6], 0, function () {
    return this.millisecond() * 1000;
  });
  addFormatToken(0, ['SSSSSSS', 7], 0, function () {
    return this.millisecond() * 10000;
  });
  addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
    return this.millisecond() * 100000;
  });
  addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
    return this.millisecond() * 1000000;
  });


  // ALIASES

  addUnitAlias('millisecond', 'ms');

  // PARSING

  addRegexToken('S', match1to3, match1);
  addRegexToken('SS', match1to3, match2);
  addRegexToken('SSS', match1to3, match3);

  var token;
  for (token = 'SSSS'; token.length <= 9; token += 'S') {
    addRegexToken(token, matchUnsigned);
  }

  function parseMs(input, array) {
    array[MILLISECOND] = toInt(('0.' + input) * 1000);
  }

  for (token = 'S'; token.length <= 9; token += 'S') {
    addParseToken(token, parseMs);
  }
  // MOMENTS

  var getSetMillisecond = makeGetSet('Milliseconds', false);

  addFormatToken('z', 0, 0, 'zoneAbbr');
  addFormatToken('zz', 0, 0, 'zoneName');

  // MOMENTS

  function getZoneAbbr() {
    return this._isUTC ? 'UTC' : '';
  }

  function getZoneName() {
    return this._isUTC ? 'Coordinated Universal Time' : '';
  }

  var momentPrototype__proto = Moment.prototype;

  momentPrototype__proto.add = add_subtract__add;
  momentPrototype__proto.calendar = moment_calendar__calendar;
  momentPrototype__proto.clone = clone;
  momentPrototype__proto.diff = diff;
  momentPrototype__proto.endOf = endOf;
  momentPrototype__proto.format = format;
  momentPrototype__proto.from = from;
  momentPrototype__proto.fromNow = fromNow;
  momentPrototype__proto.to = to;
  momentPrototype__proto.toNow = toNow;
  momentPrototype__proto.get = getSet;
  momentPrototype__proto.invalidAt = invalidAt;
  momentPrototype__proto.isAfter = isAfter;
  momentPrototype__proto.isBefore = isBefore;
  momentPrototype__proto.isBetween = isBetween;
  momentPrototype__proto.isSame = isSame;
  momentPrototype__proto.isValid = moment_valid__isValid;
  momentPrototype__proto.lang = lang;
  momentPrototype__proto.locale = locale;
  momentPrototype__proto.localeData = localeData;
  momentPrototype__proto.max = prototypeMax;
  momentPrototype__proto.min = prototypeMin;
  momentPrototype__proto.parsingFlags = parsingFlags;
  momentPrototype__proto.set = getSet;
  momentPrototype__proto.startOf = startOf;
  momentPrototype__proto.subtract = add_subtract__subtract;
  momentPrototype__proto.toArray = toArray;
  momentPrototype__proto.toObject = toObject;
  momentPrototype__proto.toDate = toDate;
  momentPrototype__proto.toISOString = moment_format__toISOString;
  momentPrototype__proto.toJSON = moment_format__toISOString;
  momentPrototype__proto.toString = toString;
  momentPrototype__proto.unix = unix;
  momentPrototype__proto.valueOf = to_type__valueOf;

  // Year
  momentPrototype__proto.year = getSetYear;
  momentPrototype__proto.isLeapYear = getIsLeapYear;

  // Week Year
  momentPrototype__proto.weekYear = getSetWeekYear;
  momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

  // Quarter
  momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

  // Month
  momentPrototype__proto.month = getSetMonth;
  momentPrototype__proto.daysInMonth = getDaysInMonth;

  // Week
  momentPrototype__proto.week = momentPrototype__proto.weeks = getSetWeek;
  momentPrototype__proto.isoWeek = momentPrototype__proto.isoWeeks = getSetISOWeek;
  momentPrototype__proto.weeksInYear = getWeeksInYear;
  momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

  // Day
  momentPrototype__proto.date = getSetDayOfMonth;
  momentPrototype__proto.day = momentPrototype__proto.days = getSetDayOfWeek;
  momentPrototype__proto.weekday = getSetLocaleDayOfWeek;
  momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
  momentPrototype__proto.dayOfYear = getSetDayOfYear;

  // Hour
  momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

  // Minute
  momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

  // Second
  momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

  // Millisecond
  momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

  // Offset
  momentPrototype__proto.utcOffset = getSetOffset;
  momentPrototype__proto.utc = setOffsetToUTC;
  momentPrototype__proto.local = setOffsetToLocal;
  momentPrototype__proto.parseZone = setOffsetToParsedOffset;
  momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
  momentPrototype__proto.isDST = isDaylightSavingTime;
  momentPrototype__proto.isDSTShifted = isDaylightSavingTimeShifted;
  momentPrototype__proto.isLocal = isLocal;
  momentPrototype__proto.isUtcOffset = isUtcOffset;
  momentPrototype__proto.isUtc = isUtc;
  momentPrototype__proto.isUTC = isUtc;

  // Timezone
  momentPrototype__proto.zoneAbbr = getZoneAbbr;
  momentPrototype__proto.zoneName = getZoneName;

  // Deprecations
  momentPrototype__proto.dates = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
  momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
  momentPrototype__proto.years = deprecate('years accessor is deprecated. Use year instead', getSetYear);
  momentPrototype__proto.zone = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

  var momentPrototype = momentPrototype__proto;

  function moment__createUnix(input) {
    return local__createLocal(input * 1000);
  }

  function moment__createInZone() {
    return local__createLocal.apply(null, arguments).parseZone();
  }

  var defaultCalendar = {
    sameDay: '[Today at] LT',
    nextDay: '[Tomorrow at] LT',
    nextWeek: 'dddd [at] LT',
    lastDay: '[Yesterday at] LT',
    lastWeek: '[Last] dddd [at] LT',
    sameElse: 'L' };


  function locale_calendar__calendar(key, mom, now) {
    var output = this._calendar[key];
    return typeof output === 'function' ? output.call(mom, now) : output;
  }

  var defaultLongDateFormat = {
    LTS: 'h:mm:ss A',
    LT: 'h:mm A',
    L: 'MM/DD/YYYY',
    LL: 'MMMM D, YYYY',
    LLL: 'MMMM D, YYYY h:mm A',
    LLLL: 'dddd, MMMM D, YYYY h:mm A' };


  function longDateFormat(key) {
    var format = this._longDateFormat[key],
    formatUpper = this._longDateFormat[key.toUpperCase()];

    if (format || !formatUpper) {
      return format;
    }

    this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
      return val.slice(1);
    });

    return this._longDateFormat[key];
  }

  var defaultInvalidDate = 'Invalid date';

  function invalidDate() {
    return this._invalidDate;
  }

  var defaultOrdinal = '%d';
  var defaultOrdinalParse = /\d{1,2}/;

  function ordinal(number) {
    return this._ordinal.replace('%d', number);
  }

  function preParsePostFormat(string) {
    return string;
  }

  var defaultRelativeTime = {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years' };


  function relative__relativeTime(number, withoutSuffix, string, isFuture) {
    var output = this._relativeTime[string];
    return typeof output === 'function' ?
    output(number, withoutSuffix, string, isFuture) :
    output.replace(/%d/i, number);
  }

  function pastFuture(diff, output) {
    var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
    return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
  }

  function locale_set__set(config) {
    var prop, i;
    for (i in config) {
      prop = config[i];
      if (typeof prop === 'function') {
        this[i] = prop;
      } else {
        this['_' + i] = prop;
      }
    }
    // Lenient ordinal parsing accepts just a number in addition to
    // number + (possibly) stuff coming from _ordinalParseLenient.
    this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + /\d{1,2}/.source);
  }

  var prototype__proto = Locale.prototype;

  prototype__proto._calendar = defaultCalendar;
  prototype__proto.calendar = locale_calendar__calendar;
  prototype__proto._longDateFormat = defaultLongDateFormat;
  prototype__proto.longDateFormat = longDateFormat;
  prototype__proto._invalidDate = defaultInvalidDate;
  prototype__proto.invalidDate = invalidDate;
  prototype__proto._ordinal = defaultOrdinal;
  prototype__proto.ordinal = ordinal;
  prototype__proto._ordinalParse = defaultOrdinalParse;
  prototype__proto.preparse = preParsePostFormat;
  prototype__proto.postformat = preParsePostFormat;
  prototype__proto._relativeTime = defaultRelativeTime;
  prototype__proto.relativeTime = relative__relativeTime;
  prototype__proto.pastFuture = pastFuture;
  prototype__proto.set = locale_set__set;

  // Month
  prototype__proto.months = localeMonths;
  prototype__proto._months = defaultLocaleMonths;
  prototype__proto.monthsShort = localeMonthsShort;
  prototype__proto._monthsShort = defaultLocaleMonthsShort;
  prototype__proto.monthsParse = localeMonthsParse;

  // Week
  prototype__proto.week = localeWeek;
  prototype__proto._week = defaultLocaleWeek;
  prototype__proto.firstDayOfYear = localeFirstDayOfYear;
  prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

  // Day of Week
  prototype__proto.weekdays = localeWeekdays;
  prototype__proto._weekdays = defaultLocaleWeekdays;
  prototype__proto.weekdaysMin = localeWeekdaysMin;
  prototype__proto._weekdaysMin = defaultLocaleWeekdaysMin;
  prototype__proto.weekdaysShort = localeWeekdaysShort;
  prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
  prototype__proto.weekdaysParse = localeWeekdaysParse;

  // Hours
  prototype__proto.isPM = localeIsPM;
  prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
  prototype__proto.meridiem = localeMeridiem;

  function lists__get(format, index, field, setter) {
    var locale = locale_locales__getLocale();
    var utc = create_utc__createUTC().set(setter, index);
    return locale[field](utc, format);
  }

  function list(format, index, field, count, setter) {
    if (typeof format === 'number') {
      index = format;
      format = undefined;
    }

    format = format || '';

    if (index != null) {
      return lists__get(format, index, field, setter);
    }

    var i;
    var out = [];
    for (i = 0; i < count; i++) {
      out[i] = lists__get(format, i, field, setter);
    }
    return out;
  }

  function lists__listMonths(format, index) {
    return list(format, index, 'months', 12, 'month');
  }

  function lists__listMonthsShort(format, index) {
    return list(format, index, 'monthsShort', 12, 'month');
  }

  function lists__listWeekdays(format, index) {
    return list(format, index, 'weekdays', 7, 'day');
  }

  function lists__listWeekdaysShort(format, index) {
    return list(format, index, 'weekdaysShort', 7, 'day');
  }

  function lists__listWeekdaysMin(format, index) {
    return list(format, index, 'weekdaysMin', 7, 'day');
  }

  locale_locales__getSetGlobalLocale('en', {
    ordinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal: function ordinal(number) {
      var b = number % 10,
      output = toInt(number % 100 / 10) === 1 ? 'th' :
      b === 1 ? 'st' :
      b === 2 ? 'nd' :
      b === 3 ? 'rd' : 'th';
      return number + output;
    } });


  // Side effect imports
  utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
  utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

  var mathAbs = Math.abs;

  function duration_abs__abs() {
    var data = this._data;

    this._milliseconds = mathAbs(this._milliseconds);
    this._days = mathAbs(this._days);
    this._months = mathAbs(this._months);

    data.milliseconds = mathAbs(data.milliseconds);
    data.seconds = mathAbs(data.seconds);
    data.minutes = mathAbs(data.minutes);
    data.hours = mathAbs(data.hours);
    data.months = mathAbs(data.months);
    data.years = mathAbs(data.years);

    return this;
  }

  function duration_add_subtract__addSubtract(duration, input, value, direction) {
    var other = create__createDuration(input, value);

    duration._milliseconds += direction * other._milliseconds;
    duration._days += direction * other._days;
    duration._months += direction * other._months;

    return duration._bubble();
  }

  // supports only 2.0-style add(1, 's') or add(duration)
  function duration_add_subtract__add(input, value) {
    return duration_add_subtract__addSubtract(this, input, value, 1);
  }

  // supports only 2.0-style subtract(1, 's') or subtract(duration)
  function duration_add_subtract__subtract(input, value) {
    return duration_add_subtract__addSubtract(this, input, value, -1);
  }

  function absCeil(number) {
    if (number < 0) {
      return Math.floor(number);
    } else {
      return Math.ceil(number);
    }
  }

  function bubble() {
    var milliseconds = this._milliseconds;
    var days = this._days;
    var months = this._months;
    var data = this._data;
    var seconds, minutes, hours, years, monthsFromDays;

    // if we have a mix of positive and negative values, bubble down first
    // check: https://github.com/moment/moment/issues/2166
    if (!(milliseconds >= 0 && days >= 0 && months >= 0 ||
    milliseconds <= 0 && days <= 0 && months <= 0)) {
      milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
      days = 0;
      months = 0;
    }

    // The following code bubbles up values, see the tests for
    // examples of what that means.
    data.milliseconds = milliseconds % 1000;

    seconds = absFloor(milliseconds / 1000);
    data.seconds = seconds % 60;

    minutes = absFloor(seconds / 60);
    data.minutes = minutes % 60;

    hours = absFloor(minutes / 60);
    data.hours = hours % 24;

    days += absFloor(hours / 24);

    // convert days to months
    monthsFromDays = absFloor(daysToMonths(days));
    months += monthsFromDays;
    days -= absCeil(monthsToDays(monthsFromDays));

    // 12 months -> 1 year
    years = absFloor(months / 12);
    months %= 12;

    data.days = days;
    data.months = months;
    data.years = years;

    return this;
  }

  function daysToMonths(days) {
    // 400 years have 146097 days (taking into account leap year rules)
    // 400 years have 12 months === 4800
    return days * 4800 / 146097;
  }

  function monthsToDays(months) {
    // the reverse of daysToMonths
    return months * 146097 / 4800;
  }

  function as(units) {
    var days;
    var months;
    var milliseconds = this._milliseconds;

    units = normalizeUnits(units);

    if (units === 'month' || units === 'year') {
      days = this._days + milliseconds / 864e5;
      months = this._months + daysToMonths(days);
      return units === 'month' ? months : months / 12;
    } else {
      // handle milliseconds separately because of floating point math errors (issue #1867)
      days = this._days + Math.round(monthsToDays(this._months));
      switch (units) {
        case 'week':return days / 7 + milliseconds / 6048e5;
        case 'day':return days + milliseconds / 864e5;
        case 'hour':return days * 24 + milliseconds / 36e5;
        case 'minute':return days * 1440 + milliseconds / 6e4;
        case 'second':return days * 86400 + milliseconds / 1000;
        // Math.floor prevents floating point math errors here
        case 'millisecond':return Math.floor(days * 864e5) + milliseconds;
        default:throw new Error('Unknown unit ' + units);}

    }
  }

  // TODO: Use this.as('ms')?
  function duration_as__valueOf() {
    return (
      this._milliseconds +
      this._days * 864e5 +
      this._months % 12 * 2592e6 +
      toInt(this._months / 12) * 31536e6);

  }

  function makeAs(alias) {
    return function () {
      return this.as(alias);
    };
  }

  var asMilliseconds = makeAs('ms');
  var asSeconds = makeAs('s');
  var asMinutes = makeAs('m');
  var asHours = makeAs('h');
  var asDays = makeAs('d');
  var asWeeks = makeAs('w');
  var asMonths = makeAs('M');
  var asYears = makeAs('y');

  function duration_get__get(units) {
    units = normalizeUnits(units);
    return this[units + 's']();
  }

  function makeGetter(name) {
    return function () {
      return this._data[name];
    };
  }

  var milliseconds = makeGetter('milliseconds');
  var seconds = makeGetter('seconds');
  var minutes = makeGetter('minutes');
  var hours = makeGetter('hours');
  var days = makeGetter('days');
  var months = makeGetter('months');
  var years = makeGetter('years');

  function weeks() {
    return absFloor(this.days() / 7);
  }

  var round = Math.round;
  var thresholds = {
    s: 45, // seconds to minute
    m: 45, // minutes to hour
    h: 22, // hours to day
    d: 26, // days to month
    M: 11 // months to year
  };

  // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
  function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
    return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
  }

  function duration_humanize__relativeTime(posNegDuration, withoutSuffix, locale) {
    var duration = create__createDuration(posNegDuration).abs();
    var seconds = round(duration.as('s'));
    var minutes = round(duration.as('m'));
    var hours = round(duration.as('h'));
    var days = round(duration.as('d'));
    var months = round(duration.as('M'));
    var years = round(duration.as('y'));

    var a = seconds < thresholds.s && ['s', seconds] ||
    minutes === 1 && ['m'] ||
    minutes < thresholds.m && ['mm', minutes] ||
    hours === 1 && ['h'] ||
    hours < thresholds.h && ['hh', hours] ||
    days === 1 && ['d'] ||
    days < thresholds.d && ['dd', days] ||
    months === 1 && ['M'] ||
    months < thresholds.M && ['MM', months] ||
    years === 1 && ['y'] || ['yy', years];

    a[2] = withoutSuffix;
    a[3] = +posNegDuration > 0;
    a[4] = locale;
    return substituteTimeAgo.apply(null, a);
  }

  // This function allows you to set a threshold for relative time strings
  function duration_humanize__getSetRelativeTimeThreshold(threshold, limit) {
    if (thresholds[threshold] === undefined) {
      return false;
    }
    if (limit === undefined) {
      return thresholds[threshold];
    }
    thresholds[threshold] = limit;
    return true;
  }

  function humanize(withSuffix) {
    var locale = this.localeData();
    var output = duration_humanize__relativeTime(this, !withSuffix, locale);

    if (withSuffix) {
      output = locale.pastFuture(+this, output);
    }

    return locale.postformat(output);
  }

  var iso_string__abs = Math.abs;

  function iso_string__toISOString() {
    // for ISO strings we do not use the normal bubbling rules:
    //  * milliseconds bubble up until they become hours
    //  * days do not bubble at all
    //  * months bubble up until they become years
    // This is because there is no context-free conversion between hours and days
    // (think of clock changes)
    // and also not between days and months (28-31 days per month)
    var seconds = iso_string__abs(this._milliseconds) / 1000;
    var days = iso_string__abs(this._days);
    var months = iso_string__abs(this._months);
    var minutes, hours, years;

    // 3600 seconds -> 60 minutes -> 1 hour
    minutes = absFloor(seconds / 60);
    hours = absFloor(minutes / 60);
    seconds %= 60;
    minutes %= 60;

    // 12 months -> 1 year
    years = absFloor(months / 12);
    months %= 12;


    // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
    var Y = years;
    var M = months;
    var D = days;
    var h = hours;
    var m = minutes;
    var s = seconds;
    var total = this.asSeconds();

    if (!total) {
      // this is the same as C#'s (Noda) and python (isodate)...
      // but not other JS (goog.date)
      return 'P0D';
    }

    return (total < 0 ? '-' : '') +
    'P' + (
    Y ? Y + 'Y' : '') + (
    M ? M + 'M' : '') + (
    D ? D + 'D' : '') + (
    h || m || s ? 'T' : '') + (
    h ? h + 'H' : '') + (
    m ? m + 'M' : '') + (
    s ? s + 'S' : '');
  }

  var duration_prototype__proto = Duration.prototype;

  duration_prototype__proto.abs = duration_abs__abs;
  duration_prototype__proto.add = duration_add_subtract__add;
  duration_prototype__proto.subtract = duration_add_subtract__subtract;
  duration_prototype__proto.as = as;
  duration_prototype__proto.asMilliseconds = asMilliseconds;
  duration_prototype__proto.asSeconds = asSeconds;
  duration_prototype__proto.asMinutes = asMinutes;
  duration_prototype__proto.asHours = asHours;
  duration_prototype__proto.asDays = asDays;
  duration_prototype__proto.asWeeks = asWeeks;
  duration_prototype__proto.asMonths = asMonths;
  duration_prototype__proto.asYears = asYears;
  duration_prototype__proto.valueOf = duration_as__valueOf;
  duration_prototype__proto._bubble = bubble;
  duration_prototype__proto.get = duration_get__get;
  duration_prototype__proto.milliseconds = milliseconds;
  duration_prototype__proto.seconds = seconds;
  duration_prototype__proto.minutes = minutes;
  duration_prototype__proto.hours = hours;
  duration_prototype__proto.days = days;
  duration_prototype__proto.weeks = weeks;
  duration_prototype__proto.months = months;
  duration_prototype__proto.years = years;
  duration_prototype__proto.humanize = humanize;
  duration_prototype__proto.toISOString = iso_string__toISOString;
  duration_prototype__proto.toString = iso_string__toISOString;
  duration_prototype__proto.toJSON = iso_string__toISOString;
  duration_prototype__proto.locale = locale;
  duration_prototype__proto.localeData = localeData;

  // Deprecations
  duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
  duration_prototype__proto.lang = lang;

  // Side effect imports

  addFormatToken('X', 0, 0, 'unix');
  addFormatToken('x', 0, 0, 'valueOf');

  // PARSING

  addRegexToken('x', matchSigned);
  addRegexToken('X', matchTimestamp);
  addParseToken('X', function (input, array, config) {
    config._d = new Date(parseFloat(input, 10) * 1000);
  });
  addParseToken('x', function (input, array, config) {
    config._d = new Date(toInt(input));
  });

  // Side effect imports


  utils_hooks__hooks.version = '2.10.6';

  setHookCallback(local__createLocal);

  utils_hooks__hooks.fn = momentPrototype;
  utils_hooks__hooks.min = min;
  utils_hooks__hooks.max = max;
  utils_hooks__hooks.utc = create_utc__createUTC;
  utils_hooks__hooks.unix = moment__createUnix;
  utils_hooks__hooks.months = lists__listMonths;
  utils_hooks__hooks.isDate = isDate;
  utils_hooks__hooks.locale = locale_locales__getSetGlobalLocale;
  utils_hooks__hooks.invalid = valid__createInvalid;
  utils_hooks__hooks.duration = create__createDuration;
  utils_hooks__hooks.isMoment = isMoment;
  utils_hooks__hooks.weekdays = lists__listWeekdays;
  utils_hooks__hooks.parseZone = moment__createInZone;
  utils_hooks__hooks.localeData = locale_locales__getLocale;
  utils_hooks__hooks.isDuration = isDuration;
  utils_hooks__hooks.monthsShort = lists__listMonthsShort;
  utils_hooks__hooks.weekdaysMin = lists__listWeekdaysMin;
  utils_hooks__hooks.defineLocale = defineLocale;
  utils_hooks__hooks.weekdaysShort = lists__listWeekdaysShort;
  utils_hooks__hooks.normalizeUnits = normalizeUnits;
  utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;

  var _moment = utils_hooks__hooks;

  return _moment;

});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! (webpack)/buildin/module.js */ 19)(module)))

/***/ }),

/***/ 19:
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ 2:
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.11
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  // fixed by xxxxxx (nvue vuex)
  /* eslint-disable no-undef */
  if(typeof SharedObject !== 'undefined'){
    this.id = SharedObject.uid++;
  } else {
    this.id = uid++;
  }
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx ????????????????????? plugins ???????????????????????????????????????????????????????????????????????? copyAugment ??????
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

// fixed by xxxxxx (mp properties)
function extractPropertiesFromVNodeData(data, Ctor, res, context) {
  var propOptions = Ctor.options.mpOptions && Ctor.options.mpOptions.properties;
  if (isUndef(propOptions)) {
    return res
  }
  var externalClasses = Ctor.options.mpOptions.externalClasses || [];
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      var result = checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false);
      // externalClass
      if (
        result &&
        res[key] &&
        externalClasses.indexOf(altKey) !== -1 &&
        context[camelize(res[key])]
      ) {
        // ?????? externalClass ????????????(????????? externalClass ????????????????????????)
        res[key] = context[camelize(res[key])];
      }
    }
  }
  return res
}

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag,
  context// fixed by xxxxxx
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    // fixed by xxxxxx
    return extractPropertiesFromVNodeData(data, Ctor, {}, context)
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  // fixed by xxxxxx
  return extractPropertiesFromVNodeData(data, Ctor, res, context)
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx ?????? hack ??? uni-app ???????????? name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i, i, i); // fixed by xxxxxx
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i, i, i); // fixed by xxxxxx
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length, i++, i)); // fixed by xxxxxx
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i, i); // fixed by xxxxxx
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    // fixed by xxxxxx app-plus scopedSlot
    nodes = scopedSlotFn(props, this, props._i) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      callHook(componentInstance, 'onServiceCreated');
      callHook(componentInstance, 'onServiceAttached');
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag, context); // fixed by xxxxxx

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ( true && isDef(data) && isDef(data.nativeOn)) {
        warn(
          ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
          context
        );
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  
  // fixed by xxxxxx update properties(mp runtime)
  vm._$updateProperties && vm._$updateProperties(vm);
  
  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu'){//?????? observer ??? setData callback ?????????????????????????????? warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field ????????????
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    vm.mpHost !== 'mp-toutiao' && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    vm.mpHost !== 'mp-toutiao' && initProvide(vm); // resolve provide after data/props
    vm.mpHost !== 'mp-toutiao' && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.11';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick ?????? ??? setData ??? setData ??????????????????
    //2.nextTick ???????????? render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // ???????????? vm ?????????????????????
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO ??????????????????????????????????????? list=>l0 ??? list ??????????????????????????????????????????
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //????????? data ???????????????
      mpData[key] = mpInstance.data[key];
    });
    var diffData = diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']????????????',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js ?????? new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  vm.mpHost !== 'mp-toutiao' && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    /* eslint-disable no-undef */
    var app = getApp();
    if (app && app.onError) {
      app.onError(err);
    } else {
      console.error(err);
    }
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope && this.$scope[method]) {
        return this.$scope[method](args)
      }
      // mp-alipay
      if (typeof my === 'undefined') {
        return
      }
      if (method === 'createSelectorQuery') {
        /* eslint-disable no-undef */
        return my.createSelectorQuery(args)
      } else if (method === 'createIntersectionObserver') {
        /* eslint-disable no-undef */
        return my.createIntersectionObserver(args)
      }
      // TODO mp-alipay ???????????? selectAllComponents,selectComponent
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook, args);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO ???????????? string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // ???????????????????????????????????????
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),

/***/ 20:
/*!********************************************************************!*\
  !*** C:/Users/admin/Desktop/change1/change/shops/config/config.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.apiBaseUrl = void 0;var apiBaseUrl = 'http://127.0.0.1:3000/users/';exports.apiBaseUrl = apiBaseUrl;

/***/ }),

/***/ 21:
/*!******************************************************************!*\
  !*** C:/Users/admin/Desktop/change1/change/shops/store/index.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));
var _vuex = _interopRequireDefault(__webpack_require__(/*! vuex */ 22));
var db = _interopRequireWildcard(__webpack_require__(/*! ../config/db.js */ 17));function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};if (desc.get || desc.set) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
_vue.default.use(_vuex.default);
var goodsList = db.get('goodsList') || [];
var store = new _vuex.default.Store({
  state: {
    goodsList: goodsList,
    userInfo: {} },

  mutations: {
    addCardMutations: function addCardMutations(state, goods) {
      //??????????????????????????????
      var stateShopInfo = state.goodsList;
      var shopInfo = goods;
      var goodsItem = null;
      var index;
      goods.count = goods.count || 1;
      goodsItem = stateShopInfo.find(function (item, i) {
        if (stateShopInfo[i].goodsId == shopInfo.goodsId) {
          index = i;
          return true;
        } else {
          return false;
        }
      });
      if (goodsItem) {
        if (goods.count) {
          goodsItem.count = shopInfo.count;
          goodsItem.goodsNumber = shopInfo.goodsNumber;
        } else {
          //????????????
          stateShopInfo.splice(index, 1);
        }
      } else {
        stateShopInfo.push({
          goodsId: shopInfo.goodsId,
          goodsName: shopInfo.goodsName,
          goodsNumber: shopInfo.goodsNumber,
          isflash: shopInfo.isflash || 0,
          count: shopInfo.count });

      }

      db.set('goodsList', state.goodsList);
    },
    setUserInfoMutations: function setUserInfoMutations(state, userinfo) {
      state.userInfo = userinfo;
      db.set('userinfo', state.userInfo);
    },
    emptyAllCardMutations: function emptyAllCardMutations(state) {
      state.goodsList = [];
      db.del('goodsList');
    },
    saveUserTokenAction: function saveUserTokenAction(state, userToken) {
      state.userToken = userToken;
      db.set('userToken', state.userToken);
    },
    delCardMutations: function delCardMutations(state, goodsId) {
      var index = state.goodsList.findIndex(function (item) {
        return item.goodsId == goodsId;
      });
      state.goodsList.splice(index, 1);
      db.set('goodsList', state.goodsList);
    } },

  actions: {
    addCardAction: function addCardAction(state, goods) {
      state.commit('addCardMutations', goods);
    },
    setUserInfoAction: function setUserInfoAction(state, userinfo) {
      state.commit('setUserInfoMutations', userinfo);
    },
    emptyAllCardAction: function emptyAllCardAction(state) {
      state.commit('emptyAllCardMutations');
    },
    saveUserTokenAction: function saveUserTokenAction(state, userToken) {
      state.commit('saveUserTokenAction', userToken);
    },
    delCardAction: function delCardAction(state, goodsId) {
      state.commit('delCardMutations', goodsId);
    } },

  getters: {
    getGoodsList: function getGoodsList(state) {
      return state.goodsList;
    },
    getNameGoodListNum: function getNameGoodListNum(state) {return function (goodsId) {
        var goodsItem = state.goodsList.find(function (item, i) {
          return item.goodsId == goodsId;
        });
        if (goodsItem) {
          return goodsItem;
        } else {
          return 0;
        }
      };},
    getUserInfos: function getUserInfos(state) {
      return state.userInfo;
    },
    getisLogin: function getisLogin(state) {
      if (JSON.stringify(state.userInfo) == "{}") {
        return false;
      } else {
        return true;
      }
    } } });var _default =



store;exports.default = _default;

/***/ }),

/***/ 22:
/*!********************************************!*\
  !*** ./node_modules/vuex/dist/vuex.esm.js ***!
  \********************************************/
/*! exports provided: Store, install, mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapState", function() { return mapState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapMutations", function() { return mapMutations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapGetters", function() { return mapGetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapActions", function() { return mapActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNamespacedHelpers", function() { return createNamespacedHelpers; });
/**
 * vuex v3.0.1
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (true) {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (true) {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (true) {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (true) {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (true) {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
     true &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (true) {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (true) {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (true) {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (true) {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (true) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if ( true && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if ( true && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '3.0.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["default"] = (index_esm);


/***/ }),

/***/ 3:
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 314:
/*!********************************************************************!*\
  !*** C:/Users/admin/Desktop/change1/change/shops/config/mixins.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.checkLogin = exports.jumpBackPage = exports.goBack = exports.goods = exports.orders = void 0;var orders = {
  mounted: function mounted() {},
  methods: {
    // ??????????????????
    orderDetail: function orderDetail(orderId) {
      this.$common.navigateTo(
      '/pages/member/order/orderdetail?order_id=' + orderId);

    },
    // ????????????

    // ?????????
    toPay: function toPay(orderId) {
      this.$common.navigateTo(
      '/pages/goods/payment/index?order_id=' + orderId + '&type=1');

    },
    // ????????????

    // ?????????
    toEvaluate: function toEvaluate(orderId) {
      this.$common.navigateTo(
      '/pages/member/order/evaluate?order_id=' + orderId);

    },
    // ????????????

    // ??????????????????
    showExpress: function showExpress(code, no) {var address = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var params = encodeURIComponent(
      'code=' + code + '&no=' + no + '&add=' + address);


      this.$common.navigateTo(
      '/pages/member/order/express_delivery?params=' + params);

    } }



  /**
         *  ??????????????????
         *
         */ };exports.orders = orders;
var goods = {
  mounted: function mounted() {},
  methods: {
    // ??????????????????
    goodsDetail: function goodsDetail(goodsId) {
      this.$common.navigateTo('/pages/goods/index/index?id=' + goodsId);
    },
    // ?????????????????????
    goodsList: function goodsList() {var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var url = '/pages/classify/index';
      if (Object.keys(obj).length) {
        url = this.$common.builderUrlParams(url, obj);
      }
      this.$common.navigateTo(url);
    },
    // ??????????????????
    groupDetail: function groupDetail(id, group_id) {
      this.$common.navigateTo(
      '/pages/goods/index/group?id=' + id + '&group_id=' + group_id);

    },
    //???????????????
    pintuanDetail: function pintuanDetail(id, team_id) {
      if (team_id) {
        this.$common.navigateTo(
        '/pages/goods/index/pintuan?id=' + id + '&team_id=' + team_id);

      } else {
        this.$common.navigateTo('/pages/goods/index/pintuan?id=' + id);
      }
    } }



  /**
         *
         *  ??????????????????
         *
         */ };exports.goods = goods;
var goBack = {
  onBackPress: function onBackPress(options) {
    if (options.from === 'navigateBack') {
      return false;
    }
    var loginPages = ['/pages/index/index', '/pages/classify/classify', '/pages/cart/cart', 'pages/member/member'];
    var backPage = this.$store.state.redirectPage;
    if (loginPages.indexOf(backPage) > -1) {
      this.$store.commit({
        type: 'redirect',
        page: '' });

      uni.switchTab({
        url: '/pages/index/index' });

      return true;
    }
  } };


/* 
        *  ??????????????????????????????
        */exports.goBack = goBack;

var jumpBackPage = {
  methods: {
    handleBack: function handleBack() {
      var redirect = this.$store.state.redirectPage;
      this.$store.commit({
        type: 'redirect',
        page: '' });

      var switchTabs = ['/pages/index/index', '/pages/classify/classify', '/pages/cart/cart', 'pages/member/member'];
      if (switchTabs.indexOf(redirect) > -1) {
        uni.switchTab({
          url: redirect });

      } else if (redirect) {
        uni.redirectTo({
          url: redirect });

      } else {
        uni.switchTab({
          url: '/pages/index/index' });

      }
    } }



  /* 
         * ????????????????????????
         */ };exports.jumpBackPage = jumpBackPage;

var checkLogin = {
  methods: {
    checkIsLogin: function checkIsLogin() {
      uni.showToast({
        title: '????????????!',
        icon: 'none',
        duration: 800,
        success: function success(res) {
          setTimeout(function () {
            uni.hideToast();
            uni.navigateTo({
              url: '/pages/member/member',
              animationType: 'pop-in',
              animationDuration: 200 });

          }, 500);
        } });

    } } };exports.checkLogin = checkLogin;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 371:
/*!*****************************************************************************************************!*\
  !*** C:/Users/admin/Desktop/change1/change/shops/components/mpvue-citypicker/city-data/province.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; /* eslint-disable */
var provinceData = [{
  "label": "?????????",
  "value": "11" },

{
  "label": "?????????",
  "value": "12" },

{
  "label": "?????????",
  "value": "13" },

{
  "label": "?????????",
  "value": "14" },

{
  "label": "??????????????????",
  "value": "15" },

{
  "label": "?????????",
  "value": "21" },

{
  "label": "?????????",
  "value": "22" },

{
  "label": "????????????",
  "value": "23" },

{
  "label": "?????????",
  "value": "31" },

{
  "label": "?????????",
  "value": "32" },

{
  "label": "?????????",
  "value": "33" },

{
  "label": "?????????",
  "value": "34" },

{
  "label": "?????????",
  "value": "35" },

{
  "label": "?????????",
  "value": "36" },

{
  "label": "?????????",
  "value": "37" },

{
  "label": "?????????",
  "value": "41" },

{
  "label": "?????????",
  "value": "42" },

{
  "label": "?????????",
  "value": "43" },

{
  "label": "?????????",
  "value": "44" },

{
  "label": "?????????????????????",
  "value": "45" },

{
  "label": "?????????",
  "value": "46" },

{
  "label": "?????????",
  "value": "50" },

{
  "label": "?????????",
  "value": "51" },

{
  "label": "?????????",
  "value": "52" },

{
  "label": "?????????",
  "value": "53" },

{
  "label": "???????????????",
  "value": "54" },

{
  "label": "?????????",
  "value": "61" },

{
  "label": "?????????",
  "value": "62" },

{
  "label": "?????????",
  "value": "63" },

{
  "label": "?????????????????????",
  "value": "64" },

{
  "label": "????????????????????????",
  "value": "65" },

{
  "label": "??????",
  "value": "66" },

{
  "label": "??????",
  "value": "67" },

{
  "label": "??????",
  "value": "68" }];var _default =


provinceData;exports.default = _default;

/***/ }),

/***/ 372:
/*!*************************************************************************************************!*\
  !*** C:/Users/admin/Desktop/change1/change/shops/components/mpvue-citypicker/city-data/city.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; /* eslint-disable */
var cityData = [
[{
  "label": "?????????",
  "value": "1101" }],

[{
  "label": "?????????",
  "value": "1201" }],

[{
  "label": "????????????",
  "value": "1301" },

{
  "label": "?????????",
  "value": "1302" },

{
  "label": "????????????",
  "value": "1303" },

{
  "label": "?????????",
  "value": "1304" },

{
  "label": "?????????",
  "value": "1305" },

{
  "label": "?????????",
  "value": "1306" },

{
  "label": "????????????",
  "value": "1307" },

{
  "label": "?????????",
  "value": "1308" },

{
  "label": "?????????",
  "value": "1309" },

{
  "label": "?????????",
  "value": "1310" },

{
  "label": "?????????",
  "value": "1311" }],


[{
  "label": "?????????",
  "value": "1401" },

{
  "label": "?????????",
  "value": "1402" },

{
  "label": "?????????",
  "value": "1403" },

{
  "label": "?????????",
  "value": "1404" },

{
  "label": "?????????",
  "value": "1405" },

{
  "label": "?????????",
  "value": "1406" },

{
  "label": "?????????",
  "value": "1407" },

{
  "label": "?????????",
  "value": "1408" },

{
  "label": "?????????",
  "value": "1409" },

{
  "label": "?????????",
  "value": "1410" },

{
  "label": "?????????",
  "value": "1411" }],


[{
  "label": "???????????????",
  "value": "1501" },

{
  "label": "?????????",
  "value": "1502" },

{
  "label": "?????????",
  "value": "1503" },

{
  "label": "?????????",
  "value": "1504" },

{
  "label": "?????????",
  "value": "1505" },

{
  "label": "???????????????",
  "value": "1506" },

{
  "label": "???????????????",
  "value": "1507" },

{
  "label": "???????????????",
  "value": "1508" },

{
  "label": "???????????????",
  "value": "1509" },

{
  "label": "?????????",
  "value": "1522" },

{
  "label": "???????????????",
  "value": "1525" },

{
  "label": "????????????",
  "value": "1529" }],


[{
  "label": "?????????",
  "value": "2101" },

{
  "label": "?????????",
  "value": "2102" },

{
  "label": "?????????",
  "value": "2103" },

{
  "label": "?????????",
  "value": "2104" },

{
  "label": "?????????",
  "value": "2105" },

{
  "label": "?????????",
  "value": "2106" },

{
  "label": "?????????",
  "value": "2107" },

{
  "label": "?????????",
  "value": "2108" },

{
  "label": "?????????",
  "value": "2109" },

{
  "label": "?????????",
  "value": "2110" },

{
  "label": "?????????",
  "value": "2111" },

{
  "label": "?????????",
  "value": "2112" },

{
  "label": "?????????",
  "value": "2113" },

{
  "label": "????????????",
  "value": "2114" }],


[{
  "label": "?????????",
  "value": "2201" },

{
  "label": "?????????",
  "value": "2202" },

{
  "label": "?????????",
  "value": "2203" },

{
  "label": "?????????",
  "value": "2204" },

{
  "label": "?????????",
  "value": "2205" },

{
  "label": "?????????",
  "value": "2206" },

{
  "label": "?????????",
  "value": "2207" },

{
  "label": "?????????",
  "value": "2208" },

{
  "label": "????????????????????????",
  "value": "2224" }],


[{
  "label": "????????????",
  "value": "2301" },

{
  "label": "???????????????",
  "value": "2302" },

{
  "label": "?????????",
  "value": "2303" },

{
  "label": "?????????",
  "value": "2304" },

{
  "label": "????????????",
  "value": "2305" },

{
  "label": "?????????",
  "value": "2306" },

{
  "label": "?????????",
  "value": "2307" },

{
  "label": "????????????",
  "value": "2308" },

{
  "label": "????????????",
  "value": "2309" },

{
  "label": "????????????",
  "value": "2310" },

{
  "label": "?????????",
  "value": "2311" },

{
  "label": "?????????",
  "value": "2312" },

{
  "label": "??????????????????",
  "value": "2327" }],


[{
  "label": "?????????",
  "value": "3101" }],

[{
  "label": "?????????",
  "value": "3201" },

{
  "label": "?????????",
  "value": "3202" },

{
  "label": "?????????",
  "value": "3203" },

{
  "label": "?????????",
  "value": "3204" },

{
  "label": "?????????",
  "value": "3205" },

{
  "label": "?????????",
  "value": "3206" },

{
  "label": "????????????",
  "value": "3207" },

{
  "label": "?????????",
  "value": "3208" },

{
  "label": "?????????",
  "value": "3209" },

{
  "label": "?????????",
  "value": "3210" },

{
  "label": "?????????",
  "value": "3211" },

{
  "label": "?????????",
  "value": "3212" },

{
  "label": "?????????",
  "value": "3213" }],


[{
  "label": "?????????",
  "value": "3301" },

{
  "label": "?????????",
  "value": "3302" },

{
  "label": "?????????",
  "value": "3303" },

{
  "label": "?????????",
  "value": "3304" },

{
  "label": "?????????",
  "value": "3305" },

{
  "label": "?????????",
  "value": "3306" },

{
  "label": "?????????",
  "value": "3307" },

{
  "label": "?????????",
  "value": "3308" },

{
  "label": "?????????",
  "value": "3309" },

{
  "label": "?????????",
  "value": "3310" },

{
  "label": "?????????",
  "value": "3311" }],


[{
  "label": "?????????",
  "value": "3401" },

{
  "label": "?????????",
  "value": "3402" },

{
  "label": "?????????",
  "value": "3403" },

{
  "label": "?????????",
  "value": "3404" },

{
  "label": "????????????",
  "value": "3405" },

{
  "label": "?????????",
  "value": "3406" },

{
  "label": "?????????",
  "value": "3407" },

{
  "label": "?????????",
  "value": "3408" },

{
  "label": "?????????",
  "value": "3410" },

{
  "label": "?????????",
  "value": "3411" },

{
  "label": "?????????",
  "value": "3412" },

{
  "label": "?????????",
  "value": "3413" },

{
  "label": "?????????",
  "value": "3415" },

{
  "label": "?????????",
  "value": "3416" },

{
  "label": "?????????",
  "value": "3417" },

{
  "label": "?????????",
  "value": "3418" }],


[{
  "label": "?????????",
  "value": "3501" },

{
  "label": "?????????",
  "value": "3502" },

{
  "label": "?????????",
  "value": "3503" },

{
  "label": "?????????",
  "value": "3504" },

{
  "label": "?????????",
  "value": "3505" },

{
  "label": "?????????",
  "value": "3506" },

{
  "label": "?????????",
  "value": "3507" },

{
  "label": "?????????",
  "value": "3508" },

{
  "label": "?????????",
  "value": "3509" }],


[{
  "label": "?????????",
  "value": "3601" },

{
  "label": "????????????",
  "value": "3602" },

{
  "label": "?????????",
  "value": "3603" },

{
  "label": "?????????",
  "value": "3604" },

{
  "label": "?????????",
  "value": "3605" },

{
  "label": "?????????",
  "value": "3606" },

{
  "label": "?????????",
  "value": "3607" },

{
  "label": "?????????",
  "value": "3608" },

{
  "label": "?????????",
  "value": "3609" },

{
  "label": "?????????",
  "value": "3610" },

{
  "label": "?????????",
  "value": "3611" }],


[{
  "label": "?????????",
  "value": "3701" },

{
  "label": "?????????",
  "value": "3702" },

{
  "label": "?????????",
  "value": "3703" },

{
  "label": "?????????",
  "value": "3704" },

{
  "label": "?????????",
  "value": "3705" },

{
  "label": "?????????",
  "value": "3706" },

{
  "label": "?????????",
  "value": "3707" },

{
  "label": "?????????",
  "value": "3708" },

{
  "label": "?????????",
  "value": "3709" },

{
  "label": "?????????",
  "value": "3710" },

{
  "label": "?????????",
  "value": "3711" },

{
  "label": "?????????",
  "value": "3712" },

{
  "label": "?????????",
  "value": "3713" },

{
  "label": "?????????",
  "value": "3714" },

{
  "label": "?????????",
  "value": "3715" },

{
  "label": "?????????",
  "value": "3716" },

{
  "label": "?????????",
  "value": "3717" }],


[{
  "label": "?????????",
  "value": "4101" },

{
  "label": "?????????",
  "value": "4102" },

{
  "label": "?????????",
  "value": "4103" },

{
  "label": "????????????",
  "value": "4104" },

{
  "label": "?????????",
  "value": "4105" },

{
  "label": "?????????",
  "value": "4106" },

{
  "label": "?????????",
  "value": "4107" },

{
  "label": "?????????",
  "value": "4108" },

{
  "label": "?????????",
  "value": "4109" },

{
  "label": "?????????",
  "value": "4110" },

{
  "label": "?????????",
  "value": "4111" },

{
  "label": "????????????",
  "value": "4112" },

{
  "label": "?????????",
  "value": "4113" },

{
  "label": "?????????",
  "value": "4114" },

{
  "label": "?????????",
  "value": "4115" },

{
  "label": "?????????",
  "value": "4116" },

{
  "label": "????????????",
  "value": "4117" },

{
  "label": "???????????????????????????",
  "value": "4190" }],


[{
  "label": "?????????",
  "value": "4201" },

{
  "label": "?????????",
  "value": "4202" },

{
  "label": "?????????",
  "value": "4203" },

{
  "label": "?????????",
  "value": "4205" },

{
  "label": "?????????",
  "value": "4206" },

{
  "label": "?????????",
  "value": "4207" },

{
  "label": "?????????",
  "value": "4208" },

{
  "label": "?????????",
  "value": "4209" },

{
  "label": "?????????",
  "value": "4210" },

{
  "label": "?????????",
  "value": "4211" },

{
  "label": "?????????",
  "value": "4212" },

{
  "label": "?????????",
  "value": "4213" },

{
  "label": "??????????????????????????????",
  "value": "4228" },

{
  "label": "???????????????????????????",
  "value": "4290" }],


[{
  "label": "?????????",
  "value": "4301" },

{
  "label": "?????????",
  "value": "4302" },

{
  "label": "?????????",
  "value": "4303" },

{
  "label": "?????????",
  "value": "4304" },

{
  "label": "?????????",
  "value": "4305" },

{
  "label": "?????????",
  "value": "4306" },

{
  "label": "?????????",
  "value": "4307" },

{
  "label": "????????????",
  "value": "4308" },

{
  "label": "?????????",
  "value": "4309" },

{
  "label": "?????????",
  "value": "4310" },

{
  "label": "?????????",
  "value": "4311" },

{
  "label": "?????????",
  "value": "4312" },

{
  "label": "?????????",
  "value": "4313" },

{
  "label": "??????????????????????????????",
  "value": "4331" }],


[{
  "label": "?????????",
  "value": "4401" },

{
  "label": "?????????",
  "value": "4402" },

{
  "label": "?????????",
  "value": "4403" },

{
  "label": "?????????",
  "value": "4404" },

{
  "label": "?????????",
  "value": "4405" },

{
  "label": "?????????",
  "value": "4406" },

{
  "label": "?????????",
  "value": "4407" },

{
  "label": "?????????",
  "value": "4408" },

{
  "label": "?????????",
  "value": "4409" },

{
  "label": "?????????",
  "value": "4412" },

{
  "label": "?????????",
  "value": "4413" },

{
  "label": "?????????",
  "value": "4414" },

{
  "label": "?????????",
  "value": "4415" },

{
  "label": "?????????",
  "value": "4416" },

{
  "label": "?????????",
  "value": "4417" },

{
  "label": "?????????",
  "value": "4418" },

{
  "label": "?????????",
  "value": "4419" },

{
  "label": "?????????",
  "value": "4420" },

{
  "label": "?????????",
  "value": "4451" },

{
  "label": "?????????",
  "value": "4452" },

{
  "label": "?????????",
  "value": "4453" }],


[{
  "label": "?????????",
  "value": "4501" },

{
  "label": "?????????",
  "value": "4502" },

{
  "label": "?????????",
  "value": "4503" },

{
  "label": "?????????",
  "value": "4504" },

{
  "label": "?????????",
  "value": "4505" },

{
  "label": "????????????",
  "value": "4506" },

{
  "label": "?????????",
  "value": "4507" },

{
  "label": "?????????",
  "value": "4508" },

{
  "label": "?????????",
  "value": "4509" },

{
  "label": "?????????",
  "value": "4510" },

{
  "label": "?????????",
  "value": "4511" },

{
  "label": "?????????",
  "value": "4512" },

{
  "label": "?????????",
  "value": "4513" },

{
  "label": "?????????",
  "value": "4514" }],


[{
  "label": "?????????",
  "value": "4601" },

{
  "label": "?????????",
  "value": "4602" },

{
  "label": "?????????",
  "value": "4603" },

{
  "label": "?????????",
  "value": "4604" },

{
  "label": "???????????????????????????",
  "value": "4690" }],


[{
  "label": "?????????",
  "value": "5001" },

{
  "label": "???",
  "value": "5002" }],


[{
  "label": "?????????",
  "value": "5101" },

{
  "label": "?????????",
  "value": "5103" },

{
  "label": "????????????",
  "value": "5104" },

{
  "label": "?????????",
  "value": "5105" },

{
  "label": "?????????",
  "value": "5106" },

{
  "label": "?????????",
  "value": "5107" },

{
  "label": "?????????",
  "value": "5108" },

{
  "label": "?????????",
  "value": "5109" },

{
  "label": "?????????",
  "value": "5110" },

{
  "label": "?????????",
  "value": "5111" },

{
  "label": "?????????",
  "value": "5113" },

{
  "label": "?????????",
  "value": "5114" },

{
  "label": "?????????",
  "value": "5115" },

{
  "label": "?????????",
  "value": "5116" },

{
  "label": "?????????",
  "value": "5117" },

{
  "label": "?????????",
  "value": "5118" },

{
  "label": "?????????",
  "value": "5119" },

{
  "label": "?????????",
  "value": "5120" },

{
  "label": "???????????????????????????",
  "value": "5132" },

{
  "label": "?????????????????????",
  "value": "5133" },

{
  "label": "?????????????????????",
  "value": "5134" }],


[{
  "label": "?????????",
  "value": "5201" },

{
  "label": "????????????",
  "value": "5202" },

{
  "label": "?????????",
  "value": "5203" },

{
  "label": "?????????",
  "value": "5204" },

{
  "label": "?????????",
  "value": "5205" },

{
  "label": "?????????",
  "value": "5206" },

{
  "label": "?????????????????????????????????",
  "value": "5223" },

{
  "label": "??????????????????????????????",
  "value": "5226" },

{
  "label": "??????????????????????????????",
  "value": "5227" }],


[{
  "label": "?????????",
  "value": "5301" },

{
  "label": "?????????",
  "value": "5303" },

{
  "label": "?????????",
  "value": "5304" },

{
  "label": "?????????",
  "value": "5305" },

{
  "label": "?????????",
  "value": "5306" },

{
  "label": "?????????",
  "value": "5307" },

{
  "label": "?????????",
  "value": "5308" },

{
  "label": "?????????",
  "value": "5309" },

{
  "label": "?????????????????????",
  "value": "5323" },

{
  "label": "??????????????????????????????",
  "value": "5325" },

{
  "label": "???????????????????????????",
  "value": "5326" },

{
  "label": "???????????????????????????",
  "value": "5328" },

{
  "label": "?????????????????????",
  "value": "5329" },

{
  "label": "??????????????????????????????",
  "value": "5331" },

{
  "label": "????????????????????????",
  "value": "5333" },

{
  "label": "?????????????????????",
  "value": "5334" }],


[{
  "label": "?????????",
  "value": "5401" },

{
  "label": "????????????",
  "value": "5402" },

{
  "label": "?????????",
  "value": "5403" },

{
  "label": "?????????",
  "value": "5404" },

{
  "label": "?????????",
  "value": "5405" },

{
  "label": "????????????",
  "value": "5424" },

{
  "label": "????????????",
  "value": "5425" }],


[{
  "label": "?????????",
  "value": "6101" },

{
  "label": "?????????",
  "value": "6102" },

{
  "label": "?????????",
  "value": "6103" },

{
  "label": "?????????",
  "value": "6104" },

{
  "label": "?????????",
  "value": "6105" },

{
  "label": "?????????",
  "value": "6106" },

{
  "label": "?????????",
  "value": "6107" },

{
  "label": "?????????",
  "value": "6108" },

{
  "label": "?????????",
  "value": "6109" },

{
  "label": "?????????",
  "value": "6110" }],


[{
  "label": "?????????",
  "value": "6201" },

{
  "label": "????????????",
  "value": "6202" },

{
  "label": "?????????",
  "value": "6203" },

{
  "label": "?????????",
  "value": "6204" },

{
  "label": "?????????",
  "value": "6205" },

{
  "label": "?????????",
  "value": "6206" },

{
  "label": "?????????",
  "value": "6207" },

{
  "label": "?????????",
  "value": "6208" },

{
  "label": "?????????",
  "value": "6209" },

{
  "label": "?????????",
  "value": "6210" },

{
  "label": "?????????",
  "value": "6211" },

{
  "label": "?????????",
  "value": "6212" },

{
  "label": "?????????????????????",
  "value": "6229" },

{
  "label": "?????????????????????",
  "value": "6230" }],


[{
  "label": "?????????",
  "value": "6301" },

{
  "label": "?????????",
  "value": "6302" },

{
  "label": "?????????????????????",
  "value": "6322" },

{
  "label": "?????????????????????",
  "value": "6323" },

{
  "label": "?????????????????????",
  "value": "6325" },

{
  "label": "?????????????????????",
  "value": "6326" },

{
  "label": "?????????????????????",
  "value": "6327" },

{
  "label": "??????????????????????????????",
  "value": "6328" }],


[{
  "label": "?????????",
  "value": "6401" },

{
  "label": "????????????",
  "value": "6402" },

{
  "label": "?????????",
  "value": "6403" },

{
  "label": "?????????",
  "value": "6404" },

{
  "label": "?????????",
  "value": "6405" }],


[{
  "label": "???????????????",
  "value": "6501" },

{
  "label": "???????????????",
  "value": "6502" },

{
  "label": "????????????",
  "value": "6504" },

{
  "label": "?????????",
  "value": "6505" },

{
  "label": "?????????????????????",
  "value": "6523" },

{
  "label": "???????????????????????????",
  "value": "6527" },

{
  "label": "???????????????????????????",
  "value": "6528" },

{
  "label": "???????????????",
  "value": "6529" },

{
  "label": "?????????????????????????????????",
  "value": "6530" },

{
  "label": "????????????",
  "value": "6531" },

{
  "label": "????????????",
  "value": "6532" },

{
  "label": "????????????????????????",
  "value": "6540" },

{
  "label": "????????????",
  "value": "6542" },

{
  "label": "???????????????",
  "value": "6543" },

{
  "label": "?????????????????????????????????",
  "value": "6590" }],


[{
  "label": "??????",
  "value": "6601" },

{
  "label": "??????",
  "value": "6602" },

{
  "label": "??????",
  "value": "6603" },

{
  "label": "??????",
  "value": "6604" },

{
  "label": "??????",
  "value": "6605" },

{
  "label": "??????",
  "value": "6606" },

{
  "label": "??????",
  "value": "6607" },

{
  "label": "??????",
  "value": "6608" },

{
  "label": "??????",
  "value": "6609" },

{
  "label": "??????",
  "value": "6610" },

{
  "label": "??????",
  "value": "6611" },

{
  "label": "??????",
  "value": "6612" },

{
  "label": "??????",
  "value": "6613" },

{
  "label": "??????",
  "value": "6614" },

{
  "label": "??????",
  "value": "6615" },

{
  "label": "??????",
  "value": "6616" },

{
  "label": "??????",
  "value": "6617" }],


[{
  "label": "?????????",
  "value": "6701" },

{
  "label": "??????",
  "value": "6702" },

{
  "label": "??????",
  "value": "6703" }],


[{
  "label": "????????????",
  "value": "6801" },

{
  "label": "?????????",
  "value": "6802" },

{
  "label": "?????????",
  "value": "6803" },

{
  "label": "?????????",
  "value": "6804" }]];var _default =



cityData;exports.default = _default;

/***/ }),

/***/ 373:
/*!*************************************************************************************************!*\
  !*** C:/Users/admin/Desktop/change1/change/shops/components/mpvue-citypicker/city-data/area.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; /* eslint-disable */
var areaData = [
[
[{
  "label": "?????????",
  "value": "110101" },

{
  "label": "?????????",
  "value": "110102" },

{
  "label": "?????????",
  "value": "110105" },

{
  "label": "?????????",
  "value": "110106" },

{
  "label": "????????????",
  "value": "110107" },

{
  "label": "?????????",
  "value": "110108" },

{
  "label": "????????????",
  "value": "110109" },

{
  "label": "?????????",
  "value": "110111" },

{
  "label": "?????????",
  "value": "110112" },

{
  "label": "?????????",
  "value": "110113" },

{
  "label": "?????????",
  "value": "110114" },

{
  "label": "?????????",
  "value": "110115" },

{
  "label": "?????????",
  "value": "110116" },

{
  "label": "?????????",
  "value": "110117" },

{
  "label": "?????????",
  "value": "110118" },

{
  "label": "?????????",
  "value": "110119" }]],



[
[{
  "label": "?????????",
  "value": "120101" },

{
  "label": "?????????",
  "value": "120102" },

{
  "label": "?????????",
  "value": "120103" },

{
  "label": "?????????",
  "value": "120104" },

{
  "label": "?????????",
  "value": "120105" },

{
  "label": "?????????",
  "value": "120106" },

{
  "label": "?????????",
  "value": "120110" },

{
  "label": "?????????",
  "value": "120111" },

{
  "label": "?????????",
  "value": "120112" },

{
  "label": "?????????",
  "value": "120113" },

{
  "label": "?????????",
  "value": "120114" },

{
  "label": "?????????",
  "value": "120115" },

{
  "label": "????????????",
  "value": "120116" },

{
  "label": "?????????",
  "value": "120117" },

{
  "label": "?????????",
  "value": "120118" },

{
  "label": "?????????",
  "value": "120119" }]],



[
[{
  "label": "?????????",
  "value": "130102" },

{
  "label": "?????????",
  "value": "130104" },

{
  "label": "?????????",
  "value": "130105" },

{
  "label": "????????????",
  "value": "130107" },

{
  "label": "?????????",
  "value": "130108" },

{
  "label": "?????????",
  "value": "130109" },

{
  "label": "?????????",
  "value": "130110" },

{
  "label": "?????????",
  "value": "130111" },

{
  "label": "?????????",
  "value": "130121" },

{
  "label": "?????????",
  "value": "130123" },

{
  "label": "?????????",
  "value": "130125" },

{
  "label": "?????????",
  "value": "130126" },

{
  "label": "?????????",
  "value": "130127" },

{
  "label": "?????????",
  "value": "130128" },

{
  "label": "?????????",
  "value": "130129" },

{
  "label": "?????????",
  "value": "130130" },

{
  "label": "?????????",
  "value": "130131" },

{
  "label": "?????????",
  "value": "130132" },

{
  "label": "??????",
  "value": "130133" },

{
  "label": "????????????????????????????????????",
  "value": "130171" },

{
  "label": "???????????????????????????",
  "value": "130172" },

{
  "label": "?????????",
  "value": "130181" },

{
  "label": "?????????",
  "value": "130183" },

{
  "label": "?????????",
  "value": "130184" }],


[{
  "label": "?????????",
  "value": "130202" },

{
  "label": "?????????",
  "value": "130203" },

{
  "label": "?????????",
  "value": "130204" },

{
  "label": "?????????",
  "value": "130205" },

{
  "label": "?????????",
  "value": "130207" },

{
  "label": "?????????",
  "value": "130208" },

{
  "label": "????????????",
  "value": "130209" },

{
  "label": "??????",
  "value": "130223" },

{
  "label": "?????????",
  "value": "130224" },

{
  "label": "?????????",
  "value": "130225" },

{
  "label": "?????????",
  "value": "130227" },

{
  "label": "?????????",
  "value": "130229" },

{
  "label": "????????????????????????????????????",
  "value": "130271" },

{
  "label": "????????????????????????",
  "value": "130272" },

{
  "label": "?????????????????????????????????",
  "value": "130273" },

{
  "label": "?????????????????????????????????",
  "value": "130274" },

{
  "label": "?????????",
  "value": "130281" },

{
  "label": "?????????",
  "value": "130283" }],


[{
  "label": "?????????",
  "value": "130302" },

{
  "label": "????????????",
  "value": "130303" },

{
  "label": "????????????",
  "value": "130304" },

{
  "label": "?????????",
  "value": "130306" },

{
  "label": "?????????????????????",
  "value": "130321" },

{
  "label": "?????????",
  "value": "130322" },

{
  "label": "?????????",
  "value": "130324" },

{
  "label": "?????????????????????????????????",
  "value": "130371" },

{
  "label": "???????????????",
  "value": "130372" }],


[{
  "label": "?????????",
  "value": "130402" },

{
  "label": "?????????",
  "value": "130403" },

{
  "label": "?????????",
  "value": "130404" },

{
  "label": "????????????",
  "value": "130406" },

{
  "label": "?????????",
  "value": "130407" },

{
  "label": "?????????",
  "value": "130408" },

{
  "label": "?????????",
  "value": "130423" },

{
  "label": "?????????",
  "value": "130424" },

{
  "label": "?????????",
  "value": "130425" },

{
  "label": "??????",
  "value": "130426" },

{
  "label": "??????",
  "value": "130427" },

{
  "label": "??????",
  "value": "130430" },

{
  "label": "?????????",
  "value": "130431" },

{
  "label": "?????????",
  "value": "130432" },

{
  "label": "?????????",
  "value": "130433" },

{
  "label": "??????",
  "value": "130434" },

{
  "label": "?????????",
  "value": "130435" },

{
  "label": "???????????????????????????",
  "value": "130471" },

{
  "label": "??????????????????",
  "value": "130473" },

{
  "label": "?????????",
  "value": "130481" }],


[{
  "label": "?????????",
  "value": "130502" },

{
  "label": "?????????",
  "value": "130503" },

{
  "label": "?????????",
  "value": "130521" },

{
  "label": "?????????",
  "value": "130522" },

{
  "label": "?????????",
  "value": "130523" },

{
  "label": "?????????",
  "value": "130524" },

{
  "label": "?????????",
  "value": "130525" },

{
  "label": "??????",
  "value": "130526" },

{
  "label": "?????????",
  "value": "130527" },

{
  "label": "?????????",
  "value": "130528" },

{
  "label": "?????????",
  "value": "130529" },

{
  "label": "?????????",
  "value": "130530" },

{
  "label": "?????????",
  "value": "130531" },

{
  "label": "?????????",
  "value": "130532" },

{
  "label": "??????",
  "value": "130533" },

{
  "label": "?????????",
  "value": "130534" },

{
  "label": "?????????",
  "value": "130535" },

{
  "label": "???????????????????????????",
  "value": "130571" },

{
  "label": "?????????",
  "value": "130581" },

{
  "label": "?????????",
  "value": "130582" }],


[{
  "label": "?????????",
  "value": "130602" },

{
  "label": "?????????",
  "value": "130606" },

{
  "label": "?????????",
  "value": "130607" },

{
  "label": "?????????",
  "value": "130608" },

{
  "label": "?????????",
  "value": "130609" },

{
  "label": "?????????",
  "value": "130623" },

{
  "label": "?????????",
  "value": "130624" },

{
  "label": "?????????",
  "value": "130626" },

{
  "label": "??????",
  "value": "130627" },

{
  "label": "?????????",
  "value": "130628" },

{
  "label": "?????????",
  "value": "130629" },

{
  "label": "?????????",
  "value": "130630" },

{
  "label": "?????????",
  "value": "130631" },

{
  "label": "?????????",
  "value": "130632" },

{
  "label": "??????",
  "value": "130633" },

{
  "label": "?????????",
  "value": "130634" },

{
  "label": "??????",
  "value": "130635" },

{
  "label": "?????????",
  "value": "130636" },

{
  "label": "?????????",
  "value": "130637" },

{
  "label": "??????",
  "value": "130638" },

{
  "label": "?????????????????????????????????",
  "value": "130671" },

{
  "label": "??????????????????",
  "value": "130672" },

{
  "label": "?????????",
  "value": "130681" },

{
  "label": "?????????",
  "value": "130682" },

{
  "label": "?????????",
  "value": "130683" },

{
  "label": "????????????",
  "value": "130684" }],


[{
  "label": "?????????",
  "value": "130702" },

{
  "label": "?????????",
  "value": "130703" },

{
  "label": "?????????",
  "value": "130705" },

{
  "label": "????????????",
  "value": "130706" },

{
  "label": "?????????",
  "value": "130708" },

{
  "label": "?????????",
  "value": "130709" },

{
  "label": "?????????",
  "value": "130722" },

{
  "label": "?????????",
  "value": "130723" },

{
  "label": "?????????",
  "value": "130724" },

{
  "label": "?????????",
  "value": "130725" },

{
  "label": "??????",
  "value": "130726" },

{
  "label": "?????????",
  "value": "130727" },

{
  "label": "?????????",
  "value": "130728" },

{
  "label": "?????????",
  "value": "130730" },

{
  "label": "?????????",
  "value": "130731" },

{
  "label": "?????????",
  "value": "130732" },

{
  "label": "???????????????????????????????????????",
  "value": "130771" },

{
  "label": "???????????????????????????",
  "value": "130772" },

{
  "label": "???????????????????????????",
  "value": "130773" }],


[{
  "label": "?????????",
  "value": "130802" },

{
  "label": "?????????",
  "value": "130803" },

{
  "label": "??????????????????",
  "value": "130804" },

{
  "label": "?????????",
  "value": "130821" },

{
  "label": "?????????",
  "value": "130822" },

{
  "label": "?????????",
  "value": "130824" },

{
  "label": "?????????",
  "value": "130825" },

{
  "label": "?????????????????????",
  "value": "130826" },

{
  "label": "?????????????????????",
  "value": "130827" },

{
  "label": "??????????????????????????????",
  "value": "130828" },

{
  "label": "?????????????????????????????????",
  "value": "130871" },

{
  "label": "?????????",
  "value": "130881" }],


[{
  "label": "?????????",
  "value": "130902" },

{
  "label": "?????????",
  "value": "130903" },

{
  "label": "??????",
  "value": "130921" },

{
  "label": "??????",
  "value": "130922" },

{
  "label": "?????????",
  "value": "130923" },

{
  "label": "?????????",
  "value": "130924" },

{
  "label": "?????????",
  "value": "130925" },

{
  "label": "?????????",
  "value": "130926" },

{
  "label": "?????????",
  "value": "130927" },

{
  "label": "?????????",
  "value": "130928" },

{
  "label": "??????",
  "value": "130929" },

{
  "label": "?????????????????????",
  "value": "130930" },

{
  "label": "???????????????????????????",
  "value": "130971" },

{
  "label": "?????????????????????????????????",
  "value": "130972" },

{
  "label": "??????????????????",
  "value": "130973" },

{
  "label": "?????????",
  "value": "130981" },

{
  "label": "?????????",
  "value": "130982" },

{
  "label": "?????????",
  "value": "130983" },

{
  "label": "?????????",
  "value": "130984" }],


[{
  "label": "?????????",
  "value": "131002" },

{
  "label": "?????????",
  "value": "131003" },

{
  "label": "?????????",
  "value": "131022" },

{
  "label": "?????????",
  "value": "131023" },

{
  "label": "?????????",
  "value": "131024" },

{
  "label": "?????????",
  "value": "131025" },

{
  "label": "?????????",
  "value": "131026" },

{
  "label": "?????????????????????",
  "value": "131028" },

{
  "label": "???????????????????????????",
  "value": "131071" },

{
  "label": "?????????",
  "value": "131081" },

{
  "label": "?????????",
  "value": "131082" }],


[{
  "label": "?????????",
  "value": "131102" },

{
  "label": "?????????",
  "value": "131103" },

{
  "label": "?????????",
  "value": "131121" },

{
  "label": "?????????",
  "value": "131122" },

{
  "label": "?????????",
  "value": "131123" },

{
  "label": "?????????",
  "value": "131124" },

{
  "label": "?????????",
  "value": "131125" },

{
  "label": "?????????",
  "value": "131126" },

{
  "label": "??????",
  "value": "131127" },

{
  "label": "?????????",
  "value": "131128" },

{
  "label": "???????????????????????????",
  "value": "131171" },

{
  "label": "??????????????????",
  "value": "131172" },

{
  "label": "?????????",
  "value": "131182" }]],



[
[{
  "label": "?????????",
  "value": "140105" },

{
  "label": "?????????",
  "value": "140106" },

{
  "label": "????????????",
  "value": "140107" },

{
  "label": "????????????",
  "value": "140108" },

{
  "label": "????????????",
  "value": "140109" },

{
  "label": "?????????",
  "value": "140110" },

{
  "label": "?????????",
  "value": "140121" },

{
  "label": "?????????",
  "value": "140122" },

{
  "label": "?????????",
  "value": "140123" },

{
  "label": "?????????????????????????????????",
  "value": "140171" },

{
  "label": "?????????",
  "value": "140181" }],


[{
  "label": "??????",
  "value": "140202" },

{
  "label": "??????",
  "value": "140203" },

{
  "label": "?????????",
  "value": "140211" },

{
  "label": "?????????",
  "value": "140212" },

{
  "label": "?????????",
  "value": "140221" },

{
  "label": "?????????",
  "value": "140222" },

{
  "label": "?????????",
  "value": "140223" },

{
  "label": "?????????",
  "value": "140224" },

{
  "label": "?????????",
  "value": "140225" },

{
  "label": "?????????",
  "value": "140226" },

{
  "label": "?????????",
  "value": "140227" },

{
  "label": "???????????????????????????",
  "value": "140271" }],


[{
  "label": "??????",
  "value": "140302" },

{
  "label": "??????",
  "value": "140303" },

{
  "label": "??????",
  "value": "140311" },

{
  "label": "?????????",
  "value": "140321" },

{
  "label": "??????",
  "value": "140322" },

{
  "label": "???????????????????????????",
  "value": "140371" }],


[{
  "label": "??????",
  "value": "140402" },

{
  "label": "??????",
  "value": "140411" },

{
  "label": "?????????",
  "value": "140421" },

{
  "label": "?????????",
  "value": "140423" },

{
  "label": "?????????",
  "value": "140424" },

{
  "label": "?????????",
  "value": "140425" },

{
  "label": "?????????",
  "value": "140426" },

{
  "label": "?????????",
  "value": "140427" },

{
  "label": "?????????",
  "value": "140428" },

{
  "label": "?????????",
  "value": "140429" },

{
  "label": "??????",
  "value": "140430" },

{
  "label": "?????????",
  "value": "140431" },

{
  "label": "????????????????????????????????????",
  "value": "140471" },

{
  "label": "?????????",
  "value": "140481" }],


[{
  "label": "??????",
  "value": "140502" },

{
  "label": "?????????",
  "value": "140521" },

{
  "label": "?????????",
  "value": "140522" },

{
  "label": "?????????",
  "value": "140524" },

{
  "label": "?????????",
  "value": "140525" },

{
  "label": "?????????",
  "value": "140581" }],


[{
  "label": "?????????",
  "value": "140602" },

{
  "label": "?????????",
  "value": "140603" },

{
  "label": "?????????",
  "value": "140621" },

{
  "label": "??????",
  "value": "140622" },

{
  "label": "?????????",
  "value": "140623" },

{
  "label": "?????????",
  "value": "140624" },

{
  "label": "???????????????????????????",
  "value": "140671" }],


[{
  "label": "?????????",
  "value": "140702" },

{
  "label": "?????????",
  "value": "140721" },

{
  "label": "?????????",
  "value": "140722" },

{
  "label": "?????????",
  "value": "140723" },

{
  "label": "?????????",
  "value": "140724" },

{
  "label": "?????????",
  "value": "140725" },

{
  "label": "?????????",
  "value": "140726" },

{
  "label": "??????",
  "value": "140727" },

{
  "label": "?????????",
  "value": "140728" },

{
  "label": "?????????",
  "value": "140729" },

{
  "label": "?????????",
  "value": "140781" }],


[{
  "label": "?????????",
  "value": "140802" },

{
  "label": "?????????",
  "value": "140821" },

{
  "label": "?????????",
  "value": "140822" },

{
  "label": "?????????",
  "value": "140823" },

{
  "label": "?????????",
  "value": "140824" },

{
  "label": "?????????",
  "value": "140825" },

{
  "label": "??????",
  "value": "140826" },

{
  "label": "?????????",
  "value": "140827" },

{
  "label": "??????",
  "value": "140828" },

{
  "label": "?????????",
  "value": "140829" },

{
  "label": "?????????",
  "value": "140830" },

{
  "label": "?????????",
  "value": "140881" },

{
  "label": "?????????",
  "value": "140882" }],


[{
  "label": "?????????",
  "value": "140902" },

{
  "label": "?????????",
  "value": "140921" },

{
  "label": "?????????",
  "value": "140922" },

{
  "label": "??????",
  "value": "140923" },

{
  "label": "?????????",
  "value": "140924" },

{
  "label": "?????????",
  "value": "140925" },

{
  "label": "?????????",
  "value": "140926" },

{
  "label": "?????????",
  "value": "140927" },

{
  "label": "?????????",
  "value": "140928" },

{
  "label": "?????????",
  "value": "140929" },

{
  "label": "?????????",
  "value": "140930" },

{
  "label": "?????????",
  "value": "140931" },

{
  "label": "?????????",
  "value": "140932" },

{
  "label": "????????????????????????",
  "value": "140971" },

{
  "label": "?????????",
  "value": "140981" }],


[{
  "label": "?????????",
  "value": "141002" },

{
  "label": "?????????",
  "value": "141021" },

{
  "label": "?????????",
  "value": "141022" },

{
  "label": "?????????",
  "value": "141023" },

{
  "label": "?????????",
  "value": "141024" },

{
  "label": "??????",
  "value": "141025" },

{
  "label": "?????????",
  "value": "141026" },

{
  "label": "?????????",
  "value": "141027" },

{
  "label": "??????",
  "value": "141028" },

{
  "label": "?????????",
  "value": "141029" },

{
  "label": "?????????",
  "value": "141030" },

{
  "label": "??????",
  "value": "141031" },

{
  "label": "?????????",
  "value": "141032" },

{
  "label": "??????",
  "value": "141033" },

{
  "label": "?????????",
  "value": "141034" },

{
  "label": "?????????",
  "value": "141081" },

{
  "label": "?????????",
  "value": "141082" }],


[{
  "label": "?????????",
  "value": "141102" },

{
  "label": "?????????",
  "value": "141121" },

{
  "label": "?????????",
  "value": "141122" },

{
  "label": "??????",
  "value": "141123" },

{
  "label": "??????",
  "value": "141124" },

{
  "label": "?????????",
  "value": "141125" },

{
  "label": "?????????",
  "value": "141126" },

{
  "label": "??????",
  "value": "141127" },

{
  "label": "?????????",
  "value": "141128" },

{
  "label": "?????????",
  "value": "141129" },

{
  "label": "?????????",
  "value": "141130" },

{
  "label": "?????????",
  "value": "141181" },

{
  "label": "?????????",
  "value": "141182" }]],



[
[{
  "label": "?????????",
  "value": "150102" },

{
  "label": "?????????",
  "value": "150103" },

{
  "label": "?????????",
  "value": "150104" },

{
  "label": "?????????",
  "value": "150105" },

{
  "label": "???????????????",
  "value": "150121" },

{
  "label": "????????????",
  "value": "150122" },

{
  "label": "???????????????",
  "value": "150123" },

{
  "label": "????????????",
  "value": "150124" },

{
  "label": "?????????",
  "value": "150125" },

{
  "label": "??????????????????????????????",
  "value": "150171" },

{
  "label": "?????????????????????????????????",
  "value": "150172" }],


[{
  "label": "?????????",
  "value": "150202" },

{
  "label": "????????????",
  "value": "150203" },

{
  "label": "?????????",
  "value": "150204" },

{
  "label": "?????????",
  "value": "150205" },

{
  "label": "??????????????????",
  "value": "150206" },

{
  "label": "?????????",
  "value": "150207" },

{
  "label": "???????????????",
  "value": "150221" },

{
  "label": "?????????",
  "value": "150222" },

{
  "label": "???????????????????????????",
  "value": "150223" },

{
  "label": "???????????????????????????????????????",
  "value": "150271" }],


[{
  "label": "????????????",
  "value": "150302" },

{
  "label": "?????????",
  "value": "150303" },

{
  "label": "?????????",
  "value": "150304" }],


[{
  "label": "?????????",
  "value": "150402" },

{
  "label": "????????????",
  "value": "150403" },

{
  "label": "?????????",
  "value": "150404" },

{
  "label": "??????????????????",
  "value": "150421" },

{
  "label": "????????????",
  "value": "150422" },

{
  "label": "????????????",
  "value": "150423" },

{
  "label": "?????????",
  "value": "150424" },

{
  "label": "???????????????",
  "value": "150425" },

{
  "label": "????????????",
  "value": "150426" },

{
  "label": "????????????",
  "value": "150428" },

{
  "label": "?????????",
  "value": "150429" },

{
  "label": "?????????",
  "value": "150430" }],


[{
  "label": "????????????",
  "value": "150502" },

{
  "label": "?????????????????????",
  "value": "150521" },

{
  "label": "?????????????????????",
  "value": "150522" },

{
  "label": "?????????",
  "value": "150523" },

{
  "label": "?????????",
  "value": "150524" },

{
  "label": "?????????",
  "value": "150525" },

{
  "label": "????????????",
  "value": "150526" },

{
  "label": "???????????????????????????",
  "value": "150571" },

{
  "label": "???????????????",
  "value": "150581" }],


[{
  "label": "?????????",
  "value": "150602" },

{
  "label": "????????????",
  "value": "150603" },

{
  "label": "????????????",
  "value": "150621" },

{
  "label": "????????????",
  "value": "150622" },

{
  "label": "???????????????",
  "value": "150623" },

{
  "label": "????????????",
  "value": "150624" },

{
  "label": "?????????",
  "value": "150625" },

{
  "label": "?????????",
  "value": "150626" },

{
  "label": "???????????????",
  "value": "150627" }],


[{
  "label": "????????????",
  "value": "150702" },

{
  "label": "???????????????",
  "value": "150703" },

{
  "label": "?????????",
  "value": "150721" },

{
  "label": "?????????????????????????????????",
  "value": "150722" },

{
  "label": "??????????????????",
  "value": "150723" },

{
  "label": "?????????????????????",
  "value": "150724" },

{
  "label": "???????????????",
  "value": "150725" },

{
  "label": "??????????????????",
  "value": "150726" },

{
  "label": "??????????????????",
  "value": "150727" },

{
  "label": "????????????",
  "value": "150781" },

{
  "label": "????????????",
  "value": "150782" },

{
  "label": "????????????",
  "value": "150783" },

{
  "label": "???????????????",
  "value": "150784" },

{
  "label": "?????????",
  "value": "150785" }],


[{
  "label": "?????????",
  "value": "150802" },

{
  "label": "?????????",
  "value": "150821" },

{
  "label": "?????????",
  "value": "150822" },

{
  "label": "???????????????",
  "value": "150823" },

{
  "label": "???????????????",
  "value": "150824" },

{
  "label": "???????????????",
  "value": "150825" },

{
  "label": "????????????",
  "value": "150826" }],


[{
  "label": "?????????",
  "value": "150902" },

{
  "label": "?????????",
  "value": "150921" },

{
  "label": "?????????",
  "value": "150922" },

{
  "label": "?????????",
  "value": "150923" },

{
  "label": "?????????",
  "value": "150924" },

{
  "label": "?????????",
  "value": "150925" },

{
  "label": "?????????????????????",
  "value": "150926" },

{
  "label": "?????????????????????",
  "value": "150927" },

{
  "label": "?????????????????????",
  "value": "150928" },

{
  "label": "????????????",
  "value": "150929" },

{
  "label": "?????????",
  "value": "150981" }],


[{
  "label": "???????????????",
  "value": "152201" },

{
  "label": "????????????",
  "value": "152202" },

{
  "label": "?????????????????????",
  "value": "152221" },

{
  "label": "?????????????????????",
  "value": "152222" },

{
  "label": "????????????",
  "value": "152223" },

{
  "label": "?????????",
  "value": "152224" }],


[{
  "label": "???????????????",
  "value": "152501" },

{
  "label": "???????????????",
  "value": "152502" },

{
  "label": "????????????",
  "value": "152522" },

{
  "label": "???????????????",
  "value": "152523" },

{
  "label": "???????????????",
  "value": "152524" },

{
  "label": "??????????????????",
  "value": "152525" },

{
  "label": "??????????????????",
  "value": "152526" },

{
  "label": "????????????",
  "value": "152527" },

{
  "label": "?????????",
  "value": "152528" },

{
  "label": "????????????",
  "value": "152529" },

{
  "label": "?????????",
  "value": "152530" },

{
  "label": "?????????",
  "value": "152531" },

{
  "label": "??????????????????",
  "value": "152571" }],


[{
  "label": "???????????????",
  "value": "152921" },

{
  "label": "???????????????",
  "value": "152922" },

{
  "label": "????????????",
  "value": "152923" },

{
  "label": "?????????????????????????????????",
  "value": "152971" }]],



[
[{
  "label": "?????????",
  "value": "210102" },

{
  "label": "?????????",
  "value": "210103" },

{
  "label": "?????????",
  "value": "210104" },

{
  "label": "?????????",
  "value": "210105" },

{
  "label": "?????????",
  "value": "210106" },

{
  "label": "????????????",
  "value": "210111" },

{
  "label": "?????????",
  "value": "210112" },

{
  "label": "????????????",
  "value": "210113" },

{
  "label": "?????????",
  "value": "210114" },

{
  "label": "?????????",
  "value": "210115" },

{
  "label": "?????????",
  "value": "210123" },

{
  "label": "?????????",
  "value": "210124" },

{
  "label": "?????????",
  "value": "210181" }],


[{
  "label": "?????????",
  "value": "210202" },

{
  "label": "?????????",
  "value": "210203" },

{
  "label": "????????????",
  "value": "210204" },

{
  "label": "????????????",
  "value": "210211" },

{
  "label": "????????????",
  "value": "210212" },

{
  "label": "?????????",
  "value": "210213" },

{
  "label": "????????????",
  "value": "210214" },

{
  "label": "?????????",
  "value": "210224" },

{
  "label": "????????????",
  "value": "210281" },

{
  "label": "?????????",
  "value": "210283" }],


[{
  "label": "?????????",
  "value": "210302" },

{
  "label": "?????????",
  "value": "210303" },

{
  "label": "?????????",
  "value": "210304" },

{
  "label": "?????????",
  "value": "210311" },

{
  "label": "?????????",
  "value": "210321" },

{
  "label": "?????????????????????",
  "value": "210323" },

{
  "label": "?????????",
  "value": "210381" }],


[{
  "label": "?????????",
  "value": "210402" },

{
  "label": "?????????",
  "value": "210403" },

{
  "label": "?????????",
  "value": "210404" },

{
  "label": "?????????",
  "value": "210411" },

{
  "label": "?????????",
  "value": "210421" },

{
  "label": "?????????????????????",
  "value": "210422" },

{
  "label": "?????????????????????",
  "value": "210423" }],


[{
  "label": "?????????",
  "value": "210502" },

{
  "label": "?????????",
  "value": "210503" },

{
  "label": "?????????",
  "value": "210504" },

{
  "label": "?????????",
  "value": "210505" },

{
  "label": "?????????????????????",
  "value": "210521" },

{
  "label": "?????????????????????",
  "value": "210522" }],


[{
  "label": "?????????",
  "value": "210602" },

{
  "label": "?????????",
  "value": "210603" },

{
  "label": "?????????",
  "value": "210604" },

{
  "label": "?????????????????????",
  "value": "210624" },

{
  "label": "?????????",
  "value": "210681" },

{
  "label": "?????????",
  "value": "210682" }],


[{
  "label": "?????????",
  "value": "210702" },

{
  "label": "?????????",
  "value": "210703" },

{
  "label": "?????????",
  "value": "210711" },

{
  "label": "?????????",
  "value": "210726" },

{
  "label": "??????",
  "value": "210727" },

{
  "label": "?????????",
  "value": "210781" },

{
  "label": "?????????",
  "value": "210782" }],


[{
  "label": "?????????",
  "value": "210802" },

{
  "label": "?????????",
  "value": "210803" },

{
  "label": "????????????",
  "value": "210804" },

{
  "label": "?????????",
  "value": "210811" },

{
  "label": "?????????",
  "value": "210881" },

{
  "label": "????????????",
  "value": "210882" }],


[{
  "label": "?????????",
  "value": "210902" },

{
  "label": "?????????",
  "value": "210903" },

{
  "label": "?????????",
  "value": "210904" },

{
  "label": "????????????",
  "value": "210905" },

{
  "label": "?????????",
  "value": "210911" },

{
  "label": "????????????????????????",
  "value": "210921" },

{
  "label": "?????????",
  "value": "210922" }],


[{
  "label": "?????????",
  "value": "211002" },

{
  "label": "?????????",
  "value": "211003" },

{
  "label": "?????????",
  "value": "211004" },

{
  "label": "????????????",
  "value": "211005" },

{
  "label": "????????????",
  "value": "211011" },

{
  "label": "?????????",
  "value": "211021" },

{
  "label": "?????????",
  "value": "211081" }],


[{
  "label": "????????????",
  "value": "211102" },

{
  "label": "????????????",
  "value": "211103" },

{
  "label": "?????????",
  "value": "211104" },

{
  "label": "?????????",
  "value": "211122" }],


[{
  "label": "?????????",
  "value": "211202" },

{
  "label": "?????????",
  "value": "211204" },

{
  "label": "?????????",
  "value": "211221" },

{
  "label": "?????????",
  "value": "211223" },

{
  "label": "?????????",
  "value": "211224" },

{
  "label": "????????????",
  "value": "211281" },

{
  "label": "?????????",
  "value": "211282" }],


[{
  "label": "?????????",
  "value": "211302" },

{
  "label": "?????????",
  "value": "211303" },

{
  "label": "?????????",
  "value": "211321" },

{
  "label": "?????????",
  "value": "211322" },

{
  "label": "?????????????????????????????????",
  "value": "211324" },

{
  "label": "?????????",
  "value": "211381" },

{
  "label": "?????????",
  "value": "211382" }],


[{
  "label": "?????????",
  "value": "211402" },

{
  "label": "?????????",
  "value": "211403" },

{
  "label": "?????????",
  "value": "211404" },

{
  "label": "?????????",
  "value": "211421" },

{
  "label": "?????????",
  "value": "211422" },

{
  "label": "?????????",
  "value": "211481" }]],



[
[{
  "label": "?????????",
  "value": "220102" },

{
  "label": "?????????",
  "value": "220103" },

{
  "label": "?????????",
  "value": "220104" },

{
  "label": "?????????",
  "value": "220105" },

{
  "label": "?????????",
  "value": "220106" },

{
  "label": "?????????",
  "value": "220112" },

{
  "label": "?????????",
  "value": "220113" },

{
  "label": "?????????",
  "value": "220122" },

{
  "label": "???????????????????????????",
  "value": "220171" },

{
  "label": "???????????????????????????????????????",
  "value": "220172" },

{
  "label": "?????????????????????????????????",
  "value": "220173" },

{
  "label": "?????????????????????????????????",
  "value": "220174" },

{
  "label": "?????????",
  "value": "220182" },

{
  "label": "?????????",
  "value": "220183" }],


[{
  "label": "?????????",
  "value": "220202" },

{
  "label": "?????????",
  "value": "220203" },

{
  "label": "?????????",
  "value": "220204" },

{
  "label": "?????????",
  "value": "220211" },

{
  "label": "?????????",
  "value": "220221" },

{
  "label": "?????????????????????",
  "value": "220271" },

{
  "label": "?????????????????????????????????",
  "value": "220272" },

{
  "label": "??????????????????????????????",
  "value": "220273" },

{
  "label": "?????????",
  "value": "220281" },

{
  "label": "?????????",
  "value": "220282" },

{
  "label": "?????????",
  "value": "220283" },

{
  "label": "?????????",
  "value": "220284" }],


[{
  "label": "?????????",
  "value": "220302" },

{
  "label": "?????????",
  "value": "220303" },

{
  "label": "?????????",
  "value": "220322" },

{
  "label": "?????????????????????",
  "value": "220323" },

{
  "label": "????????????",
  "value": "220381" },

{
  "label": "?????????",
  "value": "220382" }],


[{
  "label": "?????????",
  "value": "220402" },

{
  "label": "?????????",
  "value": "220403" },

{
  "label": "?????????",
  "value": "220421" },

{
  "label": "?????????",
  "value": "220422" }],


[{
  "label": "?????????",
  "value": "220502" },

{
  "label": "????????????",
  "value": "220503" },

{
  "label": "?????????",
  "value": "220521" },

{
  "label": "?????????",
  "value": "220523" },

{
  "label": "?????????",
  "value": "220524" },

{
  "label": "????????????",
  "value": "220581" },

{
  "label": "?????????",
  "value": "220582" }],


[{
  "label": "?????????",
  "value": "220602" },

{
  "label": "?????????",
  "value": "220605" },

{
  "label": "?????????",
  "value": "220621" },

{
  "label": "?????????",
  "value": "220622" },

{
  "label": "????????????????????????",
  "value": "220623" },

{
  "label": "?????????",
  "value": "220681" }],


[{
  "label": "?????????",
  "value": "220702" },

{
  "label": "?????????????????????????????????",
  "value": "220721" },

{
  "label": "?????????",
  "value": "220722" },

{
  "label": "?????????",
  "value": "220723" },

{
  "label": "???????????????????????????",
  "value": "220771" },

{
  "label": "?????????",
  "value": "220781" }],


[{
  "label": "?????????",
  "value": "220802" },

{
  "label": "?????????",
  "value": "220821" },

{
  "label": "?????????",
  "value": "220822" },

{
  "label": "???????????????????????????",
  "value": "220871" },

{
  "label": "?????????",
  "value": "220881" },

{
  "label": "?????????",
  "value": "220882" }],


[{
  "label": "?????????",
  "value": "222401" },

{
  "label": "?????????",
  "value": "222402" },

{
  "label": "?????????",
  "value": "222403" },

{
  "label": "?????????",
  "value": "222404" },

{
  "label": "?????????",
  "value": "222405" },

{
  "label": "?????????",
  "value": "222406" },

{
  "label": "?????????",
  "value": "222424" },

{
  "label": "?????????",
  "value": "222426" }]],



[
[{
  "label": "?????????",
  "value": "230102" },

{
  "label": "?????????",
  "value": "230103" },

{
  "label": "?????????",
  "value": "230104" },

{
  "label": "?????????",
  "value": "230108" },

{
  "label": "?????????",
  "value": "230109" },

{
  "label": "?????????",
  "value": "230110" },

{
  "label": "?????????",
  "value": "230111" },

{
  "label": "?????????",
  "value": "230112" },

{
  "label": "?????????",
  "value": "230113" },

{
  "label": "?????????",
  "value": "230123" },

{
  "label": "?????????",
  "value": "230124" },

{
  "label": "??????",
  "value": "230125" },

{
  "label": "?????????",
  "value": "230126" },

{
  "label": "?????????",
  "value": "230127" },

{
  "label": "?????????",
  "value": "230128" },

{
  "label": "?????????",
  "value": "230129" },

{
  "label": "?????????",
  "value": "230183" },

{
  "label": "?????????",
  "value": "230184" }],


[{
  "label": "?????????",
  "value": "230202" },

{
  "label": "?????????",
  "value": "230203" },

{
  "label": "?????????",
  "value": "230204" },

{
  "label": "????????????",
  "value": "230205" },

{
  "label": "???????????????",
  "value": "230206" },

{
  "label": "????????????",
  "value": "230207" },

{
  "label": "????????????????????????",
  "value": "230208" },

{
  "label": "?????????",
  "value": "230221" },

{
  "label": "?????????",
  "value": "230223" },

{
  "label": "?????????",
  "value": "230224" },

{
  "label": "?????????",
  "value": "230225" },

{
  "label": "?????????",
  "value": "230227" },

{
  "label": "?????????",
  "value": "230229" },

{
  "label": "?????????",
  "value": "230230" },

{
  "label": "?????????",
  "value": "230231" },

{
  "label": "?????????",
  "value": "230281" }],


[{
  "label": "?????????",
  "value": "230302" },

{
  "label": "?????????",
  "value": "230303" },

{
  "label": "?????????",
  "value": "230304" },

{
  "label": "?????????",
  "value": "230305" },

{
  "label": "????????????",
  "value": "230306" },

{
  "label": "?????????",
  "value": "230307" },

{
  "label": "?????????",
  "value": "230321" },

{
  "label": "?????????",
  "value": "230381" },

{
  "label": "?????????",
  "value": "230382" }],


[{
  "label": "?????????",
  "value": "230402" },

{
  "label": "?????????",
  "value": "230403" },

{
  "label": "?????????",
  "value": "230404" },

{
  "label": "?????????",
  "value": "230405" },

{
  "label": "?????????",
  "value": "230406" },

{
  "label": "?????????",
  "value": "230407" },

{
  "label": "?????????",
  "value": "230421" },

{
  "label": "?????????",
  "value": "230422" }],


[{
  "label": "?????????",
  "value": "230502" },

{
  "label": "?????????",
  "value": "230503" },

{
  "label": "????????????",
  "value": "230505" },

{
  "label": "?????????",
  "value": "230506" },

{
  "label": "?????????",
  "value": "230521" },

{
  "label": "?????????",
  "value": "230522" },

{
  "label": "?????????",
  "value": "230523" },

{
  "label": "?????????",
  "value": "230524" }],


[{
  "label": "????????????",
  "value": "230602" },

{
  "label": "?????????",
  "value": "230603" },

{
  "label": "????????????",
  "value": "230604" },

{
  "label": "?????????",
  "value": "230605" },

{
  "label": "?????????",
  "value": "230606" },

{
  "label": "?????????",
  "value": "230621" },

{
  "label": "?????????",
  "value": "230622" },

{
  "label": "?????????",
  "value": "230623" },

{
  "label": "??????????????????????????????",
  "value": "230624" },

{
  "label": "?????????????????????????????????",
  "value": "230671" }],


[{
  "label": "?????????",
  "value": "230702" },

{
  "label": "?????????",
  "value": "230703" },

{
  "label": "?????????",
  "value": "230704" },

{
  "label": "?????????",
  "value": "230705" },

{
  "label": "?????????",
  "value": "230706" },

{
  "label": "?????????",
  "value": "230707" },

{
  "label": "?????????",
  "value": "230708" },

{
  "label": "????????????",
  "value": "230709" },

{
  "label": "?????????",
  "value": "230710" },

{
  "label": "????????????",
  "value": "230711" },

{
  "label": "????????????",
  "value": "230712" },

{
  "label": "?????????",
  "value": "230713" },

{
  "label": "????????????",
  "value": "230714" },

{
  "label": "?????????",
  "value": "230715" },

{
  "label": "????????????",
  "value": "230716" },

{
  "label": "?????????",
  "value": "230722" },

{
  "label": "?????????",
  "value": "230781" }],


[{
  "label": "?????????",
  "value": "230803" },

{
  "label": "?????????",
  "value": "230804" },

{
  "label": "?????????",
  "value": "230805" },

{
  "label": "??????",
  "value": "230811" },

{
  "label": "?????????",
  "value": "230822" },

{
  "label": "?????????",
  "value": "230826" },

{
  "label": "?????????",
  "value": "230828" },

{
  "label": "?????????",
  "value": "230881" },

{
  "label": "?????????",
  "value": "230882" },

{
  "label": "?????????",
  "value": "230883" }],


[{
  "label": "?????????",
  "value": "230902" },

{
  "label": "?????????",
  "value": "230903" },

{
  "label": "????????????",
  "value": "230904" },

{
  "label": "?????????",
  "value": "230921" }],


[{
  "label": "?????????",
  "value": "231002" },

{
  "label": "?????????",
  "value": "231003" },

{
  "label": "?????????",
  "value": "231004" },

{
  "label": "?????????",
  "value": "231005" },

{
  "label": "?????????",
  "value": "231025" },

{
  "label": "??????????????????????????????",
  "value": "231071" },

{
  "label": "????????????",
  "value": "231081" },

{
  "label": "?????????",
  "value": "231083" },

{
  "label": "?????????",
  "value": "231084" },

{
  "label": "?????????",
  "value": "231085" },

{
  "label": "?????????",
  "value": "231086" }],


[{
  "label": "?????????",
  "value": "231102" },

{
  "label": "?????????",
  "value": "231121" },

{
  "label": "?????????",
  "value": "231123" },

{
  "label": "?????????",
  "value": "231124" },

{
  "label": "?????????",
  "value": "231181" },

{
  "label": "???????????????",
  "value": "231182" }],


[{
  "label": "?????????",
  "value": "231202" },

{
  "label": "?????????",
  "value": "231221" },

{
  "label": "?????????",
  "value": "231222" },

{
  "label": "?????????",
  "value": "231223" },

{
  "label": "?????????",
  "value": "231224" },

{
  "label": "?????????",
  "value": "231225" },

{
  "label": "?????????",
  "value": "231226" },

{
  "label": "?????????",
  "value": "231281" },

{
  "label": "?????????",
  "value": "231282" },

{
  "label": "?????????",
  "value": "231283" }],


[{
  "label": "???????????????",
  "value": "232701" },

{
  "label": "?????????",
  "value": "232702" },

{
  "label": "?????????",
  "value": "232703" },

{
  "label": "?????????",
  "value": "232704" },

{
  "label": "?????????",
  "value": "232721" },

{
  "label": "?????????",
  "value": "232722" },

{
  "label": "?????????",
  "value": "232723" }]],



[
[{
  "label": "?????????",
  "value": "310101" },

{
  "label": "?????????",
  "value": "310104" },

{
  "label": "?????????",
  "value": "310105" },

{
  "label": "?????????",
  "value": "310106" },

{
  "label": "?????????",
  "value": "310107" },

{
  "label": "?????????",
  "value": "310109" },

{
  "label": "?????????",
  "value": "310110" },

{
  "label": "?????????",
  "value": "310112" },

{
  "label": "?????????",
  "value": "310113" },

{
  "label": "?????????",
  "value": "310114" },

{
  "label": "????????????",
  "value": "310115" },

{
  "label": "?????????",
  "value": "310116" },

{
  "label": "?????????",
  "value": "310117" },

{
  "label": "?????????",
  "value": "310118" },

{
  "label": "?????????",
  "value": "310120" },

{
  "label": "?????????",
  "value": "310151" }]],



[
[{
  "label": "?????????",
  "value": "320102" },

{
  "label": "?????????",
  "value": "320104" },

{
  "label": "?????????",
  "value": "320105" },

{
  "label": "?????????",
  "value": "320106" },

{
  "label": "?????????",
  "value": "320111" },

{
  "label": "?????????",
  "value": "320113" },

{
  "label": "????????????",
  "value": "320114" },

{
  "label": "?????????",
  "value": "320115" },

{
  "label": "?????????",
  "value": "320116" },

{
  "label": "?????????",
  "value": "320117" },

{
  "label": "?????????",
  "value": "320118" }],


[{
  "label": "?????????",
  "value": "320205" },

{
  "label": "?????????",
  "value": "320206" },

{
  "label": "?????????",
  "value": "320211" },

{
  "label": "?????????",
  "value": "320213" },

{
  "label": "?????????",
  "value": "320214" },

{
  "label": "?????????",
  "value": "320281" },

{
  "label": "?????????",
  "value": "320282" }],


[{
  "label": "?????????",
  "value": "320302" },

{
  "label": "?????????",
  "value": "320303" },

{
  "label": "?????????",
  "value": "320305" },

{
  "label": "?????????",
  "value": "320311" },

{
  "label": "?????????",
  "value": "320312" },

{
  "label": "??????",
  "value": "320321" },

{
  "label": "??????",
  "value": "320322" },

{
  "label": "?????????",
  "value": "320324" },

{
  "label": "???????????????????????????",
  "value": "320371" },

{
  "label": "?????????",
  "value": "320381" },

{
  "label": "?????????",
  "value": "320382" }],


[{
  "label": "?????????",
  "value": "320402" },

{
  "label": "?????????",
  "value": "320404" },

{
  "label": "?????????",
  "value": "320411" },

{
  "label": "?????????",
  "value": "320412" },

{
  "label": "?????????",
  "value": "320413" },

{
  "label": "?????????",
  "value": "320481" }],


[{
  "label": "?????????",
  "value": "320505" },

{
  "label": "?????????",
  "value": "320506" },

{
  "label": "?????????",
  "value": "320507" },

{
  "label": "?????????",
  "value": "320508" },

{
  "label": "?????????",
  "value": "320509" },

{
  "label": "??????????????????",
  "value": "320571" },

{
  "label": "?????????",
  "value": "320581" },

{
  "label": "????????????",
  "value": "320582" },

{
  "label": "?????????",
  "value": "320583" },

{
  "label": "?????????",
  "value": "320585" }],


[{
  "label": "?????????",
  "value": "320602" },

{
  "label": "?????????",
  "value": "320611" },

{
  "label": "?????????",
  "value": "320612" },

{
  "label": "?????????",
  "value": "320621" },

{
  "label": "?????????",
  "value": "320623" },

{
  "label": "???????????????????????????",
  "value": "320671" },

{
  "label": "?????????",
  "value": "320681" },

{
  "label": "?????????",
  "value": "320682" },

{
  "label": "?????????",
  "value": "320684" }],


[{
  "label": "?????????",
  "value": "320703" },

{
  "label": "?????????",
  "value": "320706" },

{
  "label": "?????????",
  "value": "320707" },

{
  "label": "?????????",
  "value": "320722" },

{
  "label": "?????????",
  "value": "320723" },

{
  "label": "?????????",
  "value": "320724" },

{
  "label": "??????????????????????????????",
  "value": "320771" },

{
  "label": "????????????????????????????????????",
  "value": "320772" }],


[{
  "label": "?????????",
  "value": "320803" },

{
  "label": "?????????",
  "value": "320804" },

{
  "label": "????????????",
  "value": "320812" },

{
  "label": "?????????",
  "value": "320813" },

{
  "label": "?????????",
  "value": "320826" },

{
  "label": "?????????",
  "value": "320830" },

{
  "label": "?????????",
  "value": "320831" },

{
  "label": "???????????????????????????",
  "value": "320871" }],


[{
  "label": "?????????",
  "value": "320902" },

{
  "label": "?????????",
  "value": "320903" },

{
  "label": "?????????",
  "value": "320904" },

{
  "label": "?????????",
  "value": "320921" },

{
  "label": "?????????",
  "value": "320922" },

{
  "label": "?????????",
  "value": "320923" },

{
  "label": "?????????",
  "value": "320924" },

{
  "label": "?????????",
  "value": "320925" },

{
  "label": "???????????????????????????",
  "value": "320971" },

{
  "label": "?????????",
  "value": "320981" }],


[{
  "label": "?????????",
  "value": "321002" },

{
  "label": "?????????",
  "value": "321003" },

{
  "label": "?????????",
  "value": "321012" },

{
  "label": "?????????",
  "value": "321023" },

{
  "label": "???????????????????????????",
  "value": "321071" },

{
  "label": "?????????",
  "value": "321081" },

{
  "label": "?????????",
  "value": "321084" }],


[{
  "label": "?????????",
  "value": "321102" },

{
  "label": "?????????",
  "value": "321111" },

{
  "label": "?????????",
  "value": "321112" },

{
  "label": "????????????",
  "value": "321171" },

{
  "label": "?????????",
  "value": "321181" },

{
  "label": "?????????",
  "value": "321182" },

{
  "label": "?????????",
  "value": "321183" }],


[{
  "label": "?????????",
  "value": "321202" },

{
  "label": "?????????",
  "value": "321203" },

{
  "label": "?????????",
  "value": "321204" },

{
  "label": "???????????????????????????????????????",
  "value": "321271" },

{
  "label": "?????????",
  "value": "321281" },

{
  "label": "?????????",
  "value": "321282" },

{
  "label": "?????????",
  "value": "321283" }],


[{
  "label": "?????????",
  "value": "321302" },

{
  "label": "?????????",
  "value": "321311" },

{
  "label": "?????????",
  "value": "321322" },

{
  "label": "?????????",
  "value": "321323" },

{
  "label": "?????????",
  "value": "321324" },

{
  "label": "???????????????????????????",
  "value": "321371" }]],



[
[{
  "label": "?????????",
  "value": "330102" },

{
  "label": "?????????",
  "value": "330103" },

{
  "label": "?????????",
  "value": "330104" },

{
  "label": "?????????",
  "value": "330105" },

{
  "label": "?????????",
  "value": "330106" },

{
  "label": "?????????",
  "value": "330108" },

{
  "label": "?????????",
  "value": "330109" },

{
  "label": "?????????",
  "value": "330110" },

{
  "label": "?????????",
  "value": "330111" },

{
  "label": "?????????",
  "value": "330112" },

{
  "label": "?????????",
  "value": "330122" },

{
  "label": "?????????",
  "value": "330127" },

{
  "label": "?????????",
  "value": "330182" }],


[{
  "label": "?????????",
  "value": "330203" },

{
  "label": "?????????",
  "value": "330205" },

{
  "label": "?????????",
  "value": "330206" },

{
  "label": "?????????",
  "value": "330211" },

{
  "label": "?????????",
  "value": "330212" },

{
  "label": "?????????",
  "value": "330213" },

{
  "label": "?????????",
  "value": "330225" },

{
  "label": "?????????",
  "value": "330226" },

{
  "label": "?????????",
  "value": "330281" },

{
  "label": "?????????",
  "value": "330282" }],


[{
  "label": "?????????",
  "value": "330302" },

{
  "label": "?????????",
  "value": "330303" },

{
  "label": "?????????",
  "value": "330304" },

{
  "label": "?????????",
  "value": "330305" },

{
  "label": "?????????",
  "value": "330324" },

{
  "label": "?????????",
  "value": "330326" },

{
  "label": "?????????",
  "value": "330327" },

{
  "label": "?????????",
  "value": "330328" },

{
  "label": "?????????",
  "value": "330329" },

{
  "label": "???????????????????????????",
  "value": "330371" },

{
  "label": "?????????",
  "value": "330381" },

{
  "label": "?????????",
  "value": "330382" }],


[{
  "label": "?????????",
  "value": "330402" },

{
  "label": "?????????",
  "value": "330411" },

{
  "label": "?????????",
  "value": "330421" },

{
  "label": "?????????",
  "value": "330424" },

{
  "label": "?????????",
  "value": "330481" },

{
  "label": "?????????",
  "value": "330482" },

{
  "label": "?????????",
  "value": "330483" }],


[{
  "label": "?????????",
  "value": "330502" },

{
  "label": "?????????",
  "value": "330503" },

{
  "label": "?????????",
  "value": "330521" },

{
  "label": "?????????",
  "value": "330522" },

{
  "label": "?????????",
  "value": "330523" }],


[{
  "label": "?????????",
  "value": "330602" },

{
  "label": "?????????",
  "value": "330603" },

{
  "label": "?????????",
  "value": "330604" },

{
  "label": "?????????",
  "value": "330624" },

{
  "label": "?????????",
  "value": "330681" },

{
  "label": "?????????",
  "value": "330683" }],


[{
  "label": "?????????",
  "value": "330702" },

{
  "label": "?????????",
  "value": "330703" },

{
  "label": "?????????",
  "value": "330723" },

{
  "label": "?????????",
  "value": "330726" },

{
  "label": "?????????",
  "value": "330727" },

{
  "label": "?????????",
  "value": "330781" },

{
  "label": "?????????",
  "value": "330782" },

{
  "label": "?????????",
  "value": "330783" },

{
  "label": "?????????",
  "value": "330784" }],


[{
  "label": "?????????",
  "value": "330802" },

{
  "label": "?????????",
  "value": "330803" },

{
  "label": "?????????",
  "value": "330822" },

{
  "label": "?????????",
  "value": "330824" },

{
  "label": "?????????",
  "value": "330825" },

{
  "label": "?????????",
  "value": "330881" }],


[{
  "label": "?????????",
  "value": "330902" },

{
  "label": "?????????",
  "value": "330903" },

{
  "label": "?????????",
  "value": "330921" },

{
  "label": "?????????",
  "value": "330922" }],


[{
  "label": "?????????",
  "value": "331002" },

{
  "label": "?????????",
  "value": "331003" },

{
  "label": "?????????",
  "value": "331004" },

{
  "label": "?????????",
  "value": "331022" },

{
  "label": "?????????",
  "value": "331023" },

{
  "label": "?????????",
  "value": "331024" },

{
  "label": "?????????",
  "value": "331081" },

{
  "label": "?????????",
  "value": "331082" },

{
  "label": "?????????",
  "value": "331083" }],


[{
  "label": "?????????",
  "value": "331102" },

{
  "label": "?????????",
  "value": "331121" },

{
  "label": "?????????",
  "value": "331122" },

{
  "label": "?????????",
  "value": "331123" },

{
  "label": "?????????",
  "value": "331124" },

{
  "label": "?????????",
  "value": "331125" },

{
  "label": "?????????",
  "value": "331126" },

{
  "label": "?????????????????????",
  "value": "331127" },

{
  "label": "?????????",
  "value": "331181" }]],



[
[{
  "label": "?????????",
  "value": "340102" },

{
  "label": "?????????",
  "value": "340103" },

{
  "label": "?????????",
  "value": "340104" },

{
  "label": "?????????",
  "value": "340111" },

{
  "label": "?????????",
  "value": "340121" },

{
  "label": "?????????",
  "value": "340122" },

{
  "label": "?????????",
  "value": "340123" },

{
  "label": "?????????",
  "value": "340124" },

{
  "label": "?????????????????????????????????",
  "value": "340171" },

{
  "label": "???????????????????????????",
  "value": "340172" },

{
  "label": "???????????????????????????????????????",
  "value": "340173" },

{
  "label": "?????????",
  "value": "340181" }],


[{
  "label": "?????????",
  "value": "340202" },

{
  "label": "?????????",
  "value": "340203" },

{
  "label": "?????????",
  "value": "340207" },

{
  "label": "?????????",
  "value": "340208" },

{
  "label": "?????????",
  "value": "340221" },

{
  "label": "?????????",
  "value": "340222" },

{
  "label": "?????????",
  "value": "340223" },

{
  "label": "?????????",
  "value": "340225" },

{
  "label": "???????????????????????????",
  "value": "340271" },

{
  "label": "???????????????????????????????????????",
  "value": "340272" }],


[{
  "label": "????????????",
  "value": "340302" },

{
  "label": "?????????",
  "value": "340303" },

{
  "label": "?????????",
  "value": "340304" },

{
  "label": "?????????",
  "value": "340311" },

{
  "label": "?????????",
  "value": "340321" },

{
  "label": "?????????",
  "value": "340322" },

{
  "label": "?????????",
  "value": "340323" },

{
  "label": "??????????????????????????????",
  "value": "340371" },

{
  "label": "????????????????????????",
  "value": "340372" }],


[{
  "label": "?????????",
  "value": "340402" },

{
  "label": "????????????",
  "value": "340403" },

{
  "label": "????????????",
  "value": "340404" },

{
  "label": "????????????",
  "value": "340405" },

{
  "label": "?????????",
  "value": "340406" },

{
  "label": "?????????",
  "value": "340421" },

{
  "label": "??????",
  "value": "340422" }],


[{
  "label": "?????????",
  "value": "340503" },

{
  "label": "?????????",
  "value": "340504" },

{
  "label": "?????????",
  "value": "340506" },

{
  "label": "?????????",
  "value": "340521" },

{
  "label": "?????????",
  "value": "340522" },

{
  "label": "??????",
  "value": "340523" }],


[{
  "label": "?????????",
  "value": "340602" },

{
  "label": "?????????",
  "value": "340603" },

{
  "label": "?????????",
  "value": "340604" },

{
  "label": "?????????",
  "value": "340621" }],


[{
  "label": "?????????",
  "value": "340705" },

{
  "label": "?????????",
  "value": "340706" },

{
  "label": "??????",
  "value": "340711" },

{
  "label": "?????????",
  "value": "340722" }],


[{
  "label": "?????????",
  "value": "340802" },

{
  "label": "?????????",
  "value": "340803" },

{
  "label": "?????????",
  "value": "340811" },

{
  "label": "?????????",
  "value": "340822" },

{
  "label": "?????????",
  "value": "340824" },

{
  "label": "?????????",
  "value": "340825" },

{
  "label": "?????????",
  "value": "340826" },

{
  "label": "?????????",
  "value": "340827" },

{
  "label": "?????????",
  "value": "340828" },

{
  "label": "???????????????????????????",
  "value": "340871" },

{
  "label": "?????????",
  "value": "340881" }],


[{
  "label": "?????????",
  "value": "341002" },

{
  "label": "?????????",
  "value": "341003" },

{
  "label": "?????????",
  "value": "341004" },

{
  "label": "??????",
  "value": "341021" },

{
  "label": "?????????",
  "value": "341022" },

{
  "label": "??????",
  "value": "341023" },

{
  "label": "?????????",
  "value": "341024" }],


[{
  "label": "?????????",
  "value": "341102" },

{
  "label": "?????????",
  "value": "341103" },

{
  "label": "?????????",
  "value": "341122" },

{
  "label": "?????????",
  "value": "341124" },

{
  "label": "?????????",
  "value": "341125" },

{
  "label": "?????????",
  "value": "341126" },

{
  "label": "?????????????????????",
  "value": "341171" },

{
  "label": "???????????????????????????",
  "value": "341172" },

{
  "label": "?????????",
  "value": "341181" },

{
  "label": "?????????",
  "value": "341182" }],


[{
  "label": "?????????",
  "value": "341202" },

{
  "label": "?????????",
  "value": "341203" },

{
  "label": "?????????",
  "value": "341204" },

{
  "label": "?????????",
  "value": "341221" },

{
  "label": "?????????",
  "value": "341222" },

{
  "label": "?????????",
  "value": "341225" },

{
  "label": "?????????",
  "value": "341226" },

{
  "label": "??????????????????????????????",
  "value": "341271" },

{
  "label": "???????????????????????????",
  "value": "341272" },

{
  "label": "?????????",
  "value": "341282" }],


[{
  "label": "?????????",
  "value": "341302" },

{
  "label": "?????????",
  "value": "341321" },

{
  "label": "??????",
  "value": "341322" },

{
  "label": "?????????",
  "value": "341323" },

{
  "label": "??????",
  "value": "341324" },

{
  "label": "?????????????????????????????????",
  "value": "341371" },

{
  "label": "???????????????????????????",
  "value": "341372" }],


[{
  "label": "?????????",
  "value": "341502" },

{
  "label": "?????????",
  "value": "341503" },

{
  "label": "?????????",
  "value": "341504" },

{
  "label": "?????????",
  "value": "341522" },

{
  "label": "?????????",
  "value": "341523" },

{
  "label": "?????????",
  "value": "341524" },

{
  "label": "?????????",
  "value": "341525" }],


[{
  "label": "?????????",
  "value": "341602" },

{
  "label": "?????????",
  "value": "341621" },

{
  "label": "?????????",
  "value": "341622" },

{
  "label": "?????????",
  "value": "341623" }],


[{
  "label": "?????????",
  "value": "341702" },

{
  "label": "?????????",
  "value": "341721" },

{
  "label": "?????????",
  "value": "341722" },

{
  "label": "?????????",
  "value": "341723" }],


[{
  "label": "?????????",
  "value": "341802" },

{
  "label": "?????????",
  "value": "341821" },

{
  "label": "?????????",
  "value": "341822" },

{
  "label": "??????",
  "value": "341823" },

{
  "label": "?????????",
  "value": "341824" },

{
  "label": "?????????",
  "value": "341825" },

{
  "label": "????????????????????????",
  "value": "341871" },

{
  "label": "?????????",
  "value": "341881" }]],



[
[{
  "label": "?????????",
  "value": "350102" },

{
  "label": "?????????",
  "value": "350103" },

{
  "label": "?????????",
  "value": "350104" },

{
  "label": "?????????",
  "value": "350105" },

{
  "label": "?????????",
  "value": "350111" },

{
  "label": "?????????",
  "value": "350121" },

{
  "label": "?????????",
  "value": "350122" },

{
  "label": "?????????",
  "value": "350123" },

{
  "label": "?????????",
  "value": "350124" },

{
  "label": "?????????",
  "value": "350125" },

{
  "label": "?????????",
  "value": "350128" },

{
  "label": "?????????",
  "value": "350181" },

{
  "label": "?????????",
  "value": "350182" }],


[{
  "label": "?????????",
  "value": "350203" },

{
  "label": "?????????",
  "value": "350205" },

{
  "label": "?????????",
  "value": "350206" },

{
  "label": "?????????",
  "value": "350211" },

{
  "label": "?????????",
  "value": "350212" },

{
  "label": "?????????",
  "value": "350213" }],


[{
  "label": "?????????",
  "value": "350302" },

{
  "label": "?????????",
  "value": "350303" },

{
  "label": "?????????",
  "value": "350304" },

{
  "label": "?????????",
  "value": "350305" },

{
  "label": "?????????",
  "value": "350322" }],


[{
  "label": "?????????",
  "value": "350402" },

{
  "label": "?????????",
  "value": "350403" },

{
  "label": "?????????",
  "value": "350421" },

{
  "label": "?????????",
  "value": "350423" },

{
  "label": "?????????",
  "value": "350424" },

{
  "label": "?????????",
  "value": "350425" },

{
  "label": "?????????",
  "value": "350426" },

{
  "label": "??????",
  "value": "350427" },

{
  "label": "?????????",
  "value": "350428" },

{
  "label": "?????????",
  "value": "350429" },

{
  "label": "?????????",
  "value": "350430" },

{
  "label": "?????????",
  "value": "350481" }],


[{
  "label": "?????????",
  "value": "350502" },

{
  "label": "?????????",
  "value": "350503" },

{
  "label": "?????????",
  "value": "350504" },

{
  "label": "?????????",
  "value": "350505" },

{
  "label": "?????????",
  "value": "350521" },

{
  "label": "?????????",
  "value": "350524" },

{
  "label": "?????????",
  "value": "350525" },

{
  "label": "?????????",
  "value": "350526" },

{
  "label": "?????????",
  "value": "350527" },

{
  "label": "?????????",
  "value": "350581" },

{
  "label": "?????????",
  "value": "350582" },

{
  "label": "?????????",
  "value": "350583" }],


[{
  "label": "?????????",
  "value": "350602" },

{
  "label": "?????????",
  "value": "350603" },

{
  "label": "?????????",
  "value": "350622" },

{
  "label": "?????????",
  "value": "350623" },

{
  "label": "?????????",
  "value": "350624" },

{
  "label": "?????????",
  "value": "350625" },

{
  "label": "?????????",
  "value": "350626" },

{
  "label": "?????????",
  "value": "350627" },

{
  "label": "?????????",
  "value": "350628" },

{
  "label": "?????????",
  "value": "350629" },

{
  "label": "?????????",
  "value": "350681" }],


[{
  "label": "?????????",
  "value": "350702" },

{
  "label": "?????????",
  "value": "350703" },

{
  "label": "?????????",
  "value": "350721" },

{
  "label": "?????????",
  "value": "350722" },

{
  "label": "?????????",
  "value": "350723" },

{
  "label": "?????????",
  "value": "350724" },

{
  "label": "?????????",
  "value": "350725" },

{
  "label": "?????????",
  "value": "350781" },

{
  "label": "????????????",
  "value": "350782" },

{
  "label": "?????????",
  "value": "350783" }],


[{
  "label": "?????????",
  "value": "350802" },

{
  "label": "?????????",
  "value": "350803" },

{
  "label": "?????????",
  "value": "350821" },

{
  "label": "?????????",
  "value": "350823" },

{
  "label": "?????????",
  "value": "350824" },

{
  "label": "?????????",
  "value": "350825" },

{
  "label": "?????????",
  "value": "350881" }],


[{
  "label": "?????????",
  "value": "350902" },

{
  "label": "?????????",
  "value": "350921" },

{
  "label": "?????????",
  "value": "350922" },

{
  "label": "?????????",
  "value": "350923" },

{
  "label": "?????????",
  "value": "350924" },

{
  "label": "?????????",
  "value": "350925" },

{
  "label": "?????????",
  "value": "350926" },

{
  "label": "?????????",
  "value": "350981" },

{
  "label": "?????????",
  "value": "350982" }]],



[
[{
  "label": "?????????",
  "value": "360102" },

{
  "label": "?????????",
  "value": "360103" },

{
  "label": "????????????",
  "value": "360104" },

{
  "label": "?????????",
  "value": "360105" },

{
  "label": "????????????",
  "value": "360111" },

{
  "label": "?????????",
  "value": "360112" },

{
  "label": "?????????",
  "value": "360121" },

{
  "label": "?????????",
  "value": "360123" },

{
  "label": "?????????",
  "value": "360124" }],


[{
  "label": "?????????",
  "value": "360202" },

{
  "label": "?????????",
  "value": "360203" },

{
  "label": "?????????",
  "value": "360222" },

{
  "label": "?????????",
  "value": "360281" }],


[{
  "label": "?????????",
  "value": "360302" },

{
  "label": "?????????",
  "value": "360313" },

{
  "label": "?????????",
  "value": "360321" },

{
  "label": "?????????",
  "value": "360322" },

{
  "label": "?????????",
  "value": "360323" }],


[{
  "label": "?????????",
  "value": "360402" },

{
  "label": "?????????",
  "value": "360403" },

{
  "label": "?????????",
  "value": "360404" },

{
  "label": "?????????",
  "value": "360423" },

{
  "label": "?????????",
  "value": "360424" },

{
  "label": "?????????",
  "value": "360425" },

{
  "label": "?????????",
  "value": "360426" },

{
  "label": "?????????",
  "value": "360428" },

{
  "label": "?????????",
  "value": "360429" },

{
  "label": "?????????",
  "value": "360430" },

{
  "label": "?????????",
  "value": "360481" },

{
  "label": "????????????",
  "value": "360482" },

{
  "label": "?????????",
  "value": "360483" }],


[{
  "label": "?????????",
  "value": "360502" },

{
  "label": "?????????",
  "value": "360521" }],


[{
  "label": "?????????",
  "value": "360602" },

{
  "label": "?????????",
  "value": "360622" },

{
  "label": "?????????",
  "value": "360681" }],


[{
  "label": "?????????",
  "value": "360702" },

{
  "label": "?????????",
  "value": "360703" },

{
  "label": "?????????",
  "value": "360704" },

{
  "label": "?????????",
  "value": "360722" },

{
  "label": "?????????",
  "value": "360723" },

{
  "label": "?????????",
  "value": "360724" },

{
  "label": "?????????",
  "value": "360725" },

{
  "label": "?????????",
  "value": "360726" },

{
  "label": "?????????",
  "value": "360727" },

{
  "label": "?????????",
  "value": "360728" },

{
  "label": "?????????",
  "value": "360729" },

{
  "label": "?????????",
  "value": "360730" },

{
  "label": "?????????",
  "value": "360731" },

{
  "label": "?????????",
  "value": "360732" },

{
  "label": "?????????",
  "value": "360733" },

{
  "label": "?????????",
  "value": "360734" },

{
  "label": "?????????",
  "value": "360735" },

{
  "label": "?????????",
  "value": "360781" }],


[{
  "label": "?????????",
  "value": "360802" },

{
  "label": "?????????",
  "value": "360803" },

{
  "label": "?????????",
  "value": "360821" },

{
  "label": "?????????",
  "value": "360822" },

{
  "label": "?????????",
  "value": "360823" },

{
  "label": "?????????",
  "value": "360824" },

{
  "label": "?????????",
  "value": "360825" },

{
  "label": "?????????",
  "value": "360826" },

{
  "label": "?????????",
  "value": "360827" },

{
  "label": "?????????",
  "value": "360828" },

{
  "label": "?????????",
  "value": "360829" },

{
  "label": "?????????",
  "value": "360830" },

{
  "label": "????????????",
  "value": "360881" }],


[{
  "label": "?????????",
  "value": "360902" },

{
  "label": "?????????",
  "value": "360921" },

{
  "label": "?????????",
  "value": "360922" },

{
  "label": "?????????",
  "value": "360923" },

{
  "label": "?????????",
  "value": "360924" },

{
  "label": "?????????",
  "value": "360925" },

{
  "label": "?????????",
  "value": "360926" },

{
  "label": "?????????",
  "value": "360981" },

{
  "label": "?????????",
  "value": "360982" },

{
  "label": "?????????",
  "value": "360983" }],


[{
  "label": "?????????",
  "value": "361002" },

{
  "label": "?????????",
  "value": "361003" },

{
  "label": "?????????",
  "value": "361021" },

{
  "label": "?????????",
  "value": "361022" },

{
  "label": "?????????",
  "value": "361023" },

{
  "label": "?????????",
  "value": "361024" },

{
  "label": "?????????",
  "value": "361025" },

{
  "label": "?????????",
  "value": "361026" },

{
  "label": "?????????",
  "value": "361027" },

{
  "label": "?????????",
  "value": "361028" },

{
  "label": "?????????",
  "value": "361030" }],


[{
  "label": "?????????",
  "value": "361102" },

{
  "label": "?????????",
  "value": "361103" },

{
  "label": "?????????",
  "value": "361121" },

{
  "label": "?????????",
  "value": "361123" },

{
  "label": "?????????",
  "value": "361124" },

{
  "label": "?????????",
  "value": "361125" },

{
  "label": "?????????",
  "value": "361126" },

{
  "label": "?????????",
  "value": "361127" },

{
  "label": "?????????",
  "value": "361128" },

{
  "label": "?????????",
  "value": "361129" },

{
  "label": "?????????",
  "value": "361130" },

{
  "label": "?????????",
  "value": "361181" }]],



[
[{
  "label": "?????????",
  "value": "370102" },

{
  "label": "?????????",
  "value": "370103" },

{
  "label": "?????????",
  "value": "370104" },

{
  "label": "?????????",
  "value": "370105" },

{
  "label": "?????????",
  "value": "370112" },

{
  "label": "?????????",
  "value": "370113" },

{
  "label": "?????????",
  "value": "370114" },

{
  "label": "?????????",
  "value": "370124" },

{
  "label": "?????????",
  "value": "370125" },

{
  "label": "?????????",
  "value": "370126" },

{
  "label": "?????????????????????????????????",
  "value": "370171" }],


[{
  "label": "?????????",
  "value": "370202" },

{
  "label": "?????????",
  "value": "370203" },

{
  "label": "?????????",
  "value": "370211" },

{
  "label": "?????????",
  "value": "370212" },

{
  "label": "?????????",
  "value": "370213" },

{
  "label": "?????????",
  "value": "370214" },

{
  "label": "?????????",
  "value": "370215" },

{
  "label": "?????????????????????????????????",
  "value": "370271" },

{
  "label": "?????????",
  "value": "370281" },

{
  "label": "?????????",
  "value": "370283" },

{
  "label": "?????????",
  "value": "370285" }],


[{
  "label": "?????????",
  "value": "370302" },

{
  "label": "?????????",
  "value": "370303" },

{
  "label": "?????????",
  "value": "370304" },

{
  "label": "?????????",
  "value": "370305" },

{
  "label": "?????????",
  "value": "370306" },

{
  "label": "?????????",
  "value": "370321" },

{
  "label": "?????????",
  "value": "370322" },

{
  "label": "?????????",
  "value": "370323" }],


[{
  "label": "?????????",
  "value": "370402" },

{
  "label": "?????????",
  "value": "370403" },

{
  "label": "?????????",
  "value": "370404" },

{
  "label": "????????????",
  "value": "370405" },

{
  "label": "?????????",
  "value": "370406" },

{
  "label": "?????????",
  "value": "370481" }],


[{
  "label": "?????????",
  "value": "370502" },

{
  "label": "?????????",
  "value": "370503" },

{
  "label": "?????????",
  "value": "370505" },

{
  "label": "?????????",
  "value": "370522" },

{
  "label": "?????????",
  "value": "370523" },

{
  "label": "???????????????????????????",
  "value": "370571" },

{
  "label": "????????????????????????",
  "value": "370572" }],


[{
  "label": "?????????",
  "value": "370602" },

{
  "label": "?????????",
  "value": "370611" },

{
  "label": "?????????",
  "value": "370612" },

{
  "label": "?????????",
  "value": "370613" },

{
  "label": "?????????",
  "value": "370634" },

{
  "label": "?????????????????????????????????",
  "value": "370671" },

{
  "label": "???????????????????????????",
  "value": "370672" },

{
  "label": "?????????",
  "value": "370681" },

{
  "label": "?????????",
  "value": "370682" },

{
  "label": "?????????",
  "value": "370683" },

{
  "label": "?????????",
  "value": "370684" },

{
  "label": "?????????",
  "value": "370685" },

{
  "label": "?????????",
  "value": "370686" },

{
  "label": "?????????",
  "value": "370687" }],


[{
  "label": "?????????",
  "value": "370702" },

{
  "label": "?????????",
  "value": "370703" },

{
  "label": "?????????",
  "value": "370704" },

{
  "label": "?????????",
  "value": "370705" },

{
  "label": "?????????",
  "value": "370724" },

{
  "label": "?????????",
  "value": "370725" },

{
  "label": "?????????????????????????????????",
  "value": "370772" },

{
  "label": "?????????",
  "value": "370781" },

{
  "label": "?????????",
  "value": "370782" },

{
  "label": "?????????",
  "value": "370783" },

{
  "label": "?????????",
  "value": "370784" },

{
  "label": "?????????",
  "value": "370785" },

{
  "label": "?????????",
  "value": "370786" }],


[{
  "label": "?????????",
  "value": "370811" },

{
  "label": "?????????",
  "value": "370812" },

{
  "label": "?????????",
  "value": "370826" },

{
  "label": "?????????",
  "value": "370827" },

{
  "label": "?????????",
  "value": "370828" },

{
  "label": "?????????",
  "value": "370829" },

{
  "label": "?????????",
  "value": "370830" },

{
  "label": "?????????",
  "value": "370831" },

{
  "label": "?????????",
  "value": "370832" },

{
  "label": "?????????????????????????????????",
  "value": "370871" },

{
  "label": "?????????",
  "value": "370881" },

{
  "label": "?????????",
  "value": "370883" }],


[{
  "label": "?????????",
  "value": "370902" },

{
  "label": "?????????",
  "value": "370911" },

{
  "label": "?????????",
  "value": "370921" },

{
  "label": "?????????",
  "value": "370923" },

{
  "label": "?????????",
  "value": "370982" },

{
  "label": "?????????",
  "value": "370983" }],


[{
  "label": "?????????",
  "value": "371002" },

{
  "label": "?????????",
  "value": "371003" },

{
  "label": "????????????????????????????????????",
  "value": "371071" },

{
  "label": "???????????????????????????",
  "value": "371072" },

{
  "label": "?????????????????????????????????",
  "value": "371073" },

{
  "label": "?????????",
  "value": "371082" },

{
  "label": "?????????",
  "value": "371083" }],


[{
  "label": "?????????",
  "value": "371102" },

{
  "label": "?????????",
  "value": "371103" },

{
  "label": "?????????",
  "value": "371121" },

{
  "label": "??????",
  "value": "371122" },

{
  "label": "???????????????????????????",
  "value": "371171" },

{
  "label": "?????????????????????",
  "value": "371172" }],


[{
  "label": "?????????",
  "value": "371202" },

{
  "label": "?????????",
  "value": "371203" }],


[{
  "label": "?????????",
  "value": "371302" },

{
  "label": "?????????",
  "value": "371311" },

{
  "label": "?????????",
  "value": "371312" },

{
  "label": "?????????",
  "value": "371321" },

{
  "label": "?????????",
  "value": "371322" },

{
  "label": "?????????",
  "value": "371323" },

{
  "label": "?????????",
  "value": "371324" },

{
  "label": "??????",
  "value": "371325" },

{
  "label": "?????????",
  "value": "371326" },

{
  "label": "?????????",
  "value": "371327" },

{
  "label": "?????????",
  "value": "371328" },

{
  "label": "?????????",
  "value": "371329" },

{
  "label": "?????????????????????????????????",
  "value": "371371" },

{
  "label": "???????????????????????????",
  "value": "371372" },

{
  "label": "???????????????????????????",
  "value": "371373" }],


[{
  "label": "?????????",
  "value": "371402" },

{
  "label": "?????????",
  "value": "371403" },

{
  "label": "?????????",
  "value": "371422" },

{
  "label": "?????????",
  "value": "371423" },

{
  "label": "?????????",
  "value": "371424" },

{
  "label": "?????????",
  "value": "371425" },

{
  "label": "?????????",
  "value": "371426" },

{
  "label": "?????????",
  "value": "371427" },

{
  "label": "?????????",
  "value": "371428" },

{
  "label": "???????????????????????????",
  "value": "371471" },

{
  "label": "???????????????????????????",
  "value": "371472" },

{
  "label": "?????????",
  "value": "371481" },

{
  "label": "?????????",
  "value": "371482" }],


[{
  "label": "????????????",
  "value": "371502" },

{
  "label": "?????????",
  "value": "371521" },

{
  "label": "??????",
  "value": "371522" },

{
  "label": "?????????",
  "value": "371523" },

{
  "label": "?????????",
  "value": "371524" },

{
  "label": "??????",
  "value": "371525" },

{
  "label": "?????????",
  "value": "371526" },

{
  "label": "?????????",
  "value": "371581" }],


[{
  "label": "?????????",
  "value": "371602" },

{
  "label": "?????????",
  "value": "371603" },

{
  "label": "?????????",
  "value": "371621" },

{
  "label": "?????????",
  "value": "371622" },

{
  "label": "?????????",
  "value": "371623" },

{
  "label": "?????????",
  "value": "371625" },

{
  "label": "?????????",
  "value": "371626" }],


[{
  "label": "?????????",
  "value": "371702" },

{
  "label": "?????????",
  "value": "371703" },

{
  "label": "??????",
  "value": "371721" },

{
  "label": "??????",
  "value": "371722" },

{
  "label": "?????????",
  "value": "371723" },

{
  "label": "?????????",
  "value": "371724" },

{
  "label": "?????????",
  "value": "371725" },

{
  "label": "?????????",
  "value": "371726" },

{
  "label": "?????????",
  "value": "371728" },

{
  "label": "???????????????????????????",
  "value": "371771" },

{
  "label": "???????????????????????????",
  "value": "371772" }]],



[
[{
  "label": "?????????",
  "value": "410102" },

{
  "label": "?????????",
  "value": "410103" },

{
  "label": "???????????????",
  "value": "410104" },

{
  "label": "?????????",
  "value": "410105" },

{
  "label": "?????????",
  "value": "410106" },

{
  "label": "?????????",
  "value": "410108" },

{
  "label": "?????????",
  "value": "410122" },

{
  "label": "???????????????????????????",
  "value": "410171" },

{
  "label": "?????????????????????????????????",
  "value": "410172" },

{
  "label": "????????????????????????????????????",
  "value": "410173" },

{
  "label": "?????????",
  "value": "410181" },

{
  "label": "?????????",
  "value": "410182" },

{
  "label": "?????????",
  "value": "410183" },

{
  "label": "?????????",
  "value": "410184" },

{
  "label": "?????????",
  "value": "410185" }],


[{
  "label": "?????????",
  "value": "410202" },

{
  "label": "???????????????",
  "value": "410203" },

{
  "label": "?????????",
  "value": "410204" },

{
  "label": "????????????",
  "value": "410205" },

{
  "label": "?????????",
  "value": "410212" },

{
  "label": "??????",
  "value": "410221" },

{
  "label": "?????????",
  "value": "410222" },

{
  "label": "?????????",
  "value": "410223" },

{
  "label": "?????????",
  "value": "410225" }],


[{
  "label": "?????????",
  "value": "410302" },

{
  "label": "?????????",
  "value": "410303" },

{
  "label": "???????????????",
  "value": "410304" },

{
  "label": "?????????",
  "value": "410305" },

{
  "label": "?????????",
  "value": "410306" },

{
  "label": "?????????",
  "value": "410311" },

{
  "label": "?????????",
  "value": "410322" },

{
  "label": "?????????",
  "value": "410323" },

{
  "label": "?????????",
  "value": "410324" },

{
  "label": "??????",
  "value": "410325" },

{
  "label": "?????????",
  "value": "410326" },

{
  "label": "?????????",
  "value": "410327" },

{
  "label": "?????????",
  "value": "410328" },

{
  "label": "?????????",
  "value": "410329" },

{
  "label": "?????????????????????????????????",
  "value": "410371" },

{
  "label": "?????????",
  "value": "410381" }],


[{
  "label": "?????????",
  "value": "410402" },

{
  "label": "?????????",
  "value": "410403" },

{
  "label": "?????????",
  "value": "410404" },

{
  "label": "?????????",
  "value": "410411" },

{
  "label": "?????????",
  "value": "410421" },

{
  "label": "??????",
  "value": "410422" },

{
  "label": "?????????",
  "value": "410423" },

{
  "label": "??????",
  "value": "410425" },

{
  "label": "????????????????????????????????????",
  "value": "410471" },

{
  "label": "?????????????????????",
  "value": "410472" },

{
  "label": "?????????",
  "value": "410481" },

{
  "label": "?????????",
  "value": "410482" }],


[{
  "label": "?????????",
  "value": "410502" },

{
  "label": "?????????",
  "value": "410503" },

{
  "label": "?????????",
  "value": "410505" },

{
  "label": "?????????",
  "value": "410506" },

{
  "label": "?????????",
  "value": "410522" },

{
  "label": "?????????",
  "value": "410523" },

{
  "label": "??????",
  "value": "410526" },

{
  "label": "?????????",
  "value": "410527" },

{
  "label": "?????????????????????????????????",
  "value": "410571" },

{
  "label": "?????????",
  "value": "410581" }],


[{
  "label": "?????????",
  "value": "410602" },

{
  "label": "?????????",
  "value": "410603" },

{
  "label": "?????????",
  "value": "410611" },

{
  "label": "??????",
  "value": "410621" },

{
  "label": "??????",
  "value": "410622" },

{
  "label": "???????????????????????????",
  "value": "410671" }],


[{
  "label": "?????????",
  "value": "410702" },

{
  "label": "?????????",
  "value": "410703" },

{
  "label": "?????????",
  "value": "410704" },

{
  "label": "?????????",
  "value": "410711" },

{
  "label": "?????????",
  "value": "410721" },

{
  "label": "?????????",
  "value": "410724" },

{
  "label": "?????????",
  "value": "410725" },

{
  "label": "?????????",
  "value": "410726" },

{
  "label": "?????????",
  "value": "410727" },

{
  "label": "?????????",
  "value": "410728" },

{
  "label": "?????????????????????????????????",
  "value": "410771" },

{
  "label": "???????????????????????????",
  "value": "410772" },

{
  "label": "???????????????????????????????????????",
  "value": "410773" },

{
  "label": "?????????",
  "value": "410781" },

{
  "label": "?????????",
  "value": "410782" }],


[{
  "label": "?????????",
  "value": "410802" },

{
  "label": "?????????",
  "value": "410803" },

{
  "label": "?????????",
  "value": "410804" },

{
  "label": "?????????",
  "value": "410811" },

{
  "label": "?????????",
  "value": "410821" },

{
  "label": "?????????",
  "value": "410822" },

{
  "label": "?????????",
  "value": "410823" },

{
  "label": "??????",
  "value": "410825" },

{
  "label": "??????????????????????????????",
  "value": "410871" },

{
  "label": "?????????",
  "value": "410882" },

{
  "label": "?????????",
  "value": "410883" }],


[{
  "label": "?????????",
  "value": "410902" },

{
  "label": "?????????",
  "value": "410922" },

{
  "label": "?????????",
  "value": "410923" },

{
  "label": "??????",
  "value": "410926" },

{
  "label": "?????????",
  "value": "410927" },

{
  "label": "?????????",
  "value": "410928" },

{
  "label": "????????????????????????",
  "value": "410971" },

{
  "label": "???????????????????????????",
  "value": "410972" }],


[{
  "label": "?????????",
  "value": "411002" },

{
  "label": "?????????",
  "value": "411003" },

{
  "label": "?????????",
  "value": "411024" },

{
  "label": "?????????",
  "value": "411025" },

{
  "label": "???????????????????????????",
  "value": "411071" },

{
  "label": "?????????",
  "value": "411081" },

{
  "label": "?????????",
  "value": "411082" }],


[{
  "label": "?????????",
  "value": "411102" },

{
  "label": "?????????",
  "value": "411103" },

{
  "label": "?????????",
  "value": "411104" },

{
  "label": "?????????",
  "value": "411121" },

{
  "label": "?????????",
  "value": "411122" },

{
  "label": "???????????????????????????",
  "value": "411171" }],


[{
  "label": "?????????",
  "value": "411202" },

{
  "label": "?????????",
  "value": "411203" },

{
  "label": "?????????",
  "value": "411221" },

{
  "label": "?????????",
  "value": "411224" },

{
  "label": "??????????????????????????????",
  "value": "411271" },

{
  "label": "?????????",
  "value": "411281" },

{
  "label": "?????????",
  "value": "411282" }],


[{
  "label": "?????????",
  "value": "411302" },

{
  "label": "?????????",
  "value": "411303" },

{
  "label": "?????????",
  "value": "411321" },

{
  "label": "?????????",
  "value": "411322" },

{
  "label": "?????????",
  "value": "411323" },

{
  "label": "?????????",
  "value": "411324" },

{
  "label": "?????????",
  "value": "411325" },

{
  "label": "?????????",
  "value": "411326" },

{
  "label": "?????????",
  "value": "411327" },

{
  "label": "?????????",
  "value": "411328" },

{
  "label": "?????????",
  "value": "411329" },

{
  "label": "?????????",
  "value": "411330" },

{
  "label": "?????????????????????????????????",
  "value": "411371" },

{
  "label": "?????????????????????????????????",
  "value": "411372" },

{
  "label": "?????????",
  "value": "411381" }],


[{
  "label": "?????????",
  "value": "411402" },

{
  "label": "?????????",
  "value": "411403" },

{
  "label": "?????????",
  "value": "411421" },

{
  "label": "??????",
  "value": "411422" },

{
  "label": "?????????",
  "value": "411423" },

{
  "label": "?????????",
  "value": "411424" },

{
  "label": "?????????",
  "value": "411425" },

{
  "label": "?????????",
  "value": "411426" },

{
  "label": "?????????????????????????????????",
  "value": "411471" },

{
  "label": "???????????????????????????",
  "value": "411472" },

{
  "label": "?????????",
  "value": "411481" }],


[{
  "label": "?????????",
  "value": "411502" },

{
  "label": "?????????",
  "value": "411503" },

{
  "label": "?????????",
  "value": "411521" },

{
  "label": "?????????",
  "value": "411522" },

{
  "label": "??????",
  "value": "411523" },

{
  "label": "?????????",
  "value": "411524" },

{
  "label": "?????????",
  "value": "411525" },

{
  "label": "?????????",
  "value": "411526" },

{
  "label": "?????????",
  "value": "411527" },

{
  "label": "??????",
  "value": "411528" },

{
  "label": "?????????????????????????????????",
  "value": "411571" }],


[{
  "label": "?????????",
  "value": "411602" },

{
  "label": "?????????",
  "value": "411621" },

{
  "label": "?????????",
  "value": "411622" },

{
  "label": "?????????",
  "value": "411623" },

{
  "label": "?????????",
  "value": "411624" },

{
  "label": "?????????",
  "value": "411625" },

{
  "label": "?????????",
  "value": "411626" },

{
  "label": "?????????",
  "value": "411627" },

{
  "label": "?????????",
  "value": "411628" },

{
  "label": "???????????????????????????",
  "value": "411671" },

{
  "label": "?????????",
  "value": "411681" }],


[{
  "label": "?????????",
  "value": "411702" },

{
  "label": "?????????",
  "value": "411721" },

{
  "label": "?????????",
  "value": "411722" },

{
  "label": "?????????",
  "value": "411723" },

{
  "label": "?????????",
  "value": "411724" },

{
  "label": "?????????",
  "value": "411725" },

{
  "label": "?????????",
  "value": "411726" },

{
  "label": "?????????",
  "value": "411727" },

{
  "label": "?????????",
  "value": "411728" },

{
  "label": "?????????",
  "value": "411729" },

{
  "label": "??????????????????????????????",
  "value": "411771" }],


[{
  "label": "?????????",
  "value": "419001" }]],


[
[{
  "label": "?????????",
  "value": "420102" },

{
  "label": "?????????",
  "value": "420103" },

{
  "label": "?????????",
  "value": "420104" },

{
  "label": "?????????",
  "value": "420105" },

{
  "label": "?????????",
  "value": "420106" },

{
  "label": "?????????",
  "value": "420107" },

{
  "label": "?????????",
  "value": "420111" },

{
  "label": "????????????",
  "value": "420112" },

{
  "label": "?????????",
  "value": "420113" },

{
  "label": "?????????",
  "value": "420114" },

{
  "label": "?????????",
  "value": "420115" },

{
  "label": "?????????",
  "value": "420116" },

{
  "label": "?????????",
  "value": "420117" }],


[{
  "label": "????????????",
  "value": "420202" },

{
  "label": "????????????",
  "value": "420203" },

{
  "label": "?????????",
  "value": "420204" },

{
  "label": "?????????",
  "value": "420205" },

{
  "label": "?????????",
  "value": "420222" },

{
  "label": "?????????",
  "value": "420281" }],


[{
  "label": "?????????",
  "value": "420302" },

{
  "label": "?????????",
  "value": "420303" },

{
  "label": "?????????",
  "value": "420304" },

{
  "label": "?????????",
  "value": "420322" },

{
  "label": "?????????",
  "value": "420323" },

{
  "label": "?????????",
  "value": "420324" },

{
  "label": "??????",
  "value": "420325" },

{
  "label": "????????????",
  "value": "420381" }],


[{
  "label": "?????????",
  "value": "420502" },

{
  "label": "????????????",
  "value": "420503" },

{
  "label": "?????????",
  "value": "420504" },

{
  "label": "?????????",
  "value": "420505" },

{
  "label": "?????????",
  "value": "420506" },

{
  "label": "?????????",
  "value": "420525" },

{
  "label": "?????????",
  "value": "420526" },

{
  "label": "?????????",
  "value": "420527" },

{
  "label": "????????????????????????",
  "value": "420528" },

{
  "label": "????????????????????????",
  "value": "420529" },

{
  "label": "?????????",
  "value": "420581" },

{
  "label": "?????????",
  "value": "420582" },

{
  "label": "?????????",
  "value": "420583" }],


[{
  "label": "?????????",
  "value": "420602" },

{
  "label": "?????????",
  "value": "420606" },

{
  "label": "?????????",
  "value": "420607" },

{
  "label": "?????????",
  "value": "420624" },

{
  "label": "?????????",
  "value": "420625" },

{
  "label": "?????????",
  "value": "420626" },

{
  "label": "????????????",
  "value": "420682" },

{
  "label": "?????????",
  "value": "420683" },

{
  "label": "?????????",
  "value": "420684" }],


[{
  "label": "????????????",
  "value": "420702" },

{
  "label": "?????????",
  "value": "420703" },

{
  "label": "?????????",
  "value": "420704" }],


[{
  "label": "?????????",
  "value": "420802" },

{
  "label": "?????????",
  "value": "420804" },

{
  "label": "?????????",
  "value": "420821" },

{
  "label": "?????????",
  "value": "420822" },

{
  "label": "?????????",
  "value": "420881" }],


[{
  "label": "?????????",
  "value": "420902" },

{
  "label": "?????????",
  "value": "420921" },

{
  "label": "?????????",
  "value": "420922" },

{
  "label": "?????????",
  "value": "420923" },

{
  "label": "?????????",
  "value": "420981" },

{
  "label": "?????????",
  "value": "420982" },

{
  "label": "?????????",
  "value": "420984" }],


[{
  "label": "?????????",
  "value": "421002" },

{
  "label": "?????????",
  "value": "421003" },

{
  "label": "?????????",
  "value": "421022" },

{
  "label": "?????????",
  "value": "421023" },

{
  "label": "?????????",
  "value": "421024" },

{
  "label": "???????????????????????????",
  "value": "421071" },

{
  "label": "?????????",
  "value": "421081" },

{
  "label": "?????????",
  "value": "421083" },

{
  "label": "?????????",
  "value": "421087" }],


[{
  "label": "?????????",
  "value": "421102" },

{
  "label": "?????????",
  "value": "421121" },

{
  "label": "?????????",
  "value": "421122" },

{
  "label": "?????????",
  "value": "421123" },

{
  "label": "?????????",
  "value": "421124" },

{
  "label": "?????????",
  "value": "421125" },

{
  "label": "?????????",
  "value": "421126" },

{
  "label": "?????????",
  "value": "421127" },

{
  "label": "??????????????????",
  "value": "421171" },

{
  "label": "?????????",
  "value": "421181" },

{
  "label": "?????????",
  "value": "421182" }],


[{
  "label": "?????????",
  "value": "421202" },

{
  "label": "?????????",
  "value": "421221" },

{
  "label": "?????????",
  "value": "421222" },

{
  "label": "?????????",
  "value": "421223" },

{
  "label": "?????????",
  "value": "421224" },

{
  "label": "?????????",
  "value": "421281" }],


[{
  "label": "?????????",
  "value": "421303" },

{
  "label": "??????",
  "value": "421321" },

{
  "label": "?????????",
  "value": "421381" }],


[{
  "label": "?????????",
  "value": "422801" },

{
  "label": "?????????",
  "value": "422802" },

{
  "label": "?????????",
  "value": "422822" },

{
  "label": "?????????",
  "value": "422823" },

{
  "label": "?????????",
  "value": "422825" },

{
  "label": "?????????",
  "value": "422826" },

{
  "label": "?????????",
  "value": "422827" },

{
  "label": "?????????",
  "value": "422828" }],


[{
  "label": "?????????",
  "value": "429004" },

{
  "label": "?????????",
  "value": "429005" },

{
  "label": "?????????",
  "value": "429006" },

{
  "label": "???????????????",
  "value": "429021" }]],



[
[{
  "label": "?????????",
  "value": "430102" },

{
  "label": "?????????",
  "value": "430103" },

{
  "label": "?????????",
  "value": "430104" },

{
  "label": "?????????",
  "value": "430105" },

{
  "label": "?????????",
  "value": "430111" },

{
  "label": "?????????",
  "value": "430112" },

{
  "label": "?????????",
  "value": "430121" },

{
  "label": "?????????",
  "value": "430181" },

{
  "label": "?????????",
  "value": "430182" }],


[{
  "label": "?????????",
  "value": "430202" },

{
  "label": "?????????",
  "value": "430203" },

{
  "label": "?????????",
  "value": "430204" },

{
  "label": "?????????",
  "value": "430211" },

{
  "label": "?????????",
  "value": "430221" },

{
  "label": "??????",
  "value": "430223" },

{
  "label": "?????????",
  "value": "430224" },

{
  "label": "?????????",
  "value": "430225" },

{
  "label": "???????????????",
  "value": "430271" },

{
  "label": "?????????",
  "value": "430281" }],


[{
  "label": "?????????",
  "value": "430302" },

{
  "label": "?????????",
  "value": "430304" },

{
  "label": "?????????",
  "value": "430321" },

{
  "label": "????????????????????????????????????",
  "value": "430371" },

{
  "label": "?????????????????????",
  "value": "430372" },

{
  "label": "?????????????????????",
  "value": "430373" },

{
  "label": "?????????",
  "value": "430381" },

{
  "label": "?????????",
  "value": "430382" }],


[{
  "label": "?????????",
  "value": "430405" },

{
  "label": "?????????",
  "value": "430406" },

{
  "label": "?????????",
  "value": "430407" },

{
  "label": "?????????",
  "value": "430408" },

{
  "label": "?????????",
  "value": "430412" },

{
  "label": "?????????",
  "value": "430421" },

{
  "label": "?????????",
  "value": "430422" },

{
  "label": "?????????",
  "value": "430423" },

{
  "label": "?????????",
  "value": "430424" },

{
  "label": "?????????",
  "value": "430426" },

{
  "label": "?????????????????????",
  "value": "430471" },

{
  "label": "????????????????????????????????????",
  "value": "430472" },

{
  "label": "?????????????????????????????????",
  "value": "430473" },

{
  "label": "?????????",
  "value": "430481" },

{
  "label": "?????????",
  "value": "430482" }],


[{
  "label": "?????????",
  "value": "430502" },

{
  "label": "?????????",
  "value": "430503" },

{
  "label": "?????????",
  "value": "430511" },

{
  "label": "?????????",
  "value": "430521" },

{
  "label": "?????????",
  "value": "430522" },

{
  "label": "?????????",
  "value": "430523" },

{
  "label": "?????????",
  "value": "430524" },

{
  "label": "?????????",
  "value": "430525" },

{
  "label": "?????????",
  "value": "430527" },

{
  "label": "?????????",
  "value": "430528" },

{
  "label": "?????????????????????",
  "value": "430529" },

{
  "label": "?????????",
  "value": "430581" }],


[{
  "label": "????????????",
  "value": "430602" },

{
  "label": "?????????",
  "value": "430603" },

{
  "label": "?????????",
  "value": "430611" },

{
  "label": "?????????",
  "value": "430621" },

{
  "label": "?????????",
  "value": "430623" },

{
  "label": "?????????",
  "value": "430624" },

{
  "label": "?????????",
  "value": "430626" },

{
  "label": "????????????????????????",
  "value": "430671" },

{
  "label": "?????????",
  "value": "430681" },

{
  "label": "?????????",
  "value": "430682" }],


[{
  "label": "?????????",
  "value": "430702" },

{
  "label": "?????????",
  "value": "430703" },

{
  "label": "?????????",
  "value": "430721" },

{
  "label": "?????????",
  "value": "430722" },

{
  "label": "??????",
  "value": "430723" },

{
  "label": "?????????",
  "value": "430724" },

{
  "label": "?????????",
  "value": "430725" },

{
  "label": "?????????",
  "value": "430726" },

{
  "label": "???????????????????????????",
  "value": "430771" },

{
  "label": "?????????",
  "value": "430781" }],


[{
  "label": "?????????",
  "value": "430802" },

{
  "label": "????????????",
  "value": "430811" },

{
  "label": "?????????",
  "value": "430821" },

{
  "label": "?????????",
  "value": "430822" }],


[{
  "label": "?????????",
  "value": "430902" },

{
  "label": "?????????",
  "value": "430903" },

{
  "label": "??????",
  "value": "430921" },

{
  "label": "?????????",
  "value": "430922" },

{
  "label": "?????????",
  "value": "430923" },

{
  "label": "???????????????????????????",
  "value": "430971" },

{
  "label": "????????????????????????????????????",
  "value": "430972" },

{
  "label": "?????????",
  "value": "430981" }],


[{
  "label": "?????????",
  "value": "431002" },

{
  "label": "?????????",
  "value": "431003" },

{
  "label": "?????????",
  "value": "431021" },

{
  "label": "?????????",
  "value": "431022" },

{
  "label": "?????????",
  "value": "431023" },

{
  "label": "?????????",
  "value": "431024" },

{
  "label": "?????????",
  "value": "431025" },

{
  "label": "?????????",
  "value": "431026" },

{
  "label": "?????????",
  "value": "431027" },

{
  "label": "?????????",
  "value": "431028" },

{
  "label": "?????????",
  "value": "431081" }],


[{
  "label": "?????????",
  "value": "431102" },

{
  "label": "????????????",
  "value": "431103" },

{
  "label": "?????????",
  "value": "431121" },

{
  "label": "?????????",
  "value": "431122" },

{
  "label": "?????????",
  "value": "431123" },

{
  "label": "??????",
  "value": "431124" },

{
  "label": "?????????",
  "value": "431125" },

{
  "label": "?????????",
  "value": "431126" },

{
  "label": "?????????",
  "value": "431127" },

{
  "label": "?????????",
  "value": "431128" },

{
  "label": "?????????????????????",
  "value": "431129" },

{
  "label": "???????????????????????????",
  "value": "431171" },

{
  "label": "????????????????????????",
  "value": "431172" },

{
  "label": "???????????????????????????",
  "value": "431173" }],


[{
  "label": "?????????",
  "value": "431202" },

{
  "label": "?????????",
  "value": "431221" },

{
  "label": "?????????",
  "value": "431222" },

{
  "label": "?????????",
  "value": "431223" },

{
  "label": "?????????",
  "value": "431224" },

{
  "label": "?????????",
  "value": "431225" },

{
  "label": "?????????????????????",
  "value": "431226" },

{
  "label": "?????????????????????",
  "value": "431227" },

{
  "label": "?????????????????????",
  "value": "431228" },

{
  "label": "???????????????????????????",
  "value": "431229" },

{
  "label": "?????????????????????",
  "value": "431230" },

{
  "label": "????????????????????????",
  "value": "431271" },

{
  "label": "?????????",
  "value": "431281" }],


[{
  "label": "?????????",
  "value": "431302" },

{
  "label": "?????????",
  "value": "431321" },

{
  "label": "?????????",
  "value": "431322" },

{
  "label": "????????????",
  "value": "431381" },

{
  "label": "?????????",
  "value": "431382" }],


[{
  "label": "?????????",
  "value": "433101" },

{
  "label": "?????????",
  "value": "433122" },

{
  "label": "?????????",
  "value": "433123" },

{
  "label": "?????????",
  "value": "433124" },

{
  "label": "?????????",
  "value": "433125" },

{
  "label": "?????????",
  "value": "433126" },

{
  "label": "?????????",
  "value": "433127" },

{
  "label": "?????????",
  "value": "433130" },

{
  "label": "???????????????????????????",
  "value": "433172" },

{
  "label": "???????????????????????????",
  "value": "433173" }]],



[
[{
  "label": "?????????",
  "value": "440103" },

{
  "label": "?????????",
  "value": "440104" },

{
  "label": "?????????",
  "value": "440105" },

{
  "label": "?????????",
  "value": "440106" },

{
  "label": "?????????",
  "value": "440111" },

{
  "label": "?????????",
  "value": "440112" },

{
  "label": "?????????",
  "value": "440113" },

{
  "label": "?????????",
  "value": "440114" },

{
  "label": "?????????",
  "value": "440115" },

{
  "label": "?????????",
  "value": "440117" },

{
  "label": "?????????",
  "value": "440118" }],


[{
  "label": "?????????",
  "value": "440203" },

{
  "label": "?????????",
  "value": "440204" },

{
  "label": "?????????",
  "value": "440205" },

{
  "label": "?????????",
  "value": "440222" },

{
  "label": "?????????",
  "value": "440224" },

{
  "label": "?????????",
  "value": "440229" },

{
  "label": "?????????????????????",
  "value": "440232" },

{
  "label": "?????????",
  "value": "440233" },

{
  "label": "?????????",
  "value": "440281" },

{
  "label": "?????????",
  "value": "440282" }],


[{
  "label": "?????????",
  "value": "440303" },

{
  "label": "?????????",
  "value": "440304" },

{
  "label": "?????????",
  "value": "440305" },

{
  "label": "?????????",
  "value": "440306" },

{
  "label": "?????????",
  "value": "440307" },

{
  "label": "?????????",
  "value": "440308" },

{
  "label": "?????????",
  "value": "440309" },

{
  "label": "?????????",
  "value": "440310" }],


[{
  "label": "?????????",
  "value": "440402" },

{
  "label": "?????????",
  "value": "440403" },

{
  "label": "?????????",
  "value": "440404" }],


[{
  "label": "?????????",
  "value": "440507" },

{
  "label": "?????????",
  "value": "440511" },

{
  "label": "?????????",
  "value": "440512" },

{
  "label": "?????????",
  "value": "440513" },

{
  "label": "?????????",
  "value": "440514" },

{
  "label": "?????????",
  "value": "440515" },

{
  "label": "?????????",
  "value": "440523" }],


[{
  "label": "?????????",
  "value": "440604" },

{
  "label": "?????????",
  "value": "440605" },

{
  "label": "?????????",
  "value": "440606" },

{
  "label": "?????????",
  "value": "440607" },

{
  "label": "?????????",
  "value": "440608" }],


[{
  "label": "?????????",
  "value": "440703" },

{
  "label": "?????????",
  "value": "440704" },

{
  "label": "?????????",
  "value": "440705" },

{
  "label": "?????????",
  "value": "440781" },

{
  "label": "?????????",
  "value": "440783" },

{
  "label": "?????????",
  "value": "440784" },

{
  "label": "?????????",
  "value": "440785" }],


[{
  "label": "?????????",
  "value": "440802" },

{
  "label": "?????????",
  "value": "440803" },

{
  "label": "?????????",
  "value": "440804" },

{
  "label": "?????????",
  "value": "440811" },

{
  "label": "?????????",
  "value": "440823" },

{
  "label": "?????????",
  "value": "440825" },

{
  "label": "?????????",
  "value": "440881" },

{
  "label": "?????????",
  "value": "440882" },

{
  "label": "?????????",
  "value": "440883" }],


[{
  "label": "?????????",
  "value": "440902" },

{
  "label": "?????????",
  "value": "440904" },

{
  "label": "?????????",
  "value": "440981" },

{
  "label": "?????????",
  "value": "440982" },

{
  "label": "?????????",
  "value": "440983" }],


[{
  "label": "?????????",
  "value": "441202" },

{
  "label": "?????????",
  "value": "441203" },

{
  "label": "?????????",
  "value": "441204" },

{
  "label": "?????????",
  "value": "441223" },

{
  "label": "?????????",
  "value": "441224" },

{
  "label": "?????????",
  "value": "441225" },

{
  "label": "?????????",
  "value": "441226" },

{
  "label": "?????????",
  "value": "441284" }],


[{
  "label": "?????????",
  "value": "441302" },

{
  "label": "?????????",
  "value": "441303" },

{
  "label": "?????????",
  "value": "441322" },

{
  "label": "?????????",
  "value": "441323" },

{
  "label": "?????????",
  "value": "441324" }],


[{
  "label": "?????????",
  "value": "441402" },

{
  "label": "?????????",
  "value": "441403" },

{
  "label": "?????????",
  "value": "441422" },

{
  "label": "?????????",
  "value": "441423" },

{
  "label": "?????????",
  "value": "441424" },

{
  "label": "?????????",
  "value": "441426" },

{
  "label": "?????????",
  "value": "441427" },

{
  "label": "?????????",
  "value": "441481" }],


[{
  "label": "??????",
  "value": "441502" },

{
  "label": "?????????",
  "value": "441521" },

{
  "label": "?????????",
  "value": "441523" },

{
  "label": "?????????",
  "value": "441581" }],


[{
  "label": "?????????",
  "value": "441602" },

{
  "label": "?????????",
  "value": "441621" },

{
  "label": "?????????",
  "value": "441622" },

{
  "label": "?????????",
  "value": "441623" },

{
  "label": "?????????",
  "value": "441624" },

{
  "label": "?????????",
  "value": "441625" }],


[{
  "label": "?????????",
  "value": "441702" },

{
  "label": "?????????",
  "value": "441704" },

{
  "label": "?????????",
  "value": "441721" },

{
  "label": "?????????",
  "value": "441781" }],


[{
  "label": "?????????",
  "value": "441802" },

{
  "label": "?????????",
  "value": "441803" },

{
  "label": "?????????",
  "value": "441821" },

{
  "label": "?????????",
  "value": "441823" },

{
  "label": "???????????????????????????",
  "value": "441825" },

{
  "label": "?????????????????????",
  "value": "441826" },

{
  "label": "?????????",
  "value": "441881" },

{
  "label": "?????????",
  "value": "441882" }],


[{
  "label": "?????????",
  "value": "441900" }],

[{
  "label": "?????????",
  "value": "442000" }],

[{
  "label": "?????????",
  "value": "445102" },

{
  "label": "?????????",
  "value": "445103" },

{
  "label": "?????????",
  "value": "445122" }],


[{
  "label": "?????????",
  "value": "445202" },

{
  "label": "?????????",
  "value": "445203" },

{
  "label": "?????????",
  "value": "445222" },

{
  "label": "?????????",
  "value": "445224" },

{
  "label": "?????????",
  "value": "445281" }],


[{
  "label": "?????????",
  "value": "445302" },

{
  "label": "?????????",
  "value": "445303" },

{
  "label": "?????????",
  "value": "445321" },

{
  "label": "?????????",
  "value": "445322" },

{
  "label": "?????????",
  "value": "445381" }]],



[
[{
  "label": "?????????",
  "value": "450102" },

{
  "label": "?????????",
  "value": "450103" },

{
  "label": "?????????",
  "value": "450105" },

{
  "label": "????????????",
  "value": "450107" },

{
  "label": "?????????",
  "value": "450108" },

{
  "label": "?????????",
  "value": "450109" },

{
  "label": "?????????",
  "value": "450110" },

{
  "label": "?????????",
  "value": "450123" },

{
  "label": "?????????",
  "value": "450124" },

{
  "label": "?????????",
  "value": "450125" },

{
  "label": "?????????",
  "value": "450126" },

{
  "label": "??????",
  "value": "450127" }],


[{
  "label": "?????????",
  "value": "450202" },

{
  "label": "?????????",
  "value": "450203" },

{
  "label": "?????????",
  "value": "450204" },

{
  "label": "?????????",
  "value": "450205" },

{
  "label": "?????????",
  "value": "450206" },

{
  "label": "?????????",
  "value": "450222" },

{
  "label": "?????????",
  "value": "450223" },

{
  "label": "?????????",
  "value": "450224" },

{
  "label": "?????????????????????",
  "value": "450225" },

{
  "label": "?????????????????????",
  "value": "450226" }],


[{
  "label": "?????????",
  "value": "450302" },

{
  "label": "?????????",
  "value": "450303" },

{
  "label": "?????????",
  "value": "450304" },

{
  "label": "?????????",
  "value": "450305" },

{
  "label": "?????????",
  "value": "450311" },

{
  "label": "?????????",
  "value": "450312" },

{
  "label": "?????????",
  "value": "450321" },

{
  "label": "?????????",
  "value": "450323" },

{
  "label": "?????????",
  "value": "450324" },

{
  "label": "?????????",
  "value": "450325" },

{
  "label": "?????????",
  "value": "450326" },

{
  "label": "?????????",
  "value": "450327" },

{
  "label": "?????????????????????",
  "value": "450328" },

{
  "label": "?????????",
  "value": "450329" },

{
  "label": "?????????",
  "value": "450330" },

{
  "label": "?????????",
  "value": "450331" },

{
  "label": "?????????????????????",
  "value": "450332" }],


[{
  "label": "?????????",
  "value": "450403" },

{
  "label": "?????????",
  "value": "450405" },

{
  "label": "?????????",
  "value": "450406" },

{
  "label": "?????????",
  "value": "450421" },

{
  "label": "??????",
  "value": "450422" },

{
  "label": "?????????",
  "value": "450423" },

{
  "label": "?????????",
  "value": "450481" }],


[{
  "label": "?????????",
  "value": "450502" },

{
  "label": "?????????",
  "value": "450503" },

{
  "label": "????????????",
  "value": "450512" },

{
  "label": "?????????",
  "value": "450521" }],


[{
  "label": "?????????",
  "value": "450602" },

{
  "label": "?????????",
  "value": "450603" },

{
  "label": "?????????",
  "value": "450621" },

{
  "label": "?????????",
  "value": "450681" }],


[{
  "label": "?????????",
  "value": "450702" },

{
  "label": "?????????",
  "value": "450703" },

{
  "label": "?????????",
  "value": "450721" },

{
  "label": "?????????",
  "value": "450722" }],


[{
  "label": "?????????",
  "value": "450802" },

{
  "label": "?????????",
  "value": "450803" },

{
  "label": "?????????",
  "value": "450804" },

{
  "label": "?????????",
  "value": "450821" },

{
  "label": "?????????",
  "value": "450881" }],


[{
  "label": "?????????",
  "value": "450902" },

{
  "label": "?????????",
  "value": "450903" },

{
  "label": "??????",
  "value": "450921" },

{
  "label": "?????????",
  "value": "450922" },

{
  "label": "?????????",
  "value": "450923" },

{
  "label": "?????????",
  "value": "450924" },

{
  "label": "?????????",
  "value": "450981" }],


[{
  "label": "?????????",
  "value": "451002" },

{
  "label": "?????????",
  "value": "451021" },

{
  "label": "?????????",
  "value": "451022" },

{
  "label": "?????????",
  "value": "451023" },

{
  "label": "?????????",
  "value": "451024" },

{
  "label": "?????????",
  "value": "451026" },

{
  "label": "?????????",
  "value": "451027" },

{
  "label": "?????????",
  "value": "451028" },

{
  "label": "?????????",
  "value": "451029" },

{
  "label": "?????????",
  "value": "451030" },

{
  "label": "?????????????????????",
  "value": "451031" },

{
  "label": "?????????",
  "value": "451081" }],


[{
  "label": "?????????",
  "value": "451102" },

{
  "label": "?????????",
  "value": "451103" },

{
  "label": "?????????",
  "value": "451121" },

{
  "label": "?????????",
  "value": "451122" },

{
  "label": "?????????????????????",
  "value": "451123" }],


[{
  "label": "????????????",
  "value": "451202" },

{
  "label": "?????????",
  "value": "451203" },

{
  "label": "?????????",
  "value": "451221" },

{
  "label": "?????????",
  "value": "451222" },

{
  "label": "?????????",
  "value": "451223" },

{
  "label": "?????????",
  "value": "451224" },

{
  "label": "????????????????????????",
  "value": "451225" },

{
  "label": "????????????????????????",
  "value": "451226" },

{
  "label": "?????????????????????",
  "value": "451227" },

{
  "label": "?????????????????????",
  "value": "451228" },

{
  "label": "?????????????????????",
  "value": "451229" }],


[{
  "label": "?????????",
  "value": "451302" },

{
  "label": "?????????",
  "value": "451321" },

{
  "label": "?????????",
  "value": "451322" },

{
  "label": "?????????",
  "value": "451323" },

{
  "label": "?????????????????????",
  "value": "451324" },

{
  "label": "?????????",
  "value": "451381" }],


[{
  "label": "?????????",
  "value": "451402" },

{
  "label": "?????????",
  "value": "451421" },

{
  "label": "?????????",
  "value": "451422" },

{
  "label": "?????????",
  "value": "451423" },

{
  "label": "?????????",
  "value": "451424" },

{
  "label": "?????????",
  "value": "451425" },

{
  "label": "?????????",
  "value": "451481" }]],



[
[{
  "label": "?????????",
  "value": "460105" },

{
  "label": "?????????",
  "value": "460106" },

{
  "label": "?????????",
  "value": "460107" },

{
  "label": "?????????",
  "value": "460108" }],


[{
  "label": "?????????",
  "value": "460202" },

{
  "label": "?????????",
  "value": "460203" },

{
  "label": "?????????",
  "value": "460204" },

{
  "label": "?????????",
  "value": "460205" }],


[{
  "label": "????????????",
  "value": "460321" },

{
  "label": "????????????",
  "value": "460322" },

{
  "label": "?????????????????????????????????",
  "value": "460323" }],


[{
  "label": "?????????",
  "value": "460400" }],

[{
  "label": "????????????",
  "value": "469001" },

{
  "label": "?????????",
  "value": "469002" },

{
  "label": "?????????",
  "value": "469005" },

{
  "label": "?????????",
  "value": "469006" },

{
  "label": "?????????",
  "value": "469007" },

{
  "label": "?????????",
  "value": "469021" },

{
  "label": "?????????",
  "value": "469022" },

{
  "label": "?????????",
  "value": "469023" },

{
  "label": "?????????",
  "value": "469024" },

{
  "label": "?????????????????????",
  "value": "469025" },

{
  "label": "?????????????????????",
  "value": "469026" },

{
  "label": "?????????????????????",
  "value": "469027" },

{
  "label": "?????????????????????",
  "value": "469028" },

{
  "label": "???????????????????????????",
  "value": "469029" },

{
  "label": "???????????????????????????",
  "value": "469030" }]],



[
[{
  "label": "?????????",
  "value": "500101" },

{
  "label": "?????????",
  "value": "500102" },

{
  "label": "?????????",
  "value": "500103" },

{
  "label": "????????????",
  "value": "500104" },

{
  "label": "?????????",
  "value": "500105" },

{
  "label": "????????????",
  "value": "500106" },

{
  "label": "????????????",
  "value": "500107" },

{
  "label": "?????????",
  "value": "500108" },

{
  "label": "?????????",
  "value": "500109" },

{
  "label": "?????????",
  "value": "500110" },

{
  "label": "?????????",
  "value": "500111" },

{
  "label": "?????????",
  "value": "500112" },

{
  "label": "?????????",
  "value": "500113" },

{
  "label": "?????????",
  "value": "500114" },

{
  "label": "?????????",
  "value": "500115" },

{
  "label": "?????????",
  "value": "500116" },

{
  "label": "?????????",
  "value": "500117" },

{
  "label": "?????????",
  "value": "500118" },

{
  "label": "?????????",
  "value": "500119" },

{
  "label": "?????????",
  "value": "500120" },

{
  "label": "?????????",
  "value": "500151" },

{
  "label": "?????????",
  "value": "500152" },

{
  "label": "?????????",
  "value": "500153" },

{
  "label": "?????????",
  "value": "500154" },

{
  "label": "?????????",
  "value": "500155" },

{
  "label": "?????????",
  "value": "500156" }],


[{
  "label": "?????????",
  "value": "500229" },

{
  "label": "?????????",
  "value": "500230" },

{
  "label": "?????????",
  "value": "500231" },

{
  "label": "??????",
  "value": "500233" },

{
  "label": "?????????",
  "value": "500235" },

{
  "label": "?????????",
  "value": "500236" },

{
  "label": "?????????",
  "value": "500237" },

{
  "label": "?????????",
  "value": "500238" },

{
  "label": "????????????????????????",
  "value": "500240" },

{
  "label": "??????????????????????????????",
  "value": "500241" },

{
  "label": "??????????????????????????????",
  "value": "500242" },

{
  "label": "??????????????????????????????",
  "value": "500243" }]],



[
[{
  "label": "?????????",
  "value": "510104" },

{
  "label": "?????????",
  "value": "510105" },

{
  "label": "?????????",
  "value": "510106" },

{
  "label": "?????????",
  "value": "510107" },

{
  "label": "?????????",
  "value": "510108" },

{
  "label": "????????????",
  "value": "510112" },

{
  "label": "????????????",
  "value": "510113" },

{
  "label": "?????????",
  "value": "510114" },

{
  "label": "?????????",
  "value": "510115" },

{
  "label": "?????????",
  "value": "510116" },

{
  "label": "?????????",
  "value": "510117" },

{
  "label": "?????????",
  "value": "510121" },

{
  "label": "?????????",
  "value": "510129" },

{
  "label": "?????????",
  "value": "510131" },

{
  "label": "?????????",
  "value": "510132" },

{
  "label": "????????????",
  "value": "510181" },

{
  "label": "?????????",
  "value": "510182" },

{
  "label": "?????????",
  "value": "510183" },

{
  "label": "?????????",
  "value": "510184" },

{
  "label": "?????????",
  "value": "510185" }],


[{
  "label": "????????????",
  "value": "510302" },

{
  "label": "?????????",
  "value": "510303" },

{
  "label": "?????????",
  "value": "510304" },

{
  "label": "?????????",
  "value": "510311" },

{
  "label": "??????",
  "value": "510321" },

{
  "label": "?????????",
  "value": "510322" }],


[{
  "label": "??????",
  "value": "510402" },

{
  "label": "??????",
  "value": "510403" },

{
  "label": "?????????",
  "value": "510411" },

{
  "label": "?????????",
  "value": "510421" },

{
  "label": "?????????",
  "value": "510422" }],


[{
  "label": "?????????",
  "value": "510502" },

{
  "label": "?????????",
  "value": "510503" },

{
  "label": "????????????",
  "value": "510504" },

{
  "label": "??????",
  "value": "510521" },

{
  "label": "?????????",
  "value": "510522" },

{
  "label": "?????????",
  "value": "510524" },

{
  "label": "?????????",
  "value": "510525" }],


[{
  "label": "?????????",
  "value": "510603" },

{
  "label": "?????????",
  "value": "510604" },

{
  "label": "?????????",
  "value": "510623" },

{
  "label": "?????????",
  "value": "510681" },

{
  "label": "?????????",
  "value": "510682" },

{
  "label": "?????????",
  "value": "510683" }],


[{
  "label": "?????????",
  "value": "510703" },

{
  "label": "?????????",
  "value": "510704" },

{
  "label": "?????????",
  "value": "510705" },

{
  "label": "?????????",
  "value": "510722" },

{
  "label": "?????????",
  "value": "510723" },

{
  "label": "?????????",
  "value": "510725" },

{
  "label": "?????????????????????",
  "value": "510726" },

{
  "label": "?????????",
  "value": "510727" },

{
  "label": "?????????",
  "value": "510781" }],


[{
  "label": "?????????",
  "value": "510802" },

{
  "label": "?????????",
  "value": "510811" },

{
  "label": "?????????",
  "value": "510812" },

{
  "label": "?????????",
  "value": "510821" },

{
  "label": "?????????",
  "value": "510822" },

{
  "label": "?????????",
  "value": "510823" },

{
  "label": "?????????",
  "value": "510824" }],


[{
  "label": "?????????",
  "value": "510903" },

{
  "label": "?????????",
  "value": "510904" },

{
  "label": "?????????",
  "value": "510921" },

{
  "label": "?????????",
  "value": "510922" },

{
  "label": "?????????",
  "value": "510923" }],


[{
  "label": "?????????",
  "value": "511002" },

{
  "label": "?????????",
  "value": "511011" },

{
  "label": "?????????",
  "value": "511024" },

{
  "label": "?????????",
  "value": "511025" },

{
  "label": "?????????????????????",
  "value": "511071" },

{
  "label": "?????????",
  "value": "511083" }],


[{
  "label": "?????????",
  "value": "511102" },

{
  "label": "?????????",
  "value": "511111" },

{
  "label": "????????????",
  "value": "511112" },

{
  "label": "????????????",
  "value": "511113" },

{
  "label": "?????????",
  "value": "511123" },

{
  "label": "?????????",
  "value": "511124" },

{
  "label": "?????????",
  "value": "511126" },

{
  "label": "?????????",
  "value": "511129" },

{
  "label": "?????????????????????",
  "value": "511132" },

{
  "label": "?????????????????????",
  "value": "511133" },

{
  "label": "????????????",
  "value": "511181" }],


[{
  "label": "?????????",
  "value": "511302" },

{
  "label": "?????????",
  "value": "511303" },

{
  "label": "?????????",
  "value": "511304" },

{
  "label": "?????????",
  "value": "511321" },

{
  "label": "?????????",
  "value": "511322" },

{
  "label": "?????????",
  "value": "511323" },

{
  "label": "?????????",
  "value": "511324" },

{
  "label": "?????????",
  "value": "511325" },

{
  "label": "?????????",
  "value": "511381" }],


[{
  "label": "?????????",
  "value": "511402" },

{
  "label": "?????????",
  "value": "511403" },

{
  "label": "?????????",
  "value": "511421" },

{
  "label": "?????????",
  "value": "511423" },

{
  "label": "?????????",
  "value": "511424" },

{
  "label": "?????????",
  "value": "511425" }],


[{
  "label": "?????????",
  "value": "511502" },

{
  "label": "?????????",
  "value": "511503" },

{
  "label": "?????????",
  "value": "511521" },

{
  "label": "?????????",
  "value": "511523" },

{
  "label": "?????????",
  "value": "511524" },

{
  "label": "??????",
  "value": "511525" },

{
  "label": "??????",
  "value": "511526" },

{
  "label": "?????????",
  "value": "511527" },

{
  "label": "?????????",
  "value": "511528" },

{
  "label": "?????????",
  "value": "511529" }],


[{
  "label": "?????????",
  "value": "511602" },

{
  "label": "?????????",
  "value": "511603" },

{
  "label": "?????????",
  "value": "511621" },

{
  "label": "?????????",
  "value": "511622" },

{
  "label": "?????????",
  "value": "511623" },

{
  "label": "?????????",
  "value": "511681" }],


[{
  "label": "?????????",
  "value": "511702" },

{
  "label": "?????????",
  "value": "511703" },

{
  "label": "?????????",
  "value": "511722" },

{
  "label": "?????????",
  "value": "511723" },

{
  "label": "?????????",
  "value": "511724" },

{
  "label": "??????",
  "value": "511725" },

{
  "label": "?????????????????????",
  "value": "511771" },

{
  "label": "?????????",
  "value": "511781" }],


[{
  "label": "?????????",
  "value": "511802" },

{
  "label": "?????????",
  "value": "511803" },

{
  "label": "?????????",
  "value": "511822" },

{
  "label": "?????????",
  "value": "511823" },

{
  "label": "?????????",
  "value": "511824" },

{
  "label": "?????????",
  "value": "511825" },

{
  "label": "?????????",
  "value": "511826" },

{
  "label": "?????????",
  "value": "511827" }],


[{
  "label": "?????????",
  "value": "511902" },

{
  "label": "?????????",
  "value": "511903" },

{
  "label": "?????????",
  "value": "511921" },

{
  "label": "?????????",
  "value": "511922" },

{
  "label": "?????????",
  "value": "511923" },

{
  "label": "?????????????????????",
  "value": "511971" }],


[{
  "label": "?????????",
  "value": "512002" },

{
  "label": "?????????",
  "value": "512021" },

{
  "label": "?????????",
  "value": "512022" }],


[{
  "label": "????????????",
  "value": "513201" },

{
  "label": "?????????",
  "value": "513221" },

{
  "label": "??????",
  "value": "513222" },

{
  "label": "??????",
  "value": "513223" },

{
  "label": "?????????",
  "value": "513224" },

{
  "label": "????????????",
  "value": "513225" },

{
  "label": "?????????",
  "value": "513226" },

{
  "label": "?????????",
  "value": "513227" },

{
  "label": "?????????",
  "value": "513228" },

{
  "label": "?????????",
  "value": "513230" },

{
  "label": "?????????",
  "value": "513231" },

{
  "label": "????????????",
  "value": "513232" },

{
  "label": "?????????",
  "value": "513233" }],


[{
  "label": "?????????",
  "value": "513301" },

{
  "label": "?????????",
  "value": "513322" },

{
  "label": "?????????",
  "value": "513323" },

{
  "label": "?????????",
  "value": "513324" },

{
  "label": "?????????",
  "value": "513325" },

{
  "label": "?????????",
  "value": "513326" },

{
  "label": "?????????",
  "value": "513327" },

{
  "label": "?????????",
  "value": "513328" },

{
  "label": "?????????",
  "value": "513329" },

{
  "label": "?????????",
  "value": "513330" },

{
  "label": "?????????",
  "value": "513331" },

{
  "label": "?????????",
  "value": "513332" },

{
  "label": "?????????",
  "value": "513333" },

{
  "label": "?????????",
  "value": "513334" },

{
  "label": "?????????",
  "value": "513335" },

{
  "label": "?????????",
  "value": "513336" },

{
  "label": "?????????",
  "value": "513337" },

{
  "label": "?????????",
  "value": "513338" }],


[{
  "label": "?????????",
  "value": "513401" },

{
  "label": "?????????????????????",
  "value": "513422" },

{
  "label": "?????????",
  "value": "513423" },

{
  "label": "?????????",
  "value": "513424" },

{
  "label": "?????????",
  "value": "513425" },

{
  "label": "?????????",
  "value": "513426" },

{
  "label": "?????????",
  "value": "513427" },

{
  "label": "?????????",
  "value": "513428" },

{
  "label": "?????????",
  "value": "513429" },

{
  "label": "?????????",
  "value": "513430" },

{
  "label": "?????????",
  "value": "513431" },

{
  "label": "?????????",
  "value": "513432" },

{
  "label": "?????????",
  "value": "513433" },

{
  "label": "?????????",
  "value": "513434" },

{
  "label": "?????????",
  "value": "513435" },

{
  "label": "?????????",
  "value": "513436" },

{
  "label": "?????????",
  "value": "513437" }]],



[
[{
  "label": "?????????",
  "value": "520102" },

{
  "label": "?????????",
  "value": "520103" },

{
  "label": "?????????",
  "value": "520111" },

{
  "label": "?????????",
  "value": "520112" },

{
  "label": "?????????",
  "value": "520113" },

{
  "label": "????????????",
  "value": "520115" },

{
  "label": "?????????",
  "value": "520121" },

{
  "label": "?????????",
  "value": "520122" },

{
  "label": "?????????",
  "value": "520123" },

{
  "label": "?????????",
  "value": "520181" }],


[{
  "label": "?????????",
  "value": "520201" },

{
  "label": "????????????",
  "value": "520203" },

{
  "label": "?????????",
  "value": "520221" },

{
  "label": "?????????",
  "value": "520281" }],


[{
  "label": "????????????",
  "value": "520302" },

{
  "label": "?????????",
  "value": "520303" },

{
  "label": "?????????",
  "value": "520304" },

{
  "label": "?????????",
  "value": "520322" },

{
  "label": "?????????",
  "value": "520323" },

{
  "label": "?????????",
  "value": "520324" },

{
  "label": "??????????????????????????????",
  "value": "520325" },

{
  "label": "??????????????????????????????",
  "value": "520326" },

{
  "label": "?????????",
  "value": "520327" },

{
  "label": "?????????",
  "value": "520328" },

{
  "label": "?????????",
  "value": "520329" },

{
  "label": "?????????",
  "value": "520330" },

{
  "label": "?????????",
  "value": "520381" },

{
  "label": "?????????",
  "value": "520382" }],


[{
  "label": "?????????",
  "value": "520402" },

{
  "label": "?????????",
  "value": "520403" },

{
  "label": "?????????",
  "value": "520422" },

{
  "label": "??????????????????????????????",
  "value": "520423" },

{
  "label": "??????????????????????????????",
  "value": "520424" },

{
  "label": "??????????????????????????????",
  "value": "520425" }],


[{
  "label": "????????????",
  "value": "520502" },

{
  "label": "?????????",
  "value": "520521" },

{
  "label": "?????????",
  "value": "520522" },

{
  "label": "?????????",
  "value": "520523" },

{
  "label": "?????????",
  "value": "520524" },

{
  "label": "?????????",
  "value": "520525" },

{
  "label": "?????????????????????????????????",
  "value": "520526" },

{
  "label": "?????????",
  "value": "520527" }],


[{
  "label": "?????????",
  "value": "520602" },

{
  "label": "?????????",
  "value": "520603" },

{
  "label": "?????????",
  "value": "520621" },

{
  "label": "?????????????????????",
  "value": "520622" },

{
  "label": "?????????",
  "value": "520623" },

{
  "label": "?????????",
  "value": "520624" },

{
  "label": "??????????????????????????????",
  "value": "520625" },

{
  "label": "?????????",
  "value": "520626" },

{
  "label": "????????????????????????",
  "value": "520627" },

{
  "label": "?????????????????????",
  "value": "520628" }],


[{
  "label": "?????????",
  "value": "522301" },

{
  "label": "?????????",
  "value": "522322" },

{
  "label": "?????????",
  "value": "522323" },

{
  "label": "?????????",
  "value": "522324" },

{
  "label": "?????????",
  "value": "522325" },

{
  "label": "?????????",
  "value": "522326" },

{
  "label": "?????????",
  "value": "522327" },

{
  "label": "?????????",
  "value": "522328" }],


[{
  "label": "?????????",
  "value": "522601" },

{
  "label": "?????????",
  "value": "522622" },

{
  "label": "?????????",
  "value": "522623" },

{
  "label": "?????????",
  "value": "522624" },

{
  "label": "?????????",
  "value": "522625" },

{
  "label": "?????????",
  "value": "522626" },

{
  "label": "?????????",
  "value": "522627" },

{
  "label": "?????????",
  "value": "522628" },

{
  "label": "?????????",
  "value": "522629" },

{
  "label": "?????????",
  "value": "522630" },

{
  "label": "?????????",
  "value": "522631" },

{
  "label": "?????????",
  "value": "522632" },

{
  "label": "?????????",
  "value": "522633" },

{
  "label": "?????????",
  "value": "522634" },

{
  "label": "?????????",
  "value": "522635" },

{
  "label": "?????????",
  "value": "522636" }],


[{
  "label": "?????????",
  "value": "522701" },

{
  "label": "?????????",
  "value": "522702" },

{
  "label": "?????????",
  "value": "522722" },

{
  "label": "?????????",
  "value": "522723" },

{
  "label": "?????????",
  "value": "522725" },

{
  "label": "?????????",
  "value": "522726" },

{
  "label": "?????????",
  "value": "522727" },

{
  "label": "?????????",
  "value": "522728" },

{
  "label": "?????????",
  "value": "522729" },

{
  "label": "?????????",
  "value": "522730" },

{
  "label": "?????????",
  "value": "522731" },

{
  "label": "?????????????????????",
  "value": "522732" }]],



[
[{
  "label": "?????????",
  "value": "530102" },

{
  "label": "?????????",
  "value": "530103" },

{
  "label": "?????????",
  "value": "530111" },

{
  "label": "?????????",
  "value": "530112" },

{
  "label": "?????????",
  "value": "530113" },

{
  "label": "?????????",
  "value": "530114" },

{
  "label": "?????????",
  "value": "530115" },

{
  "label": "?????????",
  "value": "530124" },

{
  "label": "?????????",
  "value": "530125" },

{
  "label": "?????????????????????",
  "value": "530126" },

{
  "label": "?????????",
  "value": "530127" },

{
  "label": "???????????????????????????",
  "value": "530128" },

{
  "label": "???????????????????????????",
  "value": "530129" },

{
  "label": "?????????",
  "value": "530181" }],


[{
  "label": "?????????",
  "value": "530302" },

{
  "label": "?????????",
  "value": "530303" },

{
  "label": "?????????",
  "value": "530321" },

{
  "label": "?????????",
  "value": "530322" },

{
  "label": "?????????",
  "value": "530323" },

{
  "label": "?????????",
  "value": "530324" },

{
  "label": "?????????",
  "value": "530325" },

{
  "label": "?????????",
  "value": "530326" },

{
  "label": "?????????",
  "value": "530381" }],


[{
  "label": "?????????",
  "value": "530402" },

{
  "label": "?????????",
  "value": "530403" },

{
  "label": "?????????",
  "value": "530422" },

{
  "label": "?????????",
  "value": "530423" },

{
  "label": "?????????",
  "value": "530424" },

{
  "label": "?????????",
  "value": "530425" },

{
  "label": "?????????????????????",
  "value": "530426" },

{
  "label": "???????????????????????????",
  "value": "530427" },

{
  "label": "????????????????????????????????????",
  "value": "530428" }],


[{
  "label": "?????????",
  "value": "530502" },

{
  "label": "?????????",
  "value": "530521" },

{
  "label": "?????????",
  "value": "530523" },

{
  "label": "?????????",
  "value": "530524" },

{
  "label": "?????????",
  "value": "530581" }],


[{
  "label": "?????????",
  "value": "530602" },

{
  "label": "?????????",
  "value": "530621" },

{
  "label": "?????????",
  "value": "530622" },

{
  "label": "?????????",
  "value": "530623" },

{
  "label": "?????????",
  "value": "530624" },

{
  "label": "?????????",
  "value": "530625" },

{
  "label": "?????????",
  "value": "530626" },

{
  "label": "?????????",
  "value": "530627" },

{
  "label": "?????????",
  "value": "530628" },

{
  "label": "?????????",
  "value": "530629" },

{
  "label": "?????????",
  "value": "530630" }],


[{
  "label": "?????????",
  "value": "530702" },

{
  "label": "????????????????????????",
  "value": "530721" },

{
  "label": "?????????",
  "value": "530722" },

{
  "label": "?????????",
  "value": "530723" },

{
  "label": "?????????????????????",
  "value": "530724" }],


[{
  "label": "?????????",
  "value": "530802" },

{
  "label": "??????????????????????????????",
  "value": "530821" },

{
  "label": "????????????????????????",
  "value": "530822" },

{
  "label": "?????????????????????",
  "value": "530823" },

{
  "label": "???????????????????????????",
  "value": "530824" },

{
  "label": "???????????????????????????????????????",
  "value": "530825" },

{
  "label": "??????????????????????????????",
  "value": "530826" },

{
  "label": "????????????????????????????????????",
  "value": "530827" },

{
  "label": "????????????????????????",
  "value": "530828" },

{
  "label": "?????????????????????",
  "value": "530829" }],


[{
  "label": "?????????",
  "value": "530902" },

{
  "label": "?????????",
  "value": "530921" },

{
  "label": "??????",
  "value": "530922" },

{
  "label": "?????????",
  "value": "530923" },

{
  "label": "?????????",
  "value": "530924" },

{
  "label": "?????????????????????????????????????????????",
  "value": "530925" },

{
  "label": "???????????????????????????",
  "value": "530926" },

{
  "label": "?????????????????????",
  "value": "530927" }],


[{
  "label": "?????????",
  "value": "532301" },

{
  "label": "?????????",
  "value": "532322" },

{
  "label": "?????????",
  "value": "532323" },

{
  "label": "?????????",
  "value": "532324" },

{
  "label": "?????????",
  "value": "532325" },

{
  "label": "?????????",
  "value": "532326" },

{
  "label": "?????????",
  "value": "532327" },

{
  "label": "?????????",
  "value": "532328" },

{
  "label": "?????????",
  "value": "532329" },

{
  "label": "?????????",
  "value": "532331" }],


[{
  "label": "?????????",
  "value": "532501" },

{
  "label": "?????????",
  "value": "532502" },

{
  "label": "?????????",
  "value": "532503" },

{
  "label": "?????????",
  "value": "532504" },

{
  "label": "?????????????????????",
  "value": "532523" },

{
  "label": "?????????",
  "value": "532524" },

{
  "label": "?????????",
  "value": "532525" },

{
  "label": "?????????",
  "value": "532527" },

{
  "label": "?????????",
  "value": "532528" },

{
  "label": "?????????",
  "value": "532529" },

{
  "label": "?????????????????????????????????",
  "value": "532530" },

{
  "label": "?????????",
  "value": "532531" },

{
  "label": "?????????????????????",
  "value": "532532" }],


[{
  "label": "?????????",
  "value": "532601" },

{
  "label": "?????????",
  "value": "532622" },

{
  "label": "?????????",
  "value": "532623" },

{
  "label": "????????????",
  "value": "532624" },

{
  "label": "?????????",
  "value": "532625" },

{
  "label": "?????????",
  "value": "532626" },

{
  "label": "?????????",
  "value": "532627" },

{
  "label": "?????????",
  "value": "532628" }],


[{
  "label": "?????????",
  "value": "532801" },

{
  "label": "?????????",
  "value": "532822" },

{
  "label": "?????????",
  "value": "532823" }],


[{
  "label": "?????????",
  "value": "532901" },

{
  "label": "?????????????????????",
  "value": "532922" },

{
  "label": "?????????",
  "value": "532923" },

{
  "label": "?????????",
  "value": "532924" },

{
  "label": "?????????",
  "value": "532925" },

{
  "label": "?????????????????????",
  "value": "532926" },

{
  "label": "???????????????????????????",
  "value": "532927" },

{
  "label": "?????????",
  "value": "532928" },

{
  "label": "?????????",
  "value": "532929" },

{
  "label": "?????????",
  "value": "532930" },

{
  "label": "?????????",
  "value": "532931" },

{
  "label": "?????????",
  "value": "532932" }],


[{
  "label": "?????????",
  "value": "533102" },

{
  "label": "??????",
  "value": "533103" },

{
  "label": "?????????",
  "value": "533122" },

{
  "label": "?????????",
  "value": "533123" },

{
  "label": "?????????",
  "value": "533124" }],


[{
  "label": "?????????",
  "value": "533301" },

{
  "label": "?????????",
  "value": "533323" },

{
  "label": "??????????????????????????????",
  "value": "533324" },

{
  "label": "??????????????????????????????",
  "value": "533325" }],


[{
  "label": "???????????????",
  "value": "533401" },

{
  "label": "?????????",
  "value": "533422" },

{
  "label": "????????????????????????",
  "value": "533423" }]],



[
[{
  "label": "?????????",
  "value": "540102" },

{
  "label": "???????????????",
  "value": "540103" },

{
  "label": "?????????",
  "value": "540121" },

{
  "label": "?????????",
  "value": "540122" },

{
  "label": "?????????",
  "value": "540123" },

{
  "label": "?????????",
  "value": "540124" },

{
  "label": "?????????",
  "value": "540126" },

{
  "label": "???????????????",
  "value": "540127" },

{
  "label": "???????????????????????????",
  "value": "540171" },

{
  "label": "???????????????????????????",
  "value": "540172" },

{
  "label": "??????????????????????????????",
  "value": "540173" },

{
  "label": "??????????????????",
  "value": "540174" }],


[{
  "label": "????????????",
  "value": "540202" },

{
  "label": "????????????",
  "value": "540221" },

{
  "label": "?????????",
  "value": "540222" },

{
  "label": "?????????",
  "value": "540223" },

{
  "label": "?????????",
  "value": "540224" },

{
  "label": "?????????",
  "value": "540225" },

{
  "label": "?????????",
  "value": "540226" },

{
  "label": "????????????",
  "value": "540227" },

{
  "label": "?????????",
  "value": "540228" },

{
  "label": "?????????",
  "value": "540229" },

{
  "label": "?????????",
  "value": "540230" },

{
  "label": "?????????",
  "value": "540231" },

{
  "label": "?????????",
  "value": "540232" },

{
  "label": "?????????",
  "value": "540233" },

{
  "label": "?????????",
  "value": "540234" },

{
  "label": "????????????",
  "value": "540235" },

{
  "label": "?????????",
  "value": "540236" },

{
  "label": "?????????",
  "value": "540237" }],


[{
  "label": "?????????",
  "value": "540302" },

{
  "label": "?????????",
  "value": "540321" },

{
  "label": "?????????",
  "value": "540322" },

{
  "label": "????????????",
  "value": "540323" },

{
  "label": "?????????",
  "value": "540324" },

{
  "label": "?????????",
  "value": "540325" },

{
  "label": "?????????",
  "value": "540326" },

{
  "label": "?????????",
  "value": "540327" },

{
  "label": "?????????",
  "value": "540328" },

{
  "label": "?????????",
  "value": "540329" },

{
  "label": "?????????",
  "value": "540330" }],


[{
  "label": "?????????",
  "value": "540402" },

{
  "label": "???????????????",
  "value": "540421" },

{
  "label": "?????????",
  "value": "540422" },

{
  "label": "?????????",
  "value": "540423" },

{
  "label": "?????????",
  "value": "540424" },

{
  "label": "?????????",
  "value": "540425" },

{
  "label": "??????",
  "value": "540426" }],


[{
  "label": "?????????",
  "value": "540502" },

{
  "label": "?????????",
  "value": "540521" },

{
  "label": "?????????",
  "value": "540522" },

{
  "label": "?????????",
  "value": "540523" },

{
  "label": "?????????",
  "value": "540524" },

{
  "label": "?????????",
  "value": "540525" },

{
  "label": "?????????",
  "value": "540526" },

{
  "label": "?????????",
  "value": "540527" },

{
  "label": "?????????",
  "value": "540528" },

{
  "label": "?????????",
  "value": "540529" },

{
  "label": "?????????",
  "value": "540530" },

{
  "label": "????????????",
  "value": "540531" }],


[{
  "label": "?????????",
  "value": "542421" },

{
  "label": "?????????",
  "value": "542422" },

{
  "label": "?????????",
  "value": "542423" },

{
  "label": "?????????",
  "value": "542424" },

{
  "label": "?????????",
  "value": "542425" },

{
  "label": "?????????",
  "value": "542426" },

{
  "label": "??????",
  "value": "542427" },

{
  "label": "?????????",
  "value": "542428" },

{
  "label": "?????????",
  "value": "542429" },

{
  "label": "?????????",
  "value": "542430" },

{
  "label": "?????????",
  "value": "542431" }],


[{
  "label": "?????????",
  "value": "542521" },

{
  "label": "?????????",
  "value": "542522" },

{
  "label": "?????????",
  "value": "542523" },

{
  "label": "?????????",
  "value": "542524" },

{
  "label": "?????????",
  "value": "542525" },

{
  "label": "?????????",
  "value": "542526" },

{
  "label": "?????????",
  "value": "542527" }]],



[
[{
  "label": "?????????",
  "value": "610102" },

{
  "label": "?????????",
  "value": "610103" },

{
  "label": "?????????",
  "value": "610104" },

{
  "label": "?????????",
  "value": "610111" },

{
  "label": "?????????",
  "value": "610112" },

{
  "label": "?????????",
  "value": "610113" },

{
  "label": "?????????",
  "value": "610114" },

{
  "label": "?????????",
  "value": "610115" },

{
  "label": "?????????",
  "value": "610116" },

{
  "label": "?????????",
  "value": "610117" },

{
  "label": "?????????",
  "value": "610118" },

{
  "label": "?????????",
  "value": "610122" },

{
  "label": "?????????",
  "value": "610124" }],


[{
  "label": "?????????",
  "value": "610202" },

{
  "label": "?????????",
  "value": "610203" },

{
  "label": "?????????",
  "value": "610204" },

{
  "label": "?????????",
  "value": "610222" }],


[{
  "label": "?????????",
  "value": "610302" },

{
  "label": "?????????",
  "value": "610303" },

{
  "label": "?????????",
  "value": "610304" },

{
  "label": "?????????",
  "value": "610322" },

{
  "label": "?????????",
  "value": "610323" },

{
  "label": "?????????",
  "value": "610324" },

{
  "label": "??????",
  "value": "610326" },

{
  "label": "??????",
  "value": "610327" },

{
  "label": "?????????",
  "value": "610328" },

{
  "label": "?????????",
  "value": "610329" },

{
  "label": "??????",
  "value": "610330" },

{
  "label": "?????????",
  "value": "610331" }],


[{
  "label": "?????????",
  "value": "610402" },

{
  "label": "?????????",
  "value": "610403" },

{
  "label": "?????????",
  "value": "610404" },

{
  "label": "?????????",
  "value": "610422" },

{
  "label": "?????????",
  "value": "610423" },

{
  "label": "??????",
  "value": "610424" },

{
  "label": "?????????",
  "value": "610425" },

{
  "label": "?????????",
  "value": "610426" },

{
  "label": "??????",
  "value": "610427" },

{
  "label": "?????????",
  "value": "610428" },

{
  "label": "?????????",
  "value": "610429" },

{
  "label": "?????????",
  "value": "610430" },

{
  "label": "?????????",
  "value": "610431" },

{
  "label": "?????????",
  "value": "610481" }],


[{
  "label": "?????????",
  "value": "610502" },

{
  "label": "?????????",
  "value": "610503" },

{
  "label": "?????????",
  "value": "610522" },

{
  "label": "?????????",
  "value": "610523" },

{
  "label": "?????????",
  "value": "610524" },

{
  "label": "?????????",
  "value": "610525" },

{
  "label": "?????????",
  "value": "610526" },

{
  "label": "?????????",
  "value": "610527" },

{
  "label": "?????????",
  "value": "610528" },

{
  "label": "?????????",
  "value": "610581" },

{
  "label": "?????????",
  "value": "610582" }],


[{
  "label": "?????????",
  "value": "610602" },

{
  "label": "?????????",
  "value": "610603" },

{
  "label": "?????????",
  "value": "610621" },

{
  "label": "?????????",
  "value": "610622" },

{
  "label": "?????????",
  "value": "610623" },

{
  "label": "?????????",
  "value": "610625" },

{
  "label": "?????????",
  "value": "610626" },

{
  "label": "?????????",
  "value": "610627" },

{
  "label": "??????",
  "value": "610628" },

{
  "label": "?????????",
  "value": "610629" },

{
  "label": "?????????",
  "value": "610630" },

{
  "label": "?????????",
  "value": "610631" },

{
  "label": "?????????",
  "value": "610632" }],


[{
  "label": "?????????",
  "value": "610702" },

{
  "label": "?????????",
  "value": "610703" },

{
  "label": "?????????",
  "value": "610722" },

{
  "label": "??????",
  "value": "610723" },

{
  "label": "?????????",
  "value": "610724" },

{
  "label": "??????",
  "value": "610725" },

{
  "label": "?????????",
  "value": "610726" },

{
  "label": "?????????",
  "value": "610727" },

{
  "label": "?????????",
  "value": "610728" },

{
  "label": "?????????",
  "value": "610729" },

{
  "label": "?????????",
  "value": "610730" }],


[{
  "label": "?????????",
  "value": "610802" },

{
  "label": "?????????",
  "value": "610803" },

{
  "label": "?????????",
  "value": "610822" },

{
  "label": "?????????",
  "value": "610824" },

{
  "label": "?????????",
  "value": "610825" },

{
  "label": "?????????",
  "value": "610826" },

{
  "label": "?????????",
  "value": "610827" },

{
  "label": "??????",
  "value": "610828" },

{
  "label": "?????????",
  "value": "610829" },

{
  "label": "?????????",
  "value": "610830" },

{
  "label": "?????????",
  "value": "610831" },

{
  "label": "?????????",
  "value": "610881" }],


[{
  "label": "?????????",
  "value": "610902" },

{
  "label": "?????????",
  "value": "610921" },

{
  "label": "?????????",
  "value": "610922" },

{
  "label": "?????????",
  "value": "610923" },

{
  "label": "?????????",
  "value": "610924" },

{
  "label": "?????????",
  "value": "610925" },

{
  "label": "?????????",
  "value": "610926" },

{
  "label": "?????????",
  "value": "610927" },

{
  "label": "?????????",
  "value": "610928" },

{
  "label": "?????????",
  "value": "610929" }],


[{
  "label": "?????????",
  "value": "611002" },

{
  "label": "?????????",
  "value": "611021" },

{
  "label": "?????????",
  "value": "611022" },

{
  "label": "?????????",
  "value": "611023" },

{
  "label": "?????????",
  "value": "611024" },

{
  "label": "?????????",
  "value": "611025" },

{
  "label": "?????????",
  "value": "611026" }]],



[
[{
  "label": "?????????",
  "value": "620102" },

{
  "label": "????????????",
  "value": "620103" },

{
  "label": "?????????",
  "value": "620104" },

{
  "label": "?????????",
  "value": "620105" },

{
  "label": "?????????",
  "value": "620111" },

{
  "label": "?????????",
  "value": "620121" },

{
  "label": "?????????",
  "value": "620122" },

{
  "label": "?????????",
  "value": "620123" },

{
  "label": "????????????",
  "value": "620171" }],


[{
  "label": "????????????",
  "value": "620201" }],

[{
  "label": "?????????",
  "value": "620302" },

{
  "label": "?????????",
  "value": "620321" }],


[{
  "label": "?????????",
  "value": "620402" },

{
  "label": "?????????",
  "value": "620403" },

{
  "label": "?????????",
  "value": "620421" },

{
  "label": "?????????",
  "value": "620422" },

{
  "label": "?????????",
  "value": "620423" }],


[{
  "label": "?????????",
  "value": "620502" },

{
  "label": "?????????",
  "value": "620503" },

{
  "label": "?????????",
  "value": "620521" },

{
  "label": "?????????",
  "value": "620522" },

{
  "label": "?????????",
  "value": "620523" },

{
  "label": "?????????",
  "value": "620524" },

{
  "label": "????????????????????????",
  "value": "620525" }],


[{
  "label": "?????????",
  "value": "620602" },

{
  "label": "?????????",
  "value": "620621" },

{
  "label": "?????????",
  "value": "620622" },

{
  "label": "?????????????????????",
  "value": "620623" }],


[{
  "label": "?????????",
  "value": "620702" },

{
  "label": "????????????????????????",
  "value": "620721" },

{
  "label": "?????????",
  "value": "620722" },

{
  "label": "?????????",
  "value": "620723" },

{
  "label": "?????????",
  "value": "620724" },

{
  "label": "?????????",
  "value": "620725" }],


[{
  "label": "?????????",
  "value": "620802" },

{
  "label": "?????????",
  "value": "620821" },

{
  "label": "?????????",
  "value": "620822" },

{
  "label": "?????????",
  "value": "620823" },

{
  "label": "?????????",
  "value": "620824" },

{
  "label": "?????????",
  "value": "620825" },

{
  "label": "?????????",
  "value": "620826" },

{
  "label": "??????????????????",
  "value": "620871" }],


[{
  "label": "?????????",
  "value": "620902" },

{
  "label": "?????????",
  "value": "620921" },

{
  "label": "?????????",
  "value": "620922" },

{
  "label": "????????????????????????",
  "value": "620923" },

{
  "label": "??????????????????????????????",
  "value": "620924" },

{
  "label": "?????????",
  "value": "620981" },

{
  "label": "?????????",
  "value": "620982" }],


[{
  "label": "?????????",
  "value": "621002" },

{
  "label": "?????????",
  "value": "621021" },

{
  "label": "??????",
  "value": "621022" },

{
  "label": "?????????",
  "value": "621023" },

{
  "label": "?????????",
  "value": "621024" },

{
  "label": "?????????",
  "value": "621025" },

{
  "label": "??????",
  "value": "621026" },

{
  "label": "?????????",
  "value": "621027" }],


[{
  "label": "?????????",
  "value": "621102" },

{
  "label": "?????????",
  "value": "621121" },

{
  "label": "?????????",
  "value": "621122" },

{
  "label": "?????????",
  "value": "621123" },

{
  "label": "?????????",
  "value": "621124" },

{
  "label": "??????",
  "value": "621125" },

{
  "label": "??????",
  "value": "621126" }],


[{
  "label": "?????????",
  "value": "621202" },

{
  "label": "??????",
  "value": "621221" },

{
  "label": "??????",
  "value": "621222" },

{
  "label": "?????????",
  "value": "621223" },

{
  "label": "??????",
  "value": "621224" },

{
  "label": "?????????",
  "value": "621225" },

{
  "label": "??????",
  "value": "621226" },

{
  "label": "??????",
  "value": "621227" },

{
  "label": "?????????",
  "value": "621228" }],


[{
  "label": "?????????",
  "value": "622901" },

{
  "label": "?????????",
  "value": "622921" },

{
  "label": "?????????",
  "value": "622922" },

{
  "label": "?????????",
  "value": "622923" },

{
  "label": "?????????",
  "value": "622924" },

{
  "label": "?????????",
  "value": "622925" },

{
  "label": "??????????????????",
  "value": "622926" },

{
  "label": "?????????????????????????????????????????????",
  "value": "622927" }],


[{
  "label": "?????????",
  "value": "623001" },

{
  "label": "?????????",
  "value": "623021" },

{
  "label": "?????????",
  "value": "623022" },

{
  "label": "?????????",
  "value": "623023" },

{
  "label": "?????????",
  "value": "623024" },

{
  "label": "?????????",
  "value": "623025" },

{
  "label": "?????????",
  "value": "623026" },

{
  "label": "?????????",
  "value": "623027" }]],



[
[{
  "label": "?????????",
  "value": "630102" },

{
  "label": "?????????",
  "value": "630103" },

{
  "label": "?????????",
  "value": "630104" },

{
  "label": "?????????",
  "value": "630105" },

{
  "label": "???????????????????????????",
  "value": "630121" },

{
  "label": "?????????",
  "value": "630122" },

{
  "label": "?????????",
  "value": "630123" }],


[{
  "label": "?????????",
  "value": "630202" },

{
  "label": "?????????",
  "value": "630203" },

{
  "label": "???????????????????????????",
  "value": "630222" },

{
  "label": "?????????????????????",
  "value": "630223" },

{
  "label": "?????????????????????",
  "value": "630224" },

{
  "label": "????????????????????????",
  "value": "630225" }],


[{
  "label": "?????????????????????",
  "value": "632221" },

{
  "label": "?????????",
  "value": "632222" },

{
  "label": "?????????",
  "value": "632223" },

{
  "label": "?????????",
  "value": "632224" }],


[{
  "label": "?????????",
  "value": "632321" },

{
  "label": "?????????",
  "value": "632322" },

{
  "label": "?????????",
  "value": "632323" },

{
  "label": "????????????????????????",
  "value": "632324" }],


[{
  "label": "?????????",
  "value": "632521" },

{
  "label": "?????????",
  "value": "632522" },

{
  "label": "?????????",
  "value": "632523" },

{
  "label": "?????????",
  "value": "632524" },

{
  "label": "?????????",
  "value": "632525" }],


[{
  "label": "?????????",
  "value": "632621" },

{
  "label": "?????????",
  "value": "632622" },

{
  "label": "?????????",
  "value": "632623" },

{
  "label": "?????????",
  "value": "632624" },

{
  "label": "?????????",
  "value": "632625" },

{
  "label": "?????????",
  "value": "632626" }],


[{
  "label": "?????????",
  "value": "632701" },

{
  "label": "?????????",
  "value": "632722" },

{
  "label": "?????????",
  "value": "632723" },

{
  "label": "?????????",
  "value": "632724" },

{
  "label": "?????????",
  "value": "632725" },

{
  "label": "????????????",
  "value": "632726" }],


[{
  "label": "????????????",
  "value": "632801" },

{
  "label": "????????????",
  "value": "632802" },

{
  "label": "?????????",
  "value": "632821" },

{
  "label": "?????????",
  "value": "632822" },

{
  "label": "?????????",
  "value": "632823" },

{
  "label": "????????????????????????",
  "value": "632857" },

{
  "label": "?????????????????????",
  "value": "632858" },

{
  "label": "?????????????????????",
  "value": "632859" }]],



[
[{
  "label": "?????????",
  "value": "640104" },

{
  "label": "?????????",
  "value": "640105" },

{
  "label": "?????????",
  "value": "640106" },

{
  "label": "?????????",
  "value": "640121" },

{
  "label": "?????????",
  "value": "640122" },

{
  "label": "?????????",
  "value": "640181" }],


[{
  "label": "????????????",
  "value": "640202" },

{
  "label": "?????????",
  "value": "640205" },

{
  "label": "?????????",
  "value": "640221" }],


[{
  "label": "?????????",
  "value": "640302" },

{
  "label": "????????????",
  "value": "640303" },

{
  "label": "?????????",
  "value": "640323" },

{
  "label": "?????????",
  "value": "640324" },

{
  "label": "????????????",
  "value": "640381" }],


[{
  "label": "?????????",
  "value": "640402" },

{
  "label": "?????????",
  "value": "640422" },

{
  "label": "?????????",
  "value": "640423" },

{
  "label": "?????????",
  "value": "640424" },

{
  "label": "?????????",
  "value": "640425" }],


[{
  "label": "????????????",
  "value": "640502" },

{
  "label": "?????????",
  "value": "640521" },

{
  "label": "?????????",
  "value": "640522" }]],



[
[{
  "label": "?????????",
  "value": "650102" },

{
  "label": "???????????????",
  "value": "650103" },

{
  "label": "?????????",
  "value": "650104" },

{
  "label": "????????????",
  "value": "650105" },

{
  "label": "????????????",
  "value": "650106" },

{
  "label": "????????????",
  "value": "650107" },

{
  "label": "?????????",
  "value": "650109" },

{
  "label": "???????????????",
  "value": "650121" },

{
  "label": "?????????????????????????????????",
  "value": "650171" },

{
  "label": "???????????????????????????????????????",
  "value": "650172" }],


[{
  "label": "????????????",
  "value": "650202" },

{
  "label": "???????????????",
  "value": "650203" },

{
  "label": "????????????",
  "value": "650204" },

{
  "label": "????????????",
  "value": "650205" }],


[{
  "label": "?????????",
  "value": "650402" },

{
  "label": "?????????",
  "value": "650421" },

{
  "label": "????????????",
  "value": "650422" }],


[{
  "label": "?????????",
  "value": "650502" },

{
  "label": "???????????????????????????",
  "value": "650521" },

{
  "label": "?????????",
  "value": "650522" }],


[{
  "label": "?????????",
  "value": "652301" },

{
  "label": "?????????",
  "value": "652302" },

{
  "label": "????????????",
  "value": "652323" },

{
  "label": "????????????",
  "value": "652324" },

{
  "label": "?????????",
  "value": "652325" },

{
  "label": "???????????????",
  "value": "652327" },

{
  "label": "????????????????????????",
  "value": "652328" }],


[{
  "label": "?????????",
  "value": "652701" },

{
  "label": "???????????????",
  "value": "652702" },

{
  "label": "?????????",
  "value": "652722" },

{
  "label": "?????????",
  "value": "652723" }],


[{
  "label": "????????????",
  "value": "652801" },

{
  "label": "?????????",
  "value": "652822" },

{
  "label": "?????????",
  "value": "652823" },

{
  "label": "?????????",
  "value": "652824" },

{
  "label": "?????????",
  "value": "652825" },

{
  "label": "?????????????????????",
  "value": "652826" },

{
  "label": "?????????",
  "value": "652827" },

{
  "label": "?????????",
  "value": "652828" },

{
  "label": "?????????",
  "value": "652829" },

{
  "label": "??????????????????????????????",
  "value": "652871" }],


[{
  "label": "????????????",
  "value": "652901" },

{
  "label": "?????????",
  "value": "652922" },

{
  "label": "?????????",
  "value": "652923" },

{
  "label": "?????????",
  "value": "652924" },

{
  "label": "?????????",
  "value": "652925" },

{
  "label": "?????????",
  "value": "652926" },

{
  "label": "?????????",
  "value": "652927" },

{
  "label": "????????????",
  "value": "652928" },

{
  "label": "?????????",
  "value": "652929" }],


[{
  "label": "????????????",
  "value": "653001" },

{
  "label": "????????????",
  "value": "653022" },

{
  "label": "????????????",
  "value": "653023" },

{
  "label": "?????????",
  "value": "653024" }],


[{
  "label": "?????????",
  "value": "653101" },

{
  "label": "?????????",
  "value": "653121" },

{
  "label": "?????????",
  "value": "653122" },

{
  "label": "????????????",
  "value": "653123" },

{
  "label": "?????????",
  "value": "653124" },

{
  "label": "?????????",
  "value": "653125" },

{
  "label": "?????????",
  "value": "653126" },

{
  "label": "????????????",
  "value": "653127" },

{
  "label": "????????????",
  "value": "653128" },

{
  "label": "?????????",
  "value": "653129" },

{
  "label": "?????????",
  "value": "653130" },

{
  "label": "?????????????????????????????????",
  "value": "653131" }],


[{
  "label": "?????????",
  "value": "653201" },

{
  "label": "?????????",
  "value": "653221" },

{
  "label": "?????????",
  "value": "653222" },

{
  "label": "?????????",
  "value": "653223" },

{
  "label": "?????????",
  "value": "653224" },

{
  "label": "?????????",
  "value": "653225" },

{
  "label": "?????????",
  "value": "653226" },

{
  "label": "?????????",
  "value": "653227" }],


[{
  "label": "?????????",
  "value": "654002" },

{
  "label": "?????????",
  "value": "654003" },

{
  "label": "???????????????",
  "value": "654004" },

{
  "label": "?????????",
  "value": "654021" },

{
  "label": "???????????????????????????",
  "value": "654022" },

{
  "label": "?????????",
  "value": "654023" },

{
  "label": "?????????",
  "value": "654024" },

{
  "label": "?????????",
  "value": "654025" },

{
  "label": "?????????",
  "value": "654026" },

{
  "label": "????????????",
  "value": "654027" },

{
  "label": "????????????",
  "value": "654028" }],


[{
  "label": "?????????",
  "value": "654201" },

{
  "label": "?????????",
  "value": "654202" },

{
  "label": "?????????",
  "value": "654221" },

{
  "label": "?????????",
  "value": "654223" },

{
  "label": "?????????",
  "value": "654224" },

{
  "label": "?????????",
  "value": "654225" },

{
  "label": "??????????????????????????????",
  "value": "654226" }],


[{
  "label": "????????????",
  "value": "654301" },

{
  "label": "????????????",
  "value": "654321" },

{
  "label": "?????????",
  "value": "654322" },

{
  "label": "?????????",
  "value": "654323" },

{
  "label": "????????????",
  "value": "654324" },

{
  "label": "?????????",
  "value": "654325" },

{
  "label": "????????????",
  "value": "654326" }],


[{
  "label": "????????????",
  "value": "659001" },

{
  "label": "????????????",
  "value": "659002" },

{
  "label": "???????????????",
  "value": "659003" },

{
  "label": "????????????",
  "value": "659004" },

{
  "label": "????????????",
  "value": "659006" }]],



[
[{
  "label": "??????",
  "value": "660101" }],

[{
  "label": "??????",
  "value": "660201" }],

[{
  "label": "??????",
  "value": "660301" }],

[{
  "label": "??????",
  "value": "660401" }],

[{
  "label": "??????",
  "value": "660501" }],

[{
  "label": "??????",
  "value": "660601" }],

[{
  "label": "??????",
  "value": "660701" }],

[{
  "label": "??????",
  "value": "660801" }],

[{
  "label": "??????",
  "value": "660901" }],

[{
  "label": "??????",
  "value": "661001" }],

[{
  "label": "??????",
  "value": "661101" }],

[{
  "label": "??????",
  "value": "661201" }],

[{
  "label": "??????",
  "value": "661301" }],

[{
  "label": "??????",
  "value": "661401" }],

[{
  "label": "??????",
  "value": "661501" }],

[{
  "label": "??????",
  "value": "661601" }],

[{
  "label": "??????",
  "value": "661701" }]],


[
[{
  "label": "?????????",
  "value": "670101" }],

[{
  "label": "??????",
  "value": "670201" }],

[{
  "label": "??????",
  "value": "670301" }]],


[
[{
  "label": "????????????",
  "value": "680101" }],

[{
  "label": "?????????",
  "value": "680201" }],

[{
  "label": "?????????",
  "value": "680301" }],

[{
  "label": "?????????",
  "value": "680401" }]]];var _default =



areaData;exports.default = _default;

/***/ }),

/***/ 4:
/*!**************************************************************!*\
  !*** C:/Users/admin/Desktop/change1/change/shops/pages.json ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),

/***/ 45:
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! regenerator-runtime */ 46);


/***/ }),

/***/ 46:
/*!************************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime-module.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() {
  return this || (typeof self === "object" && self);
})() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(/*! ./runtime */ 47);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),

/***/ 47:
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() {
    return this || (typeof self === "object" && self);
  })() || Function("return this")()
);


/***/ }),

/***/ 5:
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-weixin"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    // ???????????????????????????????????????
    if (uni.canIUse('getAccountInfoSync')) {
      packName = uni.getAccountInfoSync().miniProgram.appId || '';
    }
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login ??? share ???pay_success ???pay_fail ???register ???title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] ????????? title ??????[options] ??????????????? String ??????');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('?????? onLauch ???????????????????????? pageShow ?????????????????????????????????');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // ????????????????????????????????????
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //?????? SDK ?????????
        t: time, //???????????????????????????
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // ?????????
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 ??????
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // ?????? type ??????
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Stat).call(this));
    _this6.instance = null;
    // ???????????????
    if (typeof uni.addInterceptor === 'function' && "development" !== 'development') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('?????????????????????????????????????????????????????????');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // ???????????????????????????????????????
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 6:
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@alpha","_id":"@dcloudio/uni-stat@2.0.0-alpha-25120200103005","_inBundle":false,"_integrity":"sha512-nYoIrRV2e5o/vzr6foSdWi3Rl2p0GuO+LPY3JctyY6uTKgPnuH99d7aL/QQdJ1SacQjBWO+QGK1qankN7oyrWw==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@dcloudio/uni-stat@alpha","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"alpha","saveSpec":null,"fetchSpec":"alpha"},"_requiredBy":["#USER","/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-alpha-25120200103005.tgz","_shasum":"a77a63481f36474f3e86686868051219d1bb12df","_spec":"@dcloudio/uni-stat@alpha","_where":"/Users/guoshengqiang/Documents/dcloud-plugins/alpha/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"6be187a3dfe15f95dd6146d9fec08e1f81100987","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-alpha-25120200103005"};

/***/ }),

/***/ 7:
/*!*******************************************************************************!*\
  !*** C:/Users/admin/Desktop/change1/change/shops/pages.json?{"type":"style"} ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/index/index": { "navigationBarTitleText": "??????", "enablePullDownRefresh": true }, "pages/classify/classify": { "navigationBarTitleText": "??????" }, "pages/cart/cart": { "navigationBarTitleText": "?????????" }, "pages/member/member": { "navigationBarTitleText": "????????????", "enablePullDownRefresh": true, "backgroundTextStyle": "light", "navigationBarBackgroundColor": "#f06c7a", "backgroundColorTop": "#f06c7a", "navigationBarTextStyle": "white" }, "pages/order/order": { "navigationBarTitleText": "????????????" }, "pages/productList/productList": { "navigationBarTitleText": "????????????", "navigationStyle": "custom" }, "pages/productDetail/productDetail": { "navigationBarTitleText": "????????????", "navigationStyle": "custom" }, "pages/flashshop/flashshop": { "navigationBarTitleText": "????????????" }, "pages/hotSale/hotSale": { "navigationBarTitleText": "????????????" }, "pages/CouponList/CouponList": { "navigationBarTitleText": "?????????" }, "pages/deposit/deposit": { "navigationBarTitleText": "??????" }, "pages/success/success": { "navigationBarTitleText": "????????????" }, "pages/coupon/coupon": { "navigationBarTitleText": "?????????" }, "pages/confirmation/confirmation": { "navigationBarTitleText": "??????" }, "pages/address/address": { "navigationBarTitleText": "????????????" }, "pages/edit/edit": { "navigationBarTitleText": "????????????" }, "pages/payment/payment": { "navigationBarTitleText": "????????????" } }, "globalStyle": { "navigationBarTextStyle": "black", "navigationBarTitleText": "?????????", "navigationBarBackgroundColor": "#fff", "backgroundColor": "#F8F8F8" } };exports.default = _default;

/***/ }),

/***/ 8:
/*!******************************************************************************!*\
  !*** C:/Users/admin/Desktop/change1/change/shops/pages.json?{"type":"stat"} ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "__UNI__96AA928" };exports.default = _default;

/***/ })

}]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map