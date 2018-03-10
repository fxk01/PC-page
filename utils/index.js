/**
 * 公共单例
 * @com
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

/**
 *  jQ公共组件插件开发
 *  @$.fn.xxx..
 **/

(function($, win, doc) {
  $.fn.loginAjax = function(options) {
    return 1;
  };
  $.fn.loginAjax2 = function(options) {
    var objThat = this, iSok = false;
    //自定义规则
    var defaults = {
      //验证错误提示信息
      tips_success: '',
      tips_required: '不能为空！',
      tips_mail: '请输入正确的邮箱！',
      //匹配正则
      reg_mail: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/ //验证E-mail
    };

    if (options) {
      $.extend(defaults, options);
    }

    function _onButton() {
      iSok = true;
      $(":text, :password").each(function() {
        var _validate = $(this).attr("data-check"),
            _name = $(this).attr("data-news");
        if (_validate) {
          var arr = _validate.split('||');
          for (var i = 0, l = arr.length; i < l; i++) {
            if (!check($(this), arr[i], $(this).val(), _name)) {
              iSok = false;
              return false;
            } else {
              continue;
            }
          }
        }
      });
    }

    if (objThat.is('form')) {
      objThat.submit(function(e) {
        _onButton();
        e.preventDefault();
        if (iSok === true) {
          var arr;
          var num = 0;
          var data = {
            username: '',
            password: '',
            captcha: ''
          };
          var data2 = [];

          $('.tpl-form-input').each(function(item) {
            arr = $(this).val();
            data2[item] = arr;
          });
          $.each(data, function(k, v) {
            data[k] = data2[num];
            num++;
          });
          singleMode.ajaxFun(singleMode.url + 'user/login', data, 'post', function(json) {
            if(json['ok'] === false) {
              $('.am-modal-bd').text(json['msg']);
              $('#my-alert').modal('open');
              $('.login-yzm-img').attr('src', singleMode.url + 'user/next?' + Math.random());
            } else {
              var date = new Date();
              date.setTime(date.getTime() + (120 * 60 * 1000));
              $.cookie('JSESSIONID', json['JSESSIONID'], {expires: date});
              $.cookie('username', json.username, {expires: date});
              $.cookie('id', json.id, {expires: date});
              window.location.href = 'table-list.html?page=1'
            }
          });
        }
      });
    }

    var check = function(obj, _match, _val, _name) {
      switch (_match) {
        case 'required':
          return $.trim(_val) !== '' ? showMsg(obj, defaults.tips_success, true) : showMsg(obj, _name + defaults.tips_required, false);
          // case 'email':
          //   return chk(_val, defaults.reg_mail) ? showMsg(obj, defaults.tips_success, true) : showMsg(obj, defaults.tips_mail, false);
        default:
          return true;
      }
    };

    var chk = function(str, reg) {
      return reg.test(str);
    };

    var showMsg = function(obj, msg, mark) {
      if (mark) {

      } else {
        $('.am-modal-bd').text(msg);
        $('#my-alert').modal('open');
      }
      return mark;
    };
  };
  $.fn.beatText = function(options) {
    var defaults = {
      beatHeight: '2em',
      upTime: 700,
      downTime: 700,
      isAuth:true,
      isRotate:true
    };
    var options = $.extend(defaults, options);
    return this.each(function() {
      var obj = $(this);
      if (obj.text() !== obj.html()) {
        return
      }
      var text = obj.text();
      var newMarkup = '';
      for (var i = 0; i <= text.length; i++) {
        var character = text.slice(i, i + 1);
        newMarkup += ($.trim(character)) ? '<span class="beat-char">' + character + '</span>' : character
      }
      obj.html(newMarkup);
      if(!options.isAuth){
        obj.find('span.beat-char').each(function(index,el) {
          $(this).mouseover(function() {
            beatAnimate($(this),options);
          })
        })
      }else{
        obj.find('span.beat-char:first').animate({
          bottom: options.beatHeight
        }, {
          queue: false,
          duration: options.upTime,
          easing: 'easeOutCubic',
          complete: function() {
            $(this).animate({
              bottom: 0
            }, {
              queue: false,
              duration: options.downTime,
              easing: 'easeOutBounce',
              complete:function(){
                beatAnimate($(this).next(),options);
              }
            })
          }
        });
      }
    })
  };
  function beatAnimate(el,options){
    if(options.isRotate){
      el.addClass("rotate");
    }
    el.animate({
      bottom: options.beatHeight
    }, {
      queue: false,
      duration: options.upTime,
      easing: 'easeOutCubic',
      complete: function() {
        el.removeClass("rotate");
        $(this).animate({
          bottom: 0
        }, {
          queue: false,
          duration: options.downTime,
          easing: 'easeOutBounce',
          complete:function(){
            if(options.isAuth){
              var len = el.parent().children().length;
              var indexNum = el.index();
              if(indexNum == (len-1)){
                beatAnimate(el.parent().find('span.beat-char:first'),options);
              }else{
                beatAnimate(el.next(),options);
              }
            }
          }
        })
      }
    })
  }
})(jQuery, window, document);
/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright 漏 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
  {
    def: 'easeOutQuad',
    swing: function (x, t, b, c, d) {
      //alert(jQuery.easing.default);
      return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
    },
    easeInQuad: function (x, t, b, c, d) {
      return c*(t/=d)*t + b;
    },
    easeOutQuad: function (x, t, b, c, d) {
      return -c *(t/=d)*(t-2) + b;
    },
    easeInOutQuad: function (x, t, b, c, d) {
      if ((t/=d/2) < 1) return c/2*t*t + b;
      return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInCubic: function (x, t, b, c, d) {
      return c*(t/=d)*t*t + b;
    },
    easeOutCubic: function (x, t, b, c, d) {
      return c*((t=t/d-1)*t*t + 1) + b;
    },
    easeInOutCubic: function (x, t, b, c, d) {
      if ((t/=d/2) < 1) return c/2*t*t*t + b;
      return c/2*((t-=2)*t*t + 2) + b;
    },
    easeInQuart: function (x, t, b, c, d) {
      return c*(t/=d)*t*t*t + b;
    },
    easeOutQuart: function (x, t, b, c, d) {
      return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeInOutQuart: function (x, t, b, c, d) {
      if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
      return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    easeInQuint: function (x, t, b, c, d) {
      return c*(t/=d)*t*t*t*t + b;
    },
    easeOutQuint: function (x, t, b, c, d) {
      return c*((t=t/d-1)*t*t*t*t + 1) + b;
    },
    easeInOutQuint: function (x, t, b, c, d) {
      if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
      return c/2*((t-=2)*t*t*t*t + 2) + b;
    },
    easeInSine: function (x, t, b, c, d) {
      return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    },
    easeOutSine: function (x, t, b, c, d) {
      return c * Math.sin(t/d * (Math.PI/2)) + b;
    },
    easeInOutSine: function (x, t, b, c, d) {
      return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    },
    easeInExpo: function (x, t, b, c, d) {
      return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    },
    easeOutExpo: function (x, t, b, c, d) {
      return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    },
    easeInOutExpo: function (x, t, b, c, d) {
      if (t==0) return b;
      if (t==d) return b+c;
      if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
      return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function (x, t, b, c, d) {
      return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
    },
    easeOutCirc: function (x, t, b, c, d) {
      return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    },
    easeInOutCirc: function (x, t, b, c, d) {
      if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
      return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    },
    easeInElastic: function (x, t, b, c, d) {
      var s=1.70158;var p=0;var a=c;
      if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
      if (a < Math.abs(c)) { a=c; var s=p/4; }
      else var s = p/(2*Math.PI) * Math.asin (c/a);
      return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    easeOutElastic: function (x, t, b, c, d) {
      var s=1.70158;var p=0;var a=c;
      if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
      if (a < Math.abs(c)) { a=c; var s=p/4; }
      else var s = p/(2*Math.PI) * Math.asin (c/a);
      return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    easeInOutElastic: function (x, t, b, c, d) {
      var s=1.70158;var p=0;var a=c;
      if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
      if (a < Math.abs(c)) { a=c; var s=p/4; }
      else var s = p/(2*Math.PI) * Math.asin (c/a);
      if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
      return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    },
    easeInBack: function (x, t, b, c, d, s) {
      if (s == undefined) s = 1.70158;
      return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    easeOutBack: function (x, t, b, c, d, s) {
      if (s == undefined) s = 1.70158;
      return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    easeInOutBack: function (x, t, b, c, d, s) {
      if (s == undefined) s = 1.70158;
      if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
      return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    easeInBounce: function (x, t, b, c, d) {
      return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
    },
    easeOutBounce: function (x, t, b, c, d) {
      if ((t/=d) < (1/2.75)) {
        return c*(7.5625*t*t) + b;
      } else if (t < (2/2.75)) {
        return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
      } else if (t < (2.5/2.75)) {
        return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
      } else {
        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
      }
    },
    easeInOutBounce: function (x, t, b, c, d) {
      if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
      return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
    }
  });

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright 漏 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */
/**
 * @desc 常用工具库函数
 * @desc 常用正则
 */

'use strict';
var toolClass = {
  uPattern: /^[a-zA-Z0-9_-]{4,16}$/, //用户名正则，4到16位（字母，数字，下划线，减号）
  pPattern: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/, //密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
  cP: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, //身份证号（18位）正则
  dP1: /^\d{4}(\-)\d{1,2}\1\d{1,2}$/, //日期正则，简单判定,未做月份及日期的判定
  urlP: /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, //URL正则
  ePattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, //Email正则
  mPattern: /^[1][3][0-9]{9}$/, //手机号正则
  cnPattern: /[\u4E00-\u9FA5]/, //包含中文正则
  Regex_MondyNum: /^\d+(\.\d{1,2})?$/, //金额，允许两位小数
  integerPattern: /^-?\d+$/, //整数
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
  },
  /**
   * @desc   大小写转换
   * @param  {String} str
   * @param  {Number} type 1:首字母大写  2:首页母小写  3:大小写转换 4:全部大写 5:全部小写
   * @return {String}
   */
  changeCase: function (str, type) {
    function ToggleCase(str) {
      var itemText = "";
      str.split("").forEach(function (item) {
        if (/^([a-z]+)/.test(item)) {
          itemText += item.toUpperCase();
        } else if (/^([A-Z]+)/.test(item)) {
          itemText += item.toLowerCase();
        } else {
          itemText += item;
        }
      });
      return itemText;
    }
    switch (type) {
      case 1:
        return str.replace(/\b\w+\b/g, function (word) {
          return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
        });
      case 2:
        return str.replace(/\b\w+\b/g, function (word) {
          return word.substring(0, 1).toLowerCase() + word.substring(1).toUpperCase();
        });
      case 3:
        return ToggleCase(str);
      case 4:
        return str.toUpperCase();
      case 5:
        return str.toLowerCase();
      default:
        return str;
    }
  }
};

