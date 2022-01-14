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
  Modal,
  Tooltip,
  Drawer,
} from 'antd';
const { confirm } = Modal;
import { ExclamationCircleFilled } from '@ant-design/icons';
import { formatDateYMD, accMul, accDiv } from '../../util/tools';
import Details from '../../components/waybill-model/detail';
import styles from './index.less';
import { connect } from 'dva';
const namespace = 'audit';

const mapStateToProps = state => {
  let {
    audit_wait_list,
    audit_finish_list,
    audit_special_list,
    loading,
    totalPage,
  } = state[namespace];
  return {
    audit_wait_list,
    audit_finish_list,
    audit_special_list,
    loading,
    totalPage,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getPaymentRequestListFn: value => {
      dispatch({
        type: namespace + '/getPaymentRequestListModel',
        value,
      });
    },
  };
};

const AuditList = props => {
  let { loading, totalPage, flag } = props;
  const [form] = Form.useForm();
  const [waybillNo, setWaybillNo] = useState('');
  const dataRef = useRef();
  const [placeholderInput, setPlaceholderInput] = useState('请输入运单编号');
  //表格初始化状态
  const [objState, setObjState] = useState({
    pageNum: 1,
    pageSize: 10,
    searchName: 'waybill_no',
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
          searchName: 'applypay_no',
        });
        setPlaceholderInput('请输入申请单编号');
        break;
      case 2:
        setObjState({
          ...objState,
          searchName: 'carrier_name',
        });
        setPlaceholderInput('请输入承运人');
        break;
      case 3:
        setObjState({
          ...objState,
          searchName: 'payee_name',
        });
        setPlaceholderInput('请输入收款人');
        break;
      case 4:
        setObjState({
          ...objState,
          searchName: 'vehicle_number',
        });
        setPlaceholderInput('请输入车牌号/船名');
        break;
    }
  };

  //选择运单号、客户销项发票单号
  const numSelector = (
    <Select defaultValue="0" onChange={selectedNo} style={{ width: '100%' }}>
      <Select.Option value="0">运单编号</Select.Option>
      <Select.Option value="1">申请单编号</Select.Option>
      <Select.Option value="2">承运人</Select.Option>
      <Select.Option value="3">收款人</Select.Option>
      <Select.Option value="4">车牌号/船名</Select.Option>
    </Select>
  );

  //搜索
  const onFinish = values => {
    values = {
      ...values,
      page: objState.pageNum,
      num: objState.pageSize,
    };
    dataRef.current = values;
    props.getPaymentRequestListFn(dataRef.current);
  };

  //重置
  const handleSearchReset = () => {
    form.resetFields();
    props.getPaymentRequestListFn({
      page: objState.pageNum,
      num: objState.pageSize,
      flag,
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
    let params = { page: current, num: pageSize, flag };
    let data = { ...params, ...dataRef.current };
    props.getPaymentRequestListFn(data);
  };

  //分页
  const pageChange = (page, pageSize) => {
    setObjState({
      ...objState,
      pageNum: page,
      pageSize,
    });
    let params = { page, num: pageSize, flag };
    let data = { ...params, ...dataRef.current };
    props.getPaymentRequestListFn(data);
  };

  useEffect(() => {
    let params = { page: objState.pageNum, num: objState.pageSize, flag };
    let data = { ...params, ...dataRef.current };
    props.getPaymentRequestListFn(data);
  }, [flag]);

  const columns = [
    {
      title: '申请单编号',
      dataIndex: 'applypay_no',
    },
    {
      title: '申请付款金额(元)',
      width: 100,
      dataIndex: 'pay_money',
    },
    {
      title: '付款类型',
      dataIndex: 'pay_type',
    },
    {
      title: '申请时间',
      dataIndex: 'create_time',
    },
    {
      title: '承运人',
      dataIndex: 'carrier_name',
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
      title: '提货时间',
      dataIndex: 'load_time',
    },
    {
      title: '车牌号/船名',
      dataIndex: 'trans_vehicle_name',
    },
    {
      title: '重量(吨)',
      dataIndex: 'goods_num',
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
            waybill_status: '',
            waybill_no: '',
            apply_no_3th: '',
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
          <Col span={3}>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button htmlType="button" onClick={handleSearchReset}>
              重置
            </Button>
          </Col>
          <Col span={16}>
            <Button type="primary">审核通过</Button>
            <Button>审核不通过</Button>
          </Col>
        </Form>
      </Row>

      <Table
        columns={columns}
        dataSource={props['audit_' + flag]}
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
const memoAuditList = React.memo(AuditList);
export default connect(mapStateToProps, mapDispatchToProps)(memoAuditList);
