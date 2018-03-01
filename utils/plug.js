/**
 *  jQ公共组件插件开发
 *  @$.fn.xxx..
 **/

(function($, win, doc) {
  $.fn.loginAjax = function(options) {
    console.log(1);
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