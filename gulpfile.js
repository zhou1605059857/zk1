/*
 * @Author: mikey.zhaopeng 
 * @Date: 2019-01-02 08:49:37 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-01-02 09:40:03
 */

var gulp = require('gulp');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean-css');
var concat = require('gulp-concat');

gulp.task('sass', function() {
    return gulp.src('./src/scss/*.scss').pipe(sass()).pipe(clean()).pipe(gulp.dest('./src/css'));
});

gulp.task('uglify', function() {
    return gulp.src('./src/js/*.js').pipe(uglify()).pipe(gulp.dest('./src/js'));
});

// gulp.task('concat', function() {
//     return gulp.src('./src/js/*.js').pipe(concat()).pipe(gulp.dest('./src/js'));
// });

gulp.task('watch', function() {
    return gulp.watch('./src/scss/*.scss', gulp.series('sass', 'uglify'))
});

// gulp.task('build');

gulp.task('webserver', function() {
    return gulp.src('./src').pipe(webserver({
        port: 8989,
        open: true,
        livereload: true,
        middleware: function(req, res) {
            var pathname = require('url').parse(req.url).pathname;
            if (pathname === '/favicon.ico') {
                return res.end('');
            };

            pathname = pathname === '/' ? 'index.html' : pathname;
            if (pathname === 'index.html') {
                res.end(require('fs').readFileSync(require('path').join(__dirname, 'src/index.html')));
            } else {
                res.end(require('fs').readFileSync(require('path').join(__dirname, 'src', pathname)));
            }
        }
    }))
});

gulp.task('default', gulp.series('sass', 'uglify', 'webserver', 'watch'));