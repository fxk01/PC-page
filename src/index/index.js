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
    dot: '../../libs/dot/dot',
    utils: '../../utils/index.min'
  },
  shim: {
    utils: ['jquery']
  }
});

define([
  'jquery',
  'amui',
  'dot',
  'utils',
  'module'
], function($, amui, dot, obj, module) {
  var indexPage = function(obj) {
    return new indexPage.prototype.init(obj);
  };
  indexPage.prototype = {
    /*
    初始化
    */
    init: function(obj) {
      this['title'] = obj['title'];
      function string2Array(stringObj) {
        stringObj = stringObj.replace(/([\w,]∗)/, '$1');
        if (stringObj.indexOf('[') === 0) {
          stringObj = stringObj.substring(1, stringObj.length - 1);
        }
        var arr = stringObj.split(',');
        var newArray = [];
        for (var i = 0; i < arr.length; i++) {
          var arrOne = arr[i];
          newArray.push(arrOne);
        }
        return newArray;
      }
      // console.log(obj.title.arr);
      $('#shclFireballs').shCircleLoader();
      $('#shclFireballs2').shCircleLoader();
      var _listArr = '';
      $.get('../../public/data/list.json').done(function(data){
        _listArr = string2Array(data.arr);
        _listArr.forEach(function(json) {
        });
      });
      setTimeout(function () {
        var interText = dot.template($('#interpolationTpl').text());
        $('#interpolation').html(interText(_listArr));
      }, 2000);

      setTimeout(function () {
        var interText2 = dot.template($('#interpolationTpl2').text());
        $('#interpolation2').html(interText2(_listArr));
      }, 5000);

      //引入第三方插件
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
    title: {
      arr: [1, 2, 3]
    },
    indexPage: indexPage
  };
});