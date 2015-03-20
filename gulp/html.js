'use strict';

var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');

module.exports = function(options) {
	gulp.task('html', function () {
	    return gulp.src('./src/app/partials/**/*.html')
	        .pipe(templateCache())
	        .pipe(gulp.dest('.tmp/serve/app/'));
	});
}