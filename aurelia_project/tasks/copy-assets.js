import gulp from 'gulp';

export default function copyAssets(dest) {
  return function copyPluginAssets() {
    return gulp.src('src/assets/**/*', { encoding: false }).pipe(gulp.dest(`${dest}/assets`));
  };
}
