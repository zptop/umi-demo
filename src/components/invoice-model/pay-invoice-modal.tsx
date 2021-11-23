import React, { useState } from 'react';
import { Row, Col, Modal, Button } from 'antd';
import { connect } from 'dva';
const namespace = 'invoice';

const mapStateToProps = state => {
    let { payInfoObj } = state[namespace];
    return { payInfoObj }
}

const mapDispatchToProps = dispatch => {

}

const PayInvoiceModal = props => {
    let { payInfoObj } = props;

    return (
        <>
            <span>注：累计应付税金，累计应付撮合服务费按申请单中各运单应付税金及服务费进行合计</span>
            <Row>
                <Col span={12}><span>开票申请单号</span>{payInfoObj.apply_invoiceno}</Col>
                <Col span={12}><span>创建时间</span>{payInfoObj.create_time}</Col>
                <Col span={12}><span>含税开票总金额</span>{payInfoObj.invoice_amount}</Col>
                <Col span={12}><span>累计应付税金</span>￥{payInfoObj.taxable_amount}</Col>
                <Col span={24}><span>付款优惠抵扣</span></Col>
                <Col span={24}><span>我的优惠券</span></Col>
                <Col span={24}><span>服务费开票金额</span>{payInfoObj.svrfee_invoice_desc}</Col>
                <Col span={24}><span>累计撮合服务费</span>{payInfoObj.svrfee_pay_detail}</Col>
                <Col span={24}><span>总支付金额</span>{payInfoObj.total_pay_detail}</Col>
            </Row>
        </>
    )

}

export default connect(mapStateToProps, mapDispatchToProps)(PayInvoiceModal);