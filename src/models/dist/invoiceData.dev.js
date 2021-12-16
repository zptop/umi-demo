"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _invoice = require("../sevice/invoice");

var _tools = require("../util/tools");

var _umi = require("umi");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = {
  namespace: 'invoice',
  state: {
    invoiceList: [],
    loading: false,
    //列表加载状态
    totalPage: 0,
    //总页数
    payInfoObj: {},
    //支付信息,
    applyTitleInfo: {},
    //发票申请详情信息
    invoiceDetailList: [],
    //发票申请详情列表
    totalPageDetail: 0,
    //发票详情列表总页数
    loadingDetail: false //发票详情loading

  },
  //同步方法
  reducers: {
    //设置列表
    setInvoiceList: function setInvoiceList(state, action) {
      return _objectSpread({}, state, {
        invoiceList: action.payload.data,
        totalPage: action.payload.total
      });
    },
    setLoadingTrue: function setLoadingTrue(state) {
      return _objectSpread({}, state, {
        loading: true
      });
    },
    setLoadingFalse: function setLoadingFalse(state) {
      return _objectSpread({}, state, {
        loading: false
      });
    },
    setPayInfoObj: function setPayInfoObj(state, action) {
      return _objectSpread({}, state, {
        payInfoObj: action.payload
      });
    },
    //发票申请详情信息
    setInvoiceGetInfo: function setInvoiceGetInfo(state, action) {
      return _objectSpread({}, state, {
        applyTitleInfo: action.payload
      });
    },
    //设置发票申请详情列表
    setInvoicewaybill: function setInvoicewaybill(state, action) {
      return _objectSpread({}, state, {
        invoiceDetailList: action.payload.data,
        totalPageDetail: action.payload.total * 1
      });
    },
    setLoadingDetail: function setLoadingDetail(state, action) {
      return _objectSpread({}, state, {
        loadingDetail: action.payload.flag
      });
    }
  },
  //异步方法
  effects: {
    //获取发票列表
    getInvoiceListModel:
    /*#__PURE__*/
    regeneratorRuntime.mark(function getInvoiceListModel(_ref, _ref2) {
      var value, call, put, res;
      return regeneratorRuntime.wrap(function getInvoiceListModel$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              value = _ref.value;
              call = _ref2.call, put = _ref2.put;
              _context.next = 4;
              return put({
                type: 'setLoadingTrue'
              });

            case 4:
              _context.next = 6;
              return call(_invoice.getInvoiceList, value, '/Invoice/get_list');

            case 6:
              res = _context.sent;

              if (!(res.code == 0)) {
                _context.next = 13;
                break;
              }

              _context.next = 10;
              return put({
                type: 'setLoadingFalse'
              });

            case 10:
              if (!(res.data && res.data.length)) {
                _context.next = 13;
                break;
              }

              _context.next = 13;
              return put({
                type: 'setInvoiceList',
                payload: res
              });

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, getInvoiceListModel);
    }),
    //支付税金弹框信息
    getInvoicePayInfoModel:
    /*#__PURE__*/
    regeneratorRuntime.mark(function getInvoicePayInfoModel(_ref3, _ref4) {
      var value, call, put, res, data, copy_data;
      return regeneratorRuntime.wrap(function getInvoicePayInfoModel$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              value = _ref3.value;
              call = _ref4.call, put = _ref4.put;
              _context2.next = 4;
              return call(_invoice.getInvoicePayInfo, value);

            case 4:
              res = _context2.sent;
              data = res.data;
              copy_data = _objectSpread({}, data, {
                invoice_amount: (0, _tools.accDiv)(data.invoice_amount, 100).toFixed(2),
                taxable_amount: (0, _tools.accDiv)(data.taxable_amount, 100).toFixed(2),
                create_time: (0, _tools.formatDateYMDHMS)(data.create_time, "year")
              });

              if (!(res.code == 0)) {
                _context2.next = 10;
                break;
              }

              _context2.next = 10;
              return put({
                type: 'setPayInfoObj',
                payload: copy_data
              });

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, getInvoicePayInfoModel);
    }),
    //发票申请详情信息
    getInvoiceGetInfoModel:
    /*#__PURE__*/
    regeneratorRuntime.mark(function getInvoiceGetInfoModel(_ref5, _ref6) {
      var value, call, put, res;
      return regeneratorRuntime.wrap(function getInvoiceGetInfoModel$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              value = _ref5.value;
              call = _ref6.call, put = _ref6.put;
              _context3.next = 4;
              return call(_invoice.getInvoiceGetInfo, value);

            case 4:
              res = _context3.sent;

              if (!(res.code == 0)) {
                _context3.next = 8;
                break;
              }

              _context3.next = 8;
              return put({
                type: 'setInvoiceGetInfo',
                payload: res.data
              });

            case 8:
            case "end":
              return _context3.stop();
          }
        }
      }, getInvoiceGetInfoModel);
    }),
    //发票申请详情列表
    getInvoicewaybillModel:
    /*#__PURE__*/
    regeneratorRuntime.mark(function getInvoicewaybillModel(_ref7, _ref8) {
      var value, call, put, res;
      return regeneratorRuntime.wrap(function getInvoicewaybillModel$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              value = _ref7.value;
              call = _ref8.call, put = _ref8.put;
              _context4.next = 4;
              return call(_invoice.getInvoicewaybill, value);

            case 4:
              res = _context4.sent;
              _context4.next = 7;
              return put({
                type: 'setLoadingDetail',
                action: true
              });

            case 7:
              if (!(res.code == 0)) {
                _context4.next = 12;
                break;
              }

              _context4.next = 10;
              return put({
                type: 'setInvoicewaybill',
                payload: res
              });

            case 10:
              _context4.next = 12;
              return put({
                type: 'setLoadingDetail',
                action: false
              });

            case 12:
            case "end":
              return _context4.stop();
          }
        }
      }, getInvoicewaybillModel);
    })
  },
  subscriptions: {
    setup: function setup(_ref9) {
      var dispatch = _ref9.dispatch,
          history = _ref9.history;
      return history.listen(function (_ref10) {
        var pathname = _ref10.pathname;

        if (pathname === '/invoice/car' || pathname === '/invoice/ship') {
          dispatch({
            type: 'getInvoiceListModel',
            value: {
              match_business_type: pathname === '/invoice/car' ? 1 : 2
            }
          });
        }
      });
    }
  }
};
exports["default"] = _default;