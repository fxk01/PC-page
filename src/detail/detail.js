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
    utils: '../../index.min',
    dot: '../../libs/dot/dot'
  },
  shim: {
    utils: ['jquery']
  }
});

define([
  'jquery',
  'amui',
  'utils',
  'dot',
  'module'
], function($, amui, obj, dot, module) {
  var detailPage = function() {
    return new detailPage.prototype.init();
  };
  detailPage.prototype = {
    /*
      初始化
     */
    init: function() {
      setTimeout(function () {
        $.AMUI.progress.done();
      }, 1000);
      console.log(dot);
    }
  };
  detailPage.prototype.init.prototype = detailPage.prototype;
  module.exports = {
    detailPage: detailPage
  };
});