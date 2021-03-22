import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Table,
  Button,
  Select,
  Cascader,
  Form,
  Input,
  DatePicker,
  Menu,
  Dropdown,
  message,
  Modal,
  Divider,
  Tooltip,
} from 'antd';
import {
  ExclamationCircleFilled,
  UserAddOutlined,
  CloseCircleFilled,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { Helmet, useLocation } from 'umi';
import { formatDateYMD, accMul, accDiv } from '../../util/tools';
import styles from './index.less';
import { connect } from 'dva';
const { confirm } = Modal;
const namespace = 'waybill';
const mapStateToProps = state => {
  let waybill_load_place = state[namespace].waybill_load_place || [],
    waybill_consi_info = state[namespace].waybill_consi_info || [],
    searchData = state[namespace].searchData,
    searchShow = state[namespace].searchShow,
    newPayerList = state[namespace].newPayerList || [],
    payeeInfo = state[namespace].payeeInfo || {},
    waybillNoInfo = state[namespace].waybillNoInfo || {};
  return {
    waybill_load_place,
    waybill_consi_info,
    searchData,
    searchShow,
    newPayerList,
    payeeInfo,
    waybillNoInfo,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    submitFormFn: value => {
      //新增运单
      dispatch({
        type: namespace + '/submitFormModel',
        value,
      });
    },
    getSearchFromMobileFn: value => {
      //搜索承运人
      dispatch({
        type: namespace + '/getSearchFromMobileModel',
        value,
      });
    },
    setNewPayerListFn: value => {
      //新增收款人列表-只有一条数据
      dispatch({
        type: namespace + '/setNewPayerListModel',
        value,
      });
    },
    getRemovePayeeFn: value => {
      //删除新增收款人
      dispatch({
        type: namespace + '/getRemovePayeeModel',
        value,
      });
    },
    addpayeeFn: value => {
      //添加额外收款人信息
      dispatch({
        type: namespace + '/addpayeeModel',
        value,
      });
    },
    getPayeeListFn: value => {
      //搜索额外收款人列表
      dispatch({
        type: namespace + '/getPayeeListModel',
        value,
      });
    },
  };
};
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
//公路-货物大类列表
const highway = [
  { value: '0100', text: '煤炭及制品' },
  { value: '0600', text: '水泥' },
  { value: '0500', text: '矿建材料' },
  { value: '0300', text: '金属矿石' },
  { value: '0800', text: '非金属矿石' },
  { value: '0400', text: '钢铁' },
  { value: '1400', text: '有色金属' },
  { value: '1300', text: '轻工原料及制品' },
  { value: '1602', text: '冷藏冷冻货物' },
  { value: '1601', text: '鲜活农产品' },
  { value: '1701', text: '商品汽车' },
  { value: '1200', text: '机械、设备和电器' },
  { value: '0700', text: '木材' },
  { value: '1100', text: '粮食' },
  { value: '0900', text: '化肥及农药' },
  { value: '1500', text: '轻工、医药产品' },
  { value: '1000', text: '盐' },
  { value: '0200', text: '石油天然气及制品' },
  { value: '1700', text: '其他' },
];

const renderOptions = arrWay => {
  return arrWay.map(item => (
    <Select.Option key={item.value} value={item.value}>
      {item.text}
    </Select.Option>
  ));
};

const validateGoodsNum = (rule, value) => {
  let reg = /^\d+(\.\d{1,3})?$/;
  if (value && value < 0.01) {
    return Promise.reject('货物重量不能小于0.01');
  } else if (value && value > 99999.99) {
    return Promise.reject('货物重量不能大于99999.99');
  } else if (value && !reg.test(value)) {
    return Promise.reject('请输入有效的数字');
  }
  return Promise.resolve();
};
const validateLabourAmount = (rule, value) => {
  let reg = /^\d+(\.\d{1,3})?$/;
  if (value && value < 0.01) {
    return Promise.reject('运输劳务费不能小于0.01');
  } else if (value && value > 9999999.99) {
    return Promise.reject('运输劳务费不能大于9999999.99');
  } else if (value && !reg.test(value)) {
    return Promise.reject('请输入有效的数字');
  }
  return Promise.resolve();
};
const oldHighWayCodeRxp = (rule, value) => {
  let oldHighWayCodeArr = ['90', '92', '93', '94', '95', '96', '999'];
  if (value && oldHighWayCodeArr.includes(value)) {
    return Promise.reject('货物类型未选择');
  }
  return Promise.resolve();
};

const FormIndex = props => {
  const location = useLocation();
  const [form] = Form.useForm(); //新增或编辑运单表单
  const [selectCarrierForm] = Form.useForm(); //搜索承运人表单
  const [selectPayerNewForm] = Form.useForm(); //新增收款人表单
  const [objState, setObjState] = useState({
    selectCarrierFlag: false, //搜索承运人模态框显示
    driverIndex: null, //选中承运司机
    vehicleIndex: null, //选中承运车辆
    carrierMobile: '', //搜索承运人的输入的手机号
    payeeSwitch: false, //运费收款人开关
    payeeMobile: '', //搜索新增收款人输入的手机号
    payeeModalDisabled: false, //新增收款人弹框“确定”
    payeeModal: false, //新增收款人弹框
    delPayeeBtnFlag: false, //删除额外收款人icon控制
    isDelCopyBtnFlag: false, //复制运单可以操作收款人
  });

  useEffect(() => {
    setObjState({
      ...objState,
      payeeSwitch: props.waybillNoInfo.carrier_uin != '0' ? true : false,
    });
    if (Object.keys(props.waybillNoInfo).length) {
      let {
          waybill_no,
          goods_name,
          goods_type,
          goods_unit,
          goods_num,
          load_time,
          unload_time,
          labour_amount,
          load_place,
          load_place_detail,
          consi_name,
          consi_contact_mobile,
          unload_place,
          unload_place_detail,
          remark,
          transport_type,
          cd_id,
          carrier_uin,
          carrier_name,
          carrier_mobile,
          transport_uin,
          transport_name,
          trans_vehicle_id,
          trans_vehicle_name,
        } = props.waybillNoInfo,
        load_place_id = Object.values(load_place).filter(item =>
          /\d/.test(Number(item)),
        ),
        unload_place_id = Object.values(unload_place).filter(item =>
          /\d/.test(Number(item)),
        );
      if (transport_type == 2) {
        load_place_id = load_place_id.map(item => Number(item));
        unload_place_id = unload_place_id.map(item => Number(item));
      }
      form.setFieldsValue({
        goods_name,
        goods_type,
        goods_unit,
        goods_num:
          goods_unit == 0 ? accDiv(goods_num, 1000).toString() : goods_num,
        load_time: moment(formatDateYMD(load_time), 'YYYY-MM-DD'),
        load_place_id,
        unload_place_id,
        load_place_detail,
        consi_name,
        consi_contact_mobile,
        unload_time: moment(formatDateYMD(unload_time), 'YYYY-MM-DD'),
        unload_place_detail,
        labour_amount: accDiv(parseFloat(labour_amount), 100).toString(),
        remark,
        transport_type,
        cd_id,
        carrier_uin,
        carrier_name: carrier_name + carrier_mobile,
        transport_uin,
        transport_name,
        trans_vehicle_id,
        trans_vehicle_name,
      });
      if (carrier_uin != '0') {
        props.getPayeeListFn({ waybill_no });
      }
    }
  }, [props.waybillNoInfo.waybill_no]);

  useEffect(() => {
    if (Object.keys(props.payeeInfo).length) {
      form.setFieldsValue({
        payee_name: props.payeeInfo.payee_name,
        payee_uin: props.payeeInfo.payee_uin,
        payee_id: props.payeeInfo.payee_id,
      });
      setObjState({
        ...objState,
        payeeSwitch: Boolean(props.payeeInfo.payee_uin) ? true : false,
        payeeModal: Boolean(props.payeeInfo.payee_name) && false,
        payeeMobile: props.payeeInfo.payee_mobile,
        delPayeeBtnFlag:
          props.payeeInfo.delable == 1 && props.payeeInfo.payee_uin
            ? true
            : false,
        isDelCopyBtnFlag:
          props.payeeInfo.delable == 0
            ? false
            : location.query.title.includes('copy') &&
              props.payeeInfo.payee_uin &&
              true,
      });
    }
  }, [props.payeeInfo.payee_uin]);

  useEffect(() => {
    props.getSearchFromMobileFn({
      carrier_mobile: objState.carrierMobile,
      transport_type: props.transportType,
    });
  }, [objState.carrierMobile]);

  const columns = [
    {
      title: '姓名',
      dataIndex: 'payee_name',
    },
    {
      title: '手机号',
      dataIndex: 'carrier_mobile',
    },
    {
      title: '银行卡号',
      render: (text, row, index) => {
        if (row.bank_card_no != '') {
          return (
            <div>
              <span>{row.bank_payee_name + '(' + row.bank_card_no + ')'}</span>
            </div>
          );
        } else {
          return (
            <div>
              <span>暂未绑定</span>
            </div>
          );
        }
      },
    },
  ];

  const onFinish = fieldsValue => {
    const values = {
      ...fieldsValue,
      load_time: fieldsValue['load_time'].format('YYYY-MM-DD'),
      unload_time: fieldsValue['unload_time'].format('YYYY-MM-DD'),
      load_place_id: fieldsValue['load_place_id'][2],
      unload_place_id: fieldsValue['unload_place_id'][2],
      transport_type: props.transportType,
      waybill_no: location.query.title.includes('编辑')
        ? location.query.waybill_no
        : '',
    };
    console.log('values:', values);
    props.submitFormFn(values);
  };
  //设置承运人-选择司机
  const renderCarrierDriver = arr => {
    return arr.map((item, index) => (
      <li
        className={index === objState.driverIndex ? styles.active : ''}
        onClick={() => handleCarrierDriver(item, index)}
        key={item.cd_id}
      >
        {item.name}
        {item.isidexpire == 1 && item.islicexpire != 1 && (
          <Tooltip
            placement="right"
            title={
              '司机“' +
              item.name +
              '”的认证信息中，身份证即将过期或已过期，可能影响后续发票开具，您可指派后进行更新'
            }
          >
            <ExclamationCircleFilled />
          </Tooltip>
        )}
        {item.islicexpire == 1 && item.isidexpire != 1 && (
          <Tooltip
            placement="right"
            title={
              '司机“' +
              item.name +
              '”的认证信息中，驾驶证即将过期或已过期，可能影响后续发票开具，您可指派后进行更新'
            }
          >
            <ExclamationCircleFilled />
          </Tooltip>
        )}
        {item.islicexpire == 1 && item.isidexpire == 1 && (
          <Tooltip
            placement="right"
            title={
              '司机“' +
              item.name +
              '”的认证信息中，身份证和驾驶证即将过期或已过期，可能影响后续发票开具，您可指派后进行更新'
            }
          >
            <ExclamationCircleFilled />
          </Tooltip>
        )}
        {item.audit_status_desc == '审核中' && (
          <span>
            <i
              style={{ fontStyle: 'normal', color: '#000', paddingLeft: '5px' }}
            >
              ({item.audit_status_desc})
            </i>
          </span>
        )}
        {item.audit_status_desc == '不通过' && (
          <span>
            <i
              style={{ fontStyle: 'normal', color: '#f00', paddingLeft: '5px' }}
            >
              ({item.audit_status_desc})
            </i>
          </span>
        )}
      </li>
    ));
  };
  const handleCarrierDriver = (item, index) => {
    if (objState.driverIndex === index) {
      setObjState({
        ...objState,
        driverIndex: null,
      });
    } else {
      setObjState({
        ...objState,
        driverIndex: index,
      });
      if (item.isidexpire == 1 && item.islicexpire != 1) {
        Modal.warning({
          title: '提示',
          okText: '知道了',
          content:
            '司机“' +
            item.name +
            '”的认证信息中，身份证即将过期或已过期，可能影响后续发票开具，您可指派后进行更新',
        });
      }
      if (item.islicexpire == 1 && item.isidexpire != 1) {
        Modal.warning({
          title: '提示',
          okText: '知道了',
          content:
            '司机“' +
            item.name +
            '”的认证信息中，驾驶证即将过期或已过期，可能影响后续发票开具，您可指派后进行更新',
        });
      }
      if (item.islicexpire == 1 && item.isidexpire == 1) {
        Modal.warning({
          title: '提示',
          okText: '知道了',
          content:
            '司机“' +
            item.name +
            '”的认证信息中，身份证和驾驶证即将过期或已过期，可能影响后续发票开具，您可指派后进行更新',
        });
      }
    }
  };

  //设置承运人-选择车辆
  const renderCarrierVehicle = arr => {
    return arr.map((item, index) => (
      <li
        className={index === objState.vehicleIndex ? styles.active : ''}
        onClick={() => handleCarrierVehicle(item, index)}
        key={item.id}
      >
        {item.name}
        {item.isroadcertexpire == 1 && (
          <Tooltip
            placement="right"
            title={
              '司机“' +
              item.name +
              '”的认证信息中，行驶证即将过期或已过期，可能影响后续发票开具，您可指派后进行更新'
            }
          >
            <ExclamationCircleFilled />
          </Tooltip>
        )}
        {item.audit_status_desc == '审核中' && (
          <span>
            <i
              style={{ fontStyle: 'normal', color: '#000', paddingLeft: '5px' }}
            >
              ({item.audit_status_desc})
            </i>
          </span>
        )}
        {item.audit_status_desc == '不通过' && (
          <span>
            <i
              style={{ fontStyle: 'normal', color: '#f00', paddingLeft: '5px' }}
            >
              ({item.audit_status_desc})
            </i>
          </span>
        )}
      </li>
    ));
  };
  const handleCarrierVehicle = (item, index) => {
    if (objState.vehicleIndex === index) {
      setObjState({
        ...objState,
        vehicleIndex: null,
      });
    } else {
      setObjState({
        ...objState,
        vehicleIndex: index,
      });
      if (item.isroadcertexpire == 1) {
        Modal.warning({
          title: '提示',
          okText: '知道了',
          content:
            '车辆“' +
            item.name +
            '”的认证信息中，行驶证即将过期或已过期，可能影响后续发票开具，您可指派后进行更新',
        });
      }
    }
  };

  //常用装货地点
  const renderWaybillLoadPlace = arr => {
    return arr.map((item, index) => (
      <li
        onClick={() =>
          handleLine(
            item.load_place.province_id,
            item.load_place.city_id,
            item.load_place.area_id,
            item.load_place_detail,
          )
        }
        key={index}
      >
        {item.load_place_id_desc + item.load_place_detail}
      </li>
    ));
  };

  //常用收货人
  const renderWaybillConsiInfo = arr => {
    return arr.map((item, index) => (
      <li
        onClick={() =>
          handleConsi(
            item.consi_name,
            item.consi_contact_mobile,
            item.unload_place.province_id,
            item.unload_place.city_id,
            item.unload_place.area_id,
            item.unload_place_detail,
          )
        }
        key={index}
      >
        {item.consi_name + ' ' + item.consi_contact_mobile}
      </li>
    ));
  };

  //操作常用线路填充
  const handleLine = (province_id, city_id, area_id, load_place_detail) => {
    let idArr = [province_id, city_id, area_id];
    form.setFieldsValue({
      load_place_id:
        props.transportType == 1 ? idArr : idArr.map(item => Number(item)),
      load_place_detail,
    });
  };

  //操作常用收货人填充
  const handleConsi = (
    consi_name,
    consi_contact_mobile,
    province_id,
    city_id,
    area_id,
    unload_place_detail,
  ) => {
    let idArr = [province_id, city_id, area_id];
    form.setFieldsValue({
      consi_name,
      consi_contact_mobile,
      unload_place_id:
        props.transportType == 1 ? idArr : idArr.map(item => Number(item)),
      unload_place_detail,
    });
  };

  //打开选择承运人模态框
  const openSelectCarrierModal = () => {
    setObjState({
      ...objState,
      selectCarrierFlag: true,
    });
  };

  //渲染承运人和司机列表
  const renderCarrierDriverList = searchData => {
    return (
      <div>
        <div className={styles.modal_content_top}>
          搜索结果&nbsp;&nbsp;
          <strong>
            {searchData.carrier.name +
              selectCarrierForm.getFieldValue('carrier_mobile')}
          </strong>
        </div>
        <Row>
          <Col span={12}>
            <div className={styles.label}>请选择承运司机</div>
            <ul className={styles.driver_list}>
              {renderCarrierDriver(searchData.drivers)}
            </ul>
          </Col>
          <Col span={12}>
            <div className={styles.label}>
              {props.transportType == 1 ? '请选择承运车辆' : '请选择承运船舶'}
            </div>
            <ul className={styles.driver_list}>
              {renderCarrierVehicle(searchData.vehicles)}
            </ul>
          </Col>
        </Row>
      </div>
    );
  };

  //搜索承运人
  const getSearchFromMobile = e => {
    const carrierMobile = e.target.value;
    setObjState({
      ...objState,
      carrierMobile,
    });
  };

  //选择承运人-确定
  const selectCarrierModalOk = () => {
    if (objState.carrierMobile.length === 0) {
      message.warning('请输入正确的承运人手机号码');
      return false;
    } else if (!/^1[3456789]\d{9}$/.test(objState.carrierMobile)) {
      message.warning('手机号码格式不正确');
      return false;
    }
    if (objState.driverIndex == null && props.transportType == 1) {
      message.warning('请选择司机');
      return false;
    }
    if (objState.vehicleIndex == null) {
      message.warning(props.transportType == 1 ? '请选择车辆' : '请选择船舶');
      return false;
    }
    form.setFieldsValue({
      carrier_uin: props.searchData.carrier.uin,
      carrier_name: props.searchData.carrier.name + objState.carrierMobile,
    });

    if (objState.driverIndex !== null) {
      form.setFieldsValue({
        transport_name: props.searchData.drivers[objState.driverIndex].name,
        transport_uin: props.searchData.drivers[objState.driverIndex].uin,
        cd_id: props.searchData.drivers[objState.driverIndex].cd_id,
      });
    } else {
      form.setFieldsValue({
        transport_name: '',
        transport_uin: '',
      });
    }
    if (objState.vehicleIndex !== null) {
      form.setFieldsValue({
        trans_vehicle_id: props.searchData.vehicles[objState.vehicleIndex].id,
        trans_vehicle_name:
          props.searchData.vehicles[objState.vehicleIndex].name,
      });
    } else {
      form.setFieldsValue({
        trans_vehicle_id: '',
        trans_vehicle_name: '',
      });
    }
    setObjState({
      ...objState,
      selectCarrierFlag: false,
      carrierMobile: '',
      payeeSwitch: true,
    });
  };

  //选择承运人-返回
  const selectCarrierModalCancel = () => {
    setObjState({
      ...objState,
      selectCarrierFlag: false,
      carrierMobile: '',
    });
    selectCarrierForm.resetFields();
  };

  //打开-新增收款人
  const openPayerNewrModal = () => {
    setObjState({
      ...objState,
      payeeModal: true,
    });
  };

  //搜索-新增收款人
  const getSearchNewPayerMobile = e => {
    let payeeMobile = e.target.value;
    setObjState({
      ...objState,
      payeeMobile,
      payeeModalDisabled: /^1[3456789]\d{9}$/.test(payeeMobile) ? false : true,
    });
    props.setNewPayerListFn({
      mobile: payeeMobile,
      transport_type: props.transportType,
    });
  };

  //删除-新增收款人
  const handleRemovePayee = () => {
    if (location.query.waybill_no && location.query.title.includes('编辑')) {
      confirm({
        title: '提示',
        icon: <QuestionCircleOutlined />,
        content: '确认删除新收款人？',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          props.getRemovePayeeFn({ payee_id: form.getFieldValue('payee_id') });
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else {
      // this.listData = [];
      props.getRemovePayeeFn({ payee_id: '' });
    }
  };

  //确定-新增收款人
  const payeeModalOk = () => {
    if (objState.payeeMobile.length == 0) {
      message.warning('请输入收款人手机号');
      return false;
    }
    form.setFieldsValue({
      payee_name: props.newPayerList[0].payee_name,
      payee_uin: props.newPayerList[0].payee_uin,
    });
    if (location.query.waybill_no && location.query.title.includes('编辑')) {
      let params = {
        waybill_no: location.query.waybill_no,
        payee_uin: form.getFieldValue('payee_uin'),
        payee_name: form.getFieldValue('payee_name'),
      };
      props.addpayeeFn(params);
    } else {
      setObjState({
        ...objState,
        payeeModal: false,
        delPayeeBtnFlag: true,
      });
    }
  };

  //新增收款人-返回
  const payeeModalCancel = () => {
    setObjState({
      ...objState,
      payeeMobile: '',
      payeeModal: false,
    });
    selectPayerNewForm.resetFields();
  };

  return (
    <div>
      <Helmet>
        <title>{location.query.title}</title>
      </Helmet>
      <Form
        form={form}
        {...formItemLayout}
        onFinish={onFinish}
        scrollToFirstError
        initialValues={{
          goods_unit: '0',
          carrier_name: '',
          carrier_uin: '',
          transport_name: '',
          transport_uin: '',
          trans_vehicle_id: '',
          trans_vehicle_name: '',
          payee_name: '',
          payee_uin: '',
          title: location.query.title,
          remark: '',
        }}
      >
        <Row>
          <Col span={16} className={styles.content_left}>
            <div className={styles.split_line}>货物信息</div>
            <Row>
              <Col span={12}>
                <Form.Item
                  name="goods_name"
                  label="货物名称"
                  rules={[
                    {
                      required: true,
                      message: '货物名称未输入',
                    },
                  ]}
                >
                  <Input placeholder="请输入货物名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="goods_type"
                  label="货物类型"
                  rules={[
                    {
                      required: true,
                      message: '货物类型未选择',
                    },
                    {
                      validator: oldHighWayCodeRxp,
                    },
                  ]}
                >
                  <Select placeholder="请选择">{renderOptions(highway)}</Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  name="goods_num"
                  label="货物重量"
                  rules={[
                    {
                      required: true,
                      message: '货物重量未输入',
                    },
                    {
                      validator: validateGoodsNum,
                    },
                  ]}
                >
                  <Input placeholder="请输入货物重量" />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name="goods_unit"
                  rules={[
                    {
                      required: true,
                      message: '未选择',
                    },
                  ]}
                >
                  <Select
                    placeholder="请选择"
                    style={{
                      position: 'relative',
                      left: '-90px',
                      width: '90px',
                    }}
                  >
                    <Select.Option value="0">吨</Select.Option>
                    <Select.Option value="1">纸箱</Select.Option>
                    <Select.Option value="2">木箱</Select.Option>
                    <Select.Option value="3">板条箱</Select.Option>
                    <Select.Option value="4">大立箱</Select.Option>
                    <Select.Option value="5">包</Select.Option>
                    <Select.Option value="6">袋</Select.Option>
                    <Select.Option value="7">篓</Select.Option>
                    <Select.Option value="8">托盘</Select.Option>
                    <Select.Option value="9">桶</Select.Option>
                    <Select.Option value="10">听</Select.Option>
                    <Select.Option value="11">瓶</Select.Option>
                    <Select.Option value="12">罐</Select.Option>
                    <Select.Option value="13">盒</Select.Option>
                    <Select.Option value="14">支</Select.Option>
                    <Select.Option value="15">件</Select.Option>
                    <Select.Option value="16">集装箱</Select.Option>
                    <Select.Option value="17">方</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <div className={styles.split_line}>收发货信息</div>
            <Row>
              <Col span={12}>
                <Form.Item
                  name="load_time"
                  label="起运时间"
                  rules={[{ required: true, message: '起运时间未选择' }]}
                >
                  <DatePicker
                    placeholder="请选择起运时间"
                    className="ant-input"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="unload_time"
                  label="到达时间"
                  rules={[{ required: true, message: '到达时间未选择' }]}
                >
                  <DatePicker
                    placeholder="请选择到达时间"
                    className="ant-input"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  name="load_place_id"
                  label="货物起运地"
                  rules={[
                    {
                      required: true,
                      message: '货物起运地未选择',
                    },
                  ]}
                >
                  <Cascader
                    options={props.addr}
                    placeholder="请选择货物起运地"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="load_place_detail"
                  rules={[
                    {
                      required: true,
                      message: '详细地址未输入',
                    },
                  ]}
                >
                  <Input placeholder="请输入详细地址" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  name="consi_name"
                  label="收货方名称"
                  rules={[
                    {
                      required: true,
                      message: '收货方名称未输入',
                    },
                  ]}
                >
                  <Input placeholder="请输入收货方名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="consi_contact_mobile"
                  label="收货方电话"
                  rules={[
                    {
                      required: true,
                      message: '收货方电话未输入',
                    },
                  ]}
                >
                  <Input placeholder="请输入收货方电话" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  name="unload_place_id"
                  label="货物到达地"
                  rules={[
                    {
                      required: true,
                      message: '货物到达地未选择',
                    },
                  ]}
                >
                  <Cascader
                    options={props.addr}
                    placeholder="请选择货物到达地"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="unload_place_detail"
                  rules={[
                    {
                      required: true,
                      message: '详细地址未输入',
                    },
                  ]}
                >
                  <Input placeholder="请输入详细地址" />
                </Form.Item>
              </Col>
            </Row>
            <div className={styles.split_line}>费用信息</div>
            <Row>
              <Col span={12}>
                <Form.Item
                  style={{ marginBottom: 0 }}
                  name="labour_amount"
                  label="运输劳务费"
                  rules={[
                    {
                      required: true,
                      message: '运输劳务费未输入',
                    },
                    {
                      validator: validateLabourAmount,
                    },
                  ]}
                >
                  <Input placeholder="请输入承运人劳务费" />
                </Form.Item>
                <div className="ant-row ant-form-item">
                  <div style={{ position: 'relative', left: '86px' }}>
                    <span style={{ lineHeight: 1.8 }}>
                      *运输劳务费不含油气、过路费等，即通过平台支付部分
                    </span>
                    <span style={{ display: 'block', color: '#00b0b5' }}>
                      含税开票金额(元)：100
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item name="remark" label="备注">
                  <Input.TextArea placeholder="请输入备注" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item name="carrier_name" label="承运人">
                  <Input disabled placeholder="请选择承运人" />
                </Form.Item>
              </Col>
              <Col>
                <Button
                  style={{
                    position: 'relative',
                    left: '-90px',
                    display: 'inline-block',
                  }}
                  type="primary"
                  onClick={openSelectCarrierModal}
                >
                  选择
                </Button>
              </Col>
              <span
                style={{
                  position: 'relative',
                  top: '-18px',
                  left: '86px',
                  display: 'block',
                }}
              >
                *若承运人未完成注册认证及运输工具的添加，可暂不指定，稍后通过编辑功能再指定承运人
              </span>
            </Row>
            {objState.payeeSwitch && (
              <Row span={24}>
                <Col span={12}>
                  <Form.Item label="运费收款人">
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                      <Col className={styles.recipient} span={10}>
                        承运人：
                        {form.getFieldValue('carrier_name').replace(/\d+/g, '')}
                      </Col>
                      {form.getFieldValue('payee_uin') ? (
                        <Col className={`${styles.recipient}`} span={10}>
                          {form.getFieldValue('payee_name')}
                        </Col>
                      ) : (
                        <Col
                          className={`${styles.recipient} ${styles.on}`}
                          span={10}
                          onClick={openPayerNewrModal}
                        >
                          <UserAddOutlined />
                          新增1名收款人
                        </Col>
                      )}

                      {form.getFieldValue('payee_uin') && (
                        <CloseCircleFilled
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: '-8px',
                            fontSize: '20px',
                            color: '#00b0b5',
                          }}
                          onClick={handleRemovePayee}
                        />
                      )}
                    </Row>
                  </Form.Item>
                  <span
                    style={{
                      position: 'relative',
                      top: '-18px',
                      left: '86px',
                      display: 'block',
                    }}
                  >
                    *承运人为默认收款人,不可删改,最多允许额外新增1名收款人
                  </span>
                </Col>
              </Row>
            )}
            <Row>
              <Col span={24}>
                <Form.Item hidden name="carrier_uin">
                  <Input />
                </Form.Item>
                <Form.Item hidden name="transport_name">
                  <Input />
                </Form.Item>
                <Form.Item hidden name="transport_uin">
                  <Input />
                </Form.Item>
                <Form.Item hidden name="trans_vehicle_id">
                  <Input />
                </Form.Item>
                <Form.Item hidden name="trans_vehicle_name">
                  <Input />
                </Form.Item>
                <Form.Item hidden name="payee_name">
                  <Input />
                </Form.Item>
                <Form.Item hidden name="payee_uin">
                  <Input />
                </Form.Item>
                <Form.Item hidden name="title">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Button type="primary" htmlType="submit">
                  保存信息
                </Button>
                <Button type="default" style={{ marginLeft: '10px' }}>
                  关闭
                </Button>
              </Col>
            </Row>
          </Col>
          <Col span={7}>
            <div className={styles.content_right}>
              <h3>常用装货地点</h3>
              <ul>{renderWaybillLoadPlace(props.waybill_load_place)}</ul>
              <Divider></Divider>
              <h3>常用收货人</h3>
              <ul>{renderWaybillConsiInfo(props.waybill_consi_info)}</ul>
            </div>
          </Col>
        </Row>
      </Form>
      <Modal
        title="设定承运人"
        okText="确定"
        cancelText="返回"
        visible={objState.selectCarrierFlag}
        onOk={selectCarrierModalOk}
        onCancel={selectCarrierModalCancel}
      >
        <div>
          <Form form={selectCarrierForm} preserve={false}>
            <Form.Item name="carrier_mobile" label="手机号">
              <Input
                placeholder="请输入承运人手机号"
                maxLength={11}
                onChange={e => getSearchFromMobile(e)}
              />
            </Form.Item>
          </Form>
        </div>
        {props.searchShow &&
          props.searchData &&
          renderCarrierDriverList(props.searchData)}
      </Modal>
      <Modal
        title="新增收款人"
        okText="确定"
        cancelText="返回"
        visible={objState.payeeModal}
        onOk={payeeModalOk}
        onCancel={payeeModalCancel}
        okButtonProps={{ disabled: props.newPayerList.length == 0 }}
      >
        <div>
          <Form form={selectPayerNewForm}>
            <Form.Item name="payeeMobile">
              <Input
                placeholder="请输入收款人手机号"
                maxLength={11}
                onChange={e => getSearchNewPayerMobile(e)}
              />
            </Form.Item>
          </Form>
          <Table
            dataSource={props.newPayerList}
            columns={columns}
            rowKey={record => `${record.payee_uin}`}
            pagination={{ hideOnSinglePage: true }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(FormIndex);
