import React, { useState, useEffect } from 'react';
import { Button, Upload, Modal, message, Image } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import { getBaseUrl } from '../../util/tools';
import { connect } from 'dva';
const namespace = 'waybill';
const mapDispatchToProps = dispatch => {
  return {
    delImgFromWaybillFn: value => {
      dispatch({
        type: namespace + '/delImgFromWaybillModel',
        value,
      });
    },
  };
};

const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

const UploadImgModal = props => {
  const [objState, setObjState] = useState({
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [],
  });

  useEffect(() => {
    if (props && props.picListShow && props.picListShow.length) {
      setObjState({
        ...objState,
        previewVisible: false,
        fileList: props.picListShow,
      });
    }
  }, [props.data.service_no]);

  const handleCancel = () =>
    setObjState({ ...objState, previewVisible: false });

  //预览
  const handlePreview = async file => {
    let url;
    if (file.url) {
      url = file.url;
    }
    if (file.response) {
      url = file.response.data.media_path;
    }
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setObjState({
      ...objState,
      // previewImage: file.url || file.preview,
      previewImage: url,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  //上传
  const handleChange = ({ fileList }) => {
    if (fileList.length > 0) {
      let picList = fileList.map(item => {
        if (item.response) {
          return item.response.data;
        }
      });
      props[props.flag](picList); //子组件通过函数传值到父组件
    }
    setObjState({ ...objState, fileList });
  };

  //删除
  const handleonRemove = file => {
    if (props.delPicUrl == 'waybill/delpic') {
      //删除运单图片
      if (file && file.response && file.response.data) {
        let { media_id } = file.response.data;
        props.delImgFromWaybillFn({ media_id });
      }
    } else {
      //删除车辆图片
    }
  };

  //上传之前钩子
  const beforeUpload = file => {
    return new Promise((resolve, reject) => {
      let suff = /\.[^\.]+$/.exec(file.name)[0];
      if (!/(\.jpeg|\.png|\.jpg|\.pdf)/i.test(suff)) {
        message.warning('文件格式不正确');
        return reject(false);
      }
      return resolve(true);
    });
  };

  const { previewVisible, previewImage, fileList, previewTitle } = objState;

  const uploadButton = (
    <div>
      <CloudUploadOutlined style={{ fontSize: '20px' }} />
      <div style={{ fontSize: '12px' }}>上传</div>
    </div>
  );

  return (
    <div>
      <Upload
        action={getBaseUrl() + '/waybill/addpic'}
        name="media_file"
        withCredentials={true}
        listType="picture-card"
        data={props.data}
        fileList={fileList}
        headers={{ 'Access-WR-Token': localStorage.getItem('x-auth-token') }}
        beforeUpload={beforeUpload}
        onPreview={handlePreview}
        onRemove={handleonRemove}
        onChange={handleChange}
        accept="image/*,.pdf"
      >
        {fileList.length >= 9 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={[
          <Button key="关闭" onClick={handleCancel}>
            关闭
          </Button>,
        ]}
        onCancel={handleCancel}
      >
        {/* <img alt="example" style={{ width: '100%' }} src={previewImage} /> */}
        <Image
          style={{ width: '100%', cursor: 'pointer' }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
};

export default connect(null, mapDispatchToProps)(UploadImgModal);
