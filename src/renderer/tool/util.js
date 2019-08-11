/*
*   函数存放地方
*   各种方法也可放入此文件去调用
*
* */

export default {
  /**
   * 时间格式化
   */
  timeForm (time) {
    var date = new Date(time);
    var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var sec = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return {
      hour: hour,
      min: min,
      sec: sec,
      min_sec: `${min}:${sec}`
    }
  },
  dateForm (date){
    var date = new Date(date);
    var year = date.getFullYear();
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return {
      year: year,
      month: month,
      day: day,
      ytd: `${year}年${month}月${day}日`,
      month_day: `${month}月${day}日`
    }
  }
}
