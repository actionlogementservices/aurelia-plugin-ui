import gulp from 'gulp';
import rename from 'gulp-rename';
import through2 from 'through2';
import { build } from 'aurelia-cli';
import project from '../aurelia.json';

// Wraps a raw .svg asset's markup into a containerless Aurelia template, so it
// can be required from a view as an HTML-only custom element (no separate .js needed).
function wrapSvgAsTemplate() {
  return through2.obj((file, enc, callback) => {
    if (file.isBuffer()) {
      file.contents = Buffer.from(`<template containerless>\n${file.contents.toString()}\n</template>\n`);
    }
    callback(null, file);
  });
}

export default function processSvg() {
  return gulp
    .src(project.svgProcessor.source, { since: gulp.lastRun(processSvg) })
    .pipe(wrapSvgAsTemplate())
    .pipe(rename({ extname: '.html' }))
    .pipe(build.bundle());
}

export function pluginSvg(dest) {
  return function processPluginSvg() {
    return gulp
      .src(project.svgProcessor.source, { base: 'src' })
      .pipe(wrapSvgAsTemplate())
      .pipe(rename({ extname: '.html' }))
      .pipe(gulp.dest(dest));
  };
}
