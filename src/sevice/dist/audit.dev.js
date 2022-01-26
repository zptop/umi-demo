'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.paymentRequestList = paymentRequestList;
exports.paymentHistoryList = paymentHistoryList;

var _request = _interopRequireDefault(require('../util/request'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**获取发票列表 */
function paymentRequestList(params, url) {
  return regeneratorRuntime.async(function paymentRequestList$(_context) {
    while (1) {
      switch ((_context.prev = _context.next)) {
        case 0:
          return _context.abrupt(
            'return',
            (0, _request['default'])(url, {
              method: 'GET',
              params: params,
            }),
          );

        case 1:
        case 'end':
          return _context.stop();
      }
    }
  });
}
/**付款申请跟踪 */

function paymentHistoryList(params) {
  return regeneratorRuntime.async(function paymentHistoryList$(_context2) {
    while (1) {
      switch ((_context2.prev = _context2.next)) {
        case 0:
          return _context2.abrupt(
            'return',
            (0, _request['default'])('/apply/history_list', {
              method: 'GET',
              params: params,
            }),
          );

        case 1:
        case 'end':
          return _context2.stop();
      }
    }
  });
}
