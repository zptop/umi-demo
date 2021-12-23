import React, { useState, useEffect, useRef } from 'react';
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
const { confirm } = Modal;
import {
  ExclamationCircleFilled,
  ExclamationCircleOutlined,
  DownSquareOutlined,
} from '@ant-design/icons';
import {
  formatDateYMD,
  accMul,
  accDiv,
  formatSelectedOptions,
} from '../../util/tools';
import UploadRequired from '../upload-required';
import UploadNoRequired from '../upload-no-required';
import Details from '../waybill-model/detail';
import PayInvoiceModal from './pay-invoice-modal';
import styles from './index.less';
import { history, useHistory } from 'umi';
import { connect } from 'dva';
const namespace = 'invoice';
const namespace_2 = 'user';

const mapStateToProps = state => {
  let {
    applyTitleInfo,
    invoiceDetailList,
    totalPageDetail,
    loadingDetail,
  } = state[namespace];
  let { userInfo } = state[namespace_2];
  return {
    applyTitleInfo,
    invoiceDetailList,
    totalPageDetail,
    loadingDetail,
    userInfo,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getInvoiceGetInfoFn: value => {
      dispatch({
        type: namespace + '/getInvoiceGetInfoModel',
        value,
      });
    },
    getInvoicewaybillModelFn: value => {
      dispatch({
        type: namespace + '/getInvoicewaybillModel',
        value,
      });
    },
    removewaybillFn: value => {
      dispatch({
        type: namespace + '/removewaybillModel',
        value,
      });
    },
  };
};

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">
      <span className={styles.detail_info_title}>{title}</span>
      {content}
    </p>
  </div>
);

