//什么时间前
export const timeAgo = function(timestamp, ago){
  if(!timestamp || !ago){
    return '';
  }
  let differ = (new Date().getTime() - timestamp) / 1000;
  if (differ < 60) {
    return `${Math.floor(differ)}${ago.second}`;
  }
  if (differ < 3600) {
    return `${Math.floor(differ / 60)}${ago.minute}`;
  }
  if (differ < 86400) {
    return `${Math.floor(differ / 3600)}${ago.hour}`;
  }
  if (differ < 2592000) {
    return `${Math.floor(differ / 86400)}${ago.day}`;
  }
  return ago.month;
};

//剩余多少时间
export const restTime = function(second){
  if(!second){
    return '';
  }
  if (second < 1000) {
    return `00:00:00`;
  }
  if (second <= 60000) {
    let sec = Math.ceil(second / 1000);
    return sec < 10 ? '0' + sec : sec;
  }
  if (second <= 3600000) {
    let min = Math.floor(second / 60000);
    let sec = Math.ceil((second % 60000) / 1000);
    return (min < 10 ? '0' + min : min) + ':'
        + (sec < 10 ? '0' + sec : sec);
  }
  /*if (second <= 7200000) {
    let hour = Math.floor(second / 3600000);
    let min = Math.floor((second % 3600000) / 60000);
    let sec = Math.ceil((second % 60000) / 1000);
    return (hour < 10 ? '0' + hour : hour) + ':'
        + (min < 10 ? '0' + min : min) + ':'
        + (sec < 10 ? '0' + sec : sec);
  }*/
  if (second <= 86400000) {
    let hour = Math.floor(second / 3600000);
    let min = Math.floor((second % 3600000) / 60000);
    let sec = Math.ceil((second % 60000) / 1000);
    return (hour < 10 ? '0' + hour : hour) + ':'
        + (min < 10 ? '0' + min : min) + ':'
        + (sec < 10 ? '0' + sec : sec);
  }
};
//剩余多少时间
export const restTimeWithDay = function(second){
  if(!second){
    return '';
  }
  if (second < 1) {
    return `00时00分00秒`;
  }
  if (second < 60) {
    let sec = Math.ceil(second);
    return sec < 10 ? '0' + sec : sec + '秒';
  }
  if (second < 3600) {
    let min = Math.floor(second / 60);
    let sec = Math.floor((second % 60));
    return (min < 10 ? '0' + min : min) + '分'
        + (sec < 10 ? '0' + sec : sec) + '秒';
  }
  if (second < 86400) {
    let hour = Math.floor(second / 3600);
    let min = Math.floor((second % 3600) / 60);
    let sec = Math.ceil((second % 3600) % 60);
    return (hour < 10 ? '0' + hour : hour) + '时'
        + (min < 10 ? '0' + min : min) + '分'
        + (sec < 10 ? '0' + sec : sec) + '秒';
  }
  if (second > 86400) {
    let day = Math.floor(second / 86400);
    let hour = Math.floor((second % 86400) / 3600);
    let min = Math.floor((second % 86400 % 3600) / 60);
    let sec = Math.ceil((second % 86400) % 60);
    return (day < 10 ? '0' + day : day) + '天'
        + (hour < 10 ? '0' + hour : hour) + '时'
        + (min < 10 ? '0' + min : min) + '分'
        + (sec < 10 ? '0' + sec : sec) + '秒';
  }
};

//几年
export const getYear = function(Date){
  return Date.getFullYear();
};

//几月
export const getMonth = function(Date){
  let month = Date.getMonth() + 1;
  return month + 1 < 10 ? `0${month}` : month;
};

//星期几
export const getDay = function(Date){
  return Date.getDay();
};

//几日
export const getDate = function(Date){
  let date = Date.getDate();
  return date < 10 ? `0${date}` : date;
};

//几时
export const getHours = function(Date){
  let hours = Date.getHours();
  return hours < 10 ? `0${hours}` : hours;
};

//几分
export const getMinutes = function(Date){
  let minutes = Date.getMinutes();
  return minutes < 10 ? `0${minutes}` : minutes;
};

//几秒
export const getSeconds = function(Date){
  let seconds = Date.getSeconds();
  return seconds < 10 ? `0${seconds}` : seconds;
};

export const monthToMinute = function (timestamp) {
  if(!timestamp){
    return '--';
  }
  let time = new Date(timestamp);
  let month = getMonth(time);
  let date = getDate(time);
  let hours = getHours(time);
  let minutes = getMinutes(time);
  return `${month}-${date} ${hours}:${minutes}`;
};

