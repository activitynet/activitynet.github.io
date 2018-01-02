/**
 * file: gulpfile.js
 * @file
 * Gulp file to compile the SASS files into CSS.
 */
'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function() {
	gulp.src('./sass/**/main.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(gulp.dest('./challenges/2018/css'));
});

gulp.task('default', function() {
	gulp.watch('./sass/**/*.scss', ['sass']);
})