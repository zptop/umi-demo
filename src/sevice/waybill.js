import request from '../util/request';
/**
 * 获取运单列表
 */
export async function getWaybillList(params, url) {
  return request(url, {
    method: 'GET',
    params,
  });
}

/**
 * 删除运单列表
 */
export async function delwaybill(params) {
  return request('/waybill/delwaybill', {
    method: 'GET',
    params,
  });
}

/**
 * 新增运单
 */
export async function submitForm(data, url) {
  return request(url, {
    method: 'POST',
    data,
    requestType: 'form',
  });
}

/**
 * 编辑 获取运单详情
 */
export async function getWaybillDetail(params) {
  return request('/waybill/get_info', {
    method: 'GET',
    params,
  });
}

/**
 * 运单详情--支付流水或付款信息列表
 */
export async function getPayinfoList(params, url) {
  return request(url, {
    method: 'GET',
    params,
  });
}

/**
 * 常用线路
 */
export async function getCommonInfo(params) {
  return request('/waybill/myinfo', {
    method: 'GET',
    params,
  });
}

/**
 * 通过手机号搜索设定承运人
 */
export async function getSearchFromMobile(params) {
  return request('/waybill/searchcarrier', {
    method: 'GET',
    params,
  });
}

/**
 * 新增收款人
 */
export async function getAddNewPayer(params) {
  return request('/waybill/searchnewpayee', {
    method: 'GET',
    params,
  });
}

/**
 * 添加额外收款人信息
 */
export async function addpayee(data) {
  return request('/waybill/addpayee', {
    method: 'POST',
    data,
    requestType: 'form',
  });
}

/**
 * 初始化额外收款人列表
 */
export async function getPayeeList(params) {
  return request('/waybill/payee_list', {
    method: 'GET',
    params,
  });
}

/**
 * 删除新增额外收款人
 */
export async function getRemovePayee(params) {
  return request('/waybill/delpayee', {
    method: 'GET',
    params,
  });
}

/**
 * 判断是否绑定银行卡接口
 */
export async function isPayToBank(data) {
  return request('/apply/checkcard', {
    method: 'POST',
    data,
    requestType: 'form',
  });
}

/**
 * 提交批量付款
 */
export async function subPayMore(data) {
  return request('/apply/batchnew', {
    method: 'POST',
    data,
    requestType: 'form',
  });
}

/**
 * 获取钱包余额
 */
export async function getWallet(params) {
  return request('/wallet/get_wallet', {
    method: 'GET',
    params,
  });
}

/**
 * 获取批量付款短信验证码
 */
export async function getSmsCode(params) {
  return request('/wallet/get_wallet', {
    method: 'GET',
    params,
  });
}
