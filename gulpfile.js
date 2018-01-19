'use strict';

var gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	watch = require('gulp-watch'),
	autoprefixer = require('gulp-autoprefixer'),
	rigger = require('gulp-rigger'),
	sass = require('gulp-sass'),
	sassGlob = require('gulp-sass-glob'),
	imagemin = require('gulp-imagemin'),
	uglify = require('gulp-uglify'),
	rename = require("gulp-rename"),
	browserSync = require("browser-sync"),
	del = require('del'),
	reload = browserSync.reload;

var path = {
	dist: {
		html: 'dist',
		js: 'dist/assets/js/',
		css: 'dist/assets/css/',
		img: 'dist/assets/img/',
		fonts: 'dist/assets/fonts/',
		libs: 'dist/assets/libs/'
	},
	src: {
		html: 'src/*.html',
		js: 'src/assets/js/*.js',
		css: 'src/assets/css/*.scss',
		img: 'src/assets/img/**/*',
		fonts: 'src/assets/fonts/**/*',
		libs: 'src/assets/libs/**/*'
	},
  clean: './dist'
};

var config = {
  server: {
    baseDir: "./dist"
  },
  tunnel: true,
  host: 'localhost',
  port: 9000,
  logPrefix: "frontend"
};

gulp.task('webserver', function() {
  browserSync(config);
});

gulp.task('html', function() {
  return gulp.src(path.src.html)
    .pipe(rigger())
    .pipe(gulp.dest(path.dist.html))
    .pipe(reload({stream: true}));
});

gulp.task('js', function() {
	return gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(rigger())
		.pipe(gulp.dest(path.dist.js))
		.pipe(reload({stream: true}));
});

gulp.task('css', function() {
  return gulp.src(path.src.css)
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ["last 12 version", "> 1%", "ie 9"],
      cascade: true
    }))
    .pipe(gulp.dest(path.dist.css))
    .pipe(reload({stream: true}));
});

gulp.task('image', function() {
	return gulp.src(path.src.img)
		.pipe(plumber())
		.pipe(imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest(path.dist.img))
		.pipe(reload({stream: true}));
});

gulp.task('fonts', function() {
	return gulp.src(path.src.fonts)
		.pipe(plumber())
		.pipe(gulp.dest(path.dist.fonts))
		.pipe(reload({stream: true}));
});

gulp.task('libs', function() {
	return gulp.src(path.src.libs)
		.pipe(plumber())
		.pipe(gulp.dest(path.dist.libs))
		.pipe(reload({stream: true}));
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('dev', [
  'clean',
  'html',
  'js',
  'css',
  'libs',
  'fonts',
  'image'
]);

gulp.task('watch', () => {
	gulp.watch('*.html', {cwd: 'src/blocks/'}, ['html']);
	gulp.watch('*.scss', {cwd: 'src/blocks/'}, ['css']);
	gulp.watch('*.scss', {cwd: 'src/assets/css/helpers/'}, ['css']);
	gulp.watch('*.scss', {cwd: 'src/assets/css/'}, ['css']);
	gulp.watch('*.html', {cwd: 'src/'}, ['html']);
	gulp.watch(path.src.libs, ['libs']);
	gulp.watch(path.src.js, ['js']);
	gulp.watch(path.src.img, ['image']);
	gulp.watch(path.src.fonts, ['fonts']);
});

gulp.task('default', ['dev', 'watch', 'webserver']);
