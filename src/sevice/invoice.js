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
        params
    })
}