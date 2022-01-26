import React, { useState, useEffect, useRef } from 'react';
import {
  Row,
  Col,
  Table,
  Button,
  Select,
  Form,
  Input,
  message,
  DatePicker,
  Modal,
  Tooltip,
  Drawer,
} from 'antd';
const { confirm } = Modal;
const { RangePicker } = DatePicker;
import { ExclamationCircleFilled } from '@ant-design/icons';
import {
  formatDateYMD,
  formatDateYMDHMS,
  accMul,
  accDiv,
} from '../../util/tools';
import Details from '../../components/waybill-model/detail';
import styles from './index.less';
import { connect } from 'dva';
const namespace = 'audit';

const mapStateToProps = state => {
  let { audit_history_list, loading, totalPage } = state[namespace];
  return {
    audit_history_list,
    loading,
    totalPage,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getPaymentHistoryListFn: value => {
      dispatch({
        type: namespace + '/paymentHistoryListModel',
        value,
      });
    },
  };
};

const ApplyHistory = props => {
  let { loading, totalPage } = props;
  const [form] = Form.useForm();
  const [waybillNo, setWaybillNo] = useState('');
  const dataRef = useRef();
  const [placeholderInput, setPlaceholderInput] = useState('请输入运单编号');
  //表格初始化状态
  const [objState, setObjState] = useState({
    pageNum: 1,
    pageSize: 10,
    searchName: 'waybill_no',
    apply_time_start: '',
    apply_time_end: '',
    isDetailDrawer: false,
  });

  //选择单号
  const selectedNo = value => {
    switch (value * 1) {
      case 0:
        setObjState({
          ...objState,
          searchName: 'waybill_no',
        });
        setPlaceholderInput('请输入运单编号');
        break;
      case 1:
        setObjState({
          ...objState,
          searchName: 'carrier_name',
        });
        setPlaceholderInput('请输入承运人');
        break;
      case 2:
        setObjState({
          ...objState,
          searchName: 'trans_vehicle_name',
        });
        setPlaceholderInput('请输入车牌号/船名');
        break;
      case 3:
        setObjState({
          ...objState,
          searchName: 'order_no',
        });
        setPlaceholderInput('请输入客户订单号');
        break;
    }
  };

  //选择日期
  const checkDate = (date, dateStrings) => {
    setObjState({
      ...objState,
      apply_time_start: dateStrings[0],
      apply_time_end: dateStrings[1],
    });
  };

  //选择运单号、客户销项发票单号
  const numSelector = (
    <Select defaultValue="0" onChange={selectedNo} style={{ width: '100%' }}>
      <Select.Option value="0">运单编号</Select.Option>
      <Select.Option value="1">承运人</Select.Option>
      <Select.Option value="2">车牌号/船名</Select.Option>
      <Select.Option value="3">客户订单号</Select.Option>
    </Select>
  );

  //选择日期
  const rangeConfig = {
    rules: [
      {
        type: 'array',
        required: false,
        message: '请选择时间',
      },
    ],
  };

  //搜索
  const onFinish = values => {
    let {
      apply_time_start,
      apply_time_end,
      pageNum: page,
      pageSize: num,
    } = objState;
    values = {
      ...values,
      apply_time_start,
      apply_time_end,
      page,
      num,
    };
    console.log('values:', values);
    dataRef.current = values;
    props.getPaymentHistoryListFn(dataRef.current);
  };

  //重置
  const handleSearchReset = () => {
    form.resetFields();
    props.getPaymentHistoryListFn({
      page: objState.pageNum,
      num: objState.pageSize,
    });
  };

  //打开运单详情对话框
  const openWaybillDetail = waybill_no => {
    setObjState({
      ...objState,
      isDetailDrawer: true,
    });
    setWaybillNo(waybill_no);
  };

  //关闭运单详情抽屉
  const onCloseDetailDrawer = () => {
    setObjState({
      ...objState,
      isDetailDrawer: false,
    });
  };

  //pageSize 变化的回调
  const onShowSizeChange = (current, pageSize) => {
    setObjState({
      ...objState,
      pageNum: current,
      pageSize: pageSize,
    });
    let params = { page: current, num: pageSize };
    let data = { ...params, ...dataRef.current };
    props.getPaymentHistoryListFn(data);
  };

  //分页
  const pageChange = (page, pageSize) => {
    setObjState({
      ...objState,
      pageNum: page,
      pageSize,
    });
    let params = { page, num: pageSize };
    let data = { ...params, ...dataRef.current };
    props.getPaymentHistoryListFn(data);
  };

  useEffect(() => {
    let params = { page: objState.pageNum, num: objState.pageSize };
    let data = { ...params, ...dataRef.current };
    props.getPaymentHistoryListFn(data);
  }, [objState.pageNum]);

  const columns = [
    {
      title: '序号',
      width: 60,
      render: (text, row, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: '申请单编号',
      dataIndex: 'applypay_no',
    },
    {
      title: '申请付款金额(元)',
      width: 100,
      render: (text, row, index) => {
        return <span>{accDiv(row.pay_money, 100).toFixed(2)}</span>;
      },
    },
    {
      title: '付款类型',
      dataIndex: 'pay_type',
    },
    {
      title: '申请时间',
      render: (text, record, index) => {
        return <span>{formatDateYMDHMS(record.create_time, 'year')}</span>;
      },
    },
    {
      title: '实际支付时间',
      dataIndex: 'payment_time_desc',
    },
    {
      title: '收款人',
      dataIndex: 'payee_name',
    },
    {
      title: '运单编号',
      render: (text, row, index) => {
        let { waybill_no } = row;
        return (
          <a
            style={{ color: '#00b0b5', border: 0, textDecoration: 'underline' }}
            onClick={() => openWaybillDetail(waybill_no)}
          >
            {waybill_no}
          </a>
        );
      },
    },
    {
      title: '客户订单号',
      width: 150,
      dataIndex: 'waybill_order_no',
    },
    {
      title: '车牌号/船名',
      width: 140,
      dataIndex: 'trans_vehicle_name',
    },
    {
      title: '司机姓名',
      dataIndex: 'transport_name',
    },
    {
      title: '提货时间',
      render: function(text, row, index) {
        return <span>{formatDateYMD(row.load_time)}</span>;
      },
    },
    {
      title: '状态',
      render: (text, row, index) => {
        let { applypay_status, applypay_status_desc } = row,
          waybill_status_color = '#3582fb';
        switch (applypay_status) {
          case '10':
            waybill_status_color = '#3582fb';
            break;
          case '30':
            waybill_status_color = '#25b864';
            break;
          case '100':
            waybill_status_color = '#868d95';
            break;
          case '111':
            waybill_status_color = '#f85e5e';
            break;
        }
        return (
          <span
            style={{
              color: waybill_status_color,
              borderColor: waybill_status_color,
            }}
          >
            {applypay_status_desc}
          </span>
        );
      },
    },
  ];

  return (
    <>
      <Row
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        className={styles.search_box}
      >
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={{
            waybill_no: '',
            applypay_status: '',
            apply_time_start: '',
            apply_time_end: '',
          }}
        >
          <Col span={5}>
            <Form.Item name={objState.searchName}>
              <Input
                addonBefore={numSelector}
                style={{ width: '100%' }}
                placeholder={placeholderInput}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item {...rangeConfig} label="申请时间">
              <RangePicker onChange={checkDate} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="applypay_status" label="状态">
              <Select style={{ width: '100%' }}>
                <Option value="">全部</Option>
                <Option value="1">待审核</Option>
                <Option value="2">打款成功</Option>
                <Option value="3">审核不通过</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={3}>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button htmlType="button" onClick={handleSearchReset}>
              重置
            </Button>
          </Col>
          <Col span={7}>
            <Button type="primary">导出</Button>
          </Col>
        </Form>
      </Row>

      <Table
        columns={columns}
        dataSource={props.audit_history_list}
        loading={loading}
        rowKey={record => `${record.applypay_no}`}
        sticky
        pagination={{
          showQuickJumper: true,
          current: objState.pageNum,
          pageSize: objState.pageSize,
          pageSizeOptions: [10, 20, 50, 100],
          total: totalPage,
          onChange: pageChange,
          onShowSizeChange: onShowSizeChange,
        }}
      />

      {/*运单详情*/}
      <Drawer
        title="运单详情"
        placement="right"
        width={986}
        closable={false}
        onClose={onCloseDetailDrawer}
        visible={objState.isDetailDrawer}
      >
        <Details waybill_no={waybillNo} />
      </Drawer>
    </>
  );
};
const memoApplyHistory = React.memo(ApplyHistory);
export default connect(mapStateToProps, mapDispatchToProps)(memoApplyHistory);
