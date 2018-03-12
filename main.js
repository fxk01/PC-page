/**
 * 加载 require.config执行baseUrl为'js'，
 * baseUrl指的模块文件的根目录，可以是绝对路径或相对路径
 * 路由加载页面
 */

'use strict';
var routeJump = function() {
  var browser = navigator.appName,
      b_version = navigator.appVersion,
      version = b_version.split(';'),
      routeHref = window.location.href.split('/'),
      routeHtml = routeHref[routeHref.length - 1].match(/\w+.html+/g)[0];
  if(typeof version[1] !== 'undefined') {
    var trim_Version = version[1].replace(/[ ]/g,'');
  }
  this.init = function() {
    var self = this;
    self._controlPage();
  };
  this._trueAndFalseIe = function(type) {
    var msIe = type.replace(/[.][\w]/g, '');
    if(browser === 'Microsoft Internet Explorer') {
      var data = {
        MSIE6: 'MSIE6.0',
        MSIE7: 'MSIE7.0',
        MSIE8: 'MSIE8.0',
        MSIE9: 'MSIE9.0'
      };
      return data[msIe] ? data[msIe] : false;
    }
  };
  this._controlPage = function() {
    trim_Version && this._trueAndFalseIe(trim_Version) ? window.location.href = '../../src/404/404.html' : console.log('浏览器版本正常！');
    var cacheTimePage = new Date().getTime();
    switch(routeHtml) {
      case 'index.html':
        require(['../index/index.js?bust=' + cacheTimePage + ''], function (obj) {
          obj.indexPage(obj);
        });
        break;
      case 'detail.html':
        require(['../detail/detail.js?bust=' + cacheTimePage + ''], function (obj) {
          obj.detailPage();
        });
        break;
      default:
    }
  };
  this.init();
};
new routeJump();