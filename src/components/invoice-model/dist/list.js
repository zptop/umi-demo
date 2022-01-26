'use strict';
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
exports.__esModule = true;
var antd_1 = require('antd');
var umi_1 = require('umi');
var RangePicker = antd_1.DatePicker.RangePicker;
var icons_1 = require('@ant-design/icons');
var tools_1 = require('../../util/tools');
var react_1 = require('react');
var dva_1 = require('dva');
var namespace = 'invoice';
var pay_invoice_modal_1 = require('./pay-invoice-modal');
var mapStateToProps = function(state) {
  var _a = state[namespace],
    invoiceList = _a.invoiceList,
    totalPage = _a.totalPage,
    loading = _a.loading;
  return {
    invoiceList: invoiceList,
    totalPage: totalPage,
    loading: loading,
  };
};
var mapDispatchToProps = function(dispatch) {
  return {
    getInvoiceListFn: function(value) {
      dispatch({
        type: namespace + '/getInvoiceListModel',
        value: value,
      });
    },
  };
};
var List = function(props) {
  var transportType = props.transportType;
  var _a = react_1.useState({
      match_business_type: 1,
      invoice_status: '100',
      start_time: '',
      end_time: '',
    }),
    searchObj = _a[0],
    setSearchObj = _a[1];
  var _b = react_1.useState({
      pageNum: 1,
      pageSize: 10,
    }),
    objState = _b[0],
    setObjState = _b[1];
  var _c = react_1.useState({
      value: '0',
      text: '开票申请单号',
    }),
    inputObj = _c[0],
    setInputObj = _c[1];
  var selectNum = function(e, option) {
    var value = option.value,
      children = option.children;
    setInputObj(
      __assign(__assign({}, inputObj), { value: value, text: children }),
    );
  };
  var judgmentParamsFn = function(params, value) {
    switch (inputObj.value * 1) {
      case 0:
        setSearchObj(
          __assign(__assign({}, searchObj), { apply_invoiceno: value }),
        );
        break;
      case 1:
        setSearchObj(__assign(__assign({}, searchObj), { invoice_no: value }));
        break;
      case 2:
        setSearchObj(__assign(__assign({}, searchObj), { waybill_no: value }));
        break;
    }
  };
  //支付税金模块
  var _d = react_1.useState(false),
    isModalvisible = _d[0],
    setIsModalvisible = _d[1];
  var _e = react_1.useState(''),
    invoiceId = _e[0],
    setInvoiceId = _e[1];
  //确定
  var handleOk = function() {
    setIsModalvisible(false);
  };
  //取消
  var handleCancel = function() {
    setIsModalvisible(false);
  };
  //打开支付税金弹框
  var handleRowPay = function(row, index) {
    setIsModalvisible(true);
    setInvoiceId(row.invoice_id);
  };
  var form = antd_1.Form.useForm()[0];
  var onFinish = function() {};
  var selectDate = function() {};
  var onReset = function() {};
  //pageSize 变化的回调
  var onShowSizeChange = function(current, pageSize) {
    setObjState(
      __assign(__assign({}, objState), {
        pageNum: current,
        pageSize: pageSize,
      }),
    );
  };
  //分页
  var pageChange = function(page, pageSize) {
    setObjState(
      __assign(__assign({}, objState), { pageNum: page, pageSize: pageSize }),
    );
    var params = {
      page: page,
      num: pageSize,
      match_business_type: transportType,
    };
    props.getInvoiceListFn(params);
  };
  var columns = [
    {
      title: '操作',
      width: 110,
      render: function(text, row, index) {
        var invoice_editable = row.invoice_editable,
          taxable_amount = row.taxable_amount;
        return React.createElement(
          'div',
          null,
          React.createElement(
            antd_1.Button,
            {
              type: 'primary',
              style: { marginRight: '6px' },
              disabled: invoice_editable != 1 || taxable_amount != 0,
              onClick: function(_) {
                return handleRowPay(row, index);
              },
            },
            '\u652F\u4ED8\u7A0E\u91D1',
          ),
          React.createElement(
            antd_1.Button,
            {
              type: 'primary',
              disabled: invoice_editable != 1 || taxable_amount == 0,
            },
            '\u5220\u9664',
          ),
        );
      },
    },
    {
      title: '开票申请单号',
      width: 50,
      dataIndex: 'apply_invoiceno',
      render: function(text, row, index) {
        var apply_invoiceno = row.apply_invoiceno,
          invoice_id = row.invoice_id;
        return React.createElement(
          'div',
          null,
          React.createElement(
            'a',
            {
              onClick: function(_) {
                umi_1.history.push({
                  pathname: props.invoiceDetailPath,
                  query: {
                    invoice_id: invoice_id,
                    title:
                      transportType == 1
                        ? '车辆发票申请详情'
                        : '船舶发票申请详情',
                  },
                });
              },
            },
            apply_invoiceno,
          ),
        );
      },
    },
    {
      title: '含税开票总金额(元)',
      width: 110,
      render: function(text, row, index) {
        var invoice_amount = row.invoice_amount;
        return React.createElement(
          'div',
          null,
          tools_1.accDiv(invoice_amount, 100).toFixed(2),
        );
      },
    },
    {
      title: '累计应付税金(元)',
      width: 110,
      render: function(text, row, index) {
        var taxable_amount = row.taxable_amount;
        return React.createElement(
          'div',
          null,
          tools_1.accDiv(taxable_amount, 100).toFixed(2),
        );
      },
    },
    {
      title: '撮合服务费(元)',
      width: 110,
      dataIndex: 'svr_fee',
      render: function(text, row, index) {
        var svr_fee = row.svr_fee;
        return React.createElement(
          'div',
          null,
          tools_1.accDiv(svr_fee, 100).toFixed(2),
        );
      },
    },
    {
      title: '创建时间',
      width: 120,
      render: function(text, row, index) {
        var create_time = row.create_time;
        return React.createElement(
          'div',
          null,
          tools_1.formatDateYMD(create_time),
        );
      },
    },
    {
      title: '支付税金时间',
      width: 120,
      render: function(text, row, index) {
        var paytax_time = row.paytax_time;
        return React.createElement(
          'div',
          null,
          tools_1.formatDateYMD(paytax_time),
        );
      },
    },
    {
      title: '运单数',
      width: 80,
      dataIndex: 'waybill_cnt',
    },
    {
      title: '状态',
      width: 100,
      dataIndex: 'audit_fail_reason_desc',
      render: function(text, row, index) {
        var invoice_status = row.invoice_status,
          invoice_status_text = row.invoice_status_text,
          waybill_status_color = '#00B0B5';
        switch (invoice_status) {
          case '0':
            waybill_status_color = '#fa8721';
            break;
          case '40':
            waybill_status_color = '#F85E5E';
            break;
          case '3':
            waybill_status_color = '#00B0B5';
            break;
          case '5':
          case '10':
            waybill_status_color = '#F9A411';
            break;
          case '15':
            waybill_status_color = '#25B864';
            break;
          case '20':
          case '30':
            waybill_status_color = '#C4C4C4';
            break;
        }
        return React.createElement(
          'span',
          {
            className: 'waybill-status-span',
            style: {
              color: waybill_status_color,
              borderColor: waybill_status_color,
            },
          },
          invoice_status_text,
        );
      },
    },
  ];
  return React.createElement(
    'div',
    null,
    React.createElement(
      antd_1.Form,
      { form: form, onFinish: onFinish },
      React.createElement(
        antd_1.Row,
        { gutter: { xs: 8, sm: 16, md: 24, lg: 32 } },
        React.createElement(
          antd_1.Col,
          { span: 14 },
          React.createElement(
            antd_1.Row,
            { gutter: { xs: 8, sm: 16, md: 24, lg: 32 } },
            React.createElement(
              antd_1.Col,
              { span: 8 },
              React.createElement(
                antd_1.Form.Item,
                { name: 'carrier_status' },
                React.createElement(
                  antd_1.Input.Group,
                  { compact: true },
                  React.createElement(
                    antd_1.Select,
                    { defaultValue: '0', onChange: selectNum },
                    React.createElement(
                      antd_1.Select.Option,
                      { value: '0' },
                      '\u5F00\u7968\u7533\u8BF7\u5355\u53F7',
                    ),
                    React.createElement(
                      antd_1.Select.Option,
                      { value: '1' },
                      '\u53D1\u7968\u53F7\u7801',
                    ),
                    React.createElement(
                      antd_1.Select.Option,
                      { value: '2' },
                      '\u8FD0\u5355\u7F16\u53F7',
                    ),
                  ),
                  React.createElement(antd_1.Input, {
                    style: { width: '50%' },
                    placeholder: inputObj.text,
                  }),
                ),
              ),
            ),
            React.createElement(
              antd_1.Col,
              { span: 6 },
              React.createElement(RangePicker, null),
            ),
            React.createElement(
              antd_1.Col,
              { span: 4 },
              React.createElement(
                antd_1.Select,
                { defaultValue: '100', onChange: selectDate },
                React.createElement(
                  Option,
                  { value: '100' },
                  '\u9009\u62E9\u7533\u8BF7\u5355\u72B6\u6001',
                ),
                React.createElement(Option, { value: '200' }, '\u5168\u90E8'),
                React.createElement(
                  Option,
                  { value: '1' },
                  '\u5F85\u652F\u4ED8\u7A0E\u91D1',
                ),
                React.createElement(
                  Option,
                  { value: '2' },
                  '\u5BA1\u6838\u4E2D',
                ),
                React.createElement(
                  Option,
                  { value: '6' },
                  '\u5BA1\u6838\u4E0D\u901A\u8FC7',
                ),
                React.createElement(
                  Option,
                  { value: '3' },
                  '\u5F85\u5F00\u7968',
                ),
                React.createElement(
                  Option,
                  { value: '4' },
                  '\u51FA\u7968\u4E2D',
                ),
                React.createElement(
                  Option,
                  { value: '5' },
                  '\u5DF2\u5B8C\u6210\u5F00\u7968',
                ),
              ),
            ),
            React.createElement(
              antd_1.Col,
              { span: 6 },
              React.createElement(
                antd_1.Button,
                { type: 'primary', htmlType: 'submit' },
                '\u641C\u7D22',
              ),
              React.createElement(
                antd_1.Button,
                {
                  icon: React.createElement(icons_1.RetweetOutlined, null),
                  htmlType: 'button',
                  onClick: onReset,
                },
                '\u91CD\u7F6E',
              ),
            ),
          ),
        ),
        React.createElement(
          antd_1.Col,
          {
            span: 10,
            style: {
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            },
          },
          React.createElement(
            antd_1.Button,
            { type: 'primary' },
            transportType == 1 ? '按单开票' : '新增申请单',
          ),
          React.createElement(
            antd_1.Button,
            { type: 'primary', style: { marginLeft: '10px' } },
            '\u6C47\u603B\u5F00\u7968',
          ),
          React.createElement(
            antd_1.Tooltip,
            {
              placement: 'right',
              title:
                '\u6309\u5355\u5F00\u7968\uFF1A\u6BCF\u4E00\u4E2A\u8FD0\u5355\u5355\u72EC\u4E00\u5F20\u7968\n\u6C47\u603B\u5F00\u7968\uFF1A\u540C\u4E00\u4E2A\u8D27\u4E3B\u3001\u53F8\u673A\u3001\u8F66\u724C\u53F7\u5728\u540C\u4E00\u5929\u5185\u7684\u5C0F\u989D\u8FD0\u5355\u6C47\u603B\u5F00\u4E00\u5F20\u53D1\u7968',
            },
            React.createElement(icons_1.ExclamationCircleFilled, null),
          ),
        ),
      ),
    ),
    React.createElement(antd_1.Table, {
      columns: columns,
      dataSource: props.invoiceList,
      loading: props.loading,
      rowKey: function(record) {
        return '' + record.invoice_id;
      },
      scroll: { x: 2100 },
      sticky: true,
      pagination: {
        showQuickJumper: true,
        current: objState.pageNum,
        pageSize: objState.pageSize,
        pageSizeOptions: [10, 20, 50, 100],
        total: props.totalPage,
        onChange: pageChange,
        onShowSizeChange: onShowSizeChange,
      },
    }),
    React.createElement(
      antd_1.Modal,
      {
        width: '740px',
        title: '\u652F\u4ED8\u7A0E\u91D1',
        okText: '\u786E\u8BA4',
        cancelText: '\u53D6\u6D88',
        visible: isModalvisible,
        onOk: handleOk,
        onCancel: handleCancel,
      },
      React.createElement(pay_invoice_modal_1['default'], {
        invoice_id: invoiceId,
      }),
    ),
  );
};
var memoList = React.memo(List);
exports['default'] = dva_1.connect(
  mapStateToProps,
  mapDispatchToProps,
)(memoList);
