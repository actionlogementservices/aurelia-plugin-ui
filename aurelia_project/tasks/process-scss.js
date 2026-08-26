import gulp from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import gulpSourcemaps from 'gulp-sourcemaps';
import project from '../aurelia.json';

const sass = gulpSass(dartSass);

export default function processSCSS() {
  // only specify the entry point for the SCSS processor, since it will automatically resolve any @import statements in the SCSS files.
  return gulp.src(project.scssProcessor.source)
    .pipe(gulpSourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpSourcemaps.write('.'))
    .pipe(gulp.dest('./src/styles/css'));
}

// publishes the raw Sass variable overrides so consumers can @import them before compiling their own Bootstrap
export function pluginSCSS(dest) {
  return function processPluginScss() {
    return gulp.src(project.plugin.source.scss)
      .pipe(gulp.dest(`${dest}/styles/scss`));
  };
}