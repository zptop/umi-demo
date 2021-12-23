import {
  Row,
  Col,
  Table,
  Button,
  Select,
  Radio,
  Form,
  Input,
  DatePicker,
  Menu,
  Dropdown,
  message,
  Modal,
  Tooltip,
  Drawer,
} from 'antd';
import { history } from 'umi';
const { RangePicker } = DatePicker;
import { RetweetOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { formatDateYMD, accMul, accDiv } from '../../util/tools';
import { useState } from 'react';
import { connect } from 'dva';
const namespace = 'invoice';
import PayInvoiceModal from './pay-invoice-modal';
const mapStateToProps = state => {
  let { invoiceList, totalPage, loading } = state[namespace];
  return {
    invoiceList,
    totalPage,
    loading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getInvoiceListFn: value => {
      dispatch({
        type: namespace + '/getInvoiceListModel',
        value,
      });
    },
  };
};

const List = props => {
  let transportType = props.transportType;
  const [searchObj, setSearchObj] = useState({
    match_business_type: 1, //1车辆 2船舶
    invoice_status: '100',
    start_time: '',
    end_time: '',
  });
  const [objState, setObjState] = useState({
    pageNum: 1,
    pageSize: 10,
  });
  const [inputObj, setInputObj] = useState({
    value: '0',
    text: '开票申请单号',
  });
  const selectNum = (e, option) => {
    let { value, children } = option;
    setInputObj({
      ...inputObj,
      value,
      text: children,
    });
  };
  const judgmentParamsFn = (params, value) => {
    switch (inputObj.value * 1) {
      case 0:
        setSearchObj({
          ...searchObj,
          apply_invoiceno: value,
        });
        break;
      case 1:
        setSearchObj({
          ...searchObj,
          invoice_no: value,
        });
        break;
      case 2:
        setSearchObj({
          ...searchObj,
          waybill_no: value,
        });
        break;
    }
  };

  //支付税金模块
  const [isModalvisible, setIsModalvisible] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');
  //确定
  const handleOk = () => {
    setIsModalvisible(false);
  };
  //取消
  const handleCancel = () => {
    setIsModalvisible(false);
  };
  //打开支付税金弹框
  const handleRowPay = (row, index) => {
    setIsModalvisible(true);
    setInvoiceId(row.invoice_id);
  };

  const [form] = Form.useForm();

  const onFinish = () => {};
  const selectDate = () => {};
  const onReset = () => {};

  //pageSize 变化的回调
  const onShowSizeChange = (current, pageSize) => {
    setObjState({
      ...objState,
      pageNum: current,
      pageSize: pageSize,
    });
  };

  //分页
  const pageChange = (page, pageSize) => {
    setObjState({
      ...objState,
      pageNum: page,
      pageSize: pageSize,
    });
    let params = {
      page: page,
      num: pageSize,
      match_business_type: transportType,
    };
    props.getInvoiceListFn(params);
  };

  const columns = [
    {
      title: '操作',
      width: 110,
      render: (text, row, index) => {
        const { invoice_editable, taxable_amount } = row;
        return (
          <div>
            <Button
              type="primary"
              style={{ marginRight: '6px' }}
              disabled={invoice_editable != 1 || taxable_amount != 0}
              onClick={_ => handleRowPay(row, index)}
            >
              支付税金
            </Button>
            <Button
              type="primary"
              disabled={invoice_editable != 1 || taxable_amount == 0}
            >
              删除
            </Button>
          </div>
        );
      },
    },
    {
      title: '开票申请单号',
      width: 50,
      dataIndex: 'apply_invoiceno',
      render: (text, row, index) => {
        let { apply_invoiceno, invoice_id } = row;
        return (
          <div>
            <a
              onClick={_ => {
                history.push({
                  pathname: props.invoiceDetailPath,
                  query: {
                    invoice_id,
                    title:
                      transportType == 1
                        ? '车辆发票申请详情'
                        : '船舶发票申请详情',
                  },
                });
              }}
            >
              {apply_invoiceno}
            </a>
          </div>
        );
      },
    },
    {
      title: '含税开票总金额(元)',
      width: 110,
      render: (text, row, index) => {
        let { invoice_amount } = row;
        return <div>{accDiv(invoice_amount, 100).toFixed(2)}</div>;
      },
    },
    {
      title: '累计应付税金(元)',
      width: 110,
      render: (text, row, index) => {
        let { taxable_amount } = row;
        return <div>{accDiv(taxable_amount, 100).toFixed(2)}</div>;
      },
    },
    {
      title: '撮合服务费(元)',
      width: 110,
      dataIndex: 'svr_fee',
      render: (text, row, index) => {
        let { svr_fee } = row;
        return <div>{accDiv(svr_fee, 100).toFixed(2)}</div>;
      },
    },
    {
      title: '创建时间',
      width: 120,
      render: (text, row, index) => {
        let { create_time } = row;
        return <div>{formatDateYMD(create_time)}</div>;
      },
    },
    {
      title: '支付税金时间',
      width: 120,
      render: (text, row, index) => {
        let { paytax_time } = row;
        return <div>{formatDateYMD(paytax_time)}</div>;
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
      render: (text, row, index) => {
        let { invoice_status, invoice_status_text } = row,
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
        return (
          <span
            className="waybill-status-span"
            style={{
              color: waybill_status_color,
              borderColor: waybill_status_color,
            }}
          >
            {invoice_status_text}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <Form form={form} onFinish={onFinish}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={14}>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={8}>
                <Form.Item name="carrier_status">
                  <Input.Group compact>
                    <Select defaultValue="0" onChange={selectNum}>
                      <Select.Option value="0">开票申请单号</Select.Option>
                      <Select.Option value="1">发票号码</Select.Option>
                      <Select.Option value="2">运单编号</Select.Option>
                    </Select>
                    <Input
                      style={{ width: '50%' }}
                      placeholder={inputObj.text}
                    />
                  </Input.Group>
                </Form.Item>
              </Col>
              <Col span={6}>
                <RangePicker />
              </Col>
              <Col span={4}>
                <Select defaultValue="100" onChange={selectDate}>
                  <Option value="100">选择申请单状态</Option>
                  <Option value="200">全部</Option>
                  <Option value="1">待支付税金</Option>
                  <Option value="2">审核中</Option>
                  <Option value="6">审核不通过</Option>
                  <Option value="3">待开票</Option>
                  <Option value="4">出票中</Option>
                  <Option value="5">已完成开票</Option>
                </Select>
              </Col>
              <Col span={6}>
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
                <Button
                  icon={<RetweetOutlined />}
                  htmlType="button"
                  onClick={onReset}
                >
                  重置
                </Button>
              </Col>
            </Row>
          </Col>
          <Col
            span={10}
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Button type="primary">
              {transportType == 1 ? '按单开票' : '新增申请单'}
            </Button>
            <Button type="primary" style={{ marginLeft: '10px' }}>
              汇总开票
            </Button>
            <Tooltip
              placement="right"
              title="按单开票：每一个运单单独一张票
汇总开票：同一个货主、司机、车牌号在同一天内的小额运单汇总开一张发票"
            >
              <ExclamationCircleFilled />
            </Tooltip>
          </Col>
        </Row>
      </Form>
      <Table
        columns={columns}
        dataSource={props.invoiceList}
        loading={props.loading}
        rowKey={record => `${record.invoice_id}`}
        scroll={{ x: 2100 }}
        sticky
        pagination={{
          showQuickJumper: true,
          current: objState.pageNum,
          pageSize: objState.pageSize,
          pageSizeOptions: [10, 20, 50, 100],
          total: props.totalPage,
          onChange: pageChange,
          onShowSizeChange: onShowSizeChange,
        }}
      />
      {/*支付税金弹框*/}
      <Modal
        width="740px"
        title="支付税金"
        okText="确认"
        cancelText="取消"
        visible={isModalvisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <PayInvoiceModal invoice_id={invoiceId} />
      </Modal>
    </div>
  );
};
const memoList = React.memo(List);
export default connect(mapStateToProps, mapDispatchToProps)(memoList);
