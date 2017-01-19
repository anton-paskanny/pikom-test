var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    spritesmith = require('gulp.spritesmith');

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/'
    },
    src: {
        html: 'src/*.html',
        mainJs: 'src/js/main.js',
        css: 'src/scss/style.scss',
        helpers: 'src/scss/helpers/',
        img: 'src/img/**/*.*',
        spriteImg: 'src/img/',
        pngSprite: 'src/sprite/png/'
    },
    watch: {
        html: 'src/*.html',
        mainJs: 'src/js/**/main.js',
        style: 'src/scss/**/*.*',
        img: 'src/img/**/*.*',
        pngSprite: 'src/sprite/png/*.png'
    }
};

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: './build'
		}
	});
});

gulp.task('img:build', function(){
	return gulp.src(path.src.img)
    .pipe(imagemin({
      progressive: true,
      interlaced: true
    }))
		.pipe(gulp.dest(path.build.img))
});

gulp.task('mainJs:build', function() {
		return gulp.src(path.src.mainJs)
      .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
			.pipe(uglify())
      .pipe(rename('main.min.js'))
			.pipe(gulp.dest(path.build.js))
			.pipe(browserSync.reload({stream: true}))
});

gulp.task('style:build', function() {
	return gulp.src(path.src.css)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(sass({
      includePaths: require('node-normalize-scss').includePaths
    }))
		.pipe(autoprefixer())
		.pipe(csso())
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest(path.build.css))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('html:build', function () {
    gulp.src(path.src.html)
      .pipe(gulp.dest(path.build.html))
      .pipe(browserSync.reload({stream: true}))
});

gulp.task('png-sprite', function () {
    var spriteData =
        gulp.src(path.src.pngSprite + '*.png')
            .pipe(spritesmith({
              retinaSrcFilter: path.src.pngSprite + '*@2x.png',
              imgName: 'sprite.png',
              retinaImgName: 'sprite-2x.png',
              cssName: '_png-sprite.sass'
            }));

    spriteData.img.pipe(gulp.dest(path.src.spriteImg));
    spriteData.css.pipe(gulp.dest(path.src.helpers));
});


gulp.task('watcher', ['browser-sync', 'style:build', 'mainJs:build', 'img:build', 'html:build'], function(){
	gulp.watch(path.watch.style, ['style:build']);
	gulp.watch(path.watch.mainJs, ['mainJs:build']);
  gulp.watch(path.watch.img, ['img:build']);
	gulp.watch(path.watch.html, ['html:build']);
  gulp.watch(path.watch.pngSprite, ['png-sprite']);
});

gulp.task('default', ['watcher']);
