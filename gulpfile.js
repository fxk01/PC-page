var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var requirejsOptimize = require('gulp-requirejs-optimize');

gulp.task('script', function() {
  gulp.src('utils/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('dist/utils'))
});
gulp.task('auto', function () {
  gulp.watch('utils/*.js', ['script']);
});
gulp.task('default', ['script', 'auto']);

//将utils下的js打包一个utils
gulp.task('minifyjs', function() {
  gulp.src('utils/*.js')
      .pipe(concat('util.js'))
      .pipe(gulp.dest('dist/utils'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('dist/utils'));
});

gulp.task('rjs', function(){
  return gulp.src('utils/*.js')
      .pipe(
          requirejsOptimize({
            optimize: 'none',
            mainConfigFile: 'src/config.js'
          }))
      .pipe(gulp.dest('dist/js/'));
});