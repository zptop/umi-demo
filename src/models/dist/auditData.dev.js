'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;

var _audit = require('../sevice/audit');

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(source, true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function(key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key),
        );
      });
    }
  }
  return target;
}

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
  namespace: 'audit',
  state: {
    audit_wait_list: [],
    //列表
    audit_finish_list: [],
    //列表
    audit_special_list: [],
    //列表
    loading: false,
    //列表加载状态
    totalPage: 0,
    //总页数,
    audit_history_list: [], //付款申请跟踪列表
  },
  reducers: {
    //loading状态
    setLoading: function setLoading(state, action) {
      return _objectSpread({}, state, {
        loading: action.payload,
      });
    },
    //列表
    set_wait_list: function set_wait_list(state, action) {
      var _action$payload = action.payload,
        data = _action$payload.data,
        total = _action$payload.total;
      return _objectSpread({}, state, {
        audit_wait_list: data,
        totalPage: total,
      });
    },
    set_finish_list: function set_finish_list(state, action) {
      var _action$payload2 = action.payload,
        data = _action$payload2.data,
        total = _action$payload2.total;
      return _objectSpread({}, state, {
        audit_finish_list: data,
        totalPage: total,
      });
    },
    set_special_list: function set_special_list(state, action) {
      var _action$payload3 = action.payload,
        data = _action$payload3.data,
        total = _action$payload3.total;
      return _objectSpread({}, state, {
        audit_special_list: data,
        totalPage: total,
      });
    },
    set_history_list: function set_history_list(state, action) {
      var _action$payload4 = action.payload,
        data = _action$payload4.data,
        total = _action$payload4.total;
      return _objectSpread({}, state, {
        audit_history_list: data,
        totalPage: total,
      });
    },
  },
  effects: {
    //列表
    getPaymentRequestListModel:
      /*#__PURE__*/
      regeneratorRuntime.mark(function getPaymentRequestListModel(_ref, _ref2) {
        var value, call, put, res;
        return regeneratorRuntime.wrap(function getPaymentRequestListModel$(
          _context,
        ) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                value = _ref.value;
                (call = _ref2.call), (put = _ref2.put);
                _context.next = 4;
                return put({
                  type: 'setLoading',
                  payload: true,
                });

              case 4:
                _context.next = 6;
                return call(
                  _audit.paymentRequestList,
                  value,
                  '/apply/' + value.flag,
                );

              case 6:
                res = _context.sent;
                _context.next = 9;
                return put({
                  type: 'set_' + value.flag,
                  payload: {
                    data: [],
                  },
                });

              case 9:
                if (!(res.code == 0)) {
                  _context.next = 15;
                  break;
                }

                _context.next = 12;
                return put({
                  type: 'setLoading',
                  payload: false,
                });

              case 12:
                if (!(res.data && res.data.length)) {
                  _context.next = 15;
                  break;
                }

                _context.next = 15;
                return put({
                  type: 'set_' + value.flag,
                  payload: _objectSpread({}, res),
                });

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        },
        getPaymentRequestListModel);
      }),
    //付款申请跟踪
    paymentHistoryListModel:
      /*#__PURE__*/
      regeneratorRuntime.mark(function paymentHistoryListModel(_ref3, _ref4) {
        var value, call, put, res;
        return regeneratorRuntime.wrap(function paymentHistoryListModel$(
          _context2,
        ) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                value = _ref3.value;
                (call = _ref4.call), (put = _ref4.put);
                _context2.next = 4;
                return put({
                  type: 'setLoading',
                  payload: true,
                });

              case 4:
                _context2.next = 6;
                return call(_audit.paymentHistoryList, value);

              case 6:
                res = _context2.sent;

                if (!(res.code == 0)) {
                  _context2.next = 13;
                  break;
                }

                _context2.next = 10;
                return put({
                  type: 'setLoading',
                  payload: false,
                });

              case 10:
                if (!(res.data && res.data.length)) {
                  _context2.next = 13;
                  break;
                }

                _context2.next = 13;
                return put({
                  type: 'set_history_list',
                  payload: res,
                });

              case 13:
              case 'end':
                return _context2.stop();
            }
          }
        },
        paymentHistoryListModel);
      }),
  },
  subscriptions: {},
};
exports['default'] = _default;
