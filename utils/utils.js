/**
 * @desc 常用工具库函数
 * @desc 常用正则
 */

'use strict';
define(['module'], function (module) {
  var utils = {
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
    }
  };
  module.exports = utils;
});