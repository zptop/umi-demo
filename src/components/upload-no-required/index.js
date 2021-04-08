import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Modal, Button, Form, Input, Radio } from 'antd';
import { accMul } from '../../util/tools';
import UploadImgModal from '../upload-img-modal';
import { connect } from 'dva';
const namespace = 'waybill';
import styles from './index.less';
const mapStateToProps = state => {
  let waybillDetailInfo = state[namespace].waybillNoInfo || {};
  let payChannelArr = state[namespace].payChannelArr || [];
  return {
    waybillDetailInfo,
    payChannelArr,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getWaybillDetailFn: value => {
      dispatch({
        type: namespace + '/getWaybillDetailModel',
        value,
      });
    },
    getPayChannelFn: value => {
      dispatch({
        type: namespace + '/getPayChannelModel',
        value,
      });
    },
    uploadNoRequiredSubmitFn: value => {
      dispatch({
        type: namespace + '/uploadNoRequiredSubmitModel',
        value,
      });
    },
  };
};

const layout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 18,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};
const UploadNoRequired = props => {
  const [form] = Form.useForm();
  const [isShowPayChannel, setIsShowPayChannel] = useState(false);
  const reply_media_ids = useRef(null);
  const contract_media_ids = useRef(null);
  const pay_media_ids = useRef(null);
  useEffect(() => {
    props.getWaybillDetailFn({
      waybill_no: props.waybill_no,
    });
    props.getPayChannelFn();
  }, [props.waybill_no]);

  const onFinish = fieldsValue => {
    let values = {
      ...fieldsValue,
      waybill_no: props.waybill_no,
      waybill_amount: accMul(fieldsValue['waybill_amount'], 100),
      reply_media_ids: reply_media_ids.current,
      contract_media_ids: contract_media_ids.current,
      pay_media_ids: pay_media_ids.current,
      transportType: props.transportType,
    };
    console.log('Success-values:', values);
    // props.uploadNoRequiredSubmitFn(values)
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  //快捷输入
  const quickChecked = e => {
    form.setFieldsValue({ pay_style: e.target.value });
  };

  //渲染支付渠道
  const renderPayChannelArr = arr => {
    return arr.map((item, index) => (
      <div
        className={styles.item}
        key={index}
        onClick={() => selectPayChannel(item.chan_name)}
      >
        {item.chan_name}
      </div>
    ));
  };

  //选择支付渠道
  const selectPayChannel = name => {
    if (name) {
      form.setFieldsValue({ pay_channel: name });
      setIsShowPayChannel(false);
    }
  };

  //支付渠道获取焦点
  const getOnFocus = () => {
    setIsShowPayChannel(true);
  };
  const searchPayChanner = e => {
    let name = e.target.value;
    setIsShowPayChannel(true);
    props.getPayChannelFn({ name: name || null });
  };

  //子组件传过来的回单图片
  const replyImgFromChild = picList => {
    reply_media_ids.current = picList.map(item => item.uid).join(',');
    console.log('reply_media_ids:', reply_media_ids);
  };

  //子组件传过来的合同图片
  const contractImgFromChild = picList => {
    contract_media_ids.current = picList.map(item => item.uid).join(',');
  };

  //子组件传过来的银行支付凭证
  const payImgFromChild = picList => {
    pay_media_ids.current = picList.map(item => item.uid).join(',');
  };
  //回单图片
  const getReplyImgArr = () => {
    let {
      waybillDetailInfo,
      waybillDetailInfo: { reply_media },
    } = props;
    if (Object.keys(waybillDetailInfo).length && reply_media) {
      let reply_media_temp = [];
      reply_media.forEach(item => {
        reply_media_temp.push({
          uid: item.media_id,
          name: '回单图片',
          status: 'done',
          url: item.media_path,
          thumbUrl: item.media_thumb,
        });
      });
      reply_media_ids.current = reply_media
        .map(item => item.media_id)
        .join(',');
      return reply_media_temp;
    }
  };

  //合同图片
  const getContractImgArr = () => {
    let {
      waybillDetailInfo,
      waybillDetailInfo: { contract_media },
    } = props;
    if (Object.keys(waybillDetailInfo).length && contract_media) {
      let contract_media_temp = [];
      contract_media.forEach(item => {
        contract_media_temp.push({
          uid: item.media_id,
          name: '合同图片',
          status: 'done',
          url: item.media_path,
          thumbUrl: item.media_thumb,
        });
      });
      contract_media_ids.current = contract_media
        .map(item => item.media_id)
        .join(',');
      return contract_media_temp;
    }
  };

  //银行支付凭证
  const getPayImgArr = () => {
    let {
      waybillDetailInfo,
      waybillDetailInfo: { pay_media },
    } = props;
    if (Object.keys(waybillDetailInfo).length && pay_media) {
      let pay_media_temp = [];
      pay_media.forEach(item => {
        pay_media_temp.push({
          uid: item.media_id,
          name: '支付凭证',
          status: 'done',
          url: item.media_path,
          thumbUrl: item.media_thumb,
        });
      });
      pay_media_ids.current = pay_media.map(item => item.media_id).join(',');
      return pay_media_temp;
    }
  };

  return (
    <div>
      <Form
        form={form}
        {...layout}
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          waybill_amount: '',
          pay_style: '',
          pay_channel: '',
        }}
      >
        <Form.Item
          label="合同金额"
          name="waybill_amount"
          rules={[
            {
              required: true,
              message: '合同金额未输入',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="支付方式"
          name="pay_style"
          rules={[
            {
              required: true,
              message: '支付方式未输入',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="快捷输入">
          <Radio.Group buttonStyle="solid" onChange={quickChecked}>
            <Radio.Button value="银行转账">银行转账</Radio.Button>
            <Radio.Button value="第三方支付">第三方支付</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="支付渠道"
          name="pay_channel"
          rules={[
            {
              required: true,
              message: '支付渠道未输入',
            },
          ]}
        >
          <Input onFocus={getOnFocus} onChange={e => searchPayChanner(e)} />
        </Form.Item>
        {isShowPayChannel && (
          <div className={styles.pay_channel_content}>
            {renderPayChannelArr(props.payChannelArr)}
          </div>
        )}
        <div className={styles.title_item}>
          <h2>上传回单</h2>
          <UploadImgModal
            data={{
              service_no: props.waybillDetailInfo.waybill_no,
              service_type: 30010,
              media_type: 61,
            }}
            title="回单图片"
            picListShow={getReplyImgArr()}
            delPicUrl="waybill/delpic"
            flag="replyImg"
            replyImg={replyImgFromChild}
          />
        </div>
        <div className={styles.title_item}>
          <h2>上传合同（收票方与承运方签署的）</h2>
          <UploadImgModal
            data={{
              service_no: props.waybillDetailInfo.waybill_no,
              service_type: 30010,
              media_type: 21,
            }}
            title="合同图片"
            picListShow={getContractImgArr()}
            delPicUrl="waybill/delpic"
            flag="contractImg"
            contractImg={contractImgFromChild}
          />
        </div>
        <div className={styles.title_item}>
          <h2>银行支付凭证（支付给承运人的凭证）</h2>
          <UploadImgModal
            data={{
              service_no: props.waybillDetailInfo.waybill_no,
              service_type: 30010,
              media_type: 10,
            }}
            title="支付凭证"
            picListShow={getPayImgArr()}
            delPicUrl="waybill/delpic"
            flag="payImg"
            payImg={payImgFromChild}
          />
        </div>
        <Form.Item
          {...tailLayout}
          style={{ textAlign: 'right', marginBottom: 0 }}
        >
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadNoRequired);
