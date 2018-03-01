var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

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
  gulp.src(['utils/com.js', 'utils/plug.js', 'libs/easing/easing.js'])
      .pipe(concat('util.js'))
      .pipe(gulp.dest('dist/utils'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('dist/utils'));
});