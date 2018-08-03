'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var changed = require('gulp-changed');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-minify-css');
var imageMin = require('gulp-imagemin');
var fileinclude  = require('gulp-file-include');
var ejs  = require('gulp-ejs');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var combiner = require('stream-combiner2');
var merge = require('merge-stream');

function lessCss() {
  ['src', 'template'].forEach(function(t) {
    return gulp.src(''+t+'/**/*.less')
      .pipe(plumber({
        errorHandler: function(error) {
          console.log(error);
          this.emit('end')
        }
      }))
      .pipe(autoprefixer({
        browsers: ['last 2 versions', 'Android >= 4.0'],
        cascade: false
      }))
      .pipe(less())
      .pipe(cssmin())
      .pipe(changed(t))
      .pipe(gulp.dest(t))
      .pipe(reload({stream: true}));
  });
}

// 默认任务
gulp.task('default', ['server', 'auto']);

// 将utils下的js打包一个utils
gulp.task('script', function() {
  gulp.src(['utils/com.js', 'utils/plug.js', 'libs/easing/easing.js', 'utils/utils.js', 'libs/modelite/modelite.js', 'libs/q/q.js', 'libs/page/amazeui.page.js'])
      .pipe(plumber({
        errorHandler: function(error) {
          console.log(error);
          this.emit('end')
        }
      }))
      .pipe(concat('index.js'))
      .pipe(gulp.dest(''))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(''))
      .pipe(reload({stream: true}));
});

// 编译less
gulp.task('less', lessCss);

// 压缩图片
gulp.task('images',function() {
  gulp.src('public/images/*/*.*')
      .pipe(imageMin({progressive: true}))
      .pipe(gulp.dest('public/images-min'))
});

// ejs
gulp.task('ejs', function() {
  gulp.src('src/**/*.ejs')
    .pipe(ejs({
      msg: 'Hello Gulp!'
    }, {}, {ext: '.html'})).on('error', function(msg) {
      console.log(msg);
    })
    .pipe(gulp.dest('src'))
    // .pipe(connect.reload());
});

//流合并监听的方式 （能够监听到错误处在哪个文件，和错误的具体位置）
gulp.task('errorJs', function() {
  var combined = combiner.obj([
    gulp.src(['src/**/*.js', 'template/**/*.js'])
      .pipe(reload({stream: true})),
    uglify()
  ]);
  //监听错误
  combined.on('error',console.error.bind(console));
  return combined;
});

// 创建文件修改监听任务
gulp.task('auto', function() {
  gulp.watch('utils/*.js', ['script']);
  gulp.watch(['src/*/*.less', 'template/*/*.less'], ['less']);
  gulp.watch(['src/*/*.js', 'template/*/*.js', 'components/*/*.js'], ['errorJs']);
  // gulp.watch('src/*/*.js').on('change', reload);
  gulp.watch('src/**/*.ejs', ['ejs']);
  gulp.watch('public/images/*/*.*', ['images']);
  gulp.watch(['src/*/*.html', 'template/*/*.html', 'components/*/*.html']).on('change', reload);
});

// 编译后的js将注入到浏览器里实现更新
gulp.task('js', function() {
  return gulp.src('src/*/*.js')
      // .pipe(changed('src'))
      .pipe(reload({stream: true}));
});

// 编译后的css将注入到浏览器里实现更新
gulp.task('css', function() {
  return gulp.src('src/*/*.css')
      .pipe(reload({stream: true}));
});

// 创建热加载任务
gulp.task('reload', function() {
  gulp.src('src/*')
      .pipe(connect.reload());
  console.log('html change');
});

// gulp服务器
gulp.task('server', function() {
  connect.server({
    root: './',
    port: 8888,
    livereload: true
  });
  browserSync.init({
    server: ''
  });
});