import React, { useState, useEffect } from 'react';
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
} from '@ant-design/icons';
import { formatDateYMD, accMul, accDiv } from '../../util/tools';
import UploadRequired from '../upload-required';
import UploadNoRequired from '../upload-no-required';
import Details from '../waybill-model/detail';
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
  const [waybillNo, setWaybillNo] = useState('');

  //表格初始化状态
  const [objState, setObjState] = useState({
    pageNum: 1,
    pageSize: 10,
    isDetailDrawer: false,
  });

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
  };

  //分页
  const pageChange = (page, pageSize) => {
    setObjState({
      ...objState,
      pageNum: page,
      pageSize,
    });
    let params = { page, num: pageSize, invoice_id };
    props.getInvoicewaybillModelFn({ params });
  };

  useEffect(() => {
    props.getInvoiceGetInfoFn({ invoice_id });
    props.getInvoicewaybillModelFn({ invoice_id });
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
            content={props.applyTitleInfo.create_time}
          />
        </Col>
        <Col span={6}>
          <DescriptionItem
            title="累计应付税金"
            content={props.applyTitleInfo.taxable_amount}
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
            content={props.applyTitleInfo.invoice_amount}
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
    </>
  );
};
const memoDetail = React.memo(Detail);
export default connect(mapStateToProps, mapDispatchToProps)(memoDetail);
