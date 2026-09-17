import { build } from 'aurelia-cli';
import gulp from 'gulp';
import { Transform } from 'node:stream';
import project from '../aurelia.json';

// Fixes asset paths for the dev app by rewriting "../assets/" to "src/assets/" in markup files
function fixAssetPathsForDevApp() {
  return new Transform({
    objectMode: true,
    transform(file, _enc, callback) {
      if (file.isBuffer()) {
        file.contents = Buffer.from(
          file.contents.toString().replace(/(\ssrc=")(?:\.\.\/)+assets\//g, '$1src/assets/')
        );
      }
      callback(null, file);
    },
  });
}

export default function processMarkup() {
  return gulp
    .src(project.markupProcessor.source, { sourcemaps: true, since: gulp.lastRun(processMarkup) })
    .pipe(fixAssetPathsForDevApp())
    .pipe(build.bundle());
}

export function pluginMarkup(dest) {
  return function processPluginMarkup() {
    return gulp.src(project.plugin.source.html)
      .pipe(gulp.dest(dest));
  };
}
