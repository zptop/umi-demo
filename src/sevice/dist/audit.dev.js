'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.paymentRequestList = paymentRequestList;

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
