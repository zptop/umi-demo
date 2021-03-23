import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Button } from 'antd';
import UploadImgModal from '../upload-img-modal';
import { connect } from 'dva';
import styles from './index.css';
const namespace = 'waybill';
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

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">
      <span className={styles.detail_info_title}>{title}</span>
      {content}
    </p>
  </div>
);

const UploadRequired = props => {
  useEffect(() => {
    props.getWaybillDetailFn({
      waybill_no: props.waybill_no,
    });
  }, [props.waybill_no]);

  return (
    <div>
      {Object.keys(props.waybillDetailInfo).length && (
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
      )}
      <div className={styles.title_item}>
        <h2>上传回单</h2>
        <UploadImgModal
          data={{
            service_no: props.waybill_no,
            service_type: 30010,
            media_type: 61,
          }}
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
        />
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadRequired);
