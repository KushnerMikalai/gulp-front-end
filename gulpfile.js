'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	prefix = require('gulp-autoprefixer'),
	rigger = require('gulp-rigger'),
	pug = require('gulp-pug'),
	stylus = require('gulp-stylus'),
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
		jpg: 'src/img/jpg/**/*.*',
		png_svg: 'src/img/png_svg/**/*.*',
		fonts: 'src/fonts/**/*.*',
		libs: 'src/libs/**/*.*'
	},
	watch: {
		pug: 'src/tmp/**/*.pug',
		js: 'src/js/**/*.js',
		style: 'src/style/**/*.styl',
		style_all: 'src/style/*.styl',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*',
		libs: 'src/libs/**/*.*'
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

gulp.task('pug', function() {
	gulp.src(path.src.pug)
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest(path.build.pug))
		.pipe(reload({
			stream: true
		}));
});


gulp.task('js:build', function() {
	gulp.src(path.src.js)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('js:build_min', function() {
	gulp.src(path.src.js)
		.pipe(rigger())
		.pipe(uglify())
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest(path.build.js));
});

gulp.task('style:build', function() {
	gulp.src(path.src.style)
		.pipe(stylus())
		.pipe(prefix(["last 12 version", "> 1%", "ie 8"]))
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('style:build_min', function() {
	return gulp.src(path.src.style)
		.pipe(stylus({
			compress: true
		}))
		.pipe(prefix(["last 12 version", "> 1%", "ie 8"]))
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('image:build_jpg', function() {
	gulp.src(path.src.jpg)
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({
			stream: true
		}));
});
gulp.task('image:build_png_svg', function() {
	gulp.src(path.src.png_svg)
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('fonts:build', function() {
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('libs:build', function() {
	gulp.src(path.src.libs)
		.pipe(gulp.dest(path.build.libs))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('clean', function() {
	return del.sync('build');
});

gulp.task('build', [
	'clean',
	'pug',
	'js:build',
	'js:build_min',
	'style:build',
	'style:build_min',
	'image:build_jpg',
	'image:build_png_svg',
	'libs:build',
	'fonts:build'
]);

gulp.task('dev', [
	'clean',
	'pug',
	'js:build',
	'style:build',
	'image:build_jpg',
	'image:build_png_svg',
	'libs:build',
	'fonts:build'
]);

gulp.task('watch', function() {
	watch([path.watch.libs], function(event, cb) {
		gulp.start('libs:build');
	});
	watch([path.watch.pug, path.src.pug], function(event, cb) {
		gulp.start('pug');
	});
	watch([path.watch.style, path.watch.style_all], function(event, cb) {
		gulp.start('style:build');
	});
	watch([path.watch.js], function(event, cb) {
		gulp.start('js:build');
	});
	watch([path.watch.img], function(event, cb) {
		gulp.start('image:build_jpg');
		gulp.start('image:build_png_svg');
	});
	watch([path.watch.fonts], function(event, cb) {
		gulp.start('fonts:build');
	});
});

gulp.task('default', ['dev', 'webserver', 'watch']);
