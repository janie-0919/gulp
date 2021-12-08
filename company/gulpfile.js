const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
var sass = require("gulp-sass")(require('sass'));
const minifyCss = require('gulp-minify-css');
const del = require('del');
const browserSync = require('browser-sync').create();
const reload      = browserSync.reload;
const fileinclude = require('gulp-file-include');

// 작업 경로 설정
const devSrc = 'src';
const devPaths = {
    js: devSrc + '/js/*.js',
    libJs: devSrc + '/js/lib/*.js',
    css: devSrc + '/scss/*.scss',
    html : devSrc + '/html/**/*.html',
    index : devSrc + '/index.html',
    image : devSrc + '/images/**/*',
    font : devSrc + '/fonts/**/*',
};

// 결과물 경로 설정
const distdSrc = 'dist'

// js - common
function copyJs() {
    return gulp.src(devPaths.js)
        .pipe(concat('common.js'))
        .pipe(uglify())
        .pipe(gulp.dest(distdSrc + '/js'));
}

// js - library
function copyLibJs() {
    return gulp.src(devPaths.libJs)
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest(distdSrc + '/js'));
}

function copyCss() {
    return gulp.src(devPaths.css)
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

// index.html
function copyIndex() {
    return gulp.src(devPaths.index)
        .pipe(gulp.dest(distdSrc + '/'));
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

// watch
function watch() {
    gulp.watch(devPaths.js, gulp.series(copyJs));
    gulp.watch(devPaths.css, gulp.series(copyCss));
    gulp.watch(devPaths.html, gulp.series(copyHtml));
    gulp.watch(devPaths.index, gulp.series(copyIndex));
    gulp.watch(devPaths.font, gulp.series(copyFonts));
    gulp.watch(devPaths.image, gulp.series(copyImages));
}

// server
function server() {
    browserSync.init({
        port: 2022,
        server: {
            baseDir: "./",
            index: "src/index.html"
        }
    });
    gulp.watch(devPaths.js, gulp.series(copyJs)).on("change", reload);
    gulp.watch(devPaths.css, gulp.series(copyCss)).on("change", reload);
    gulp.watch(devPaths.html, gulp.series(copyHtml)).on("change", reload);
    gulp.watch(devPaths.index, gulp.series(copyIndex)).on("change", reload);
    gulp.watch(devPaths.font, gulp.series(copyFonts)).on("change", reload);
    gulp.watch(devPaths.image, gulp.series(copyImages)).on("change", reload);
}

//task
gulp.task("dev", gulp.series(delDist, copyHtml, copyCss, copyLibJs, copyJs, copyFonts, copyImages, copyIndex, delInclude, server))
gulp.task("watch", gulp.series(watch))

exports.default = gulp.series("dev");
