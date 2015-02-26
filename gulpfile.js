var gulp = require('gulp')
  , refresh = require('gulp-livereload')
  , plumber = require('gulp-plumber')
  , browserify = require('browserify')
  , watchify = require('watchify')
  , transform = require('vinyl-transform')
  , source = require('vinyl-source-stream')
  , buffer = require('vinyl-buffer')
  , http = require('http')
  , spawn = require('child_process').spawn
  , gutil = require('gulp-util')
  , sourcemaps = require('gulp-sourcemaps')

var sequencerBundler = watchify(browserify('./index.js', watchify.args))
sequencerBundler.on('update', sequencer)

function sequencer () {
  return sequencerBundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('sequencer.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public'))
    .pipe(refresh())
}

gulp.task('sequencer', sequencer)

gulp.task('server', function ()  {
  console.log('AT YOUR SERVICE')
  refresh.listen()
  spawn('node', ['server.js'], { stdio: 'inherit' })
})


gulp.task('watch', function () {
  gulp.watch('./index.js', ['sequencer'])
  gulp.watch('./server.js', ['server'])
})

gulp.task('default', ['server', 'sequencer', 'watch'])













