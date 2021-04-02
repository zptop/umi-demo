import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Button, Form, Input, Radio } from 'antd';
import UploadImgModal from '../upload-img-modal';
import { connect } from 'dva';
const namespace = 'waybill';
import styles from './index.less';
const mapStateToProps = state => {
  let waybillDetailInfo = state[namespace].waybillNoInfo || {};
  return {
    waybillDetailInfo,
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
  const [objState, setObjState] = useState({
    replyPicListShow: [], //上传回单列表
    contractPicListShow: [], //上传合同列表
    payPicListShow: [], //银行支付凭证列表
  });
  useEffect(() => {
    props.getWaybillDetailFn({
      waybill_no: props.waybill_no,
    });
  }, [props.waybill_no]);
  const onFinish = values => {
    console.log('Success:', values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  //子组件传过来的回单图片
  const replyImgFromChild = picList => {
    console.log('reply-picList:', picList);
    setObjState({
      ...objState,
      replyPicListShow: picList,
    });
  };

  //子组件传过来的合同图片
  const contractImgFromChild = picList => {
    setObjState({
      ...objState,
      contractPicListShow: picList,
    });
  };
  //子组件传过来的银行支付凭证
  const payImgFromChild = picList => {
    setObjState({
      ...objState,
      payPicListShow: picList,
    });
  };
  //回单图片
  const getReplyImgArr = () => {
    if (
      Object.keys(props.waybillDetailInfo).length &&
      props.waybillDetailInfo.reply_media
    ) {
      let replyImgArr = [];
      props.waybillDetailInfo.reply_media.map(item => {
        replyImgArr.push({
          uid: item.media_id,
          name: '回单图片',
          status: 'done',
          url: item.media_path,
          thumbUrl: item.media_thumb,
        });
      });
      return replyImgArr;
    }
  };

  //合同图片
  const getContractImgArr = () => {
    if (
      Object.keys(props.waybillDetailInfo).length &&
      props.waybillDetailInfo.contract_media
    ) {
      let contractImgArr = [];
      props.waybillDetailInfo.contract_media.map(item => {
        contractImgArr.push({
          uid: item.media_id,
          name: '合同图片',
          status: 'done',
          url: item.media_path,
          thumbUrl: item.media_thumb,
        });
      });
      return contractImgArr;
    }
  };
  //银行支付凭证
  const getPayImgArr = () => {
    if (
      Object.keys(props.waybillDetailInfo).length &&
      props.waybillDetailInfo.pay_media
    ) {
      let contractImgArr = [];
      props.waybillDetailInfo.pay_media.map(item => {
        contractImgArr.push({
          uid: item.media_id,
          name: '支付凭证',
          status: 'done',
          url: item.media_path,
          thumbUrl: item.media_thumb,
        });
      });
      return contractImgArr;
    }
  };
  return (
    <div>
      <Form
        form={form}
        {...layout}
        name="basic"
        initialValues={{
          remember: true,
        }}
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
        <Form.Item
          label="快捷输入"
          rules={[{ required: true, message: 'Please pick an item!' }]}
        >
          <Radio.Group>
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
          <Input />
        </Form.Item>
        <div className={styles.title_item}>
          <h2>上传回单</h2>
          <UploadImgModal
            data={{
              service_no: props.waybill_no,
              service_type: 30010,
              media_type: 61,
            }}
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
              service_no: props.waybill_no,
              service_type: 30010,
              media_type: 21,
            }}
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
              service_no: props.waybill_no,
              service_type: 30010,
              media_type: 10,
            }}
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
