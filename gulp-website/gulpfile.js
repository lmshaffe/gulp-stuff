var gulp = require('gulp')
var uglify = require('gulp-uglify')
var livereload = require('gulp-livereload')
var concat = require('gulp-concat')
var minifyCss = require('gulp-minify-css')
var autoprefixer = require('gulp-autoprefixer')
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps')
var sass = require('gulp-sass')
var babel = require('gulp-babel')
var del = require('del')
var zip = require('gulp-zip')

// LESS plugins
var less = require('gulp-less')
var LessAutoprefix = require('less-plugin-autoprefix')
var lessAutoprefix = new LessAutoprefix({
  browsers: ['last 2 versions']
})

// Handlebars plugins
var handlebars = require('gulp-handlebars')
var handlebarsLib = require('handlebars')
var declare = require('gulp-declare')
var wrap = require('gulp-wrap')

// Image compression
var imagemin = require('gulp-imagemin')
var imageminPngquant = require('imagemin-pngquant')
var imageminJpegRecompress = require('imagemin-jpeg-recompress')

// File paths
var SCRIPTS_PATH = 'public/scripts/**/*.js'
var CSS_PATH = 'public/css/**/*.css'
var DIST_PATH = 'public/dist'
var TEMPLATES_PATH = 'templates/**/*.hbs'
var IMAGES_PATH = 'public/images/**/*.{png,jpeg,jpg,svg,gif}'

// Styles for CSS
// gulp.task('styles', () => {
//   console.log('starting styles task')
//
//   return gulp.src(['public/css/reset.css', CSS_PATH])
//     // keeps gulp watch running
//     .pipe(plumber(function(err) {
//       console.log('Styles task error')
//       console.log(err)
//       this.emit('end')
//     }))
//     .pipe(sourcemaps.init())
//     .pipe(autoprefixer({// just showing the power we have to choose browsers
//       browsers: ['last 2 versions', 'ie 8']
//     }))
//     .pipe(concat('styles.css'))
//     .pipe(minifyCss())
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest(DIST_PATH))
//     .pipe(livereload())
// })

// Styles for SCSS
gulp.task('styles', () => {
  console.log('starting styles task')

  return gulp.src(['public/scss/styles.scss'])
    // keeps gulp watch running
    .pipe(plumber(function(err) {
      console.log('Styles task error')
      console.log(err)
      this.emit('end')
    }))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    // this does minify and concat is already done with sass imports
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload())
})

// Styles for LESS
// gulp.task('styles', () => {
//   console.log('starting styles task')
//
//   return gulp.src(['public/less/styles.less'])
//     // keeps gulp watch running
//     .pipe(plumber(function(err) {
//       console.log('Styles task error')
//       console.log(err)
//       this.emit('end')
//     }))
//     .pipe(sourcemaps.init())
//     .pipe(less({
//       plugins: [lessAutoprefix]
//     }))
//     .pipe(minifyCss())
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest(DIST_PATH))
//     .pipe(livereload())
// })

// Scripts
gulp.task('scripts', () => {
  console.log('starting scripts task')

  return gulp.src(SCRIPTS_PATH)
    .pipe(plumber(function(err) {
      console.log('Scripts task error')
      console.log(err)
      this.emit('end')
    }))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    // uglifyJS doesn't support ES6 features, babel helps with that
    .pipe(uglify())
    .pipe(concat('scripts.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload())
})

// Images
gulp.task('images', () => {
  return gulp.src(IMAGES_PATH)
    .pipe(imagemin(
      [
        imagemin.gifsicle(),
        imagemin.jpegtran(),
        imagemin.optipng(),
        imagemin.svgo(),
        // dat lossy compression >>>>> lossless compression
        imageminPngquant(),
        imageminJpegRecompress()
      ]
    ))
    .pipe(gulp.dest(DIST_PATH + '/images'))
})

// Templates
gulp.task('templates', () => {
  return gulp.src(TEMPLATES_PATH)
    .pipe(handlebars({
      handlebars: handlebarsLib
    }))
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'templates',
      noRedeclare: true
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload())
})

gulp.task('clean', () => {
  return del.sync([
    DIST_PATH
  ])
})


gulp.task('default', ['clean', 'images', 'templates', 'styles', 'scripts'], () => {
  console.log('starting default task')
})

gulp.task('export', () => {
  return gulp.src('public/**/*')
    .pipe(zip('website.zip'))
    .pipe(gulp.dest('./'))
})

gulp.task('watch', ['default'], () => {
  console.log('starting watch task')
  require('./server')
  livereload.listen()
  gulp.watch(SCRIPTS_PATH, ['scripts'])
  // gulp.watch(CSS_PATH, ['styles'])
  gulp.watch('public/scss/**/*.scss', ['styles'])
  // gulp.watch('public/less/**/*.less', ['styles'])
  gulp.watch(TEMPLATES_PATH, ['templates'])
})
