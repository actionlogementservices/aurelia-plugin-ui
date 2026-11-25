import { runCLI } from '@jest/core';
import path from 'path';
import packageJson from '../../package.json';

import { CLIOptions } from 'aurelia-cli';

export default (cb) => {
  let options = packageJson.jest;

  if (CLIOptions.hasFlag('watch')) {
    Object.assign(options, { watchAll: true});
  }

  runCLI(options, [path.resolve(__dirname, '../../')]).then(({ results }) => {
    // `success` is also false when the coverage does not reach the `coverageThreshold` of the jest configuration
    if (!results.success) {
      cb('Tests Failed');
    } else {
      cb();
    }
  });
};
