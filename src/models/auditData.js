import { paymentRequestList, paymentHistoryList } from '../sevice/audit';

export default {
  namespace: 'audit',
  state: {
    audit_wait_list: [], //列表
    audit_finish_list: [], //列表
    audit_special_list: [], //列表
    loading: false, //列表加载状态
    totalPage: 0, //总页数,
    audit_history_list: [], //付款申请跟踪列表
  },
  reducers: {
    //loading状态
    setLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },

    //列表
    set_wait_list(state, action) {
      let {
        payload: { data, total },
      } = action;
      return {
        ...state,
        audit_wait_list: data,
        totalPage: total,
      };
    },
    set_finish_list(state, action) {
      let {
        payload: { data, total },
      } = action;
      return {
        ...state,
        audit_finish_list: data,
        totalPage: total,
      };
    },
    set_special_list(state, action) {
      let {
        payload: { data, total },
      } = action;
      return {
        ...state,
        audit_special_list: data,
        totalPage: total,
      };
    },
    set_history_list(state, action) {
      let {
        payload: { data, total },
      } = action;
      return {
        ...state,
        audit_history_list: data,
        totalPage: total,
      };
    },
  },
  effects: {
    //列表
    *getPaymentRequestListModel({ value }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(paymentRequestList, value, '/apply/' + value.flag);
      yield put({ type: 'set_' + value.flag, payload: { data: [] } });
      if (res.code == 0) {
        yield put({ type: 'setLoading', payload: false });
        if (res.data && res.data.length) {
          yield put({
            type: 'set_' + value.flag,
            payload: { ...res },
          });
        }
      }
    },
    //付款申请跟踪
    *paymentHistoryListModel({ value }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(paymentHistoryList, value);
      if (res.code == 0) {
        yield put({ type: 'setLoading', payload: false });
        if (res.data && res.data.length) {
          yield put({ type: 'set_history_list', payload: res });
        }
      }
    },
  },
  subscriptions: {},
};
