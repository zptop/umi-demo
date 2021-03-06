import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Modal, Button, Form, Input, Radio, message } from 'antd';
import { accMul, accDiv } from '../../util/tools';
import UploadImgModal from '../upload-img-modal';
import { connect } from 'dva';
const namespace = 'waybill';
import styles from './index.less';
const mapStateToProps = state => {
  let waybillDetailInfo = state[namespace].waybillNoInfo || {};
  let payChannelArr = state[namespace].payChannelArr || [];
  let isNoRequiredModalVisible = state[namespace].isNoRequiredModalVisible;
  return {
    waybillDetailInfo,
    payChannelArr,
    isNoRequiredModalVisible,
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

  useEffect(() => {
    console.log('props:',props)
    if (props && Object.keys(props.waybillDetailInfo).length) {
      let { waybill_amount, pay_style, pay_channel } = props.waybillDetailInfo;
      form.setFieldsValue({
        waybill_amount: accDiv(waybill_amount, 100).toFixed(2),
        pay_style,
        pay_channel,
      });
    }
  }, [props.waybillDetailInfo.waybill_no]);

  const onFinish = fieldsValue => {
    let values = {
      ...fieldsValue,
      waybill_no: props.waybill_no,
      waybill_amount: accMul(fieldsValue['waybill_amount'], 100),
      reply_media_ids: reply_media_ids.current || '',
      contract_media_ids: contract_media_ids.current || '',
      pay_media_ids: pay_media_ids.current || '',
      transportType: props.transportType,
    };
    props.uploadNoRequiredSubmitFn(values);
    props.closeModelFromChild(props.isNoRequiredModalVisible);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  //????????????
  const quickChecked = e => {
    form.setFieldsValue({ pay_style: e.target.value });
  };

  //??????????????????
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

  //??????????????????
  const selectPayChannel = name => {
    if (name) {
      form.setFieldsValue({ pay_channel: name });
      setIsShowPayChannel(false);
    }
  };

  //????????????????????????
  const getOnFocus = () => {
    setIsShowPayChannel(true);
  };
  const searchPayChanner = e => {
    let name = e.target.value;
    setIsShowPayChannel(true);
    props.getPayChannelFn({ name: name || null });
  };

  //?????????????????????????????????
  const replyImgFromChild = picList => {
    reply_media_ids.current = picList.map(item => item.uid).join(',');
    console.log('reply_media_ids:', reply_media_ids);
  };

  //?????????????????????????????????
  const contractImgFromChild = picList => {
    contract_media_ids.current = picList.map(item => item.uid).join(',');
  };

  //???????????????????????????????????????
  const payImgFromChild = picList => {
    pay_media_ids.current = picList.map(item => item.uid).join(',');
  };
  //????????????
  const getReplyImgArr = () => {
    let {
      waybillDetailInfo,
      waybillDetailInfo: { reply_media },
    } = props;
    let reply_media_temp = [];
    if (Object.keys(waybillDetailInfo).length && reply_media) {
      reply_media.forEach(item => {
        reply_media_temp.push({
          uid: item.media_id,
          name: '????????????',
          status: 'done',
          url: item.media_path,
          thumbUrl: item.media_thumb,
        });
      });
      reply_media_ids.current = reply_media
        .map(item => item.media_id)
        .join(',');
    }
    return reply_media_temp;
  };

  //????????????
  const getContractImgArr = () => {
    let {
      waybillDetailInfo,
      waybillDetailInfo: { contract_media },
    } = props;
    let contract_media_temp = [];
    if (Object.keys(waybillDetailInfo).length && contract_media) {
      contract_media.forEach(item => {
        contract_media_temp.push({
          uid: item.media_id,
          name: '????????????',
          status: 'done',
          url: item.media_path,
          thumbUrl: item.media_thumb,
        });
      });
      contract_media_ids.current = contract_media
        .map(item => item.media_id)
        .join(',');
    }
    return contract_media_temp;
  };

  //??????????????????
  const getPayImgArr = () => {
    let {
      waybillDetailInfo,
      waybillDetailInfo: { pay_media },
    } = props;
    let pay_media_temp = [];
    if (Object.keys(waybillDetailInfo).length && pay_media) {
      pay_media.forEach(item => {
        pay_media_temp.push({
          uid: item.media_id,
          name: '????????????',
          status: 'done',
          url: item.media_path,
          thumbUrl: item.media_thumb,
        });
      });
      pay_media_ids.current = pay_media.map(item => item.media_id).join(',');
    }
    return pay_media_temp;
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
          label="????????????"
          name="waybill_amount"
          rules={[
            {
              required: true,
              message: '?????????????????????',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="????????????"
          name="pay_style"
          rules={[
            {
              required: true,
              message: '?????????????????????',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="????????????">
          <Radio.Group
            buttonStyle="solid"
            onChange={quickChecked}
            value={props.waybillDetailInfo.pay_style || ''}
          >
            <Radio.Button value="????????????">????????????</Radio.Button>
            <Radio.Button value="???????????????">???????????????</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="????????????"
          name="pay_channel"
          rules={[
            {
              required: true,
              message: '?????????????????????',
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
          <h2>????????????</h2>
          <UploadImgModal
            data={{
              service_no: props.waybillDetailInfo.waybill_no,
              service_type: 30010,
              media_type: 61,
            }}
            title="????????????"
            picListShow={getReplyImgArr()}
            delPicUrl="waybill/delpic"
            flag="replyImg"
            replyImg={replyImgFromChild}
          />
        </div>
        <div className={styles.title_item}>
          <h2>????????????????????????????????????????????????</h2>
          <UploadImgModal
            data={{
              service_no: props.waybillDetailInfo.waybill_no,
              service_type: 30010,
              media_type: 21,
            }}
            title="????????????"
            picListShow={getContractImgArr()}
            delPicUrl="waybill/delpic"
            flag="contractImg"
            contractImg={contractImgFromChild}
          />
        </div>
        <div className={styles.title_item}>
          <h2>???????????????????????????????????????????????????</h2>
          <UploadImgModal
            data={{
              service_no: props.waybillDetailInfo.waybill_no,
              service_type: 30010,
              media_type: 10,
            }}
            title="????????????"
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
            ??????
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadNoRequired);
