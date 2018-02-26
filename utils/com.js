/**
 * 公共com
 * @type {{}}
 */

'use strict';
define(['module'], function (module) {
  var objApp = Object.create(null, {
    ipUrl: {
      value: '',
      writable: false,
      configurable: false
    }
  });
  (function() {
    this.init = function() {
      return '加载成功！'
    };
    this.initAjax = function(url, params, type, successFun) {
      $.ajax({
        url: url,
        data: params,
        type: type,
        cache: true,
        async: true,
        dataType: 'json',
        success: function(data) {
          if (successFun && typeof(successFun) === 'function') {
            successFun(data);
          }
        }
      });
    };
    this.addEvent = function(obj, type, handle) {
      try {
        obj.addEventListener(type, handle, false);
      } catch(e) {
        try {
          obj.attachEvent('on' + type, handle);
        } catch(e) {
          // obj['on' + type] = handle;
        }
      }
    };
    this.parseURL = function(urlParameter) {
      var _url = window.location.href.split('?')[1];
      if (_url !== undefined) {
        var _index;
        var _arr = _url.split('&');
        for (var i = 0, _len = _arr.length; i < _len; i++) {
          if (_arr[i].indexOf(urlParameter + '=') >= 0) {
            _index = i;
            break;
          } else {
            _index = -1;
          }
        }
        if (_index >= 0) {
          var _key = _arr[_index].split('=')[1];
          return _key;
        }
      }
    };
    this.isArray = Array.isArray || function(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }).apply(objApp);
  module.exports = objApp;
});