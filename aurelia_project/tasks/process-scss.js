import gulp from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import gulpSourcemaps from 'gulp-sourcemaps';
import project from '../aurelia.json';

const sass = gulpSass(dartSass);

// Those warnings can be ignored : https://getbootstrap.com/docs/5.3/customize/sass/
const sassOptions = {
  loadPaths: ['node_modules'],
  quietDeps: true,
  silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function']
};

export default function processSCSS() {
  // only specify the entry point for the SCSS processor, since it will automatically resolve any @import statements in the SCSS files.
  return gulp
    .src(project.scssProcessor.source)
    .pipe(gulpSourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(gulpSourcemaps.write('.'))
    .pipe(gulp.dest('./src/styles/css'));
}

// publishes the Sass sources of the theme: theme.scss (bootstrap + theme in one import) and the override files it chains,
// for the consumers that build their own bootstrap pipeline
export function pluginSCSS(dest) {
  return function processPluginScss() {
    return gulp.src(project.plugin.source.scss).pipe(gulp.dest(`${dest}/styles/scss`));
  };
}
