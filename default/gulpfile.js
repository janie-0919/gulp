var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require("gulp-sass")(require('sass'));
var minifyCss = require('gulp-minify-css');
var del = require('del');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;
var fileinclude = require('gulp-file-include');

// 작업 경로 설정
var devSrc = 'src';
var devPaths = {
    js: devSrc + '/js/**/*.js',
    css: devSrc + '/scss/**/*.scss',
    html : devSrc + '/html/**/*.html',
    image : devSrc + '/images/**/*',
    font : devSrc + '/fonts/**/*',
};

// 결과물 경로 설정
var distdSrc = 'dist'

// js
function copyJs() {
    return gulp.src(devPaths.js)
        .pipe(concat('common.js'))
        .pipe(uglify())
        .pipe(gulp.dest(distdSrc + '/js'));
}

// css
function copyCss() {
    return gulp.src(devPaths.css)
        .pipe(concat('style.css'))
        .pipe(sass())
        .pipe(minifyCss())
        .pipe(gulp.dest(distdSrc + '/css'));
}

// html
function copyHtml() {
    return gulp.src(devPaths.html)
        .pipe(fileinclude())
        .pipe(gulp.dest(distdSrc + '/html'));
}

// fonts
function copyFonts() {
    return gulp.src(devPaths.font)
        .pipe(gulp.dest(distdSrc + '/fonts'));
}

// images
function copyImages() {
    return gulp.src(devPaths.image)
        .pipe(gulp.dest(distdSrc + '/images'));
}

// clean del
function delDist() {
    return del('dist');
}

// clean include
function delInclude() {
    return del('dist/html/include');
}

// include
// function include() {
//     gulp.src(devPaths.html)
//         .pipe(fileinclude())
//         .pipe(gulp.dest(distdSrc + '/html/include'));
// }

// watch
function watch() {
    gulp.watch(devPaths.js, gulp.series(copyJs));
    gulp.watch(devPaths.css, gulp.series(copyCss));
    gulp.watch(devPaths.html, gulp.series(copyHtml));
    gulp.watch(devPaths.font, gulp.series(copyFonts));
    gulp.watch(devPaths.image, gulp.series(copyImages));
}

// server
function server() {
    browserSync.init({
        port: 2021,
        server: {
            baseDir: "./",
            index: "src/index.html"
        }
    });
    gulp.watch(devPaths.js, gulp.series(copyJs)).on("change", reload);
    gulp.watch(devPaths.css, gulp.series(copyCss)).on("change", reload);
    gulp.watch(devPaths.html, gulp.series(copyHtml)).on("change", reload);
    gulp.watch(devPaths.font, gulp.series(copyFonts)).on("change", reload);
    gulp.watch(devPaths.image, gulp.series(copyImages)).on("change", reload);
}

//task
gulp.task("dev", gulp.series(delDist, copyJs, copyCss, copyHtml, copyFonts, copyImages, delInclude, server))
gulp.task("watch", gulp.series(watch))

exports.default = gulp.series("dev");
