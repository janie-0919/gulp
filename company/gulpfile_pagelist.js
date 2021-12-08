const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const rename = require("gulp-rename");
const del = require('del');

function tasksass() {
    return gulp.src(['pagelist/sass/style.scss'])
        .pipe(sass())
        .pipe(rename({extname: '.css'}))
        .pipe(gulp.dest('pagelist/css/'))
}

function copyCss() {
    return gulp.src(['pagelist/css/style.css'])
        .pipe(
            postcss([
                require('postcss-preset-env')({
                    stage: 0,
                    features: {
                        'nesting-rules': true
                    }
                })
            ])
        )
        .pipe(rename({extname: '.css'}))
        .pipe(gulp.dest('pagelist/css/'))
}

function watch() {
    gulp.watch('pagelist/scss/style.css', gulp.series(tasksass, copyCss));
}

gulp.task("distDel", function () {
    del('pagelist/css');
});
gulp.task("compile", gulp.series(tasksass, copyCss, watch));
