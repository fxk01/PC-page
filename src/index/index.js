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
    utils: '../../utils/index.min',
    text: '../../libs/text/text',
    textEsPorts: '../../template/index/esports.html',
    textOnline: '../../template/index/online.html'
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
  'text!textEsPorts',
  'text!textOnline',
  'module'
], function($, amui, dot, obj, esports, online, module) {
  var indexPage = function(obj) {
    return new indexPage.prototype.init(obj);
  };
  indexPage.prototype = {
    /*
    初始化
    */
    init: function(obj) {
      var self = this;
      q.reg('about', function() {
        document.getElementById('m').innerHTML = esports;
        self.esTpl();
      });

      q.reg('home', function() {
        document.getElementById('m').innerHTML = online;
      });

      q.init({
        key: '/',
        about: 'about',
        home: 'home'
      });
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
          console.log(json);
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
    },
    esTpl: function() {
      //测试数据
      var data=["北京","上海","广州","深圳","杭州","长沙","合肥","宁夏","成都","西安","南昌","上饶","沈阳","济南","厦门","福州","九江","宜春","赣州","宁波","绍兴","无锡","苏州","徐州","东莞","佛山","中山","成都","武汉","青岛","天津","重庆","南京","九江","香港","澳门","台北"];
      var nums = 5; //每页出现的数量
      var pages = Math.ceil(data.length / nums); //得到总页数

      var thisDate = function(curr) {
        //此处只是演示，实际场景通常是返回已经当前页已经分组好的数据
        var str = '',
            last = curr * nums - 1;
        last = last >= data.length ? (data.length - 1) : last;
        for (var i = (curr * nums - nums); i <= last; i++) {
          str += '<li>' + data[i] + '</li>';
        }
        return str;
      };
      $(function() {
        //返回的是一个page示例，拥有实例方法
        var $page = $("#page").page({
          pages: pages, //页数
          curr: 1, //当前页
          type: 'default', //主题
          groups: 5, //连续显示分页数
          prev: '<', //若不显示，设置false即可
          next: '>', //若不显示，设置false即可
          first: "首页",
          last: "尾页", //false则不显示
          before: function(context, next) { //加载前触发，如果没有执行next()则中断加载
            console.log('开始加载...');
            context.time = (new Date()).getTime(); //只是演示，并没有什么卵用，可以保存一些数据到上下文中
            next();
          },
          render: function(context, $el, index) { //渲染[context：对this的引用，$el：当前元素，index：当前索引]
            //逻辑处理
            if (index == 'last') { //虽然上面设置了last的文字为尾页，但是经过render处理，结果变为最后一页
              $el.find('a').html('最后一页');
              return $el; //如果有返回值则使用返回值渲染
            }
            return false; //没有返回值则按默认处理
          },
          after: function(context, next) { //加载完成后触发
            var time = (new Date()).getTime(); //没有什么卵用的演示
            console.log('分页组件加载完毕，耗时：' + (time - context.time) + 'ms');
            next();
          },
          /*
           * 触发分页后的回调，如果首次加载时后端已处理好分页数据则需要在after中判断终止或在jump中判断first是否为假
           */
          jump: function(context, first) {
            console.log('当前第：' + context.option.curr + "页");
            $("#content").html(thisDate(context.option.curr));
          }
        });

        $("#remove").click(function() {
          $page.remove(function() {
            console.log('移除分页组件成功');
          })
        });

        $("#set").click(function() {
          var page = $("#curr").val();
          $page.setCurr(page, function() {
            console.log('跳转到第' + page + "页");
          });
        })
      })
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