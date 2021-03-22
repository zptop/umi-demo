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
import React, { useState, useEffect } from 'react';
import {
  RetweetOutlined,
  DownOutlined,
  DownloadOutlined,
  ExclamationCircleFilled,
  QuestionCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  CloudSyncOutlined,
} from '@ant-design/icons';
import { formatSelectedOptions, accDiv, timeCutdown } from '../../util/tools';
import {
  isPayToBank,
  subPayMore,
  getWallet,
  getSmsCode,
  delwaybill,
} from '../../sevice/waybill';
const { RangePicker } = DatePicker;
import styles from './index.less';
import { connect } from 'dva';
import Details from './detail';
const { confirm } = Modal;
const namespace = 'user';
const namespace_2 = 'waybill';
let isAjax = false,
  waybillNoArr = []; //提交的运单

//将page层和model层进行链接，返回model中的数据，并将数据绑定到this.props中
const mapStateToProps = state => {
  const userInfo = state[namespace].userInfo,
    totalPage = state[namespace_2].totalPage,
    total_wait_amount = state[namespace_2].total_wait_amount,
    total_labour_amount = state[namespace_2].total_labour_amount,
    loading = state[namespace_2].loading,
    dataList = state[namespace_2].waybillList;
  return {
    userInfo,
    totalPage,
    total_wait_amount,
    total_labour_amount,
    loading,
    dataList,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getWaybillListFn: value => {
      dispatch({
        type: namespace_2 + '/getWaybillListModel',
        value,
      });
    },
    isPayToBankFn: value => {
      dispatch({
        type: namespace + '/isPayToBankModel',
        value,
      });
    },
  };
};

