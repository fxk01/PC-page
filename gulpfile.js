'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-minify-css');
var imageMin = require('gulp-imagemin');
var fileinclude  = require('gulp-file-include');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

// 默认任务
gulp.task('default', ['server', 'auto', 'htmlInclude']);

// 将utils下的js打包一个utils
gulp.task('script', function() {
  gulp.src(['utils/com.js', 'utils/plug.js', 'libs/easing/easing.js'])
      .pipe(concat('index.js'))
      .pipe(gulp.dest('utils'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('utils'))
      .pipe(reload({stream: true}));
});

// 编译less
gulp.task('less', function() {
  return gulp.src('src/**/*.less')
      .pipe(autoprefixer({
          browsers: ['last 2 versions', 'Android >= 4.0'],
          cascade: false
      }))
      .pipe(less())
      .pipe(cssmin())
      .pipe(gulp.dest('src'))
      .pipe(reload({stream: true}));
});

// 压缩图片
gulp.task('images',function() {
  gulp.src('public/images/*/*.*')
      .pipe(imageMin({progressive: true}))
      .pipe(gulp.dest('public/images-min'))
});

// 编译html
gulp.task('htmlInclude', function() {
  gulp.src(['src/index/index.html'])
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
      }))
      .pipe(gulp.dest('./src/index'));
});

// 创建文件修改监听任务
gulp.task('auto', function() {
  // 源码有改动就进行压缩以及热刷新
  gulp.watch('utils/*.js', ['script']);
  gulp.watch('src/*/*.less', ['less']);
  gulp.watch('src/*/*.js', ['js']);
  gulp.watch('public/images/*/*.*', ['images']);
  gulp.watch('src/*/*.html').on('change', reload);
});

// 编译后的js将注入到浏览器里实现更新
gulp.task('js', function() {
  return gulp.src('src/*/*.js')
      .pipe(reload({stream: true}));
});

// 编译后的css将注入到浏览器里实现更新
gulp.task('css', function() {
  return gulp.src('src/*/*.css')
      // .pipe(gulp.dest("src/css"))
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
    root: '',
    port: 8888,
    livereload: true
  });
  browserSync.init({
    server: ''
  });
});