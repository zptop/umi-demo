import { Button, Table, Row, Col, Upload, Tooltip, message, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import {
  UploadOutlined,
  ExclamationCircleFilled,
  LoadingOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import download from "ly-downloader";
import { formatDateYMDHMS } from '../../util/tools';
import { getBaseUrl } from '../../util/tools';
import { connect } from 'dva';
import styles from './index.less';
const namespace = 'waybill';
const mapStateToProps = state => {
  let { export_loading, exportImportList, exportTtotalPage } = state[namespace];
  return {
    export_loading,
    exportImportList,
    exportTtotalPage,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getExportListFn: value => {
      dispatch({
        type: namespace + '/getExoprtModel',
        value,
      });
    },
  };
};

const ExportList = props => {
  let {
    export_loading,
    exportImportList,
    exportTtotalPage,
    exportWaybillType,
  } = props;
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const columns = [
    {
      title: '提交人',
      dataIndex: 'create_man',
      width: 100,
    },
    {
      title: '提交时间',
      dataIndex: 'create_time_desc',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '结果',
      align: 'center',
      render(text, record, index) {
        let { export_status, saved_num, total_num, id } = record;
        if (export_status == 1) {
          return (
            <div>
              {'正在生成Excel，完成即可下载' +
                (parseInt((saved_num / total_num) * 100) + '%')}
            </div>
          );
        } else if (export_status == 2) {
          return (
            <div
              style={{ cursor: 'pointer' }}
              onClick={() =>
                download(1, 'Export/download_export_file?id=' + id, '')
              }
            >
              下载Excel
            </div>
          );
        } else if (export_status == 3) {
          return <div>生成Excel失败，请重新导出</div>;
        } else {
          return <div>已创建</div>;
        }
      },
    },
  ];

  useEffect(() => {
    props.getExportListFn({
      export_type: exportWaybillType,
      page: pageNum,
      num: pageSize,
    });
  }, []);

  //pageSize 变化的回调
  const onShowSizeChange = (current, pageSize) => {
    setPageNum(current);
    setPageSize(pageSize);
  };

  //分页
  const pageChange = (page, pageSize) => {
    setPageNum(page);
    setPageSize(pageSize);
    let params = { page: page, num: pageSize, export_type: exportWaybillType };
    props.getExportListFn(params);
  };

  //刷新
  const handleRefresh = () => {
    props.getExportListFn({
      export_type: exportWaybillType,
      page: pageNum,
      num: pageSize,
    });
  };

  return (
    <div className={styles.batch_modal}>
      <Row className={styles.batch_import_title}>
        <Col span={20}>
          <div>
            <h3>导出规则</h3>
          </div>
          <div>
            1.为避免文件过大无法打开文件，导出的Excel数据不可超过5万条。
          </div>
          <div>2.导出数据保留30天，过期自动删除，请及时下载。</div>
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            onClick={handleRefresh}
            icon={<RedoOutlined />}
          >
            刷新
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={exportImportList}
        loading={export_loading}
        rowKey={record => `${record.id}`}
        sticky
        pagination={{
          showQuickJumper: true,
          current: pageNum,
          pageSize: pageSize,
          pageSizeOptions: [10, 20, 50, 100],
          total: exportTtotalPage,
          onChange: pageChange,
          onShowSizeChange: onShowSizeChange,
        }}
      />
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(ExportList));
