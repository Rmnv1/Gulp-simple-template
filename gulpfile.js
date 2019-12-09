'use strict';
 
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    babel = require(`gulp-babel`),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    cleanCSS = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    copy = require('gulp-copy');

/* Array of static files for gulp-copy */
var staticFiles = ['./src/*.html', './src/fonts/*'];

/* Style processing */
gulp.task('sass', function () {
    return gulp.src('src/scss/*.scss')
    .pipe(sourcemaps.init())
     .pipe(plumber({
        errorHandler: function (error) {
          console.log(error.message);
          this.emit('end');
      }}))
     .pipe(sass().on('error', sass.logError))
     .pipe(autoprefixer('last 2 versions'))
     .pipe(rename({suffix: '.min'}))
     .pipe(cleanCSS())
     .pipe(sourcemaps.write('./maps'))
     .pipe(gulp.dest('src/css'))
});

/* Scripts processing */
gulp.task('scripts', function() {
    return gulp.src('src/js/scripts.js')
        .pipe(plumber({
          errorHandler: function (error) {
          console.log(error.message);
          this.emit('end');
        }}))
       .pipe(babel({
            presets: ['@babel/env']
        }))
      .pipe(concat('main.js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('./src/js'))
});

/* Images processing */
gulp.task('images', () =>
    gulp.src('./src/img/**/*')
        .pipe(imagemin({
            interlaced: false,
            progressive: true,
            optimizationLevel: 3,
            svgoPlugins: [
                {
                    removeViewBox: false
                }
            ]
        }))
        .pipe(gulp.dest('dist/img'))
);

/* Copy static files from src to dist */
gulp.task('copy', function () {
    return gulp
        .src(staticFiles)
        .pipe(copy('./dist', { prefix: 1, allowEmpty: true }))
});

/* I know that maybe this is not the best way to do it, but now i dont know how to do it better. Maybe i'll do better later :| фф*/
var stylesToDist = ['src/css/main.min.css'],
    scriptsToDist = ['src/js/main.min.js']
gulp.task('stylesToDist', function () {
    return gulp
        .src(stylesToDist)
        .pipe(copy('./dist/css', { prefix: 2, allowEmpty: true }))
});
gulp.task('scriptsToDist', function () {
    return gulp
        .src(scriptsToDist)
        .pipe(copy('./dist/js', { prefix: 2, allowEmpty: true }))
});

/* Build project */
gulp.task('build', gulp.series('sass', 'stylesToDist', 'scripts', 'scriptsToDist', 'images', 'copy', function(done) { 
    done();
})); 

/* Watching of file changes */
gulp.task('watch', function () {
  gulp.watch('src/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('src/js/scripts.js', gulp.series('scripts'));
});