var gulp         = require('gulp');
var gutil        = require('gulp-util');
var rename       = require('gulp-rename');
var uglify       = require('gulp-uglify');
var del          = require('del');
var webpack      = require('webpack');
var path         = require('path');
var runSequence  = require('run-sequence');

var dist = [
    '**',
    '!dist{,/**}',
    '!node_modules{,/**}',
    '!src{,/**}',
    '!.**',
    '!gulpfile.js',
    '!package-lock.json',
    '!package.json',
];

gulp.task('default', function() {
    gulp.watch('src/**/*.js', ['webpack']);
});

gulp.task('build', ['clean'], function(done) {
    if (gutil.env.production) {
        runSequence(['js'], 'dist', done);
    } else {
        runSequence(['webpack'], done);
    }
});

gulp.task('clean', function() {
    return del(['js/', 'dist/']);
});

gulp.task('webpack', function(done) {
    webpack({
        entry: {
            atom_link: './src/atom-link.js'
        },
        output: {
            path: path.resolve(__dirname, 'js'),
            filename: '[name].js'
        },
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js'
            }
        }
    }, function(err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({
            colors: true
        }));
        done();
    });
});

gulp.task('js', ['webpack'], function() {
    return gulp.src(['js/*.js', '!js/*.min.js'])
    .pipe(uglify({
        ie8: true,
        mangle: false,
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('js/'));
});

gulp.task('dist', function() {
    return gulp.src(dist)
    .pipe(gulp.dest('dist/'));
});
