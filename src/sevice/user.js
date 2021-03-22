import request from '../util/request';
/**
 * 登录
 */
export async function doLogin(data) {
    return request('/Login/dologin', {
        method: 'POST',
        data,
        requestType: 'form'
    });
};

/**
 *  检测登录状态
 */
export async function checkLogin() {
    return request('/Login/check', {
        method: 'GET'
    });
};

/**
 * 退出登录
 */
export async function logout() {
    return request('/Login/logout', {
        method: 'POST',
        requestType: 'form'
    });
};

/**
 * 注册
 */
export async function doreg(data){
    return request('/Login/doreg',{
        method:'POST',
        data,
        requestType:'form'
    })
};

/**
 * 注册页面-获取验证码
 */
export async function getCode(data) {
    return request('/Login/regsms', {
        method: 'POST',
        data,
        requestType: 'form'
    });
};