const WaybillIndex = props => {
  // console.log('props-index:', props)
  let transportType = props.transportType;
  const [form] = Form.useForm();
  const [payFormData] = Form.useForm();
  //表格初始化状态
  const [objState, setObjState] = useState({
    waybill_no:'',
    selectedRowKeys: [], //选中的运单号
    selectedRows: [], //选中的行
    pageNum: 1,
    pageSize: 10,
    searchName: 'waybill_no',
    payMoreModal: false, //批量付款通过弹框
    payMoreErrModal: false, //批量付款错误信息弹框
    payMoreErrInfoTitle: '', //批量付款错误信息title
    pay_more_err_flag_1: false, //不满足付款条件
    pay_more_err_flag_2: false, //银行卡未绑定
    pay_more_err_flag_3: false, //余额不足
    isDetailDrawer: false, //运单详情
  });

  //金额
  const [amount, setAmount] = useState({
    total_wait_pay: '', //选择列表后累计待付
    available_amount: '', //钱包可用余额
    total_wait_amount: '', //待付运输劳务费
    total_labour_amount: '', //总运输劳务费
  });

  //选择日期
  const [chooseTime, setChooseTime] = useState({
    selectDateIndex: 0,
    start_load_time: '',
    end_load_time: '',
    dateStringsVal: '',
    timeRest: new Date(),
  });

  //批量付款短信
  const [payMore, setPayMore] = useState({
    requiredsms: 0, //是否需要短信验证码   1显示
    riskctrlmode: '', //是否显示短信配置信息  0显示
    getBtnText: '获取验证码',
    is_sms_disabled: false, //获取短信验证码点击
  });

  //搜索
  const [copySubmitData, setCopySubmitData] = useState({});

  //初始化钱包余额、待付运输劳务费、总运输劳务费
  useEffect(() => {
    getWalletFn();
  }, [transportType]);

  //初始化批量付款弹窗
  const initPayment = () => {
    setObjState({
      ...objState,
      pay_more_err_flag_1: false,
      pay_more_err_flag_2: false,
      pay_more_err_flag_3: false,
    });
    waybillNoArr = [];
    payFormData.setFieldsValue({
      pay_type: '',
      smscode: '',
    });
  };

  //快速选择
  const quickChecked = e => {
    let val = e.target.value,
      text = '';
    switch (Number(val)) {
      case 0:
        text = '预付款';
        break;
      case 1:
        text = '到付款';
        break;
      case 2:
        text = '回单尾款';
        break;
    }
    payFormData.setFieldsValue({ pay_type: text });
  };

  //获取批量付款短信验证码
  const getSmsCodeFn = () => {
    getSmsCode({ waybill_no: 'batchnew' })
      .then(res => {
        if (res.code != 0) {
          message.warning({
            title: '系统提醒',
            content: res.msg || '系统错误',
          });
          return;
        }
        var t = timeCutdown(60, 1000, n => {
          let is_sms_disabled = false,
            getBtnText = '';
          if (n <= 0) {
            is_sms_disabled = false;
            getBtnText = '获取验证码';
          } else {
            is_sms_disabled = true;
            getBtnText = '剩余' + n + '秒';
          }
          setPayMore({
            ...payMore,
            is_sms_disabled,
            getBtnText,
          });
        });
      })
      .catch(err => {
        message.warning({
          title: '系统提醒',
          content: err || '系统错误',
        });
      });
  };

  //获取钱包余额
  const getWalletFn = () => {
    getWallet(null)
      .then(res => {
        if (res.code != 0) {
          message.warning({
            title: '系统提醒',
            content: res.msg || '系统错误',
          });
          return;
        }
        var obj = res.data;
        setAmount({
          ...amount,
          available_amount: accDiv(obj.available_amount, 100).toFixed(2),
          total_wait_amount: accDiv(props.total_wait_amount, 100).toFixed(2),
          total_labour_amount: accDiv(props.total_labour_amount, 100).toFixed(
            2,
          ),
        });
        setPayMore({
          ...payMore,
          requiredsms: obj.requiredsms,
          riskctrlmode: obj.riskctrlmode,
        });
        payFormData.setFieldsValue({ shipper_mobile: obj.shipper_mobile });
      })
      .catch(err => {
        message.warning({
          title: '系统提醒',
          content: err || '系统错误',
        });
      });
  };

  //删除运单
  const delwaybillFn = (waybill_no, flag) => {
    confirm({
      title: '提示',
      content: '是否确定删除？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        delwaybill({ waybill_no })
          .then(res => {
            if (res.code == 0) {
              message.success(flag == 'single' ? '删除成功' : res.data);
              props.getWaybillListFn({
                page: objState.pageNum,
                num: objState.pageSize,
                transportType,
              });
            } else {
              message.error(res.msg || '操作失败');
            }
          })
          .catch(err => {
            message.error(err || '系统错误');
          });
      },
      onCancel: () => {
        //取消
      },
    });
  };

  //多选或单选
  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setObjState({
      ...objState,
      selectedRowKeys,
      selectedRows,
    });
    setAmount({
      ...amount,
      total_wait_pay: '',
    });
    var sum = '';
    if (selectedRows.length > 0) {
      for (let item of selectedRows) {
        sum += Number(accDiv(item.apply_available_amount, 100));
        sum = Number(sum);
      }
    } else {
      sum = '';
    }
    setAmount({
      ...amount,
      total_wait_pay: sum,
    });
  };

  const rowSelection = {
    selectedRowKeys: objState.selectedRowKeys,
    onChange: onSelectChange,
  };

  //选择运单号...
  const selectNum = value => {
    switch (Number(value)) {
      case 0:
        setObjState({
          ...objState,
          searchName: 'waybill_no',
        });
        break;
      case 1:
        setObjState({
          ...objState,
          searchName: 'trans_vehicle_name',
        });
        break;
      case 2:
        setObjState({
          ...objState,
          searchName: 'carrier_id_card_no',
        });
        break;
      case 3:
        setObjState({
          ...objState,
          searchName: 'invoice_no',
        });
        break;
      case 4:
        setObjState({
          ...objState,
          searchName: 'order_no',
        });
        break;
      case 5:
        setObjState({
          ...objState,
          searchName: 'carrier_name',
        });
        break;
      case 6:
        setObjState({
          ...objState,
          searchName: 'transport_name',
        });
        break;
      case 7:
        setObjState({
          ...objState,
          searchName: 'waybiapply_no_3thll_no',
        });
        break;
    }
  };

  //选择日期
  const checkDateComm = (value, dateStrings) => {
    switch (Number(value)) {
      case 0:
        setChooseTime({
          ...chooseTime,
          start_load_time: dateStrings[0],
          end_load_time: dateStrings[1],
        });
        break;
      case 1:
        setChooseTime({
          ...chooseTime,
          start_unload_time: dateStrings[0],
          end_unload_time: dateStrings[1],
        });
        break;
      case 2:
        setChooseTime({
          ...chooseTime,
          invoice_start: dateStrings[0],
          invoice_end: dateStrings[1],
        });
        break;
      case 3:
        setChooseTime({
          ...chooseTime,
          audit_start_time: dateStrings[0],
          audit_end_time: dateStrings[1],
        });
        break;
    }
  };
  const selectDate = value => {
    setChooseTime({
      ...chooseTime,
      setSelectDateIndex: value,
    });
    checkDateComm(value, chooseTime.dateStringsVal);
  };
  const checkDate = (dates, dateStrings) => {
    setChooseTime({
      ...chooseTime,
      dateStringsVal: dateStrings,
    });
    checkDateComm(chooseTime.selectDateIndex, dateStrings);
  };

  const rangeConfig = {
    rules: [
      {
        type: 'array',
        required: false,
        message: '请选择时间',
      },
    ],
  };

  //选择运单编号，车牌号...
  const numSelector = (
    <Select defaultValue="0" style={{ width: 120 }} onChange={selectNum}>
      <Select.Option value="0">运单编号</Select.Option>
      <Select.Option value="1">
        {transportType == '1' ? '车牌号' : '船名'}
      </Select.Option>
      <Select.Option value="2">承运人身份证</Select.Option>
      <Select.Option value="3">发票号码</Select.Option>
      <Select.Option value="4">客户订单号</Select.Option>
      <Select.Option value="5">承运人姓名</Select.Option>
      {transportType == '1' && (
        <Select.Option value="6">司机姓名</Select.Option>
      )}
      <Select.Option value="7">客户销项发票单号</Select.Option>
    </Select>
  );

  //搜索
  const onFinish = values => {
    values = {
      ...values,
      ...selectDateName,
      page: objState.pageNum,
      num: objState.pageSize,
      transportType,
    };
    formatSelectedOptions(values);
    setCopySubmitData(values);
    props.getWaybillListFn(values);
  };
  //重置
  const onReset = () => {
    form.resetFields();
    setChooseTime({
      ...chooseTime,
      timeRest: new Date(),
    });
    props.getWaybillListFn({
      page: objState.pageNum,
      num: objState.pageSize,
      transportType,
    });
  };

  //打开运单详情对话框
  const openWaybillDetail = waybill_no => {
    setObjState({
      ...objState,
      waybill_no,
      isDetailDrawer: true,
    });
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
      pageSize: pageSize,
    });
    let params = { page: page, num: pageSize, transportType };
    props.getWaybillListFn(params);
  };

  //运单列表->更多操作
  const menu = (waybill_no, waybill_candelete) => (
    <Menu onClick={changeMenu.bind(this, waybill_no, waybill_candelete)}>
      <Menu.Item key="1">付款</Menu.Item>
      <Menu.Item key="2">费用明细 </Menu.Item>
      <Menu.Item key="3" className={waybill_candelete != 1 && styles.del_grey}>
        删除
      </Menu.Item>
      <Menu.Item key="4">复制运单</Menu.Item>
    </Menu>
  );

  const changeMenu = (waybill_no, waybill_candelete, e) => {
    switch (Number(e.key)) {
      case 1:
        console.log('跳转到付款页面');
        break;
      case 2:
        console.log('打开右抽屉-费用明细');
        break;
      case 3:
        //删除运单
        if (waybill_candelete != 1) return;
        delwaybillFn(waybill_no, 'single');
        break;
      case 4:
        //复制运单
        history.push({
          pathname: props.addForm,
          query: {
            waybill_no,
            title: transportType == 1 ? '复制车辆运单' : '复制船舶运单',
          },
        });
        break;
    }
  };

  //打开批量付款
  const openPayMore = () => {
    if (objState.selectedRowKeys.length == 0) {
      message.warning('请选择至少一条运单');
      return;
    }
    initPayment();
    let checkbox_inner = document
      .querySelector('.ant-table-wrapper')
      .querySelector('.ant-table-body')
      .querySelectorAll('.ant-checkbox-checked');

    for (let item of checkbox_inner) {
      item.classList.remove('on');
    }
    let waybillNoCardArr = [], //直接付银行卡运单编号的数组
      isPayToBankflag = true, //是否打款到银行卡  true是，false否
      isNoBindCard = true, //银行卡未绑定     true显示，false不显示
      isWaybillNotPay = true; //运单不具备付款条件  true显示，false不显示

    //过滤选中的项
    // let intersectionArr = [...props.dataList].filter(x => [...objState.selectedRowKeys].some(y => y === x.waybill_no));
    objState.selectedRows.forEach((item, index) => {
      //1打款到银行卡  0打款到钱包
      if (item.business_payment_card == 1) {
        isPayToBankflag = false;
        waybillNoCardArr.push(item.waybill_no);
      }

      //不满足付款条件
      if (
        item.carrier_pay_flag == 1 ||
        item.waybill_status == 0 ||
        item.apply_available_amount == 0
      ) {
        isWaybillNotPay = false;
        //添加红框样式
        checkbox_inner[index].classList.add('on');
      }
      waybillNoArr.push(item.waybill_no);
    });
    //批量付款不满足付款条件弹窗提醒
    setObjState({
      ...objState,
      payMoreErrModal: !isWaybillNotPay && true,
      pay_more_err_flag_1: !isWaybillNotPay && true,
      payMoreErrInfoTitle:
        !isWaybillNotPay && '部分运单不具备付款条件（已红框标记）！',
    });
    if (!isWaybillNotPay) return;

    //批量付款余额不足弹窗
    setObjState({
      ...objState,
      payMoreErrModal:
        parseFloat(amount.total_wait_pay) >
          parseFloat(amount.available_amount) && true,
      pay_more_err_flag_3:
        parseFloat(amount.total_wait_pay) >
          parseFloat(amount.available_amount) && true,
      payMoreErrInfoTitle:
        parseFloat(amount.total_wait_pay) >
          parseFloat(amount.available_amount) &&
        '余额不足，请减少运单或充值后再操作',
    });
    if (parseFloat(amount.total_wait_pay) > parseFloat(amount.available_amount))
      return;

    //判断是否绑定银行卡接口
    if (isPayToBankflag) return;
    isPayToBank({
      waybill_no_items: waybillNoCardArr.join(','),
    }).then(res => {
      if (res.code == 0) {
        if (res.data.length > 0) {
          objState.selectedRows.forEach((item, index) => {
            if (
              item.business_payment_card == 1 &&
              res.data.includes(item.waybill_no)
            ) {
              isNoBindCard = false;
              //添加红框样式
              checkbox_inner[index].classList.add('on');
            }
          });
        }
      } else {
        message.warning(res.msg);
      }
      setObjState({
        ...objState,
        payMoreModal:
          res.data.length == 0 || res.code != 0 || isPayToBankflag
            ? true
            : false,
        payMoreErrModal: !isNoBindCard ? true : false,
        pay_more_err_flag_2: !isNoBindCard ? true : false,
        payMoreErrInfoTitle:
          !isNoBindCard && '部分运单不具备付款条件（已红框标记）！',
      });
    });
  };

  //关闭批量付款
  const closePayMore = () => {
    setObjState({
      ...objState,
      payMoreModal: false,
    });
  };

  //提交批量付款
  const subPayMoreFn = () => {
    if (payFormData.getFieldValue('pay_type') == '') {
      message.warning('本次付款类型未输入');
      return;
    }
    if (isAjax) return;
    isAjax = true;
    let params = {
      pay_type: payFormData.getFieldValue('pay_type'),
      waybill_no_items: waybillNoArr.join(','),
      smscode: payFormData.getFieldValue('smscode') || '',
    };
    subPayMore(params)
      .then(res => {
        // this.getApplyWaitCount();
        if (res.code != 0) {
          message.warning({
            title: '系统提醒',
            content: res.msg || '系统错误',
          });
          return;
        }
        message.success({
          title: '提示',
          content:
            payMore.requiredsms == 1
              ? '批量付款申请发起成功，系统正在打款中'
              : '批量付款申请发起成功，请等待内部审核',
        });
        setObjState({
          ...objState,
          payMoreModal: false,
        });
        // this.commFn("search");
        // this.getWallet();
      })
      .catch(err => {
        message.warning({
          title: '系统提醒',
          content: '系统错误',
        });
      })
      .then(() => {
        isAjax = false;
      });
  };

  //批量导入运单
  const openImportMoreWaybill = () => {};

  //批量删除运单
  const batchDelMore = () => {
    // if (this.$store.state.user.shipperauditstatus != 1) {
    //     //没审核通过,不能进入二级页面
    //     dataApi.secondaryPage(this, "systemProfile");
    //     return;
    // }
    let checkbox_inner = document
      .querySelector('.ant-table-wrapper')
      .querySelector('.ant-table-body')
      .querySelectorAll('.ant-checkbox-checked');

    for (let item of checkbox_inner) {
      item.classList.remove('on');
    }
    if (objState.selectedRows.length == 0) {
      message.warning('请选择至少一条运单');
      return;
    }

    objState.selectedRows.forEach((item, index) => {
      waybillNoArr.push(item.waybill_no);
    });
    delwaybillFn(waybillNoArr.join(','), 'more');
  };

  //批量操作
  const batchMenu = (
    <Menu onClick={handleMenuClick}>
      {props.userInfo.PAYMENTREQUIRED == 1 && (
        <Menu.Item key="1">批量付款</Menu.Item>
      )}
      {transportType == 1 && <Menu.Item key="2">批量导入运单</Menu.Item>}
      <Menu.Item key="3">批量删除运单</Menu.Item>
    </Menu>
  );
  function handleMenuClick(e) {
    switch (Number(e.key)) {
      case 1:
        openPayMore();
        break;
      case 2:
        openImportMoreWaybill();
        break;
      case 3:
        batchDelMore();
        break;
    }
  }

  //关闭批量付款错误弹框
  const closePayMoreErr = () => {
    setObjState({
      ...objState,
      payMoreErrModal: false,
    });
  };

  const columns = [
    {
      title: '操作',
      width: 330,
      render: (text, row, index) => {
        const { waybill_editable, waybill_no, waybill_candelete } = row;
        return (
          <div>
            <Button
              type="primary"
              disabled={waybill_editable != 1}
              onClick={_ => {
                history.push({
                  pathname: props.addForm,
                  query: {
                    waybill_no,
                    title: transportType == 1 ? '编辑车辆运单' : '编辑船舶运单',
                  },
                });
              }}
            >
              编辑
            </Button>
            <Button type="primary" disabled={waybill_editable != 1}>
              上传资料
            </Button>
            {props.userInfo.PAYMENTREQUIRED == 1 &&
              props.userInfo.CONTRACTSIGN == 1 && (
                <Button type="primary">合同管理</Button>
              )}
            <Dropdown
              overlay={menu(waybill_no, waybill_candelete)}
              trigger={['click']}
            >
              <Button>
                更多
                <DownOutlined />
              </Button>
            </Dropdown>
          </div>
        );
      },
    },
    {
      title: '运单编号',
      width: 100,
      dataIndex: 'waybill_no',
      render: (text, row, index) => {
        return (
          <div>
            <a
              style={{ textDecoration: 'underline' }}
              onClick={()=>openWaybillDetail(row.waybill_no)}
            >
              {row.waybill_no}
            </a>
            {row.pending_status_desc && (
              <Tooltip placement="right" title={row.pending_status_desc}>
                <ExclamationCircleFilled />
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      title: '客户订单号',
      width: 100,
      dataIndex: 'order_no',
    },
    {
      title: '货物名称',
      width: 80,
      dataIndex: 'goods_name',
    },
    {
      title: () => {
        return transportType == '1' ? '车牌号' : '船名';
      },
      width: 110,
      dataIndex: 'trans_vehicle_name',
    },
    {
      title: '承运人',
      width: 110,
      dataIndex: 'carrier_name',
    },
    {
      title: '提货时间',
      width: 90,
      dataIndex: 'load_time',
    },
    {
      title: '到货时间',
      width: 90,
      dataIndex: 'unload_time',
    },
    {
      title: () => {
        return props.userInfo.PAYMENTREQUIRED == 1
          ? '待付/已付/运输劳务费(元)'
          : '运输劳务费(元)';
      },
      width: 100,
      dataIndex: 'labour_amount_desc',
    },
    {
      title: '含税开票金额(元)',
      width: 100,
      dataIndex: 'invoice_amount',
    },
    {
      title: '应付税金(元)',
      width: 100,
      dataIndex: 'taxable_amount',
    },
    {
      title: '撮合服务费(元)',
      width: 100,
      dataIndex: 'svr_fee',
    },

    {
      title: '审核状态',
      width: 100,
      dataIndex: 'audit_fail_reason_desc',
      render: (text, row, index) => {
        let {
          waybill_status,
          waybill_status_text,
          audit_fail_reason_desc,
        } = row;
        let tooltip = (
          <Tooltip placement="right" title={audit_fail_reason_desc}>
            <ExclamationCircleFilled />
          </Tooltip>
        );
        return (
          <div>
            <span style={{ verticalAlign: 'middle' }}>
              {waybill_status_text}
            </span>
            {waybill_status == 200 ? tooltip : ''}
          </div>
        );
      },
    },
    {
      title: '开票状态',
      width: 110,
      dataIndex: 'invoice_status_text',
    },
  ];

  return (
    <div className={styles.content}>
      <Form
        className="login-form"
        initialValues={{ remember: true }}
        form={form}
        onFinish={onFinish}
        initialValues={{
          waybill_no: '',
          carrier_status: '',
          invoice_status: '',
          business_flag_7: '',
          waybill_status: '',
          carrier_audit_status: '',
          driver_audit_status: '',
          vehicle_audit_status: '',
          business_flag_5: '',
          business_flag_34: '',
          carrier_pay_flag: '',
        }}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={4}>
            <Form.Item name={objState.searchName}>
              <Input addonBefore={numSelector} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={5}>
            <Select
              defaultValue="0"
              style={{ width: 100 }}
              onChange={selectDate}
            >
              <Select.Option value="0">提货时间</Select.Option>
              <Select.Option value="1">到货时间</Select.Option>
              <Select.Option value="2">开票日期</Select.Option>
              <Select.Option value="3">审核通过时间</Select.Option>
            </Select>
            <Form.Item
              {...rangeConfig}
              style={{ display: 'inline-block', width: 201 }}
            >
              <RangePicker key={chooseTime.timeRest} onChange={checkDate} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={3}>
            <Form.Item name="carrier_status">
              <Select>
                <Select.Option value="">是否指定承运人</Select.Option>
                <Select.Option value="200">全部</Select.Option>
                <Select.Option value="1">待指定</Select.Option>
                <Select.Option value="2">已指定</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={3}>
            <Form.Item name="invoice_status">
              <Select>
                <Select.Option value="">选择开票状态</Select.Option>
                <Select.Option value="200">全部</Select.Option>
                <Select.Option value="3">不满足开票条件</Select.Option>
                <Select.Option value="1">未开票</Select.Option>
                <Select.Option value="2">已开票</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={3}>
            <Form.Item name="business_flag_7">
              <Select>
                <Select.Option value="">选择资料上传状态</Select.Option>
                <Select.Option value="200">全部</Select.Option>
                <Select.Option value="0">未上传</Select.Option>
                <Select.Option value="1">已上传</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={2.5}>
            <Form.Item name="waybill_status">
              <Select>
                <Select.Option value="">运单审核状态</Select.Option>
                <Select.Option value="200">全部</Select.Option>
                <Select.Option value="9">待提交审核</Select.Option>
                <Select.Option value="1">审核中</Select.Option>
                <Select.Option value="2">审核通过</Select.Option>
                <Select.Option value="3">审核不通过</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={3}>
            <Form.Item name="carrier_audit_status">
              <Select>
                <Select.Option value="">承运人审核状态</Select.Option>
                <Select.Option value="200">全部</Select.Option>
                <Select.Option value="1">审核中</Select.Option>
                <Select.Option value="2">审核通过</Select.Option>
                <Select.Option value="3">审核不通过</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          {transportType == '1' && (
            <Col className="gutter-row" span={3}>
              <Form.Item name="driver_audit_status">
                <Select>
                  <Select.Option value="">司机审核状态</Select.Option>
                  <Select.Option value="200">全部</Select.Option>
                  <Select.Option value="1">审核中</Select.Option>
                  <Select.Option value="2">审核通过</Select.Option>
                  <Select.Option value="3">审核不通过</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          )}
          <Col className="gutter-row" span={3}>
            <Form.Item name="vehicle_audit_status">
              <Select>
                <Select.Option value="">
                  {transportType == '1' ? '车辆审核状态' : '船舶审核状态'}
                </Select.Option>
                <Select.Option value="200">全部</Select.Option>
                <Select.Option value="1">审核中</Select.Option>
                <Select.Option value="2">审核通过</Select.Option>
                <Select.Option value="3">审核不通过</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={3}>
            <Form.Item name="business_flag_5">
              <Select>
                <Select.Option value="">选择费用明细录入状态</Select.Option>
                <Select.Option value="200">全部</Select.Option>
                <Select.Option value="0">未录入</Select.Option>
                <Select.Option value="1">已录入</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={3}>
            <Form.Item name="business_flag_34">
              <Select>
                <Select.Option value="">选择合同签署状态</Select.Option>
                <Select.Option value="200">全部</Select.Option>
                <Select.Option value="1">未签署</Select.Option>
                <Select.Option value="2">待承运人确认</Select.Option>
                <Select.Option value="3">已签署</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={3}>
            <Form.Item name="carrier_pay_flag">
              <Select>
                <Select.Option value="">选择结算状态</Select.Option>
                <Select.Option value="200">全部</Select.Option>
                <Select.Option value="0">待结清</Select.Option>
                <Select.Option value="1">已结清</Select.Option>
                <Select.Option value="2">可支付</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={3}>
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
          <Col className="gutter-row" span={6}>
            <Button
              type="primary"
              to={props.addForm}
              className="ant-btn ant-btn-primary"
              onClick={_ => {
                history.push({
                  pathname: props.addForm,
                  query: {
                    title: transportType == 1 ? '新增车辆运单' : '新增船舶运单',
                  },
                });
              }}
            >
              新增
            </Button>
            {props.userInfo.FROMAPI != 1 && (
              <Dropdown overlay={batchMenu} trigger={['click']}>
                <Button type="primary">
                  批量操作 <DownOutlined />
                </Button>
              </Dropdown>
            )}

            <Button icon={<DownloadOutlined />}>导出</Button>
          </Col>
        </Row>
      </Form>
      <Table
        className={styles.tableList}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={props.dataList}
        loading={props.loading}
        rowKey={record => `${record.waybill_no}`}
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
      <Row style={{ position: 'absolute', bottom: '6px' }}>
        <Col span={24}>
          {props.userInfo.PAYMENTREQUIRED == 1 && (
            <span>当前已勾选的运单累计待付：￥{amount.total_wait_pay}，</span>
          )}
          <span>钱包可用余额：￥{amount.available_amount}</span>
        </Col>
        <Col span={24}>
          <span>
            当前筛选条件合计：待付运输劳务费￥{amount.total_wait_amount}
            ，总运输劳务费：￥{amount.total_labour_amount}
          </span>
        </Col>
      </Row>

      {/* 批量付款 */}
      <Modal
        visible={objState.payMoreModal}
        title="付款确认"
        onCancel={closePayMore}
        footer={[
          <Button key="back" onClick={closePayMore}>
            关闭
          </Button>,
          <Button key="submit" onClick={subPayMoreFn}>
            提交
          </Button>,
        ]}
      >
        <Form
          form={payFormData}
          preserve={false}
          initialValues={{
            pay_type: '',
            smscode: '',
            shipper_mobile: '',
          }}
        >
          <Form.Item label="符合付款运单数：">
            {objState.selectedRows.length}
          </Form.Item>
          <Form.Item label="付款金额：">￥{amount.total_wait_pay}</Form.Item>
          <Form.Item label="收款人：">运单承运人</Form.Item>
          <Form.Item
            label="本次付款类型："
            name="pay_type"
            rules={[
              {
                required: true,
                message: '本次付款类型未输入',
              },
            ]}
          >
            <Input style={{ width: '195px' }} />
          </Form.Item>
          <Form.Item label="快速选择：">
            <Radio.Group
              defaultValue="a"
              buttonStyle="solid"
              onChange={quickChecked}
            >
              <Radio.Button value="0">预付款</Radio.Button>
              <Radio.Button value="1">到付款</Radio.Button>
              <Radio.Button value="2">回单尾款</Radio.Button>
            </Radio.Group>
          </Form.Item>
          {payMore.requiredsms != 0 && (
            <Form.Item label="短信验证码：">
              <Input name="smscode" style={{ width: '138px' }}></Input>
              <Button
                className={
                  payMore.is_sms_disabled
                    ? `${styles.get_sms} ${styles.on}`
                    : `${styles.get_sms}`
                }
                disabled={payMore.is_sms_disabled}
                onclick={getSmsCodeFn}
              >
                {payMore.getBtnText}
              </Button>
              <div>
                验证码关联手机号{payFormData.getFieldValue('shipper_mobile')}
                {payMore.riskctrlmode && (
                  <span style={{ display: 'block', color: '#999' }}>
                    系统管理->付款流程配置
                    <i style={{ color: '#f77f1f', fontStyle: 'normal' }}>
                      配置审核流程后无需输入验证码
                    </i>
                  </span>
                )}
              </div>
            </Form.Item>
          )}
          <span style={{ color: '#424752' }}>
            注：确定后将会支付所选运单所有未付金额
          </span>
        </Form>
      </Modal>

      {/* 批量付款错误信息弹窗提醒，包括(不满足付款条件、银行卡未绑定、余额不足) */}
      <Modal
        Modal
        visible={objState.payMoreErrModal}
        onCancel={closePayMoreErr}
        footer={[
          <Button key="back" onClick={closePayMoreErr}>
            关闭
          </Button>,
        ]}
      >
        <p style={{ display: 'flex', padding: '10px 0', alignItems: 'center' }}>
          <ExclamationCircleFilled
            style={{ fontSize: '20px', color: '#ff4d4f', margin: '0 6px 0 0' }}
          />
          <span style={{ fontSize: '20px', color: '#333', fontWeight: 'bold' }}>
            {objState.payMoreErrInfoTitle}
          </span>
        </p>
        {objState.pay_more_err_flag_1 && (
          <div className={styles.sub_title}>
            <h3>常见原因：</h3>
            <p>1、所选运单已结清</p>
            <p>2、所选运单处于待指定承运人或已取消状态</p>
            <p>3、所选运单付款金额为0</p>
          </div>
        )}
        {objState.pay_more_err_flag_2 && (
          <div className={styles.sub_title}>
            <h3>常见原因：</h3>
            <p>未绑定承运人收款银行卡</p>
          </div>
        )}
        {objState.pay_more_err_flag_3 && (
          <div className={styles.sub_title}>
            <h3>常见原因：</h3>
            <p>当前已勾选的运单累计需付款￥{amount.total_wait_pay}</p>
            <p>钱包可用余额￥{amount.available_amount}</p>
          </div>
        )}
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
        <Details waybill_no={objState.waybill_no}/>
      </Drawer>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(WaybillIndex);