const Detail = props => {
  const history = useHistory();
  let invoice_id = history.location.query.invoice_id;
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
          searchName: 'apply_no_3th',
        });
        setPlaceholderInput('请输入客户销项发票单号');
        break;
    }
  };

  //选择运单号、客户销项发票单号
  const numSelector = (
    <Select defaultValue="0" onChange={selectedNo} style={{ width: '100%' }}>
      <Select.Option value="0">运单编号</Select.Option>
      <Select.Option value="1">客户销项发票单号</Select.Option>
    </Select>
  );

  //搜索
  const onFinish = values => {
    console.log('values:', values);
    values = {
      ...values,
      page: objState.pageNum,
      num: objState.pageSize,
    };
    dataRef.current = formatSelectedOptions(values);
    props.getInvoicewaybillModelFn(dataRef.current);
  };

  //重置
  const handleSearchReset = () => {
    form.resetFields();
    props.getInvoicewaybillModelFn({
      page: objState.pageNum,
      num: objState.pageSize,
      invoice_id,
    });
  };

  //支付税金模块
  const [isModalvisible, setIsModalvisible] = useState(false);
  //确定
  const handleOk = () => {
    setIsModalvisible(false);
  };
  //取消
  const handleCancel = () => {
    setIsModalvisible(false);
  };

  //打开支付税金弹窗
  const handleRowPay = () => {
    setIsModalvisible(true);
  };

  //走资金-模态框控制
  const [isRequiredModalVisible, setIsRequiredModalVisible] = useState(false);
  const handleRequiredOk = () => {
    setIsRequiredModalVisible(false);
  };
  const handleRequiredCancel = () => {
    setIsRequiredModalVisible(false);
  };

  //不走资金-模态框控制
  const [isNoRequiredModalVisible, setIsNoRequiredModalVisible] = useState(
    false,
  );
  const handleNoRequiredOk = () => {
    setIsNoRequiredModalVisible(false);
  };
  const handleNoRequiredCancel = () => {
    setIsNoRequiredModalVisible(false);
  };

  //不走资金-关闭模态框
  const closeModel = flag => {
    setIsNoRequiredModalVisible(flag);
  };

  //行操作-上传资料
  const handleRowUpload = (row, index) => {
    if (props.userInfo.PAYMENTREQUIRED == 1) {
      //走资金
      setIsRequiredModalVisible(true);
    } else {
      //不走资金
      setIsNoRequiredModalVisible(true);
    }
    setWaybillNo(row.waybill_no);
  };

  //行操作-移除
  const handleDel = row => {
    let { invoice_id_3, waybill_no } = row;
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: '是否确定移除？',
      cancelText: '取消',
      okText: '确定',
      onOk() {
        props.removewaybillFn({ invoice_id: invoice_id_3, waybill_no });
      },
      onCancel() {
        console.log('Cancel');
      },
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
    let params = { page, num: pageSize };
    let data = { ...params, ...dataRef.current };
    props.getInvoicewaybillModelFn(data);
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
    props.getInvoicewaybillModelFn(data);
  };

  useEffect(() => {
    props.getInvoiceGetInfoFn({ invoice_id });
    let params = { page: 1, num: 10, invoice_id };
    props.getInvoicewaybillModelFn(params);
  }, [invoice_id]);

  const columns = [
    {
      title: '序号',
      render: (text, row, index) => `${index + 1}`,
      width: 50,
    },
    {
      title: '操作',
      width: 254,
      align: 'center',
      render: (text, row, index) => {
        let {
          waybill_no,
          waybill_editable,
          invoice_status,
          carrier_ticket_limit,
        } = row;
        return (
          <div>
            {props.userInfo.FROMAPI == 0 && (
              <Button
                onClick={() => {
                  history.push({
                    pathname: props.formName,
                    query: {
                      waybill_no,
                      title:
                        props.transportType == 1
                          ? '编辑车辆运单'
                          : '编辑船舶运单',
                    },
                  });
                  setWaybillNo(waybill_no);
                }}
                type="primary"
                disabled={waybill_editable != 1}
              >
                编辑
              </Button>
            )}
            {props.userInfo.FROMAPI == 0 && (
              <Button
                onClick={() => {
                  handleRowUpload(row, index);
                }}
                type="primary"
                disabled={waybill_editable != 1}
                style={{ marginLeft: '10px', marginRight: '10px' }}
              >
                上传资料
              </Button>
            )}
            <Button type="primary" onClick={() => handleDel(row)}>
              移除
            </Button>
          </div>
        );
      },
    },
    {
      title: '运单编号',
      width: 140,
      render: (text, row, index) => {
        let { waybill_no } = row;
        return (
          <>
            <a
              style={{ textDecoration: 'underline' }}
              onClick={() => openWaybillDetail(waybill_no)}
            >
              {waybill_no}
            </a>
          </>
        );
      },
    },
    {
      title: '审核状态',
      width: 100,
      dataIndex: 'pending_status_desc',
      render: (text, row, index) => {
        let {
          invoice_status,
          waybill_status,
          waybill_status_text,
          audit_fail_reason_desc,
          waybill_no,
        } = row;
        let html;
        if (invoice_status == 40 && waybill_status == 200) {
          html = (
            <div>
              <span style={{ color: '#f00' }}>{waybill_status_text}</span>
              {invoice_status == 40 && (
                <Tooltip placement="right" title={audit_fail_reason_desc}>
                  <ExclamationCircleFilled />
                </Tooltip>
              )}
              <div>
                <div>{audit_fail_reason_desc}</div>
                <div>
                  <Button
                    type="primary"
                    size="small"
                    style={{
                      height: 'auto',
                      color: '#fff',
                    }}
                    onClick={() => handleWaybillStatus(waybill_no)}
                  >
                    已处理
                  </Button>
                </div>
              </div>
            </div>
          );
        } else {
          html = waybill_status_text;
        }
        return <div>{html}</div>;
      },
    },
    {
      title: '货物名称',
      width: 100,
      dataIndex: 'goods_name',
    },
    {
      title: '承运人',
      width: 100,
      render(text, row, index) {
        let { carrier_ticket_limit, carrier_name } = row;
        // let num = localRead("month_carrier_waybill_limit");
        let num = 10;
        let tooltip = (
          <Tooltip
            placement="right"
            title={
              '此承运人本月开票申请达到张' +
              num +
              '， 本月无法开票， 请下月1日再进行开票申请'
            }
          >
            <ExclamationCircleFilled />
          </Tooltip>
        );
        return (
          <div>
            <span style={{ verticalAlign: 'middle' }}>{carrier_name}</span>
            {carrier_ticket_limit == 1 && tooltip}
          </div>
        );
      },
    },
    {
      title: '车牌号',
      width: 100,
      dataIndex: 'trans_vehicle_name',
    },
    {
      title: '提货时间',
      width: 100,
      render: (text, row, index) => {
        let { load_time } = row;
        return <div>{formatDateYMD(load_time)}</div>;
      },
    },
    {
      title: '到货时间',
      width: 100,
      render: (text, row, index) => {
        let { unload_time } = row;
        return <div>{formatDateYMD(unload_time)}</div>;
      },
    },
    {
      title: '运费(元)',
      width: 100,
      render: (text, row, index) => {
        let { labour_amount } = row;
        return <div>{accDiv(labour_amount, 100).toFixed(2)}</div>;
      },
    },
    {
      title: '含税开票总金额(元)',
      width: 120,
      render: (text, row, index) => {
        let { invoice_amount } = row;
        return <div>{accDiv(invoice_amount, 100).toFixed(2)}</div>;
      },
    },
    {
      title: '撮合服务费(元)',
      width: 100,
      render: (text, row, index) => {
        let { svr_fee } = row;
        return <div>{accDiv(svr_fee, 100).toFixed(2)}</div>;
      },
    },
    {
      title: '应付税金',
      width: 100,
      render: (text, row, index) => {
        let { taxable_amount } = row;
        return <div>{accDiv(taxable_amount, 100).toFixed(2)}</div>;
      },
    },
    {
      title: '发票状态',
      width: 100,
      dataIndex: 'invoice_status_text',
    },
  ];

  return (
    <>
      <Row>
        <Col span={6}>
          <DescriptionItem
            title="开票申请单号"
            content={props.applyTitleInfo.apply_invoiceno}
          />
        </Col>
        <Col span={6}>
          <DescriptionItem
            title="创建时间"
            content={formatDateYMD(props.applyTitleInfo.create_time)}
          />
        </Col>
        <Col span={6}>
          <DescriptionItem
            title="累计应付税金"
            content={props.applyTitleInfo.taxable_amount / 100}
          />
        </Col>
        <Col span={6}>
          <DescriptionItem
            title="累计撮合服务费"
            content={props.applyTitleInfo.svr_fee_text}
          />
        </Col>
        <Col span={6}>
          <DescriptionItem
            title="含税开票总金额"
            content={props.applyTitleInfo.invoice_amount / 100}
          />
        </Col>
        <Col span={6}>
          <DescriptionItem
            title="状态"
            content={props.applyTitleInfo.invoiceStatusText}
          />
        </Col>
        <Col span={6}>
          <DescriptionItem
            title="已开发票"
            content={props.applyTitleInfo.ticket_success}
          />
        </Col>
        <Col span={6}>
          <DescriptionItem
            title="未开发票"
            content={props.applyTitleInfo.ticket_wait}
          />
        </Col>
      </Row>

      <Row
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        className={styles.search_box}
      >
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={{
            invoice_id,
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
            <Form.Item hidden name="invoice_id">
              <Input />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="waybill_status">
              <Select defaultValue="100" style={{ width: '100%' }}>
                <Select.Option value="100">选择审核状态</Select.Option>
                <Select.Option value="200">全部</Select.Option>
                <Select.Option value="2">审核通过</Select.Option>
                <Select.Option value="3">审核不通过</Select.Option>
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
          <Col span={13}>
            {props.applyTitleInfo.invoice_editable == 1 && (
              <Button type="primary" onClick={handleRowPay}>
                支付税金
              </Button>
            )}
            {props.applyTitleInfo.invoice_editable == 1 && (
              <Button type="primary">添加运单</Button>
            )}
            <Button type="primary" icon={<DownSquareOutlined />}>
              导出
            </Button>
            <Button type="primary" icon={<DownSquareOutlined />}>
              导出任务
            </Button>
            <Button>返回列表</Button>
          </Col>
        </Form>
      </Row>

      <Table
        columns={columns}
        dataSource={props.invoiceDetailList}
        loading={props.loadingDetail}
        rowKey={record => `${record.waybill_no}`}
        scroll={{ x: 2000 }}
        sticky
        pagination={{
          showQuickJumper: true,
          current: objState.pageNum,
          pageSize: objState.pageSize,
          pageSizeOptions: [10, 20, 50, 100],
          total: props.totalPageDetail,
          onChange: pageChange,
          onShowSizeChange: onShowSizeChange,
        }}
      />
      {/*上传资料-走资金 */}
      <Modal
        title="上传资料"
        okText="确定"
        cancelText="关闭"
        width={790}
        visible={isRequiredModalVisible}
        onOk={handleRequiredOk}
        onCancel={handleRequiredCancel}
        footer={[
          <Button key="关闭" onClick={handleRequiredCancel}>
            关闭
          </Button>,
        ]}
      >
        <UploadRequired
          waybill_no={waybillNo}
          transportType={props.transportType}
        />
      </Modal>

      {/**上传资料-不走资金 */}
      <Modal
        title="上传资料"
        okText="确定"
        cancelText="关闭"
        width={740}
        visible={isNoRequiredModalVisible}
        onOk={handleNoRequiredOk}
        onCancel={handleNoRequiredCancel}
        footer={null}
      >
        <UploadNoRequired
          waybill_no={waybillNo}
          transportType={props.transportType}
          closeModelFromChild={closeModel}
        />
      </Modal>

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
        <PayInvoiceModal invoice_id={invoice_id} />
      </Modal>
    </>
  );
};
const memoDetail = React.memo(Detail);
export default connect(mapStateToProps, mapDispatchToProps)(memoDetail);
