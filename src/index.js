import { PLATFORM } from 'aurelia-pal';

/**
 * Defines the Aurelia plugin entry point.
 * @module
 * @category internal
 */

/** @typedef {import('aurelia-framework').FrameworkConfiguration} FrameworkConfiguration */

/**
 * Configures the Aurelia plugin.
 * @param {FrameworkConfiguration} config the aurelia framework configuration
 */
export function configure(config) {
  config.globalResources([PLATFORM.moduleName('./elements/hello-world')]);
}
