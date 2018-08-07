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
    amui: '../../static/amazeui/js/amazeui.min',
    dot: '../../libs/dot/dot'
  },
  shim: {
    utils: ['jquery']
  }
});

define([
  'jquery',
  'amui',
  'dot',
  'module'
], function($, amui, dot, module) {
  function esPorTs(r) {
    this.r = r;
  }
  esPorTs.PI = 3.14159;
  esPorTs.prototype.area = function() {
    $('#bt').on('click', function() {
      console.log(13)
    });

    $("#app").html(dot.template($("#tpl").html())({
      name: 'stringParams1',
      stringParams1: 'stringParams1_value',
      stringParams2: 1,
      arr: [{id:0,text:'val1',num:1},{id:1,text:'val2',num:1}],
      sayHello: function() {
        return this[this.name]
      }
    }));
    return esPorTs.PI * this.r * this.r;
  };

  var c = new esPorTs(1.0);
  module.exports = {
    esPorTs: c
  };
});