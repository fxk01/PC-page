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


/*! modelite.js v0.3.0 | (c) 2015, Kan Kung-Yip. | MIT */
var slice=[].slice;!function(){var e,t,n,r,a,i,l,s,u,o;if(!jQuery)throw new Error("First require jQuery!");return l=function(e,t){var n,r,a;if(null==e&&(e=10),null==t&&(t=!1),"boolean"==typeof e&&(r=[8,e],e=r[0],t=r[1]),!t)return Math.floor(Math.random()*e);for(n="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789","string"==typeof t&&(n=t),a="";a.length<e;)a+=n[l(n.length)];return a},n=function(e,t){var r,a,i;if(e){if(a=t.indexOf("."),-1===a)return e[t];if(r=t.substr(0,a),isNaN(i=parseInt(r))||(r=i),e[r])return n(e[r],t.substr(a+1))}},u=function(e,t,n){var r,a,i,l;return a=t.indexOf("."),-1===a?("undefined"==typeof n?delete e[t]:e[t]=n,n):(r=t.substr(0,a),isNaN(i=parseInt(r))||(r=i),t=t.substr(a+1),e[r]||(l=t,a=t.indexOf("."),-1!==a&&(l=l.substr(0,a)),e[r]=isNaN(parseInt(l))?{}:[]),u(e[r],t,n))},t=function(e){var t,n,r,a,i,l,s,u,o,m,c,f;for(t=/\( *(\w+) *\) *(\w+) *\:?([^\(]*)/g;o=t.exec(e.attr("ml-events"));)s=o.slice(1,4),f=s[0],i=s[1],l=s[2],("repeat"===f||"each"===f||"insert"===f||"remove"===f)&&(f="ml-"+f),c=e[0].tagName.toLowerCase(),"change"===f&&"input"===c&&(f="ml-change"),e.on(f,{type:f,name:i,raw:l},function(){var e,t,n,r,a,s,u,o,m,c,d,g,p,h,b,v,y;if(t=arguments[0],e=2<=arguments.length?slice.call(arguments,1):[],t.stopPropagation(),m=t.data,f=m.type,i=m.name,l=m.raw,null==l&&(l=""),n=null!=(c=ml.EVENTS)?c[i]:void 0,"function"==typeof n){if(r=$(this),h=r.closest("[name='#']"),b=h.attr("ml-binding"),"string"==typeof b&&(p=new RegExp(b.replace(/\d+/g,"#"))),o=function(e){return null==e&&(e=""),e=e.trim(),p&&-1!==e.indexOf("#")&&(e=e.replace(p,b)),e},t.data=o(l),-1!==l.indexOf("="))for(t.data={},d=l.split(","),a=0,u=d.length;u>a;a++)v=d[a],v&&(g=v.split("="),s=g[0],y=g[1],t.data[s.trim()]=o(y));return e.unshift(t),n.apply(r,e)}});for(u=["insert","remove"],m=[],n=0,a=u.length;a>n;n++)f=u[n],(r=e.attr("ml-"+f))&&m.push(e.on("click",{type:f,keypath:r},function(e){var t,n,a,i,l,s;return e.stopPropagation(),a=e.data,f=a.type,r=a.keypath,null==r&&(r=""),t=ml[f],"function"==typeof t?(n=$(this),r=r.trim(),-1!==r.indexOf("#")&&(l=n.closest("[name='#']"),s=l.attr("ml-binding"),i=new RegExp(s.replace(/\d+/g,"#")),r=r.replace(i,s)),t.call(n,r),setTimeout(function(){return n.triggerHandler("ml-"+f,r)})):void 0}));return m},e=function(t){var n,r;return null==ml.TEMPLATES&&(ml.TEMPLATES={}),ml.TEMPLATES[n=l(!0)]?e(t):(r=t.closest("[name][name!='#']"),ml.TEMPLATES[n]=t,r.attr("ml-template",n),t.detach())},o=function(e,t){var r,a,i,l,s,m,c,f;if(i=e.attr("ml-binding"),i||e.attr("ml-binding",i=e.attr("name")),t||(t=n(ml.DATA,i)),c=e.find("[name]"),f=e.attr("ml-template"),!f)return 0===c.length?o.single(i,e,t):(t||(t=u(ml.DATA,i,{})),void c.each(function(){var e,n;return e=$(this),o.bound||!e.attr("ml-binding")?(n=e.attr("name"),e.attr("ml-binding",i+"."+n),o(e,t[n])):void 0}));if($.isArray(t)||(t=u(ml.DATA,i,[])),t.reserve=0,isNaN(s=parseInt(e.attr("ml-reserve")))||(t.reserve=s),l=t.reserve-t.length,l>0)for(r=a=0,m=l;m>=0?m>a:a>m;r=m>=0?++a:--a)t.push(null);return o.repeat(e,ml.TEMPLATES[f],t),e.triggerHandler("ml-repeat",t.length)},o.repeat=function(e,t,n){var r,a,i,l,s,u,m,c,f,d,g;if(e.empty(),$.isArray(n)){for(c=e.attr("ml-binding"),f=e.attr("ml-template"),s=n.length,m=[],r=a=0,l=n.length;l>a;r=++a)d=n[r],i=c+"."+r,u=t.clone(!0),u.attr("ml-binding",i),u.attr("ml-belong",f),e.append(u),o.repeat.mode(u,r,s),g=u.find("[name='$']"),g.length?o.single(i,g,d):o(u,d),m.push(u.triggerHandler("ml-each",r));return m}},o.repeat.mode=function(e,t,n){var r,a;return r=n-1,a=e.attr("ml-belong"),e.find("[ml-repeat]").each(function(){var e,n;if(e=$(this),n=e.attr("ml-repeat"),a===e.closest("[name='#']").attr("ml-belong"))switch(e.css("display",""),e.attr("ml-repeat")){case"header":if(t>0)return e.css("display","none");break;case"body":if(!(t>0&&r>t))return e.css("display","none");break;case"odd":if(!(t%2))return e.css("display","none");break;case"even":if(t%2)return e.css("display","none");break;case"footer":if(r>t)return e.css("display","none")}})},o.single=function(e,t,r){var a,i,l;switch(("undefined"==typeof r||null===r||0===r.length)&&(r=t.attr("ml-default")||null,"string"==typeof r&&/^[\[\{]/.test(r)&&(r=JSON.parse(r)),u(ml.DATA,e,r)),t[0].tagName.toLowerCase()){case"input":switch(l=t.attr("type")||"text",l.toLowerCase()){case"text":case"email":a="keyup blur";break;default:a="change"}switch(t.data("changeEvent")||(t.data("changeEvent",!0),t.on(a,{type:l},function(t){var r,a,i,l,s;if(t.stopPropagation(),r=$(this),a="checkbox"===t.data.type,e=r.attr("ml-binding"),s=r.data("value"),"undefined"==typeof s)switch(t.data.type){case"checkbox":case"radio":i=$("[ml-binding='"+e+"'][type='"+t.data.type+"']"),s=i.index(r);break;default:s=r.val()}if(l=n(ml.DATA,e),a)if($.isArray(l)||(l=[]),r.prop("checked")){if(-1!==l.indexOf(s))return;l.push(s),u(ml.DATA,e,l)}else{if(-1===l.indexOf(s))return;l.splice(l.indexOf(s),1),u(ml.DATA,e,l)}else{if(l===s)return;u(ml.DATA,e,s)}return r.triggerHandler("ml-change"),$("[ml-binding='"+e+"']").not(r).each(function(){var t,n;return t=$(this),n=t.find("[name='$']"),n.length?o.single(e,n,s):o.single(e,t,s)})})),l){case"checkbox":if(!$.isArray(r))return;return $("[ml-binding='"+e+"'][type='checkbox']").not(t).each(function(e){var t,n;return t=$(this),n=parseInt(t.data("value")),isNaN(n)&&(n=e),t.prop("checked",-1!==r.indexOf(n))});case"radio":if(isNaN(i=parseInt(r)))return;return $("[ml-binding='"+e+"'][type='radio']").not(t).each(function(e){var t,n;return t=$(this),n=parseInt(t.data("value")),isNaN(n)&&(n=e),t.prop("checked",i===n)});default:return t.val(r)}break;case"meta":return u(ml.DATA,e,t.attr("content"));case"img":return null==r&&(r=t.attr("ml-placeholder")),t.attr("src",r);default:return null==r&&(r=t.attr("ml-placeholder")),t.text(r)}},r=function(e,t,n){var r,a,l,s,u,m;if(!(m=e.attr("ml-template")))throw new Error("template is "+m);return s=e.attr("ml-binding"),a=s+"."+t,l=ml.TEMPLATES[m].clone(!0),l.attr("ml-binding",a),l.attr("ml-belong",m),r=e.find("[ml-binding='"+a+"']"),r.length?l.insertBefore(r):e.append(l),i(e),u=l.find("[name='$']"),u.length?o.single(a,u,n):o(l,n),l.triggerHandler("ml-each",t)},s=function(e,t){var n,r,a;if(a=e.attr("ml-binding"),n=a+"."+t,r=e.find("[ml-binding='"+n+"']"),!r.length)throw new Error("not found "+n);return setTimeout(r.remove,1e3),r.detach(),i(e)},i=function(e){var t,n,r,a,i;return a=e.attr("ml-binding"),i=e.attr("ml-template"),n=new RegExp(a+"\\.\\d+","g"),r=e.find("[ml-belong='"+i+"']"),t=r.length,r.each(function(e){var r,i,l;return r=$(this),i=r.attr("ml-binding"),l=a+"."+e,r.attr("ml-binding",i.replace(n,l)),o.repeat.mode(r,e,t),r.find("[ml-binding*='"+i+"']").each(function(){var e;return r=$(this),e=r.attr("ml-binding"),r.attr("ml-binding",e.replace(n,l))})})},a=window.ml=window.modelite=function(e,t){if("string"!=typeof e)throw TypeError(e+" is not string");return"undefined"==typeof t?n(ml.DATA,e):(u(ml.DATA,e,t),$("[ml-binding='"+e+"']").each(function(){return o($(this))}))},ml.clear=function(e){return ml(e,null)},ml.insert=function(e,t){var a,i,l,s;if(null==t&&(t=null),"string"!=typeof e)throw TypeError(e+" is not string");return l=e.lastIndexOf("."),a=NaN,-1!==l&&(a=parseInt(e.substr(l+1))),isNaN(a)?a=Number.MAX_VALUE:e=e.substr(0,l),s=n(ml.DATA,e),$.isArray(s)||(s=u(ml.DATA,e,[])),i=s.length,a>i&&(a=i),0>a&&(a=i+a),0>a&&(a=0),s.splice(a,0,t),$("[ml-binding='"+e+"']").each(function(){return r($(this),a,t)})},ml.remove=function(e){var t,r,a,i,l,u,o,m,c;if("string"!=typeof e)throw TypeError(e+" is not string");if(l=e.lastIndexOf("."),r=NaN,-1!==l&&(r=parseInt(e.substr(l+1))),isNaN(r)?r=Number.MAX_VALUE:e=e.substr(0,l),c=n(ml.DATA,e),$.isArray(c)&&c.length&&(i=c.length-1,r>i&&(r=i),0>r&&(r=i+r),0>r&&(r=0),c.splice(r,1),$("[ml-binding='"+e+"']").each(function(){return s($(this),r)}),c.length<c.reserve)){for(m=[],t=a=u=c.length,o=c.reserve;o>=u?o>a:a>o;t=o>=u?++a:--a)m.push(ml.insert(e));return m}},ml.emit=function(){var e,t,n,r,a;return n=arguments[0],e=2<=arguments.length?slice.call(arguments,1):[],1===e.length&&"string"==typeof e[0]?(t=$("[ml-binding='"+n+"']"),t.triggerHandler(e[0])):null!=(r=ml.EVENTS)&&null!=(a=r[n])?a.apply(null,e):void 0},$(function(){return null==ml.DATA&&(ml.DATA={}),null==ml.EVENTS&&(ml.EVENTS={}),$("[ml-events], [ml-insert], [ml-remove]").each(function(){return t($(this))}),$("[name='#']").each(function(){return e($(this))}),$("[name]").each(function(){return o($(this))}),o.bound=!0})}();