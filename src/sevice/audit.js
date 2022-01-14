import request from '../util/request';

/**获取发票列表 */
export async function paymentRequestList(params, url) {
  return request(url, {
    method: 'GET',
    params,
  });
}
