import gulp from 'gulp';
import eslint from 'gulp-eslint-new';
import project from '../aurelia.json';

export default function lint() {
  return gulp.src(project.transpiler.source)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}
