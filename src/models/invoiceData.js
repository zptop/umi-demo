import {
  getInvoiceList,
  getInvoicePayInfo,
  getInvoicewaybill,
  getInvoiceGetInfo,
  removewaybill,
  waybilloutexport,
} from '../sevice/invoice';
import { message } from 'antd';
import { formatDateYMDHMS, accDiv } from '../util/tools';

export default {
  namespace: 'invoice',
  state: {
    invoiceList: [],
    loading: false, //列表加载状态
    totalPage: 0, //总页数
    payInfoObj: {}, //支付信息,
    applyTitleInfo: {}, //发票申请详情信息
    invoiceDetailList: [], //发票申请详情列表
    totalPageDetail: 0, //发票详情列表总页数
    loadingDetail: false, //发票详情loading
  },
  //同步方法
  reducers: {
    //设置列表
    setInvoiceList(state, action) {
      return {
        ...state,
        invoiceList: action.payload.data,
        totalPage: action.payload.total,
      };
    },
    setLoadingTrue(state) {
      return {
        ...state,
        loading: true,
      };
    },
    setLoadingFalse(state) {
      return {
        ...state,
        loading: false,
      };
    },
    setPayInfoObj(state, action) {
      return {
        ...state,
        payInfoObj: action.payload,
      };
    },
    //发票申请详情信息
    setInvoiceGetInfo(state, action) {
      return {
        ...state,
        applyTitleInfo: action.payload,
      };
    },
    //设置发票申请详情列表
    setInvoicewaybill(state, action) {
      return {
        ...state,
        invoiceDetailList: action.payload.data,
        totalPageDetail: action.payload.total * 1,
      };
    },
    setLoadingDetail(state, action) {
      return {
        ...state,
        loadingDetail: action.payload,
      };
    },
  },
  //异步方法
  effects: {
    //获取发票列表
    *getInvoiceListModel({ value }, { call, put }) {
      yield put({ type: 'setLoadingTrue' });
      const res = yield call(getInvoiceList, value, '/Invoice/get_list');
      if (res.code == 0) {
        yield put({ type: 'setLoadingFalse' });
        if (res.data && res.data.length) {
          yield put({
            type: 'setInvoiceList',
            payload: res,
          });
        }
      }
    },

    //支付税金弹框信息
    *getInvoicePayInfoModel({ value }, { call, put }) {
      const res = yield call(getInvoicePayInfo, value);
      const { data } = res;
      const copy_data = {
        ...data,
        invoice_amount: accDiv(data.invoice_amount, 100).toFixed(2),
        taxable_amount: accDiv(data.taxable_amount, 100).toFixed(2),
        create_time: formatDateYMDHMS(data.create_time, 'year'),
      };
      if (res.code == 0) {
        yield put({
          type: 'setPayInfoObj',
          payload: copy_data,
        });
      }
    },
    //发票申请详情信息
    *getInvoiceGetInfoModel({ value }, { call, put }) {
      const res = yield call(getInvoiceGetInfo, value);
      if (res.code == 0) {
        yield put({
          type: 'setInvoiceGetInfo',
          payload: res.data,
        });
      }
    },
    //发票申请详情列表
    *getInvoicewaybillModel({ value }, { call, put }) {
      yield put({
        type: 'setLoadingDetail',
        payload: true,
      });
      const res = yield call(getInvoicewaybill, value);
      if (res.code == 0) {
        yield put({
          type: 'setInvoicewaybill',
          payload: res,
        });
        yield put({
          type: 'setLoadingDetail',
          payload: false,
        });
      }
    },

    //发票详情列表行操作-移除
    *removewaybillModel({ value }, { call, put }) {
      const res = yield call(removewaybill, value);
      if (res.code == 0) {
        message.success(res.msg);
        dispatch({
          type: 'getInvoicewaybillModel',
          value: { page: 1, num: 10, invoice_id: value.invoice_id },
        });
      } else {
        message.warning(res.msg);
      }
    },

    //发票详情列表-导出
    *waybilloutexportModel({ value }, { call, put }) {
      const res = yield call(waybilloutexport, value);
      if (res.code == 0) {
        message.success(res.msg);
      } else {
        message.success(res.msg || '操作失败');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/invoice/car' || pathname === '/invoice/ship') {
          dispatch({
            type: 'getInvoiceListModel',
            value: { match_business_type: pathname === '/invoice/car' ? 1 : 2 },
          });
        }
      });
    },
  },
};
