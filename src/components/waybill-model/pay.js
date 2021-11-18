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
  Card,
} from 'antd';
import { Helmet, useLocation } from 'umi';
import { connect } from 'dva';
const namespace = 'waybill';
const mapStateToProps = state => {
  let { payObjInfo, payeeList, getBtnText, is_sms_disabled } = state[namespace];
  return {
    payObjInfo,
    payeeList,
    getBtnText,
    is_sms_disabled,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getInfoPersonFn: value => {
      //获取付款人信息
      dispatch({
        type: namespace + '/getInfoPersonModel',
        value,
      });
    },
    getPayeeListFn: value => {
      //获取收款人列表
      dispatch({
        type: namespace + '/getPayeePayListModel',
        value,
      });
    },
    getSmsCodeFromPayFn: value => {
      //倒计时
      dispatch({
        type: namespace + '/getSmsCodeFromPayModel',
        value,
      });
    },
  };
};

const Pay = props => {
  const location = useLocation();
  const [form] = Form.useForm();
  let waybill_no = location.query.waybill_no;
  let { payObjInfo, payeeList, getBtnText, is_sms_disabled } = props;
  console.log('payObjInfo:',payObjInfo)
  useEffect(() => {
    props.getInfoPersonFn({ waybill_no });
    props.getPayeeListFn({ waybill_no });
  }, [waybill_no]);

  const onFinish = fieldsValue => {
    const values = {
      ...fieldsValue,
    };
    props.submitFormFn(values);
  };

  return (
    <>
      <Helmet>
        <title>{location.query.title}</title>
      </Helmet>
      <Card>
        {payObjInfo && (
          <Row>
            <Col span={5}>运单编号：{payObjInfo.waybill_no}</Col>
            <Col span={5}>货物名称：{payObjInfo.goods_name}</Col>
            <Col span={5}>承运人：{payObjInfo.carrier_name || '未指定'}</Col>
            <Col span={5}>应付金额：{payObjInfo.labour_amount}</Col>
            <Col span={4}>
              {payObjInfo.transport_type == 1 ? '车牌号' : '船名'}：
              {payObjInfo.trans_vehicle_name}
            </Col>
          </Row>
        )}
      </Card>
      <Card type="inner" style={{ margin: '20px 0' }} title="付款申请">
        <Form
          form={form}
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
          <Form.Item label="未付款金额："></Form.Item>
          <Form.Item label="收款人："></Form.Item>
          <Form.Item
            name="pay_money"
            label="本次付款金额(元)："
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input />
            <Button>全额支付</Button>
          </Form.Item>
          <Form.Item label="收款卡：">
            <span>中国银行</span>
          </Form.Item>
          <Form.Item
            label="本次付款类型："
            name="pay_type"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="快速选择："
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="短信验证码："
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
            <Button>获取验证码</Button>
            <div>
              验证码关联手机号13745210236
              <span style={{ color: '#999', marginLeft: '20px' }}>
                系统管理->付款流程配置
                <i style={{ color: '#f77f1f', fontStyle: 'normal' }}>
                  配置审核流程后无需输入验证码
                </i>
              </span>
            </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary">提交</Button>
            <Button>关闭</Button>
          </Form.Item>
        </Form>
      </Card>
      <Card type="inner" title="付款申请记录">
        Inner Card content
      </Card>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Pay));
