'use strict';
var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
exports.__esModule = true;
var react_1 = require('react');
var list_1 = require('../../components/invoice-model/list');
var CarForm = /** @class */ (function(_super) {
  __extends(CarForm, _super);
  function CarForm() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  CarForm.prototype.render = function() {
    return react_1['default'].createElement(
      'div',
      null,
      react_1['default'].createElement(list_1['default'], {
        transportType: '1',
        invoiceDetailPath: '/invoice/carDetail',
        formName: '/car/form',
      }),
    );
  };
  return CarForm;
})(react_1['default'].Component);
exports['default'] = CarForm;
