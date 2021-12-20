'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;

var _ref;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

var _default = {
  targets: {
    //配置浏览器最低版本
    ie: 11,
  },
  mfsu: {},
  hash: true,
  //开启打包文件的hash值后缀
  treeShaking: true,
  //去除那些引用的但却没有使用的代码
  plugins: [
    [
      'umi-plugin-react',
      ((_ref = {
        dva: true,
        //开启dva功能
        antd: true,
        //开启ant design功能
        dynamicImport: {
          //实现路由级的动态加载
          webpackChunkName: true, //实现有意义的异步文件名
        },
      }),
      _defineProperty(_ref, 'dva', {
        dynamicImport: true,
        //是否启用按需加载
        hmr: true, //是否启用 dva 的 热更新
      }),
      _defineProperty(_ref, 'dll', {
        exclude: [],
        include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch', 'antd/es'],
      }),
      _defineProperty(_ref, 'routes', {
        exclude: [
          /components\//,
          /model\.(j|t)sx?$/,
          /components\.(j|t)sx?$/,
          /service\.(j|t)sx?$/,
          /models\//,
          /services\//,
        ],
      }),
      _ref),
    ],
  ],
  baseUrl: {
    dev: 'http://local-invoice.ship56.net',
    pro: '/',
  },
};
exports['default'] = _default;
