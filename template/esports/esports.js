/**
 * esports业务逻辑
 */

'use strict';
require.config({
  baseUrl: '',
  urlArgs: 'bust=' + new Date().getTime(),
  waitSeconds: 0,
  paths: {
    jquery: '../../libs/jquery/jquery-2.1.4',
    amui: '../../static/amazeui/js/amazeui.min'
  },
  shim: {
    utils: ['jquery']
  }
});

define([
  'jquery',
  'amui',
  'module'
], function($, amui, module) {
  function esPorTs(r) {
    this.r = r;
  }
  esPorTs.PI = 3.14159;
  esPorTs.prototype.area = function() {
    $('#bt').on('click', function() {
      console.log(13)
    });
    return esPorTs.PI * this.r * this.r;
  };

  var c = new esPorTs(1.0);
  module.exports = {
    esPorTs: c
  };
});