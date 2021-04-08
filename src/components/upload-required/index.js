import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Button } from 'antd';
import UploadImgModal from '../upload-img-modal';
import { connect } from 'dva';
import styles from './index.css';
const namespace = 'waybill';
const mapStateToProps = state => {
  let waybillDetailInfo = state[namespace].waybillNoInfo;
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

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">
      <span className={styles.detail_info_title}>{title}</span>
      {content}
    </p>
  </div>
);

const UploadRequired = props => {
  const [objState, setObjState] = useState({
    replyPicListShow: [], //上传回单列表
    contractPicListShow: [], //上传合同列表
  });
  useEffect(() => {
    props.getWaybillDetailFn({
      waybill_no: props.waybill_no,
    });
  }, [props.waybill_no]);

  //子组件传过来的回单图片
  const replyImgFromChild = picList => {
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

  //回单图片
  const getReplyImgArr = () => {
    let reply_media_temp = [];
    if (
      Object.keys(props.waybillDetailInfo).length > 0 &&
      props.waybillDetailInfo.reply_media.length > 0
    ) {
      props.waybillDetailInfo.reply_media.forEach(item => {
        reply_media_temp.push({
          uid: item.media_id,
          name: '回单图片',
          status: 'done',
          url: item.media_path,
          thumbUrl: item.media_thumb,
        });
      });
    }
    return [...new Set(reply_media_temp)];
  };

  //合同图片
  const getContractImgArr = () => {
    let contract_media_temp = [];
    if (
      Object.keys(props.waybillDetailInfo).length > 0 &&
      props.waybillDetailInfo.contract_media.length > 0
    ) {
      props.waybillDetailInfo.contract_media.forEach(item => {
        contract_media_temp.push({
          uid: item.media_id,
          name: '合同图片',
          status: 'done',
          url: item.media_path,
          thumbUrl: item.media_thumb,
        });
      });
    }
    return [...new Set(contract_media_temp)];
  };

  return (
    <div>
      {Object.keys(props.waybillDetailInfo).length && (
        <div>
          <Row>
            <Col span={8}>
              <DescriptionItem
                title="承运人"
                content={props.waybillDetailInfo.carrier_name}
              />
            </Col>
            <Col span={8}>
              <DescriptionItem
                title="车牌号/船名"
                content={props.waybillDetailInfo.trans_vehicle_name}
              />
            </Col>
            <Col span={8}>
              <DescriptionItem
                title="驾驶员"
                content={props.waybillDetailInfo.transport_name}
              />
            </Col>
          </Row>
          <div className={styles.title_item}>
            <h2>上传回单</h2>
            <UploadImgModal
              data={{
                service_no: props.waybillDetailInfo.waybill_no,
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
                service_no: props.waybillDetailInfo.waybill_no,
                service_type: 30010,
                media_type: 21,
              }}
              picListShow={getContractImgArr()}
              delPicUrl="waybill/delpic"
              flag="contractImg"
              contractImg={contractImgFromChild}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadRequired);
