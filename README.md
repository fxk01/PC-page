《穿透CSS迷雾，解锁样式新境界》 主讲人：李凯明 亮点：CSS的奥秘无处不在，李凯明将带来一场关于样式穿透的深入分享。无论是跨组件样式管理，还是复杂布局中的样式隔离，他都将一一剖析，让我们在CSS的世界里更加游刃有余。

在Vue中,有两种常用的CSS选择器,用于修改组件样式：scoped 和 /deep/（或 ::v-deep）,它们都是为了实现样式的作用域,本文小编就来分别给大家介绍一下这两种选择器的原理,需要的朋友可以参考下

Scoped：局部

我们在自己的组件中引入了一个子组件，并且希望在我的组件中修改子组件中的样式，由于我们用了 scoped ，直接修改是不生效的。去掉 scoped 是可以，不过没了局部 样式风险不可控。

有一种更好的方式，用深度选择器修改，比如 less 中的 /deep/ 。在覆盖组件库样式的时候应该会经常用到深度选择器 /deep/ 。


为什么 scoped 可以形成局部 css ？原理是什么？
为什么 /deep/ 可以跨组件修改 css ？原理是什么？


查看 html 元素时发现多了很多类似 data-v-f321cf6 属性，这些属性其实就是 scoped hash 出来的。
每个加过 scoped 的组件生成的值都是唯一的。

scoped 形成局部 css 的原理其实很简单，就是先给元素加上 hash 出来的属性，再通过属性选择器来选择这些元素，由于每个组件 hash 出来的属性值都是唯一的， css 属性选择器选出来的元素当然也是组件级的了，因为形成了组件内局部 css 。


/deep/ 原理

在使用了 /deep/ 选择器后，会把当前元素 img 的 [data-v-6a6ef68c] 干掉，并通过他的父级（准确的说是 img 元素所属空白页组件的根元素 <div ></div> ），来查找到 img ，也就是通过 .no-data[data-v-f5321cf6] img 来定位到 img 元素。
因为我们的代码是在列表页写的，列表页 hash 出来的属性是 [data-v-f5321cf6] ，在我们使用 /deep/ 之前， img 的 hash 是 [data-v-6a6ef68c] ，在列表页中的 css 代码当然是识别不到空白页组件的 [data-v-6a6ef68c] ，所以修改宽高不生效。使用 /deep/ 之后，通过 .no-data[data-v-f5321cf6] img ，由于 [data-v-f5321cf6] 本身就是列表 hash 出来的，自然是可以识别的，修改宽高自然也就生效了。
为了加深理解，这里再提一点，仔细看 <div ></div> 这一块的 html 代码，你会发现它是同时具有 [data-v-f5321cf6] 和 [data-v-6a6ef68c] 两种属性，因为 <no-data> 组件的根元素是 <div ></div> ，在列表页引入 <no-data> ， <div ></div> 也相当于是列表中的一个元素，所以 scoped 也会给它 hash 上 [data-v-f5321cf6] 。 （这一块在实际开发中，有些朋友会搞一些骚操作，比如在父组件和子组件同时改 .no-data ）

1、vue——样式穿透/deep/ >>> ::v-deep 三者的区别




# 备案大师
## technology stack
多页面架构
Please try running this command again as root/Administrator.  ~~npm cache clean -f

> gulp + requireJs + dot + AmazeUI + jquery

> npm install 安装依赖

>gulp images //压缩图片

>gulp //启动服务器

## Demo 预览
<p align="center"><img src="http://sdx.hefupb.com/img/Animation.gif"/></p>

## 打包
>node r.js -o build.js //编译src文件&&压缩js、css

>node test.js //压缩html

# 解决谷歌跨域
找到谷歌浏览器目录最后添加:
  --args   --disable-web-security   --user-data-dir


