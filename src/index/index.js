/**
 * index业务逻辑
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

define(['jquery', 'amui', 'utils', 'module'], function($, amui, utils, module) {
  var indexPage = function() {
    return new indexPage.prototype.init();
  };
  indexPage.prototype = {
    /*
    初始化
    */
    init: function() {
      console.log(amui);
      //引入第三方插件
      // console.log(comTarget);
      // $('p#beatText').loginAjax();
      $('p#beatText').beatText({isAuth:false,isRotate:false});
      $('p#rotateText').beatText({isAuth:false,isRotate:true});
      $('p#autoText').beatText({isAuth:true,beatHeight:"3em",isRotate:false});
      $('p#roloadText').beatText({isAuth:true,beatHeight:"1em",isRotate:false,upTime:100,downTime:100});
      $('p#autoRotateText').beatText({isAuth:true,upTime:700,downTime:700,beatHeight:"3em",isRotate:true});
    }
  };
  indexPage.prototype.init.prototype = indexPage.prototype;
  module.exports = {
    indexPage: indexPage
  };
});