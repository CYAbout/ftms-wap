// zip 打包
const gulp = require('gulp');
const zip = require('gulp-zip');
const clean = require('gulp-clean');
const pump = require('pump');
const runSequence = require('run-sequence');

// 以当前时间作为版本号
var getVersion_now = function () {
  var nowDate = new Date();
  return "" + nowDate.getFullYear() + (nowDate.getMonth() + 1) + nowDate.getDate() + nowDate.getHours() + nowDate.getMinutes() + nowDate.getSeconds();
};

// 预设任务
gulp.task('default', ['clean'], function (done) {
  // gulp.start('copy-file');
  // 需要说明的是，用gulp.run也可以实现以上所有任务的执行，只是gulp.run是最大限度的并行执行这些任务，
  // 而在添加版本号时需要串行执行（顺序执行）这些任务，故使用了runSequence.
  runSequence(
    ['copy-file'], //移动文件
    //['zip'],
    done);
});

// 移动文件
gulp.task('copy-file', function () {
  var task = "",
    fileAry = [{
      src: './.nuxt/**/*',
      folder: 'dist/.nuxt/'
    }, {
      src: './static/**/*',
      folder: 'dist/static/'
    }, {
      src: './api.config.js',
      folder: 'dist/'
    }, {
      src: './nuxt.config.js',
      folder: 'dist/'
    }, {
      src: './server.js',
      folder: 'dist/'
    }, {
      src: './*.json',
      folder: 'dist/'
    }];

  for (var i = 0; i < fileAry.length; i++) {
    task = tMoveFile(fileAry[i].src, fileAry[i].folder);
  }

  return task;
});

gulp.task('clean', function (cb) {
  pump([
    gulp.src('./dist'),
    clean()
  ], cb)
});

gulp.task('zip', function () {
  gulp.src([
    './dist/**/*',
    './dist/.*/**/*'
  ])
    .pipe(zip('ftms-wap-' + getVersion_now() + '.zip'))
    .pipe(gulp.dest('dist/'));
});

// 移动文件
const tMoveFile = function (src, tofolder) {
  return gulp.src(src).pipe(gulp.dest(tofolder));
};
