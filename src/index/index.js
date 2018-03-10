/**
 * index业务逻辑
 */

// 'use strict';
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

define([
  'jquery',
  'amui',
  'utils',
  'module'
], function($, amui, obj, module) {
  var indexPage = function() {
    return new indexPage.prototype.init();
  };
  indexPage.prototype = {
    /*
    初始化
    */
    init: function() {
      function DataBinder( object_id ) {
        // Create a simple PubSub object
        var pubSub = {
            callbacks: {},

            on: function( msg, callback ) {
              this.callbacks[ msg ] = this.callbacks[ msg ] || [];
              this.callbacks[ msg ].push( callback );
            },

            publish: function( msg ) {
              this.callbacks[ msg ] = this.callbacks[ msg ] || [];
              for ( var i = 0, len = this.callbacks[ msg ].length; i < len; i++ ) {
                this.callbacks[ msg ][ i ].apply( this, arguments );
              }
            }
          },

          data_attr = "data-bind-" + object_id,
          message = object_id + ":input",
          timeIn;

        changeHandler = function( evt ) {
          var target = evt.target || evt.srcElement, // IE8 compatibility
            prop_name = target.getAttribute( data_attr );

          if ( prop_name && prop_name !== "" ) {
            clearTimeout(timeIn);
            timeIn = setTimeout(function(){
              pubSub.publish( message, prop_name, target.value );
            },50);

          }
        };

        // Listen to change events and proxy to PubSub
        if ( document.addEventListener ) {
          document.addEventListener( "input", changeHandler, false );
        } else {
          // IE8 uses attachEvent instead of addEventListener
          document.attachEvent( "oninput", changeHandler );
        }

        // PubSub propagates changes to all bound elements
        pubSub.on( message, function( evt, prop_name, new_val ) {
          var elements = document.querySelectorAll("[" + data_attr + "=" + prop_name + "]"),
            tag_name;

          for ( var i = 0, len = elements.length; i < len; i++ ) {
            tag_name = elements[ i ].tagName.toLowerCase();

            if ( tag_name === "input" || tag_name === "textarea" || tag_name === "select" ) {
              elements[ i ].value = new_val;
            } else {
              elements[ i ].innerHTML = new_val;
            }
          }
        });

        return pubSub;
      }
      function DBind( uid ) {
        var binder = new DataBinder( uid ),

          user = {
            // ...
            attributes: {},
            set: function( attr_name, val ) {
              this.attributes[ attr_name ] = val;
              // Use the `publish` method
              binder.publish( uid + ":input", attr_name, val, this );
            },
            get: function( attr_name ) {
              return this.attributes[ attr_name ];
            },

            _binder: binder
          };

        // Subscribe to the PubSub
        binder.on( uid + ":input", function( evt, attr_name, new_val, initiator ) {
          if ( initiator !== user ) {
            user.set( attr_name, new_val );
          }
        });

        return user;
      }
      var DBind = new DBind(1);
      DBind.set('name', '黄奇');

      $('#but2').on('click', function () {
        $('#app2').show()
      });
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
    indexPage: indexPage
  };
});