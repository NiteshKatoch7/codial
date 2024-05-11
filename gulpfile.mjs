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

    gulp.src('./assets/scss/**/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets/css/main'));

    gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

gulp.task('js', function(done){
    console.log('minifying js...');

    gulp.src('./assets/js/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets/js'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

gulp.task('images', function(done){
    console.log('compressing images...');

    gulp.src('./assets/**/*.+(png||jpg||gif||svg||jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));

    done();
})

gulp.task('clean:assets', function(done){
    console.log('cleaning the assets');

    deleteSync('./public/assets');
    done();
})

gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images'), function(done){
    console.log('Building assets');
    done();
})