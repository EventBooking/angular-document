/* global require */
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    project = require('./package.json'),
    moduleName = 'ngDocument',
    dest = 'dist';

gulp.task('build', ['styles', 'html']);
gulp.task('watch', ['build'], watch);
gulp.task('html', html);
gulp.task('styles', styles);
gulp.task('clean', clean);

function clean() {
    var del = require('del');
    return del(dest);
}

function html() {
    var html2js = require('gulp-ng-html2js');

    return gulp.src(['src/**/*.html'])
        .pipe(html2js({
            moduleName: moduleName,
            stripPrefix: 'directives'
        }))
        .pipe(concat(project.name + '.templates.js'))
        .pipe(gulp.dest(dest));
}

function styles() {
    var less = require('gulp-less'),
        autoprefixer = require('gulp-autoprefixer');

    gulp.src(['src/assets.less'])
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(concat(project.name + '.css'))
        .pipe(gulp.dest(dest));

    gulp.src(['src/**/*.less'])
        .pipe(gulp.dest(dest + '/less'));
}

function watch() {
    gulp.watch(['src/**/*.less'], ['styles']);
    gulp.watch(['src/**/*.html'], ['html']);
}