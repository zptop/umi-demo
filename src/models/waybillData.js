import { message, Modal } from 'antd';
const { confirm } = Modal;
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
  delImgFromWaybill,
  delImgFromVehicle,
  uploadNoRequiredSubmit,
  getPayChannel,
  getContract,
  sureContract,
  getBatchImportList,
  outexportFn,
  getExoprtList,
  getPayeePayList,
  getApplyRecordList,
  getSmsCodeFromPay,
  getInfoPersonFromPay,
} from '../sevice/waybill';
import { formatDateYMD, accMul, accDiv, timeCutdown } from '../util/tools';
import { history, getDvaApp } from 'umi';
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
    payChannelArr: [], //银行支付列表
    isNoRequiredModalVisible: false, //上传资料，不走资金弹框显示控制
    contractData: '', //电子合同地址
    elecContractFlag: false, //电子合同弹框
    batchImportList: [], //批量导入运单列表
    batch_loading: false, //批量导入运单列表loading
    batchTtotalPage: 0, //批量导入运单列表totalPage
    exportImportList: [], //导出运单列表
    export_loading: false, //导出运单列表loading
    exportTtotalPage: 0, //导出运单列表totalPage
    payeeList: [], //付款页面，收款人列表
    applyRecordList: [], //付款页面，付款申请记录
    getBtnText: '获取验证码', //付款页面
    is_sms_disabled: false, //付款页面,获取短信验证码点击
    payObjInfo: {}, //付款页面，收款人信息
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
    setLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
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
    setPayChannelArr(state, action) {
      return {
        ...state,
        payChannelArr: action.payload,
      };
    },
    setIsNoRequiredModalVisible(state) {
      return {
        ...state,
        isNoRequiredModalVisible: false,
      };
    },
    setContractPic(state, action) {
      return {
        ...state,
        contractData: action.payload,
      };
    },
    setBatchLoadingTrue(state) {
      return {
        ...state,
        batch_loading: true,
      };
    },
    setBatchLoadingFalse(state) {
      return {
        ...state,
        batch_loading: false,
      };
    },
    setBatchImportList(state, action) {
      return {
        ...state,
        batchImportList: action.payload.data,
        batchTtotalPage: action.payload.total,
      };
    },
    setExportLoadingTrue(state) {
      return {
        ...state,
        export_loading: true,
      };
    },
    setExportLoadingFalse(state) {
      return {
        ...state,
        export_loading: false,
      };
    },
    setExportImportList(state, action) {
      return {
        ...state,
        exportImportList: action.payload.data,
        exportTtotalPage: action.payload.total,
      };
    },
    setPayeeList(state, action) {
      return {
        ...state,
        payeeList: action.payload,
      };
    },
    setApplyRecordList(state, action) {
      return {
        ...state,
        applyRecordList: action.payload,
      };
    },
    setIsSmsDisabled(state, action) {
      return {
        ...state,
        is_sms_disabled: action.payload,
      };
    },
    setGetBtnText(state, action) {
      return {
        ...state,
        getBtnText: action.payload,
      };
    },
    setPayObjInfo(state, action) {
      console.log('action:', action);
      return {
        ...state,
        payObjInfo: action.payload,
      };
    },
  },
  // 这里定义异步方法
  effects: {
    //获取运单列表
    *getWaybillListModel({ value }, { call, put }) {
      yield put({
        type: 'setLoading',
        payload: true,
      });
      const res = yield call(
        getWaybillList,
        value,
        value.transportType == 1 ? '/Car/get_list' : '/Ship/get_list',
      );
      if (res.code == 0) {
        yield put({
          type: 'setLoading',
          payload: false,
        });
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
        yield put({
          type: 'getPayeeListModel',
          value,
        });
      } else {
        message.warning(res.msg || '系统错误');
      }
    },

    //初始化额外收款人列表
    *getPayeeListModel({ value }, { call, put }) {
      const res = yield call(getPayeeList, {
        waybill_no: value.waybill_no,
      });
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

    //删除运单图片
    *delImgFromWaybillModel({ value }, { call, put }) {
      const res = yield call(delImgFromWaybill, value);
      if (res.code == 0) {
        console.log('运单图片-删除成功');
      }
    },

    //删除车辆图片
    *delImgFromVehicleModel({ value }, { call, put }) {
      const res = yield call(delImgFromVehicle, value);
      if (res.code == 0) {
        console.log('车辆图片-删除成功');
      }
    },

    //不走资金-上传资料，提交
    *uploadNoRequiredSubmitModel({ value }, { call, put }) {
      const res = yield call(
        uploadNoRequiredSubmit,
        value,
        value.transportType == 1 ? '/car/update_trade' : '/ship/update_trade',
      );
      if (res.code == 0) {
        message.success('保存成功');
        yield put({
          type: 'setIsNoRequiredModalVisible',
        });
      } else {
        message.warning(res.msg || '保存失败');
      }
    },

    //获取支付渠道
    *getPayChannelModel({ value }, { call, put }) {
      const res = yield call(getPayChannel, value);
      if (res.code == 0) {
        yield put({
          type: 'setPayChannelArr',
          payload: res.data,
        });
      }
    },

    //获取电子合同
    *getContractModel({ value }, { call, put }) {
      const res = yield call(getContract, value);
      if (res.code == 0) {
        yield put({
          type: 'setContractPic',
          payload: res.data,
        });
      }
    },

    //确认电子合同
    *sureContractModel({ value }, { call, put }) {
      let store = getDvaApp()._store;
      confirm({
        title: '提示',
        content: '请确认运单数据无误且与合同内数据一致后进行签署',
        okText: '核对无误，签署',
        cancelText: '取消',
        onOk: () => {
          store.runSaga(function*() {
            const res = yield call(sureContract, value);
            if (res.code == 0) {
              message.success('签署成功');
            } else {
              message.warning('操作失败');
            }
          });
        },
        onCancel: () => {
          //取消
        },
      });
    },

    //获取批量导入运单列表
    *getBatchImportListModel({ value }, { call, put }) {
      yield put({
        type: 'setBatchLoadingTrue',
      });
      const res = yield call(getBatchImportList, value);
      if (res.code == 0) {
        yield put({
          type: 'setBatchLoadingFalse',
        });
        yield put({
          type: 'setBatchImportList',
          payload: res,
        });
      } else {
        message.error(res.msg || '系统错误');
      }
    },

    //导出
    *outexportModel({ value }, { call, put }) {
      const res = yield call(outexportFn, value);
      if (res.code == 0) {
        message.success(res.msg);
      } else {
        message.error(res.msg || '操作失败');
      }
    },

    //获取导出列表
    *getExoprtModel({ value }, { call, put }) {
      yield put({
        type: 'setExportLoadingTrue',
      });
      const res = yield call(getExoprtList, value);
      if (res.code == 0) {
        yield put({
          type: 'setExportLoadingFalse',
        });
        yield put({
          type: 'setExportImportList',
          payload: res,
        });
      } else {
        message.error(res.msg || '系统错误');
      }
    },

    //获取收款人列表
    *getPayeePayListModel({ value }, { call, put }) {
      const res = yield call(getPayeePayList, value);
      if (res.code == 0) {
        yield put({
          type: 'setPayeeList',
          payload: res.data,
        });
      } else {
        message.error(res.msg || '系统错误');
      }
    },

    //付款申请记录列表
    *getApplyRecordListModel({ value }, { call, put }) {
      const res = yield call(getApplyRecordList, value);
      if (res.code == 0) {
        yield put({
          type: '/setApplyRecordList',
          payload: res.data,
        });
      } else {
        message.error(res.msg || '系统错误');
      }
    },

    //付款页面-倒计时
    *getSmsCodeFromPayModel({ value }, { call, put }) {
      const res = yield call(getSmsCodeFromPay, value);
      if (res.code == 0) {
        yield put({
          type: '/setIsSmsDisabled',
          payload: true,
        });
        let store = getDvaApp._store;
        let t = timeCutdown(60, 1000, n => {
          store.runSaga(function*() {
            if (n <= 0) {
              yield put({
                type: '/setIsSmsDisabled',
                payload: true,
              });
              yield put({
                type: '/setGetBtnText',
                payload: '获取验证码',
              });
            } else {
              yield put({
                type: '/setGetBtnText',
                payload: '剩余' + n + '秒',
              });
            }
          });
        });
      } else {
        message.error(res.msg || '系统错误');
      }
    },

    //付款页面-获取收款人信息
    *getInfoPersonModel({ value }, { call, put }) {
      const res = yield call(getInfoPersonFromPay, value);
      console.log('res:', res);
      if (res.code == 0) {
        console.log('1111');
        yield put({
          type: '/setPayObjInfo',
          payload: res.data,
        });
      } else {
        message.error(res.msg || '系统错误');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname == '/car/index' || pathname == '/ship/index') {
          dispatch({
            type: 'getWaybillListModel',
            value: {
              transportType: pathname == '/car/index' ? '1' : '2',
            },
          });
        }
        if (pathname == '/car/form' || pathname == '/ship/form') {
          const waybill_no = history.location.query.waybill_no;
          dispatch({
            type: 'getCommonInfoModel',
            value: {
              transport_type: pathname == '/car/form' ? '1' : '2',
            },
          });
          if (waybill_no) {
            dispatch({
              type: 'getWaybillDetailModel',
              value: {
                waybill_no,
              },
            });
          }
        }
      });
    },
  },
};
