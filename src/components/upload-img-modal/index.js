import React, { useState, useEffect } from 'react';
import { Upload, Modal, message } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import { getBaseUrl } from '../../util/tools';
const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

const UploadRequired = props => {
  const [objState, setObjState] = useState({
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [],
  });

  const handleCancel = () =>
    setObjState({ ...objState, previewVisible: false });

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setObjState({
      ...objState,
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };
  const handleChange = ({ fileList }) => setObjState({ ...objState, fileList });
  const { previewVisible, previewImage, fileList, previewTitle } = objState;

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
        withCredentials={true}
        listType="picture-card"
        data={props.data}
        fileList={fileList}
        headers={{ 'Access-WR-Token': localStorage.getItem('x-auth-token') }}
        beforeUpload={beforeUpload}
        onPreview={handlePreview}
        onChange={handleChange}
        accept="image/*,.pdf"
      >
        {fileList.length >= 9 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default UploadRequired;
