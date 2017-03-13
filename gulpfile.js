/**
 * Created by szhitenev on 10.03.2017.
 */

(function () {

    'use strict';
    var gulp = require('gulp');
    var uglify = require('gulp-uglify');
    var concat = require('gulp-concat');
    var minifyCSS = require('gulp-minify-css');
    var minifyHTML = require('gulp-minify-html');
    var less = require('gulp-less');
    var autoprefixer = require('autoprefixer');
    var rename = require('gulp-rename');
    var livereload = require('gulp-livereload');
    var htmlmin = require('gulp-htmlmin');
    var ngHtml2Js = require('gulp-ng-html2js');

    var plumber = require('gulp-plumber');
    var preprocess = require('gulp-preprocess');
    var source = require('vinyl-source-stream');
    var buffer = require('vinyl-buffer');
    var browserify = require('browserify');

    var appName = 'party-table';

    gulp.task(appName + '-HTML-to-JS', function () {

        console.log('Executing task index-HTML-templateCache...');

        var pathToHtml = ['src/' + appName + '/scripts/**/*.html'];

        return gulp.src(pathToHtml)
            .pipe(htmlmin({collapseWhitespace: true}))
            .on('error', function (error) {
                console.error('\nError on HTML minifaction: \n', error.toString());
                this.emit('end');
            })
            .pipe(ngHtml2Js({
                moduleName: 'party.table'
            }))
            .pipe(concat('templates.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('src/' + appName + '/scripts/'));

    });

    gulp.task(appName + '-less-to-css-min', function () {

        var pathToLess = ['src/' + appName + '/content/less/imports.less'];

        return gulp.src(pathToLess)
            .pipe(less())
            .on('error', function (err) {
                console.error('Error in Browserify: \n', err.message);
                this.emit('end');
            })
            .pipe(plumber())
            .pipe(rename('party-table.css'))
            .pipe(gulp.dest('dist/' + appName + '/'))
            .pipe(minifyCSS())
            .pipe(rename('party-table.min.css'))
            .pipe(gulp.dest('dist/' + appName + '/'))

    });

    gulp.task(appName + '-js-min', function () {

        var pathToJS = ['src/' + appName + '/scripts/main.js'];

        return browserify(pathToJS)
            .bundle()
            .on('error', function (err) {
                console.error('Error in Browserify: \n', err.message);
                this.emit('end');
            })
            .pipe(plumber())
            .pipe(source('bundled.js'))
            .pipe(buffer())
            .pipe(preprocess())
            //.pipe(uglify())
            .pipe(rename({basename: 'party-table', suffix: '.min'}))
            .on('error', function (error) {
                console.error('\nError on JS minification: \n', error.toString());
                this.emit('end');
            })
            .pipe(gulp.dest('dist/' + appName + '/'))
            .pipe(livereload());
    });

    gulp.task(appName + '-watch-All', function () {
        livereload.listen(35728);
        //gulp.watch('src/' + appName + '/**/*.less', [appName + '-less-to-css-min']);
        gulp.watch('src/' + appName + '/**/*.js', [appName + '-js-min']);
        gulp.watch('src/' + appName + '/**/*.html', [appName + '-HTML-to-JS', appName + '-js-min']);
        //gulp.watch('src/index.html', [appName + '-html-min']);
    });

    gulp.task(appName + '-min-All', [
        appName + '-HTML-to-JS',
        appName + '-js-min'
    ]);

}());