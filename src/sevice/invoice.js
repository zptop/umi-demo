import request from '../util/request';

/**获取发票列表 */
export async function getInvoiceList(params, url) {
  return request(url, {
    method: 'GET',
    params,
  });
}

/**获取支付税金信息 */
export async function getInvoicePayInfo(params) {
  return request('/invoice/pay_info', {
    method: 'GET',
    params,
  });
}

/*发票申请详情列表*/
export async function getInvoicewaybill(params) {
  return request('/invoice/invoicewaybill', {
    method: 'GET',
    params,
  });
}

/*获取支付税金详情信息*/
export async function getInvoiceGetInfo(params) {
  return request('/invoice/get_info', {
    method: 'GET',
    params,
  });
}

/*运单详情行操作-移除 */
export async function removewaybill(params) {
  return request('/invoice/removewaybill', {
    method: 'GET',
    params,
  });
}
