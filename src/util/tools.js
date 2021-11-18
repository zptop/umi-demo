import config from '../../config/config';
/**
 * 倒计时
 */
export const timeCutdown = (total, interval, resolve) => {
  var _total = total;
  var t = setInterval(() => {
    _total--;

    if (_total <= 0) {
      clearInterval(t);
    }

    resolve(_total);

    if (_total <= 0) {
      return;
    }
  }, interval);

  return t;
};

/**
 * 格式化selcet选项
 * value为100或200时为空
 */
export const formatSelectedOptions = object => {
  for (var key in object) {
    if (object[key] == '100' || object[key] == '200') {
      object[key] = '';
    }
  }
  return object;
};

/**
 * @param {Number} num 数值
 * @returns {String} 处理后的字符串
 * @description 如果传入的数值小于10，即位数只有1位，则在前面补充0
 */
const getHandledValue = num => {
  return num < 10 ? '0' + num : num;
};

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} startType 要返回的时间字符串的格式类型，传入'year'则返回年开头的完整时间
 */
const getDate = (timeStamp, startType) => {
  const d = new Date(timeStamp * 1000);
  const year = d.getFullYear();
  const month = getHandledValue(d.getMonth() + 1);
  const date = getHandledValue(d.getDate());
  const hours = getHandledValue(d.getHours());
  const minutes = getHandledValue(d.getMinutes());
  const second = getHandledValue(d.getSeconds());
  let resStr = '';
  if (startType === 'year')
    resStr =
      year +
      '-' +
      month +
      '-' +
      date +
      ' ' +
      hours +
      ':' +
      minutes +
      ':' +
      second;
  else resStr = month + '-' + date + ' ' + hours + ':' + minutes;
  return resStr;
};

/**
 *  时间戳转年月日时分秒
 */
export const formatDateYMDHMS = (timeStamp, startType) => {
  return getDate(timeStamp, startType);
};

/**
 * 时间戳转年月日
 */
export const formatDateYMD = s => {
  var dd = new Date(parseInt(s) * 1000);
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;
  if (m < 10) m = '0' + m;
  var d = dd.getDate();
  if (d < 10) d = '0' + d;
  return y + '-' + m + '-' + d;
};

//乘法浮点数精度计算方法
export const accMul = (arg1, arg2) => {
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split('.')[1].length;
  } catch (e) {}
  try {
    m += s2.split('.')[1].length;
  } catch (e) {}
  return (
    (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
    Math.pow(10, m)
  );
};

//除法浮点数精度计算方法
export const accDiv = (num1, num2) => {
  var t1, t2, r1, r2;
  try {
    t1 = num1.toString().split('.')[1].length;
  } catch (e) {
    t1 = 0;
  }
  try {
    t2 = num2.toString().split('.')[1].length;
  } catch (e) {
    t2 = 0;
  }
  r1 = Number(num1.toString().replace('.', ''));
  r2 = Number(num2.toString().replace('.', ''));
  return (r1 / r2) * Math.pow(10, t2 - t1);
};

export const forEach = (arr, fn) => {
  if (!arr.length || !fn) return;
  let i = -1;
  let len = arr.length;
  while (++i < len) {
    let item = arr[i];
    fn(item, i, arr);
  }
};

//是否有sub_items子集合
export const hasChild = item => {
  return item.sub_items && item.sub_items.length !== 0;
};

//获取AJAX 域名地址
export const getBaseUrl = () => {
  return process.env.NODE_ENV === 'development'
    ? config.baseUrl.dev
    : config.baseUrl.pro;
};
