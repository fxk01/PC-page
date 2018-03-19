/**
 * detail业务逻辑
 */

'use strict';
require.config({
  baseUrl: '',
  urlArgs: 'bust=' + new Date().getTime(),
  waitSeconds: 0,
  paths: {
    jquery: '../../libs/jquery/jquery-2.1.4',
    amui: '../../static/amazeui/js/amazeui.min',
    underscore: '../../libs/underscore/underscore.min',
    backbone: '../../libs/backbone/backbone.min',
    utils: '../../utils/index.min',
    text: '../../libs/text/text',
    text1: '../../template/detail/gmv.html',
    text2: '../../template/detail/mobile.html'
  },
  shim: {
    utils: ['jquery'],
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  }
});

define([
  'jquery',
  'amui',
  'underscore',
  'backbone',
  'utils',
  'text!text1',
  'text!text2',
  'module'
], function($, amui, underscore, backbone, obj, template1, template2, module) {
  var People = backbone.Model.extend({
    name: null,
    ctime: null
  });

  var Peoples = backbone.Collection.extend({
    initialize: function(models,options){
      this.bind("add",options.view.addOnePerson);
    }
  });

  var AppView = backbone.View.extend({
    el: $('body'),
    initialize: function(){
      this.peoples = new Peoples(null,{view:this})
    },
    events: {
      "click #check":"checkIn",
      "click #ck": "checkIn2"
    },
    checkIn: function() {
      var person_name = prompt("您的姓名是？");
      if(person_name === ''){
        person_name = '路人甲';
      }
      var ctime = new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds();
      var person = new People({name:person_name,ctime:ctime});
      this.peoples.add(person);
    },
    checkIn2: function() {
      console.log(1);
    },
    addOnePerson: function(model) {
      $("#person-list").append("<li>"+model.get('name')+"您好，您的打卡时间为："+model.get('ctime')+"</li>");
    }
  });

  var appview = new AppView;

  var detailPage = function() {
    return new detailPage.prototype.init();
  };
  detailPage.prototype = {
    /*
      初始化
     */
    init: function() {
      var self = this;
      var MyRouter = backbone.Router.extend({
        routes: {
          'detail/gmv': 'gmv',
          'detail/mobile': 'mobile'
        },
        gmv: function() {
          $('#page').html(template1);
          self.t1();
        },
        mobile: function(params) {
          $('#page').html(template2);
          self.t2();
        }
      }) ;
      var myRouter = new MyRouter();
      Backbone.history.start();
    },
    t1: function() {

    },
    t2: function() {

    }
  };
  detailPage.prototype.init.prototype = detailPage.prototype;
  module.exports = {
    detailPage: detailPage
  };
});