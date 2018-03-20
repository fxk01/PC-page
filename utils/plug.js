/**
 *  jQ公共组件插件开发
 *  @$.fn.xxx..
 **/

(function($, win, doc) {
  /**
   * $('#shclFireballs').shCircleLoader();
   * <div id="shclFireballs"></div>
   * @param first
   * @param second
   */
  $.fn.shCircleLoader = function(first, second) {
    var defaultNamespace = "shcl",
        id = 1,
        sel = $(this);

    // Destroy the loader
    if (first === "destroy") {
      sel.find("." + defaultNamespace).detach();
      return;

      // Show progress status into the center
    } else if ((first === "progress") && (typeof second !== "undefined")) {
      sel.each(function() {
        var el = $(this),
            outer = el.find('.' + defaultNamespace);
        if (!outer.get(0))
          return;
        if (!el.find('span').get(0))
          outer.append("<span></span>");
        var span = outer.find('span').last();
        span.html(second).css({
          position: "absolute",
          display: "block",
          left: Math.round((outer.width() - span.width()) / 2) + "px",
          top: Math.round((outer.height() - span.height()) / 2) + "px"
        });
      });
      return;
    }

    // Default options
    var o = {
      namespace: defaultNamespace,
      radius: "auto", // "auto" - calculate from selector's width and height
      dotsRadius: "auto",
      color: "auto", // "auto" - get from selector's color CSS property; null - do not set
      dots: 12,
      duration: 1,
      clockwise: true,
      externalCss: false, // true - don't apply CSS from the script
      keyframes: '0%{{prefix}transform:scale(1)}80%{{prefix}transform:scale(.3)}100%{{prefix}transform:scale(1)}',
      uaPrefixes: ['o', 'ms', 'webkit', 'moz', '']
    };

    $.extend(o, first);

    // Usable options (for better YUI compression)
    var cl = o.color,
        ns = o.namespace,
        dots = o.dots,
        eCss = o.externalCss,
        ua = o.uaPrefixes,

        // Helper functions
        no_px = function(str) {
          return str.replace(/(.*)px$/i, "$1");
        },

        parseCss = function(text) {
          var i, prefix, ret = "";
          for (i = 0; i < ua.length; i++) {
            prefix = ua[i].length ? ("-" + ua[i] + "-") : "";
            ret += text.replace(/\{prefix\}/g, prefix);
          }
          return ret;
        },

        prefixedCss = function(property, value) {
          var ret = {};
          if (!property.substr) {
            $.each(property, function(p, v) {
              $.extend(ret, prefixedCss(p, v));
            });
          } else {
            var i, prefix;
            for (i = 0; i < ua.length; i++) {
              prefix = ua[i].length ? ("-" + ua[i] + "-") : "";
              ret[prefix + property] = value;
            }
          }
          return ret;
        };

    // Get unexisting ID
    while ($('#' + ns + id).get(0)) {id++;}

    // Create animation CSS
    if (!eCss) {
      var kf = o.keyframes.replace(/\s+$/, "").replace(/^\s+/, "");

      // Test if the first keyframe (0% or "from") has visibility property. If not - add it.
      if (!/(\;|\{)\s*visibility\s*\:/gi.test(kf))
        kf = /^(0+\%|from)\s*\{/i.test(kf)
            ? kf.replace(/^((0+\%|from)\s*\{)(.*)$/i, "$1visibility:visible;$3")
            : (/\s+(0+\%|from)\s*\{/i.test(kf)
                ? kf.replace(/(\s+(0+\%|from)\s*\{)/i, "$1visibility:visible;")
                : ("0%{visibility:visible}" + kf));

      $($('head').get(0) ? 'head' : 'body').append('<style id="' + ns + id + '" type="text/css">' + parseCss('@{prefix}keyframes ' + ns + id + '_bounce{' + kf + '}') + '</style>');
    }

    // Create loader
    sel.each(function() {
      var r, dr, i, dot, rad, x, y, delay, offset, css, cssBase = {}, el = $(this), l = el.find('.' + defaultNamespace);

      // If loader exists, destroy it before creating new one
      if (l.get(0))
        l.shCircleLoader("destroy");

      el.html('<div class="' + ns + ((ns != defaultNamespace) ? (" " + defaultNamespace) : "") + '"></div>');

      if (eCss)
        el = el.find('div');

      x = el.innerWidth() - no_px(el.css('padding-left')) - no_px(el.css('padding-right'));
      y = el.innerHeight() - no_px(el.css('padding-top')) - no_px(el.css('padding-bottom'));

      r = (o.radius == "auto")
          ? ((x < y) ? (x / 2) : (y / 2))
          : o.radius;

      if (!eCss) {
        r--;
        if (o.dotsRadius == "auto") {
          dr = Math.abs(Math.sin(Math.PI / (1 * dots))) * r;
          dr = (dr * r) / (dr + r) - 1;
        } else
          dr = o.dotsRadius;

        el = el.find('div');

        i = Math.ceil(r * 2);
        css = {
          position: "relative",
          width: i + "px",
          height: i + "px"
        };

        if (i < x)
          css.marginLeft = Math.round((x - i) / 2);
        if (i < y)
          css.marginTop = Math.round((y - i) / 2);

        el.css(css);

        i = Math.ceil(dr * 2) + "px";
        cssBase = {
          position: "absolute",
          visibility: "hidden",
          width: i,
          height: i
        };

        if (cl !== null)
          cssBase.background = (cl == "auto") ? el.css('color') : cl;

        $.extend(cssBase, prefixedCss({
          'border-radius': Math.ceil(dr) + "px",
          'animation-name': ns + id + "_bounce",
          'animation-duration': o.duration  + "s",
          'animation-iteration-count': "infinite",
          'animation-direction': "normal"
        }));
      }

      for (i = 0; i < dots; i++) {
        el.append("<div></div>");
        if (eCss && (typeof dr === "undefined"))
          dr = (no_px(el.find('div').css('width')) / 2);
        dot = el.find('div').last();
        delay = (o.duration / dots) * i;
        rad = (2 * Math.PI * i) / dots;
        offset = r - dr;
        x = offset * Math.sin(rad);
        y = offset * Math.cos(rad);

        if (o.clockwise) y = -y;

        css = {
          left: Math.round(x + offset) + "px",
          top: Math.round(y + offset) + "px"
        };

        if (delay)
          $.extend(css, prefixedCss('animation-delay', delay + 's'));

        $.extend(css, cssBase);
        dot.css(css);
      }
    });
  };
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