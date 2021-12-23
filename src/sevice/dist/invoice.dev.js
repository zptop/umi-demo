'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.getInvoiceList = getInvoiceList;
exports.getInvoicePayInfo = getInvoicePayInfo;
exports.getInvoicewaybill = getInvoicewaybill;
exports.getInvoiceGetInfo = getInvoiceGetInfo;
exports.removewaybill = removewaybill;

var _request = _interopRequireDefault(require('../util/request'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**获取发票列表 */
function getInvoiceList(params, url) {
  return regeneratorRuntime.async(function getInvoiceList$(_context) {
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
/**获取支付税金信息 */

function getInvoicePayInfo(params) {
  return regeneratorRuntime.async(function getInvoicePayInfo$(_context2) {
    while (1) {
      switch ((_context2.prev = _context2.next)) {
        case 0:
          return _context2.abrupt(
            'return',
            (0, _request['default'])('/invoice/pay_info', {
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
/**发票申请详情列表*/

function getInvoicewaybill(params) {
  return regeneratorRuntime.async(function getInvoicewaybill$(_context3) {
    while (1) {
      switch ((_context3.prev = _context3.next)) {
        case 0:
          return _context3.abrupt(
            'return',
            (0, _request['default'])('/invoice/invoicewaybill', {
              method: 'GET',
              params: params,
            }),
          );

        case 1:
        case 'end':
          return _context3.stop();
      }
    }
  });
}
/**获取支付税金详情信息*/

function getInvoiceGetInfo(params) {
  return regeneratorRuntime.async(function getInvoiceGetInfo$(_context4) {
    while (1) {
      switch ((_context4.prev = _context4.next)) {
        case 0:
          return _context4.abrupt(
            'return',
            (0, _request['default'])('/invoice/get_info', {
              method: 'GET',
              params: params,
            }),
          );

        case 1:
        case 'end':
          return _context4.stop();
      }
    }
  });
}
/**运单详情行操作-移除 */

function removewaybill(params) {
  return regeneratorRuntime.async(function removewaybill$(_context5) {
    while (1) {
      switch ((_context5.prev = _context5.next)) {
        case 0:
          return _context5.abrupt(
            'return',
            (0, _request['default'])('/invoice/removewaybill', {
              method: 'GET',
              params: params,
            }),
          );

        case 1:
        case 'end':
          return _context5.stop();
      }
    }
  });
}
/**发票详情列表-搜索*/
