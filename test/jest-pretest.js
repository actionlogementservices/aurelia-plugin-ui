import 'aurelia-polyfills';
import { ExtensionHandlers, Options, TextHandler } from 'aurelia-loader-nodejs';
import { globalize } from 'aurelia-pal-nodejs';
import fs from 'fs';
import path from 'path';
Options.relativeToDir = path.join(__dirname, '../src');
// like the build (aurelia_project/tasks/process-svg.js), a required icon .html is its .svg wrapped in a template
ExtensionHandlers['.html'] = async filePath => {
  const svgPath = filePath.replace(/\.html$/, '.svg');
  if (fs.existsSync(filePath) || !fs.existsSync(svgPath)) {
    return TextHandler(filePath);
  }
  return `<template containerless>\n${await TextHandler(svgPath)}\n</template>\n`;
};
globalize();
// vanillajs-datepicker uses the global event classes: they must be jsdom's (window), not node's (global)
/* eslint-disable unicorn/prefer-global-this */
global.EventTarget = window.EventTarget;
global.CustomEvent = window.CustomEvent;
/* eslint-enable unicorn/prefer-global-this */
