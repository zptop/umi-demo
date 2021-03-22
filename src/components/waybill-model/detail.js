import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Tabs, Button, Image } from 'antd';
import { formatDateYMD, accMul, accDiv } from '../../util/tools';
const { TabPane } = Tabs;
import { connect } from 'dva';
import styles from './index.less';
import { createFromIconfontCN } from '@ant-design/icons';
const IconFont = createFromIconfontCN({
  scriptUrl: ['//at.alicdn.com/t/font_1595958_p5529b5fjfr.js'],
});
const namespace = 'waybill';
const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">
      <span className={styles.detail_info_title}>{title}</span>
      {content}
    </p>
  </div>
);
const mapStateToProps = state => {
  let waybillDetailInfo = state[namespace].waybillNoInfo || {};
  return {
    waybillDetailInfo,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getWaybillDetailFn: value => {
      //运单详情
      dispatch({
        type: namespace + '/getWaybillDetailModel',
        value,
      });
    },
  };
};
const Details = props => {
  const [isShowMoreImg, setIsShowMoreImg] = useState(false);
  const [showMoreImgArr, setShowMoreImgArr] = useState([]);
  const [show, setShow] = useState(true);
  const [imgTitle, setImgTitle] = useState('');
  useEffect(() => {
    props.getWaybillDetailFn({ waybill_no: props.waybill_no });
  }, [props.waybill_no]);

  //打开多图modal
  const openPreviewImg = (imgArr, title) => {
    setIsShowMoreImg(true);
    setShowMoreImgArr(imgArr);
    setImgTitle(title);
  };

  //渲染多图列表
  const renderMoreImgList = imgList => {
    return imgList.map(item => {
      if (/\.(jpg|jpeg|png|bmp|BMP|JPG|PNG|JPEG)$/.test(item)) {
        return <Image width={70} src={item} key={item} />;
      } else {
        return (
          <a href={item} target="_blank">
            <img
              src={
                /\pdf/gi.test(item)
                  ? require('../../assets/pdf.png')
                  : require('../../assets/defaul-img.png')
              }
            />
          </a>
        );
      }
    });
  };

  //关闭图片弹框
  const closeShowMoreImg = () => {
    setIsShowMoreImg(false);
  };

  return (
    <>
      <Row>
        <Col span={8} className={styles.detail_col_8}>
          <DescriptionItem
            title="运单编号"
            content={props.waybillDetailInfo.waybill_no}
          />
        </Col>
        <Col span={8} className={styles.detail_col_8}>
          <DescriptionItem
            title="承运信息"
            content={
              props.waybillDetailInfo.carrier_name +
              '' +
              props.waybillDetailInfo.carrier_mobile
            }
          />
        </Col>
        <Col span={8} className={styles.detail_col_8}>
          <DescriptionItem
            title="创建人"
            content={props.waybillDetailInfo.waybill_founder}
          />
        </Col>
      </Row>
      <Row>
        <Col span={8} className={styles.detail_col_8}>
          <DescriptionItem
            title="创建时间"
            content={formatDateYMD(props.waybillDetailInfo.create_time)}
          />
        </Col>
        <Col span={16} className={styles.detail_col_16}>
          <DescriptionItem
            title="开票申请单号"
            content={props.waybillDetailInfo.apply_invoiceno || '暂无'}
          />
          {props.waybillDetailInfo.pending_status_desc && (
            <span className={styles.error_span}>
              {props.waybillDetailInfo.pending_status_desc}
            </span>
          )}
        </Col>
      </Row>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <IconFont type="iconjibenxinxi" />
              基本信息
            </span>
          }
          key="1"
        >
          {Object.keys(props.waybillDetailInfo).length &&
            props.waybillDetailInfo.ticket_info.invoice_no && (
              <div>
                <p className={styles.split_line}>发票信息</p>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="发票号码"
                      content={props.waybillDetailInfo.ticket_info.invoice_no}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="发票日期"
                      content={formatDateYMD(
                        props.waybillDetailInfo.ticket_info.make_invoice_time,
                      )}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <DescriptionItem
                      title="发票代码"
                      content={props.waybillDetailInfo.ticket_info.invoice_code}
                    />
                  </Col>
                </Row>
              </div>
            )}
          <p className={styles.split_line}>货物信息</p>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title="货物名称"
                content={props.waybillDetailInfo.goods_name}
              />
            </Col>
            <Col span={12}>
              <DescriptionItem
                title="货物大类"
                content={props.waybillDetailInfo.goods_type_desc}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <DescriptionItem
                title="货物重量"
                content={
                  props.waybillDetailInfo.goods_num / 1000 +
                  props.waybillDetailInfo.goods_unit_desc
                }
              />
            </Col>
          </Row>
          <p className={styles.split_line}>收发货信息</p>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title="货物起运时间"
                content={formatDateYMD(props.waybillDetailInfo.load_time)}
              />
            </Col>
            <Col span={12}>
              <DescriptionItem
                title="货物到达时间"
                content={formatDateYMD(props.waybillDetailInfo.unload_time)}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <DescriptionItem
                title="货物起运地"
                content={
                  props.waybillDetailInfo.load_place_desc +
                  props.waybillDetailInfo.load_place_detail
                }
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <DescriptionItem
                title="货物到达地"
                content={
                  props.waybillDetailInfo.unload_place_desc +
                  props.waybillDetailInfo.unload_place_detail
                }
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <DescriptionItem
                title="收货方"
                content={
                  props.waybillDetailInfo.consi_name +
                  props.waybillDetailInfo.consi_contact_mobile
                }
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <DescriptionItem
                title="备注"
                content={props.waybillDetailInfo.remark}
              />
            </Col>
          </Row>
          <p className={styles.split_line}>费用信息</p>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title="运输劳务费(元)"
                content={(props.waybillDetailInfo.labour_amount / 100).toFixed(
                  2,
                )}
              />
            </Col>
            <Col span={12}>
              <DescriptionItem
                title="加油/气费(元)"
                content={props.waybillDetailInfo.oil_gas_fee_amount_desc}
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title="过路/过桥费(元)"
                content={props.waybillDetailInfo.road_fee_amount_desc}
              />
            </Col>
            <Col span={12}>
              <DescriptionItem
                title="其它费用(元)"
                content={props.waybillDetailInfo.other_fee_amount_desc}
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title="合同金额(元)"
                content={(props.waybillDetailInfo.waybill_amount / 100).toFixed(
                  2,
                )}
              />
            </Col>
            <Col span={12}>
              <DescriptionItem
                title="含税开票金额(元)"
                content={(props.waybillDetailInfo.invoice_amount / 100).toFixed(
                  2,
                )}
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title="撮合服务费(元)"
                content={(props.waybillDetailInfo.svr_fee / 100).toFixed(2)}
              />
            </Col>
            <Col span={12}>
              <DescriptionItem
                title="支付方式"
                content={props.waybillDetailInfo.pay_style_desc || '无'}
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title="支付渠道"
                content={props.waybillDetailInfo.pay_channel_desc || '无'}
              />
            </Col>
            <Col span={12}>
              <DescriptionItem
                title="银行支付凭证"
                content={
                  props.waybillDetailInfo.pay_media &&
                  props.waybillDetailInfo.pay_media.length > 0 ? (
                    <a
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        openPreviewImg(
                          props.waybillDetailInfo.pay_media.map(
                            item => item.media_path,
                          ),
                          '银行支付凭证',
                        )
                      }
                    >
                      查看
                    </a>
                  ) : (
                    '暂无图片'
                  )
                }
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title="运输合同"
                content={
                  props.waybillDetailInfo.contract_media &&
                  props.waybillDetailInfo.contract_media.length > 0 ? (
                    <a
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        openPreviewImg(
                          props.waybillDetailInfo.contract_media.map(
                            item => item.media_path,
                          ),
                          '运输合同',
                        )
                      }
                    >
                      查看
                    </a>
                  ) : (
                    '暂无图片'
                  )
                }
              />
            </Col>
            <Col span={12}>
              <DescriptionItem
                title="回单图片"
                content={
                  props.waybillDetailInfo.reply_media &&
                  props.waybillDetailInfo.reply_media.length > 0 ? (
                    <a
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        openPreviewImg(
                          props.waybillDetailInfo.reply_media.map(
                            item => item.media_path,
                          ),
                          '回单图片',
                        )
                      }
                    >
                      查看
                    </a>
                  ) : (
                    '暂无图片'
                  )
                }
              />
            </Col>
          </Row>
        </TabPane>
        {props.waybillDetailInfo.transport_type == 1 ? (
          <TabPane
            tab={
              <span>
                <IconFont type="iconcheliangxinxi" />
                车辆信息
              </span>
            }
            key="2"
          >
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="车牌号"
                  content={props.waybillDetailInfo.trans_vehicle_name}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="驾驶员"
                  content={props.waybillDetailInfo.driver_name}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="联系方式"
                  content={props.waybillDetailInfo.driver_mobile}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="长宽高"
                  content={
                    Object.keys(props.waybillDetailInfo).length &&
                    Object.keys(props.waybillDetailInfo.vehicle_info).length &&
                    props.waybillDetailInfo.vehicle_info.vehicle_length / 1000 +
                      'm*' +
                      props.waybillDetailInfo.vehicle_info.vehicle_width /
                        1000 +
                      'm*' +
                      props.waybillDetailInfo.vehicle_info.vehicle_height /
                        1000 +
                      'm'
                  }
                />
              </Col>
              {Object.keys(props.waybillDetailInfo).length && (
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="整备质量(吨)"
                      content={
                        Object.keys(props.waybillDetailInfo.vehicle_info)
                          .length &&
                        props.waybillDetailInfo.vehicle_info
                          .vehicle_laden_weight / 1000
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="核定载牵引质量(吨)"
                      content={
                        Object.keys(props.waybillDetailInfo.vehicle_info)
                          .length &&
                        props.waybillDetailInfo.vehicle_info.vehicle_tonnage /
                          1000
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="车辆总质量类型"
                      content={
                        Object.keys(props.waybillDetailInfo.vehicle_info)
                          .length &&
                        props.waybillDetailInfo.vehicle_info
                          .vehicle_weight_type == 0
                          ? '4.5吨以上'
                          : '4.5吨以下'
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="身份证正面"
                      content={
                        Object.keys(props.waybillDetailInfo.driver).length &&
                        props.waybillDetailInfo.driver.id_pic1.split(',')
                          .length > 0 ? (
                          <a
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                              openPreviewImg(
                                props.waybillDetailInfo.driver.id_pic1.split(
                                  ',',
                                ),
                                '身份证正面',
                              )
                            }
                          >
                            查看
                          </a>
                        ) : (
                          '暂无图片'
                        )
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="身份证反面"
                      content={
                        Object.keys(props.waybillDetailInfo.driver).length &&
                        props.waybillDetailInfo.driver.id_pic2.split(',')
                          .length > 0 ? (
                          <a
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                              openPreviewImg(
                                props.waybillDetailInfo.driver.id_pic2.split(
                                  ',',
                                ),
                                '身份证反面',
                              )
                            }
                          >
                            查看
                          </a>
                        ) : (
                          '暂无图片'
                        )
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="驾驶证"
                      content={
                        Object.keys(props.waybillDetailInfo.driver).length &&
                        props.waybillDetailInfo.driver.driver_lic_pic.split(',')
                          .length > 0 ? (
                          <a
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                              openPreviewImg(
                                props.waybillDetailInfo.driver.driver_lic_pic.split(
                                  ',',
                                ),
                                '驾驶证',
                              )
                            }
                          >
                            查看
                          </a>
                        ) : (
                          '暂无图片'
                        )
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="行驶证"
                      content={
                        Object.keys(props.waybillDetailInfo.vehicle_info)
                          .length &&
                        props.waybillDetailInfo.vehicle_info.driving_license.split(
                          ',',
                        ).length > 0 ? (
                          <a
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                              openPreviewImg(
                                props.waybillDetailInfo.vehicle_info.driving_license.split(
                                  ',',
                                ),
                                '行驶证',
                              )
                            }
                          >
                            查看
                          </a>
                        ) : (
                          '暂无图片'
                        )
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="道路运输证"
                      content={
                        Object.keys(props.waybillDetailInfo.vehicle_info)
                          .length &&
                        props.waybillDetailInfo.vehicle_info.road_trans_cert_pic.split(
                          ',',
                        ).length > 0 ? (
                          <a
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                              openPreviewImg(
                                props.waybillDetailInfo.vehicle_info.road_trans_cert_pic.split(
                                  ',',
                                ),
                                '道路运输证',
                              )
                            }
                          >
                            查看
                          </a>
                        ) : (
                          '暂无图片'
                        )
                      }
                    />
                  </Col>
                </Row>
              )}
            </Row>
          </TabPane>
        ) : (
          <TabPane
            tab={
              <span>
                <IconFont type="iconchuanboxinxi" />
                船舶信息
              </span>
            }
            key="2"
          >
            {Object.keys(props.waybillDetailInfo).length &&
            Object.keys(props.waybillDetailInfo.ship_info).length ? (
              <Row>
                <Col span={12}>
                  <DescriptionItem
                    title="船舶名称"
                    content={props.waybillDetailInfo.trans_vehicle_name}
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="载重吨位(吨)"
                    content={props.waybillDetailInfo.ship_info.total_ton || ''}
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="所有权证/国籍证"
                    content={
                      props.waybillDetailInfo.ship_info.media_91.length > 0 ? (
                        <a
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            openPreviewImg(
                              props.waybillDetailInfo.ship_info.media_91,
                              '所有权证/国籍证',
                            )
                          }
                        >
                          查看
                        </a>
                      ) : (
                        '暂无图片'
                      )
                    }
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="年审合格证"
                    content={
                      props.waybillDetailInfo.ship_info.media_93.length > 0 ? (
                        <a
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            openPreviewImg(
                              props.waybillDetailInfo.ship_info.media_93,
                              '年审合格证',
                            )
                          }
                        >
                          查看
                        </a>
                      ) : (
                        '暂无图片'
                      )
                    }
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="营运证"
                    content={
                      props.waybillDetailInfo.ship_info.media_94.length > 0 ? (
                        <a
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            openPreviewImg(
                              props.waybillDetailInfo.ship_info.media_94,
                              '营运证',
                            )
                          }
                        >
                          查看
                        </a>
                      ) : (
                        '暂无图片'
                      )
                    }
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="所有人身份证正面"
                    content={
                      props.waybillDetailInfo.ship_info.media_101.length > 0 ? (
                        <a
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            openPreviewImg(
                              props.waybillDetailInfo.ship_info.media_101,
                              '所有人身份证正面',
                            )
                          }
                        >
                          查看
                        </a>
                      ) : (
                        '暂无图片'
                      )
                    }
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="所有人身份证反面"
                    content={
                      props.waybillDetailInfo.ship_info.media_102.length > 0 ? (
                        <a
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            openPreviewImg(
                              props.waybillDetailInfo.ship_info.media_102,
                              '所有人身份证反面',
                            )
                          }
                        >
                          查看
                        </a>
                      ) : (
                        '暂无图片'
                      )
                    }
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="产权协议"
                    content={
                      Object.keys(props.waybillDetailInfo.vehicle_info)
                        .length &&
                      props.waybillDetailInfo.ship_info.media_95.length > 0 ? (
                        <a
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            openPreviewImg(
                              props.waybillDetailInfo.ship_info.media_95,
                              '产权协议',
                            )
                          }
                        >
                          查看
                        </a>
                      ) : (
                        '暂无图片'
                      )
                    }
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="协议签订人身份证正面"
                    content={
                      props.waybillDetailInfo.ship_info.media_111.length > 0 ? (
                        <a
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            openPreviewImg(
                              props.waybillDetailInfo.ship_info.media_111,
                              '协议签订人身份证正面',
                            )
                          }
                        >
                          查看
                        </a>
                      ) : (
                        '暂无图片'
                      )
                    }
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="协议签订人身份证反面"
                    content={
                      props.waybillDetailInfo.ship_info.media_112.length > 0 ? (
                        <a
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            openPreviewImg(
                              props.waybillDetailInfo.ship_info.media_112,
                              '协议签订人身份证反面',
                            )
                          }
                        >
                          查看
                        </a>
                      ) : (
                        '暂无图片'
                      )
                    }
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="其它相关证照"
                    content={
                      props.waybillDetailInfo.ship_info.media_96.length > 0 ? (
                        <a
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            openPreviewImg(
                              props.waybillDetailInfo.ship_info.media_96,
                              '其它相关证照',
                            )
                          }
                        >
                          查看
                        </a>
                      ) : (
                        '暂无图片'
                      )
                    }
                  />
                </Col>
              </Row>
            ) : (
              <img
                className={styles.no_info}
                src={require('../../assets/no-info.png')}
                width="100"
                height="100"
              />
            )}
          </TabPane>
        )}
        <TabPane
          tab={
            <span>
              <IconFont type="iconjibenxinxi" />
              付款信息
            </span>
          }
          key="3"
        ></TabPane>
      </Tabs>
      <Modal
        title={imgTitle}
        visible={isShowMoreImg}
        onOk={closeShowMoreImg}
        onCancel={closeShowMoreImg}
        footer={[<Button key="确定" onClick={closeShowMoreImg}></Button>]}
      >
        <div className={styles.img_list}>
          {renderMoreImgList(showMoreImgArr)}
        </div>
      </Modal>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Details);
