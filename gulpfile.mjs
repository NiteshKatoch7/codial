import gulp from 'gulp';

// Gulp css related libraries
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass'
const sass = gulpSass(dartSass);

import cssnano from 'gulp-cssnano';

// Gulp js related libraries
import uglify from 'gulp-uglify';

// Gulp image related libraries
import imagemin from 'gulp-imagemin';

// Gulp delete assets related libraries
import {deleteSync} from 'del';

import rev from 'gulp-rev';


gulp.task('css', function(done){
    console.log('minifying css...');

    return gulp.src('./assets/scss/**/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets/css/main'));
});

gulp.task('rev:css', function(done){
    console.log('revisioning the css');

    return gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
})

gulp.task('js', function(done){
    console.log('minifying js...');

    return gulp.src('./assets/js/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets/js'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
});

gulp.task('images', function(done){
    console.log('compressing images...');

    return gulp.src('./assets/**/*.+(png||jpg||gif||svg||jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
})

gulp.task('clean:assets', function(done){
    console.log('cleaning the assets');

    deleteSync('./public/assets');
    done();
})

gulp.task('series', gulp.series('clean:assets', 'css', 'js', 'images'), function(done){
    console.log('Building assets');
    done();
})

gulp.task('build', gulp.series('series', 'rev:css'), function(done){
    console.log('Building assets');
    done();
})