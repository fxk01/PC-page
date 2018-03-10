/**
 * @desc 常用工具库函数
 * @desc 常用正则
 */

'use strict';
var toolClass = {
  uPattern: /^[a-zA-Z0-9_-]{4,16}$/, //用户名正则，4到16位（字母，数字，下划线，减号）
  pPattern: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/, //密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
  cP: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, //身份证号（18位）正则
  dP1: /^\d{4}(\-)\d{1,2}\1\d{1,2}$/, //日期正则，简单判定,未做月份及日期的判定
  urlP: /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, //URL正则
  ePattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, //Email正则
  mPattern: /^[1][3][0-9]{9}$/, //手机号正则
  cnPattern: /[\u4E00-\u9FA5]/, //包含中文正则
  Regex_MondyNum: /^\d+(\.\d{1,2})?$/, //金额，允许两位小数
  integerPattern: /^-?\d+$/, //整数
  /**
   * @desc 打乱数组顺序
   * @param {Array} arr
   * @return {Array}
   */
  arrayDisorder: function (arr) {
    return arr.sort(function () {
      return Math.random() - 0.5;
    });
  },
  /**
   * @desc 判断两个数组是否相等
   * @param {Array} arr1
   * @param {Array} arr2
   * @return {Boolean}
   */
  arrayEqual: function (arr1, arr2) {
    if (arr1 === arr2) return true;
    if (arr1.length !== arr2.length) return false;
    for (var i = 0; i < arr1.length; ++i) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  },
  /**
   * @desc 从数组中随机获取元素
   * @param {Array} arr
   * @return {Number}
   */
  arrayRandom: function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },
  /**
   * @desc   大小写转换
   * @param  {String} str
   * @param  {Number} type 1:首字母大写  2:首页母小写  3:大小写转换 4:全部大写 5:全部小写
   * @return {String}
   */
  changeCase: function (str, type) {
    function ToggleCase(str) {
      var itemText = "";
      str.split("").forEach(function (item) {
        if (/^([a-z]+)/.test(item)) {
          itemText += item.toUpperCase();
        } else if (/^([A-Z]+)/.test(item)) {
          itemText += item.toLowerCase();
        } else {
          itemText += item;
        }
      });
      return itemText;
    }
    switch (type) {
      case 1:
        return str.replace(/\b\w+\b/g, function (word) {
          return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
        });
      case 2:
        return str.replace(/\b\w+\b/g, function (word) {
          return word.substring(0, 1).toLowerCase() + word.substring(1).toUpperCase();
        });
      case 3:
        return ToggleCase(str);
      case 4:
        return str.toUpperCase();
      case 5:
        return str.toLowerCase();
      default:
        return str;
    }
  }
};

