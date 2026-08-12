import gulp from 'gulp';

export default function copyAssets(dest) {
  return function copyPluginAssets() {
    return gulp.src('src/assets/**/*')
      .pipe(gulp.dest(`${dest}/assets`));
  };
}
