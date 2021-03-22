import React from 'react';
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
    getWaybillDetailFn: value => {
      dispatch({
        type: namespace + '/getWaybillDetailModel',
        value,
      });
    },
  };
};
const PaymentFlowRequired = props => {
  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={record => `${record.waybill_no}`}
      />
    </div>
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentFlowRequired);
