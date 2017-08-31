'use strict';

var gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	watch = require('gulp-watch'),
	prefix = require('gulp-autoprefixer'),
	rigger = require('gulp-rigger'),
	pug = require('gulp-pug'),
	stylus = require('gulp-stylus'),
	imagemin = require('gulp-imagemin'),
	uglify = require('gulp-uglify'),
	rename = require("gulp-rename"),
	browserSync = require("browser-sync"),
	del = require('del'),
	reload = browserSync.reload;

var path = {
	build: {
		pug: 'build',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/img/',
		fonts: 'build/fonts/',
		libs: 'build/libs/'
	},
	src: {
		pug: 'src/*.pug',
		js: 'src/js/*.js',
		style: 'src/style/*.styl',
		img: 'src/img/**/*',
		fonts: 'src/fonts/**/*',
		libs: 'src/libs/**/*'
	},
	watch: {
		pug: 'src/html/**/*',
		js: 'src/js/**/*',
		style: 'src/style/**/*',
	},
	clean: './build'
};

var config = {
	server: {
		baseDir: "./build"
	},
	tunnel: true,
	host: 'localhost',
	port: 9000,
	logPrefix: "front_nik"
};

gulp.task('webserver', function() {
	browserSync(config);
});

gulp.task('pug:build', function() {
	return gulp.src(path.src.pug)
		.pipe(plumber())
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest(path.build.pug))
		.pipe(reload({stream: true}));
});

gulp.task('js:build', function() {
	return gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(rigger())
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));
});

gulp.task('style:build', function() {
	return gulp.src(path.src.style)
		.pipe(plumber())
		.pipe(stylus())
		.pipe(prefix(["last 12 version", "> 1%", "ie 9"]))
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}));
});

gulp.task('image:build', function() {
	return gulp.src(path.src.img)
		.pipe(plumber())
		.pipe(imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
	return gulp.src(path.src.fonts)
		.pipe(plumber())
		.pipe(gulp.dest(path.build.fonts))
		.pipe(reload({stream: true}));
});

gulp.task('libs:build', function() {
	return gulp.src(path.src.libs)
		.pipe(plumber())
		.pipe(gulp.dest(path.build.libs))
		.pipe(reload({stream: true}));
});

gulp.task('clean', function() {
	return del.sync('build');
});

gulp.task('dev', [
	'clean',
	'pug:build',
	'js:build',
	'style:build',
	'libs:build',
	'fonts:build',
	'image:build'
]);

gulp.task('watch', function() {
	gulp.watch(path.src.libs, ['libs:build']);
	gulp.watch(path.watch.pug, ['pug:build']);
	gulp.watch(path.watch.style, ['style:build']);
	gulp.watch(path.watch.js, ['js:build']);
	gulp.watch(path.src.img, ['image:build']);
	gulp.watch(path.src.fonts, ['fonts:build']);
});

gulp.task('default', ['dev', 'webserver', 'watch']);
