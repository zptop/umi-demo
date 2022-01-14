import { Button, Table, Row, Col, Upload, Tooltip, message, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import {
  UploadOutlined,
  ExclamationCircleFilled,
  LoadingOutlined,
} from '@ant-design/icons';
import { formatDateYMDHMS } from '../../util/tools';
import { getBaseUrl } from '../../util/tools';
import { connect } from 'dva';
import styles from './index.less';
const namespace = 'waybill';
const mapStateToProps = state => {
  let { batch_loading, batchImportList, batchTtotalPage } = state[namespace];
  return {
    batch_loading,
    batchImportList,
    batchTtotalPage,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getBatchImportListFn: value => {
      dispatch({
        type: namespace + '/getBatchImportListModel',
        value,
      });
    },
  };
};

const BatchImport = props => {
  let {
    batchImportFlag,
    batch_loading,
    batchImportList,
    batchTtotalPage,
  } = props;
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isUpLoading, setIsUpLoading] = useState(false);
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const columns = [
    //批量导入title列表
    {
      title: '序号',
      width: 60,
      render: (text, record, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: '下载导入结果',
      width: 110,
      render: (text, record, index) => {
        let { import_status, log_id } = record;
        return (
          import_status == 2 && (
            <a
              href={'/excel/waybill_download?log_id=' + log_id}
              download
              target="_blank"
            >
              下载
            </a>
          )
        );
      },
    },
    {
      title: '提交人',
      width: 100,
      dataIndex: 'create_man',
    },
    {
      title: '提交时间',
      width: 150,
      render: (text, record, index) => {
        let { import_time } = record;
        return <div>{formatDateYMDHMS(import_time, 'year')}</div>;
      },
    },
    {
      title: '状态',
      width: 90,
      dataIndex: 'import_status_desc',
    },
    {
      title: '备注',
      width: 140,
      dataIndex: 'fail_reason',
    },
  ];

  useEffect(() => {
    props.getBatchImportListFn({
      import_type: 1,
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
    let params = { page: page, num: pageSize, import_type: 1 };
    props.getBatchImportListFn(params);
  };

  //导入属性
  const importProps = {
    name: 'media_file',
    action: getBaseUrl() + '/excel/waybill_import',
    headers: {
      'Access-WR-Token': localStorage.getItem('x-auth-token'),
    },
    withCredentials: true,
    accept:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
    onChange(info) {
      if (info.file.status == 'uploading') {
        setIsUpLoading(true);
      }
      if (info.file.status === 'done') {
        if (info.file.response.code != 0) {
          message.error(info.file.response.msg || '系统错误');
        } else {
          message.success(`${info.file.name}导入成功`);
          props.getBatchImportListFn({
            import_type: 1,
            page: pageNum,
            num: pageSize,
          });
        }
        setIsUpLoading(false);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 导入失败.`);
        setIsUpLoading(false);
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: percent => `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  //刷新
  const handleRefresh = () => {
    props.getBatchImportListFn({
      import_type: 1,
      page: pageNum,
      num: pageSize,
    });
  };

  return (
    <div className={styles.batch_modal}>
      {isUpLoading && <Spin indicator={antIcon} className={styles.loading} />}
      <Row className={styles.batch_import_title}>
        <Col span={6}>
          <Button type="primary" onClick={handleRefresh}>
            刷新列表
          </Button>
        </Col>
        <Col span={18}>
          <a href="/excel/waybill_template" target="_blank" download>
            下载导入文件模板（excel）
          </a>
          <Upload {...importProps}>
            <Button type="primary" icon={<UploadOutlined />}>
              导入
            </Button>
          </Upload>
          <Tooltip
            placement="right"
            title={
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    '<p>导入说明：</p>' +
                    '<p>1、每次最多导入500条数据</p>' +
                    '<p>2、推荐使用谷歌或火狐浏览器，IE系统仅支持IE10及以上</p>' +
                    '<p>3、请勿修改模板表头，并按模板说明填入数据，避免导入失败</p>' +
                    '<p>4、模板中多余的空行请删去，避免文件行数过大无法识别的情况</p>' +
                    '<p>5、导入结果最多保留一个月</p>',
                }}
              ></div>
            }
          >
            <ExclamationCircleFilled />
          </Tooltip>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={batchImportList}
        loading={batch_loading}
        rowKey={record => `${record.log_id}`}
        sticky
        pagination={{
          showQuickJumper: true,
          current: pageNum,
          pageSize: pageSize,
          pageSizeOptions: [10, 20, 50, 100],
          total: batchTtotalPage,
          onChange: pageChange,
          onShowSizeChange: onShowSizeChange,
        }}
      />
    </div>
  );
};
const memoBatchImport = React.memo(BatchImport);
export default connect(mapStateToProps, mapDispatchToProps)(memoBatchImport);
