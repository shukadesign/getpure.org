var autoprefix = require('gulp-autoprefixer'),
  browserSync = require('browser-sync'),
  concat = require('gulp-concat'),
  csso = require('gulp-csso'),
  gulp = require('gulp'),
  imagemin = require('gulp-imagemin'),
  plumber = require('gulp-plumber'),
  reload = browserSync.reload,
  rename = require('gulp-rename'),
  rupture = require('rupture'),
  jeet = require('jeet'),
  styl = require('gulp-stylus'),
  merge = require('merge-stream'),
  combineMQ = require('gulp-combine-mq'),
  uglify = require('gulp-uglify');

// Create development server
gulp.task('server', function() {
  var path;
  browserSync({
    notify: false,
    open:   false,
    server: './',
    ui:     false
  });
  path = {
    styl: './source/styl/**/*',
    js:   './source/js/**/*',
    html: './**/*.html'
  };
  gulp.watch(path.html, reload);
  gulp.watch(path.styl, ['styl']);
  gulp.watch(path.js, ['js']);
});

// Compile .styl files to public derictory
gulp.task('styl', function() {
  var path;
  path = {
    srcDestop: 'source/styl/main.styl',
    srcTouch: 'source/styl/main.touch.styl',
    dest: 'public/css/'
  };
  return gulp.src( path.srcDestop )
    .pipe(plumber())
    .pipe(styl({
      use: [rupture(), jeet()]
    }))
    .pipe(autoprefix({
      browsers: ['last 2 version', 'IE 9']
    }))
    .pipe(combineMQ())
    .pipe(csso())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(path.dest))
    .pipe(reload({
      stream: true
    }));
});

// Concat & uglify js files
gulp.task('js', function() {
  var bower = './bower_components/',
    vendor = './public/js/vendor/',
    _vendor = [
      bower + 'jquery/dist/*.min.js',
      bower + 'detection/*.min.js'
    ],
    src = [
      bower + 'jquery/dist/*.min.js',
      bower + 'detection/*.min.js',
      bower + 'cookie/**/cookie.js',
      bower + 'Flowtype.js/**/flowtype.js',
      bower + 'velocity/**/velocity.js',
      bower + 'scrollreveal/**/scrollreveal.js',
      './source/js/util/*',
      './source/js/jquery.mobile-events.js',
      './source/js/main.js'
    ],
    dest = './public/js/';

  var main = gulp.src(src)
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({
      basename: 'main',
      suffix: '.min',
      extname: '.js'
    }))
    .pipe(gulp.dest(dest))
    .pipe(reload({
      stream: true
    }));

  var vendor = gulp.src(_vendor)
    .pipe(uglify())
    .pipe(gulp.dest(vendor));

  return merge( main, vendor );
});

// gulp.task('imagemin', function() {
//   var path;
//   path = {
//     src: 'lib/img/**/*.*',
//     dest: 'lib/img/'
//   };
//   return gulp.src(path.src)
//     .pipe(imagemin({
//       progressive: true,
//       interlaced: true
//     }))
//     .pipe(gulp.dest(path.dest))
//     .pipe(reload({
//       stream: true
//     }));
// });

gulp.task( 'default', ['styl', 'server', 'js'] );