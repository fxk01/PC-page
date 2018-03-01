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
    dot: '../../utils/dot',
    com: '../../utils/com'
  }
});

define(['jquery', 'amui', 'dot', 'com', 'module'], function($, amui, dot, comTarget, module) {
  var detailPage = function() {
    return new detailPage.prototype.init();
  };
  detailPage.prototype = {
    /*
      初始化
     */
    init: function() {
      console.log(amui);
    }
  };
  detailPage.prototype.init.prototype = detailPage.prototype;
  module.exports = {
    detailPage: detailPage
  };
});