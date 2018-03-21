# 备案大师
## technology stack
多页面架构
Please try running this command again as root/Administrator.  ~~npm cache clean -f

> gulp + requireJs + dot + AmazeUI + jquery

> npm install 安装依赖

>gulp images //压缩图片

>gulp //启动服务器

## Demo 预览
<p align="center"><img src="http://obdhoyfg4.bkt.clouddn.com/tower-preview.gif"/></p>
<h2 align="center"><a href="http://fe.bmqb.com/tower_game/index.html?v=2">在线预览地址 (Demo Link)</a></h2>
<h4 align="center">手机设备可以扫描下方二维码</h4>
<p align="center">
  <img src="https://o2qq673j2.qnssl.com/tower-game-qr-code.png" />
</p>

## 打包
>node r.js -o build.js //编译src文件&&压缩js、css

>node test.js //压缩html

# 解决谷歌跨域
找到谷歌浏览器目录最后添加:
  --args   --disable-web-security   --user-data-dir