//时间格式yyyy年mm月dd日 hh时mm分ss秒
export const fullTime = function (timestamp) {
  if(!timestamp){
    return '--';
  }
  let time = new Date(timestamp);
  let year = getYear(time);
  let month = getMonth(time);
  let date = getDate(time);
  let hours = getHours(time);
  let minutes = getMinutes(time);
  let seconds = getSeconds(time);
  return `${year}年${month}月${date}日  ${hours}时${minutes}分${seconds}秒`;
};

//时间格式yyyy-mm-dd hh:mm:ss
export const yearToSeconds = function (timestamp) {
  if(!timestamp){
    return '--';
  }
  let time = new Date(timestamp);
  let year = getYear(time);
  let month = getMonth(time);
  let date = getDate(time);
  let hours = getHours(time);
  let minutes = getMinutes(time);
  let seconds = getSeconds(time);
  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
};

//时间格式yyyy-mm-dd
export const yearToDate = function (timestamp) {
  if (!timestamp) {
    return '';
  }
  let time = new Date(timestamp);
  let year = getYear(time);
  let month = getMonth(time)
  let date = getDate(time)
  return `${year}-${month}-${date}`;
};

//格式hh:mi:ss
export const hoursToSeconds = function (timestamp) {
  if (!timestamp) {
    return '--';
  }
  let time = new Date(timestamp);
  let hours = getHours(time);
  let minutes = getMinutes(time);
  let seconds = getSeconds(time);
  return `${hours}:${minutes}:${seconds}`;
};

//时间格式yyyyMMddHHmmss
export const yearToSecondsNextTo = function (timestamp) {
  if (!timestamp) {
    return '--';
  }
  let time = new Date(timestamp);
  let year = getYear(time);
  let month = getMonth(time);
  let date = getDate(time);
  let hours = getHours(time);
  let minutes = getMinutes(time);
  let seconds = getSeconds(time);
  return `${year}${month}${date}${hours}${minutes}${seconds}`;
};

/**
 * [dateFormat 时间格式化]
 * @param  {[Number,String]} [timestamp=Date.now()] [需转化的时间戳或一个能格式化的时间字符串]
 * @param  {[String]} [format='yyyy-M-d'] [需转化的时间格式]
 * yyyy年，月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q)，两个字符表示按2位字符输入
 * 举例：
 * dateFormat(Date.now(), "yyyy-MM-dd hh:mm:ss") ==> 2017-04-25 16:06:06
 * dateFormat(Date.now(), "yyyy-M-d h:m:s q")    ==> 2017-4-25 16:6:6 2
 * @return {[String]}                       [格式化时间字符串]
 */
export function dateFormat(timestamp = Date.now(), format = 'yyyy-M-d') {
  return getFormatDate(getJsonDate(timestamp), format)
}

// 生成时间对象
export function getJsonDate(timestamp) {
  let time = new Date(getCorrectTime(timestamp))
  let jsonDate = {
    y: time.getFullYear(), //年
    M: time.getMonth() + 1, //月
    d: time.getDate(), //日
    h: time.getHours(), //时
    m: time.getMinutes(), //分
    s: time.getSeconds(), //秒
    q: Math.floor((time.getMonth() + 3) / 3) //季度
  }
  return jsonDate
}

// 生成格式化时间字符串
export function getFormatDate(jsonDate, format) {
  let dateStr = format.replace(/yyyy/g, jsonDate.y)
  Object.keys(jsonDate).forEach(e => {
    // 时间格式化操作
    let double = e.repeat(2)
    let num = jsonDate[e]
    if (format.includes(double)) {
      // 如果需要两位的格式化数据，则转换为两位数
      dateStr = dateStr.replace(double, getTwoDigit(num))
    } else {
      dateStr = dateStr.replace(e, num)
    }
  })
  return dateStr
}

// 对于传入时间数据的转换
function getCorrectTime(timestamp) {
  if (isNaN(timestamp)) {
    // ios日期格式兼容处理
    timestamp = timestamp.toString().includes('-')
        ? timestamp.replace(/-/g, '/')
        : timestamp
  } else {
    timestamp = Number(timestamp)
  }
  return timestamp
}

// 传入时间转时间戳
export function timeToStamp(time) {
  return new Date(getCorrectTime(time)).getTime();
}

// 数字如果为一位数，前面加0
function getTwoDigit(num) {
  return Number(num) < 10
      ? `0${num}`
      : num
}
