import gulp from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import gulpSourcemaps from 'gulp-sourcemaps';

const sass = gulpSass(dartSass);

// Compiles src/styles/custom.scss (Bootstrap + variable overrides) into src/styles/custom.css,
// so it gets picked up by the existing css processor/plugin tasks like any other .css source.
export default function processSCSS() {
  // only glob the entry point: partials like override.scss would otherwise compile standalone, and no `since` filter since gulp can't track scss @import dependencies
  return gulp.src('src/styles/custom.scss')
    .pipe(gulpSourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpSourcemaps.write('.'))
    .pipe(gulp.dest('src/styles'));
}