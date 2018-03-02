var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var connect = require('gulp-connect');

// 默认任务
gulp.task('default', ['server', 'auto']);

//将utils下的js打包一个utils
gulp.task('script', function() {
  gulp.src(['utils/com.js', 'utils/plug.js', 'libs/easing/easing.js'])
      .pipe(concat('index.js'))
      .pipe(gulp.dest('utils'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('utils'));
});

// 创建文件修改监听任务
gulp.task('auto', function() {
  // 源码有改动就进行压缩以及热刷新
  gulp.watch('utils/*.js', ['script']);
  gulp.watch('src/*/*.css', ['reload']);
  gulp.watch('src/*/*.html', ['reload']);
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
  })
});