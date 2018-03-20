/*!
 * q.js<https://github.com/itorr/q.js>
 * Version: 1.2
 * Built: 2014/12/28
 */

var q = function(W,D,HTML,hash,view,arg,_arg,i,index,Regex,key,q){
  HTML=D.documentElement;
  Regex=[];
  key='!';
  onhashchange=function(){
    q.hash=hash=location.hash.substring(key.length+1);

    arg=hash.split('/');

    i=Regex.length;
    while(i--)
      if(_arg=hash.match(Regex[i])){
        arg=_arg;
        arg[0]=Regex[i];
        break;
      }


    if(!q[arg[0]]) // default
      arg[0]=index;

    if(q.pop)
      q.pop.apply(W,arg);

    q.lash=view=arg.shift();

    HTML.setAttribute('view',view);

    q[view].apply(W,arg);
  };


  if(!'onhashchange' in W){
    q.path=location.hash;
    setInterval(function(){
      if(q.path!=location.hash){
        onhashchange();
        q.path=location.hash;
      }
    },100);
  }

  q={
    init:function(o){

      if(o.key!==undefined)
        key=o.key;

      index=o.index||'V';

      if(o.pop&&typeof o.pop=='function')
        q.pop=o.pop;

      onhashchange();

      return this
    },
    reg:function(r,u){
      if(!r)
        return;

      if(u == undefined)
        u=function(){};

      if(r instanceof RegExp){ //正则注册
        q[r]=u;
        Regex.push(r);
      }else if(r instanceof Array){ //数组注册
        for(var i in r){
          this.reg.apply(this,[].concat(r[i]).concat(u));
        }
      }else if(typeof r=='string'){ //关键字注册
        if(typeof u=='function')
          q[r]=u;
        else if(typeof u=='string'&&q[u])
          q[r]=q[u];
      }

      return this
    },
    V:function(){
      // console.log('q.js <https://github.com/itorr/q.js> 2014/12/28');
      return this
    },
    go:function(u){
      location.hash='#'+key+u;
      return this
    }
  };
  return q;
}(this,document);
