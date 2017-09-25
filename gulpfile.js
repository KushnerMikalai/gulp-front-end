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
	dist: {
		pug: 'dist',
		js: 'dist/assets/js/',
		css: 'dist/assets/css/',
		img: 'dist/assets/img/',
		fonts: 'dist/assets/fonts/',
		libs: 'dist/assets/libs/'
	},
	src: {
		pug: 'src/pages/*.pug',
		js: 'src/assets/js/*.js',
		style: 'src/styles/*.styl',
		img: 'src/assets/img/**/*',
		fonts: 'src/assets/fonts/**/*',
		libs: 'src/assets/libs/**/*'
	},
	watch: {
		pug: 'src/blocks/**/*.pug',
		style: 'src/blocks/**/*.styl'
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
	logPrefix: "front_nik"
};

gulp.task('webserver', function() {
	browserSync(config);
});

gulp.task('pug:dist', function() {
	return gulp.src(path.src.pug)
		.pipe(plumber())
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest(path.dist.pug))
		.pipe(reload({stream: true}));
});

gulp.task('js:dist', function() {
	return gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(rigger())
		.pipe(gulp.dest(path.dist.js))
		.pipe(reload({stream: true}));
});

gulp.task('style:dist', function() {
	return gulp.src(path.src.style)
		.pipe(plumber())
		.pipe(stylus())
		.pipe(prefix(["last 12 version", "> 1%", "ie 9"]))
		.pipe(gulp.dest(path.dist.css))
		.pipe(reload({stream: true}));
});

gulp.task('image:dist', function() {
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

gulp.task('fonts:dist', function() {
	return gulp.src(path.src.fonts)
		.pipe(plumber())
		.pipe(gulp.dest(path.dist.fonts))
		.pipe(reload({stream: true}));
});

gulp.task('libs:dist', function() {
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
	'pug:dist',
	'js:dist',
	'style:dist',
	'libs:dist',
	'fonts:dist',
	'image:dist'
]);

gulp.task('watch', () => {
	gulp.watch(path.watch.pug, ['pug:dist']);
	gulp.watch(path.watch.style, ['style:dist']);

	gulp.watch(path.src.libs, ['libs:dist']);
	gulp.watch(path.src.style, ['style:dist']);
	gulp.watch(path.src.pug, ['pug:dist']);
	gulp.watch(path.src.js, ['js:dist']);
	gulp.watch(path.src.img, ['image:dist']);
	gulp.watch(path.src.fonts, ['fonts:dist']);
});

gulp.task('default', ['dev', 'watch', 'webserver']);
