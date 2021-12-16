import React, { useState, useEffect } from "react";
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
} from 'antd';
import {
    RetweetOutlined,
    DownOutlined,
    DownloadOutlined,
    ExclamationCircleFilled,
    QuestionCircleOutlined,
    CloseCircleOutlined,
    WarningOutlined,
    CloudSyncOutlined,
  } from '@ant-design/icons';
import styles from './index.less';
import { useHistory } from 'umi';
import { connect } from 'dva';
const namespace = 'invoice';

const mapStateToProps = state => {
    let { applyTitleInfo, invoiceDetailList,totalPageDetail,loadingDetail } = state[namespace];
    return { applyTitleInfo, invoiceDetailList,totalPageDetail,loadingDetail }
}

const mapDispatchToProps = dispatch => {
    return {
        getInvoiceGetInfoFn: value => {
            dispatch({
                type: namespace + '/getInvoiceGetInfoModel',
                value
            })
        },
        getInvoicewaybillModelFn: value => {
            dispatch({
                type: namespace + '/getInvoicewaybillModel',
                value
            })
        }
    }
}

const DescriptionItem = ({ title, content }) => (
    <div className="site-description-item-profile-wrapper">
        <p className="site-description-item-profile-p-label">
            <span className={styles.detail_info_title}>{title}</span>
            {content}
        </p>
    </div>
);


const Detail = props => {
    const history = useHistory()
    let invoice_id = history.location.query.invoice_id;

    //表格初始化状态
    const [objState, setObjState] = useState({
        pageNum: 1,
        pageSize: 10,
    });

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
        let params = { page: page, num: pageSize, invoice_id };
        props.getInvoicewaybillModelFn({ params });
    };


    useEffect(() => {
        props.getInvoiceGetInfoFn({ invoice_id });
        props.getInvoicewaybillModelFn({ invoice_id });
    }, [invoice_id])

    const columns = [
        {
            type: "index",
            title: "序号",
            width: 40,
            align: "center",
        },
        {
            title: "操作",
            width: 254,
            align: "center",
        },
        {
            title: "运单编号",
            width: 140,
            dataIndex: "waybill_no",
        },
        {
            title: "审核状态",
            width: 100,
            dataIndex: "pending_status_desc",
            slot: "action3",
        },
        {
            title: "货物名称",
            width: 100,
            dataIndex: "goods_name",
        },
        {
            title: "承运人",
            width: 100,
            render(text, row, index) {
                let { carrier_ticket_limit, carrier_name } = row;
                // let num = localRead("month_carrier_waybill_limit");
                let tooltip = (
                    <Tooltip placement="right" title={'此承运人本月开票申请达到张， 本月无法开票， 请下月1日再进行开票申请'}>
                        < ExclamationCircleFilled />
                    </Tooltip >

                );
                return (
                    <div>
                        <span style={{ verticalAlign: "middle" }}>
                            {carrier_name}
                        </span>
                        {carrier_ticket_limit == 1 && tooltip}
                    </div>
                );
            },
        },
        {
            title: "车牌号",
            width: 100,
            dataIndex: "trans_vehicle_name",
        },
        {
            title: "提货时间",
            width: 100,
            dataIndex: "load_time",
        },
        {
            title: "到货时间",
            width: 100,
            dataIndex: "unload_time",
        },
        {
            title: "运费(元)",
            width: 100,
            dataIndex: "labour_amount",
        },
        {
            title: "含税开票总金额(元)",
            width: 120,
            dataIndex: "invoice_amount",
        },
        {
            title: "撮合服务费(元)",
            width: 100,
            dataIndex: "svr_fee",
        },
        {
            title: "应付税金",
            width: 100,
            dataIndex: "taxable_amount",
        },
        {
            title: "发票状态",
            width: 100,
            dataIndex: "invoice_status_text",
        },
    ];

    return (
        <>
            <Row>
                <Col span={6}>
                    <DescriptionItem
                        title="开票申请单号"
                        content={props.applyTitleInfo.apply_invoiceno}
                    />
                </Col>
                <Col span={6}>
                    <DescriptionItem
                        title="创建时间"
                        content={props.applyTitleInfo.create_time}
                    />
                </Col>
                <Col span={6}>
                    <DescriptionItem
                        title="累计应付税金"
                        content={props.applyTitleInfo.taxable_amount}
                    />
                </Col>
                <Col span={6}>
                    <DescriptionItem
                        title="累计撮合服务费"
                        content={props.applyTitleInfo.svr_fee_text}
                    />
                </Col>
                <Col span={6}>
                    <DescriptionItem
                        title="含税开票总金额"
                        content={props.applyTitleInfo.invoice_amount}
                    />
                </Col>
                <Col span={6}>
                    <DescriptionItem
                        title="状态"
                        content={props.applyTitleInfo.invoiceStatusText}
                    />
                </Col>
                <Col span={6}>
                    <DescriptionItem
                        title="已开发票"
                        content={props.applyTitleInfo.ticket_success}
                    />
                </Col>
                <Col span={6}>
                    <DescriptionItem
                        title="未开发票"
                        content={props.applyTitleInfo.ticket_wait}
                    />
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={props.invoiceDetailList}
                loading={props.loadingDetail}
                rowKey={record => `${record.waybill_no}`}
                scroll={{ x: 2100 }}
                sticky
                pagination={{
                    showQuickJumper: true,
                    current: objState.pageNum,
                    pageSize: objState.pageSize,
                    pageSizeOptions: [10, 20, 50, 100],
                    total: props.totalPageDetail,
                    onChange: pageChange,
                    onShowSizeChange: onShowSizeChange,
                }}
            />
        </>
    )
}
export default connect(mapStateToProps, mapDispatchToProps)(Detail);