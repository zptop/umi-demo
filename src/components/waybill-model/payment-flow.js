import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { formatDateYMD, accMul, accDiv } from '../../util/tools';
import { connect } from 'dva';
const namespace = 'waybill';
const mapStateToProps = state => {
  let payMentFlowList = state[namespace].payMentFlowList || [];
  return {
    payMentFlowList,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getPayinfoListFn: value => {
      dispatch({
        type: namespace + '/getPayinfoListModel',
        value,
      });
    },
  };
};
const PaymentFlow = props => {
  //初始化table状态
  const [objState, setObjState] = useState({
    pageNum: 1,
    pageSize: 10,
  });

  useEffect(() => {
    props.getPayinfoListFn({
      waybill_no: props.waybill_no,
      page: objState.pageNum,
      page_size: objState.pageSize,
      paymentrequired: props.userInfo.PAYMENTREQUIRED,
    });
  }, [props.waybill_no]);

  //走资金title
  const columns_required = [
    {
      title: '序号',
      width: 60,
    },
    {
      title: '申请单编号',
      dataIndex: 'applypay_no',
    },
    {
      title: '付款金额(元)',
      render(text, row, index) {
        let { pay_money } = row;
        pay_money = accDiv(pay_money, 100).toFixed(2);
        return <span>{pay_money}</span>;
      },
    },

    {
      title: '申请人',
      dataIndex: 'apply_man',
    },
    {
      title: '申请时间',
      align: 'center',
      render(text, row, index) {
        let { create_time } = row;
        return <span>{formatDateYMDHMS(create_time, 'year')}</span>;
      },
    },
    {
      title: '承运人',
      dataIndex: 'carrier_name',
    },
    {
      title: '收款人',
      dataIndex: 'payee_name',
    },
    {
      title: '付款类型',
      dataIndex: 'pay_type',
    },
    {
      title: '状态',
      dataIndex: 'applypay_status_desc',
    },
  ];

  //不走资金
  const columns_norequired = [
    {
      title: '序号',
      width: 60,
    },
    {
      title: '银行流水号',
      dataIndex: 'bank_order_no',
    },
    {
      title: '金额',
      dataIndex: 'pay_amount',
    },
    {
      title: '收款人',
      width: 90, 
      dataIndex: 'payee_name',
    },
    {
      title: '银行卡号',
      dataIndex: 'bank_card_no',
    },
    {
      title: '支付时间',
      width: 90, 
      dataIndex: 'pay_time_text',
    },
    {
      title: '支付方式',
      width: 90, 
      dataIndex: 'pay_style',
    },
    {
      title: '支付渠道',
      width: 120, 
      dataIndex: 'pay_channel_code_text',
    },

    {
      title: '支付凭证',
      width: 90, 
      dataIndex: '查看',
      render(text, row, index) {
        let { pay_pic_url } = row;
        return (
          <a onClick={() => props.openPreviewImg(pay_pic_url, '支付凭证')}>
            查看
          </a>
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];

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
    let params = {
      page: page,
      page_size: pageSize,
      waybill_no: props.waybill_no,
      paymentrequired: props.userInfo.PAYMENTREQUIRED,
    };
    props.getPayinfoListFn(params);
  };

  return (
    <div>
      <Table
        columns={
          props.userInfo.PAYMENTREQUIRED != 1
            ? columns_norequired
            : columns_required
        }
        dataSource={props.payMentFlowList}
        rowKey={record => `${record.waybill_no}`}
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
    </div>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(PaymentFlow);
