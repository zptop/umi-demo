import { message } from 'antd';
import {
  getWaybillList,
  submitForm,
  getWaybillDetail,
  getCommonInfo,
  getSearchFromMobile,
  getAddNewPayer,
  getRemovePayee,
  addpayee,
  getPayeeList,
  getPayinfoList,
} from '../sevice/waybill';
import { formatDateYMD, accMul, accDiv } from '../util/tools';
import { history } from 'umi';
export default {
  namespace: 'waybill',
  state: {
    waybillList: [],
    totalPage: 0, //总页数
    total_wait_amount: 0, //待付运输劳务费
    total_labour_amount: 0, //总运输劳务费
    loading: false, //列表加载状态
    waybill_load_place: [], //常用装货地点列表
    waybill_consi_info: [], //常用收货人列表
    searchData: null, //设置承运人搜索到的列表
    searchShow: false, //设置承运人列表显示与隐藏
    okButtonDisabledModel: true, //搜索承运人弹框“确定”
    newPayerList: [], //新增收款人列表数据，只有一条
    payeeInfo: {}, //新增收款人列表信息
    waybillNoInfo: {}, //编辑或复制时的运单详情
    payMentFlowList: [], //支付流水或付款信息列表
  },
  //一些正常的同步方法
  reducers: {
    setWaybillList(state, result) {
      const obj = result.data;
      return {
        ...state,
        waybillList: obj.data,
        totalPage: obj.total,
        total_wait_amount: obj.total_wait_amount,
        total_labour_amount: obj.total_labour_amount,
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
    setCommonInfo(state, result) {
      return {
        ...state,
        waybill_load_place: result.data.data.waybill_load_place,
        waybill_consi_info: result.data.data.waybill_consi_info,
      };
    },
    setSearchData(state, action) {
      return {
        ...state,
        searchData: action.payload,
      };
    },
    setSearchShow(state, action) {
      return {
        ...state,
        searchShow: action.payload,
      };
    },
    setNewPayerList(state, action) {
      return {
        ...state,
        newPayerList:
          action.payload == 'empty'
            ? []
            : [...state.newPayerList, action.payload],
      };
    },
    setPayeeInfo(state, action) {
      return {
        ...state,
        payeeInfo: action.payload,
      };
    },
    setWaybillNoInfo(state, action) {
      return {
        ...state,
        waybillNoInfo: action.payload,
      };
    },
    setPayMentFlowList(state, action) {
      return {
        ...state,
        payMentFlowList: action.payload,
      };
    },
  },
  // 这里定义异步方法
  effects: {
    //获取运单列表
    *getWaybillListModel({ value }, { call, put }) {
      yield put({ type: 'setLoadingTrue' });
      const res = yield call(
        getWaybillList,
        value,
        value.transportType == 1 ? '/Car/get_list' : '/Ship/get_list',
      );
      if (res.code == 0) {
        yield put({ type: 'setLoadingFalse' });
        if (res.data && res.data.length > 0) {
          for (let item of res.data) {
            item.load_time = formatDateYMD(item.load_time);
            item.unload_time =
              item.unload_time == 0 ? '' : formatDateYMD(item.unload_time);
            item.invoice_amount = accDiv(item.invoice_amount, 100).toFixed(2);
            item.taxable_amount = accDiv(item.taxable_amount, 100).toFixed(2);
            item.svr_fee = accDiv(item.svr_fee, 100).toFixed(2);
          }
        }
        yield put({
          type: 'setWaybillList',
          data: res,
        });
      } else {
        message.warning(res.msg);
      }
    },

    //新增运单
    *submitFormModel({ value }, { call, put }) {
      let url = null;
      if (value.transport_type == 1) {
        if (value.title.includes('新增') || value.title.includes('复制')) {
          url = '/car/addnew';
        } else {
          url = '/car/update';
        }
      } else {
        if (value.title.includes('新增') || value.title.includes('复制')) {
          url = '/ship/addnew';
        } else {
          url = '/ship/update';
        }
      }
      const res = yield call(submitForm, value, url);
      if (res.code == 0) {
        message.success(res.msg || '保存成功');
      } else {
        message.warning(res.msg);
      }
    },

    //编辑-获取运单详情
    *getWaybillDetailModel({ value }, { call, put }) {
      const res = yield call(getWaybillDetail, value);
      if (res.code == 0) {
        yield put({
          type: 'setWaybillNoInfo',
          payload: res.data,
        });
      } else {
        message.warning(res.msg || '系统错误');
      }
    },

    //运单详情--支付流水或付款信息列表
    *getPayinfoListModel({ value }, { call, put }) {
      const res = yield call(
        getPayinfoList,
        value,
        value.paymentrequired != 1
          ? '/payinfo/getPayinfoList'
          : '/waybill/get_apply_list',
      );
      if (res.code == 0) {
        yield put({
          type: 'setPayMentFlowList',
          payload: res.data,
        });
      }
    },

    //常用联系人和地址
    *getCommonInfoModel({ value }, { call, put }) {
      const res = yield call(getCommonInfo, value);
      if (res.code == 0) {
        yield put({
          type: 'setCommonInfo',
          data: res,
        });
      } else if (res.code == 956322) {
        history.push('/login');
      } else {
        message.warning(res.msg);
      }
    },

    //通过手机号搜索设定承运人
    *getSearchFromMobileModel({ value }, { call, put }) {
      if (
        value.carrier_mobile == '' ||
        !/^1[3456789]\d{9}$/.test(value.carrier_mobile)
      ) {
        yield put({
          type: 'setSearchShow',
          payload: false,
        });
        return;
      }
      const res = yield call(getSearchFromMobile, value);
      if (res.code == 0) {
        yield put({
          type: 'setSearchData',
          payload: res.data,
        });
        yield put({
          type: 'setSearchShow',
          payload: true,
        });
      } else {
        yield put({
          type: 'setSearchShow',
          payload: false,
        });
        message.warning(res.msg);
      }
    },

    //新增收款人列表-只有一条数据
    *setNewPayerListModel({ value }, { call, put }) {
      if (!/^1[3456789]\d{9}$/.test(value.mobile)) return;
      const res = yield call(getAddNewPayer, value);
      yield put({
        type: 'setNewPayerList',
        payload: 'empty',
      });
      if (res.code == 0) {
        yield put({
          type: 'setNewPayerList',
          payload: res.data,
        });
      } else {
        message.warning(res.msg);
      }
    },

    //添加额外收款人信息
    *addpayeeModel({ value }, { call, put }) {
      const res = yield call(addpayee, value);
      if (res.code == 0) {
        yield put({ type: 'getPayeeListModel', value });
      } else {
        message.warning(res.msg || '系统错误');
      }
    },

    //初始化额外收款人列表
    *getPayeeListModel({ value }, { call, put }) {
      const res = yield call(getPayeeList, { waybill_no: value.waybill_no });
      if (res.code == 0) {
        yield put({
          type: 'setPayeeInfo',
          payload: res.data[0],
        });
      } else {
        yield put({
          type: 'setPayeeInfo',
          payload: {
            payee_name: '',
            payee_uin: '',
          },
        });
      }
    },

    //删除新增额外收款人
    *getRemovePayeeModel({ value }, { call, put }) {
      if (value.payee_id) {
        const res = yield call(getRemovePayee, value);
        if (res.code == 0) {
          message.success(res.msg || '删除成功');
          yield put({
            type: 'setPayeeInfo',
            payload: {
              payee_name: '',
              payee_uin: '',
            },
          });
        } else {
          message.error(res.msg || '操作失败');
        }
      } else {
        yield put({
          type: 'setNewPayerList',
          payload: 'empty',
        });
        yield put({
          type: 'setPayeeInfo',
          payload: {
            payee_name: '',
            payee_uin: '',
          },
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname == '/car/index' || pathname == '/ship/index') {
          dispatch({
            type: 'getWaybillListModel',
            value: { transportType: pathname == '/car/index' ? '1' : '2' },
          });
        }
        if (pathname == '/car/form' || pathname == '/ship/form') {
          const waybill_no = history.location.query.waybill_no;
          dispatch({
            type: 'getCommonInfoModel',
            value: { transport_type: pathname == '/car/form' ? '1' : '2' },
          });
          if (waybill_no) {
            dispatch({
              type: 'getWaybillDetailModel',
              value: { waybill_no },
            });
          }
        }
      });
    },
  },
};
