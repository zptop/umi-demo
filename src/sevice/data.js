// import {request} from 'umi';
import axios from '../util/api.request';

/**
 *  业务接口请求get
 * @param {*} url
 * @param {*} params
 */
export const get = (url, params) => {
    return axios.request({
        method: 'get',
        url: url,
        params: params
    })
}

/**
 *  业务接口请求post
 * @param {*} url
 * @param {*} data
 */
export const post = (url, data) => {
        if (data == null) {
            data = {};
        }
        // data['audit_man'] = auditMan
        return axios.request({
            method: 'post',
            url: url,
            data: data
        })
    }
    /**
     * 上传文件
     *
     * @param {*} file 文件
     * @param {*} data 其他数据（对象）
     * @returns
     */
export const uploadFile = (file, data) => {
    if (file == null) {
        //    throw '文件为空'
    }

    var formData = new FormData()
    formData.append('pic', file)

    if (data != null) {
        for (const key in data) {
            formData.append(key, data[key])
        }
    }

    return postWithFile('admin/Common/upload', formData);
}

/**
 * 上传文件
 *
 * @param {FormData数据} formData
 * @returns
 */
export const postWithFile = (url, formData) => {
    const requestUrl = 'api/uploadfile?path=' + url
    return axios.request({
        method: 'post',
        url: requestUrl,
        data: formData,
        nointerceptor: true
    })
}

/**
 * 上传图片
 */
export const uploadImg = (url) => {
    return axios.request({
        method: 'post',
        url: url
    })
}

/**
 * 获取字典数据
 *
 * @param {*} name
 * @returns
 */
export const getDict = (name) => {
        return axios.request({
            method: 'get',
            url: 'api/dict',
            params: {
                name
            }
        })
    }
    /**
     *
     *
     * @param {*} parent
     * @returns
     */
export const getNationalAreaChildrenList = (parent) => {
    return axios.request({
        method: 'get',
        url: 'api/getNationalAreaChildrenList',
        params: {
            parentCode: parent
        }
    })
}

/**
 *  文件下载
 *
 * @param {String} url
 * @param {Object} params
 * @returns
 */
export const downloadFile = (url, params, method = 'get') => {
    return axios.request({
        method: 'get',
        url: url,
        params: params,
        responseType: 'blob',
    });
}

/**
 *  发送验证码
 * @param {*} type
 */
export const sendSmsCode = (type, mobile) => {
    const requestUrl = '/admin/sendSmsCode'
    var data = {
        type: type,
        id: '',
        mobile: mobile
    };
    return axios.request({
        method: 'get',
        url: requestUrl,
        params: data,
    });
}

/**
 *  站点配置信息
 */
export const getSiteConfig = () => {
    return axios.request({
        method: 'get',
        url: '/admin/siteConfig',
    });
}

/**
 * 得到左边菜单栏的红色圆圈数字
 */
export const getMenuRedBadges = (url) => {
    return axios.request({
        method: 'get',
        url: url,
    });
}

/*
获取左侧菜单栏
 */
export const getApiMenuList = () => {
    return axios.request({
        method: 'get',
        url: 'system/menu_items',
    });
}

/**
 * 格式化selcet选项
 * value为100或200时为空
 */
export const formatSelectedOptions = (object) => {
    for (var key in object) {
        if (object[key] == '100' || object[key] == '200') {
            object[key] = '';
        }
    }
    return object;
}

/**
 * 没审核通过不能进入二级页面
 */
export const secondaryPage = (vm, url) => {
    vm.$Modal.confirm({
        title: "提示",
        content: "企业暂未通过认证，不能使用此功能！",
        okText: "前往认证",
        onOk: () => {
            vm.$router.push({
                name: url
            });
        }
    });
}