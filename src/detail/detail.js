/**
 * detail业务逻辑
 */

'use strict';
require.config({
  baseUrl: '',
  urlArgs: 'bust=' + new Date().getTime(),
  waitSeconds: 0,
  paths: {
    jquery: '../../libs/jquery/jquery-2.1.4',
    amui: '../../static/amazeui/js/amazeui.min',
    utils: '../../utils/index.min'
  },
  shim: {
    utils: ['jquery']
  }
});

define(['jquery', 'amui', 'utils', 'module'], function($, amui, obj, module) {
  var detailPage = function() {
    return new detailPage.prototype.init();
  };
  detailPage.prototype = {
    /*
      初始化
     */
    init: function() {
      console.log(obj);
    }
  };
  detailPage.prototype.init.prototype = detailPage.prototype;
  module.exports = {
    detailPage: detailPage
  };
});