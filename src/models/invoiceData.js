import { getInvoiceList, getInvoicePayInfo } from '../sevice/invoice';
import { history } from 'umi';

export default {
    namespace: 'invoice',
    state: {
        invoiceList: [],
        loading: false, //列表加载状态
        totalPage: 0, //总页数
        payInfoObj: {}, //支付信息
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
                payInfoObj: action.payload.data
            }
        }
    },
    //异步方法
    effects: {
        //获取发票列表
        * getInvoiceListModel({ value }, { call, put }) {
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
        * getInvoicePayInfoModel({ value }, { call, put }) {
            const res = yield call(getInvoicePayInfo, value);
            console.log('res:', res)
            if (res.code == 0) {
                yield put({
                    type: 'setPayInfoObj',
                    payload: res
                })
            }
        }
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