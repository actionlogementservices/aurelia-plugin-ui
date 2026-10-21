import { AureliaConfiguration } from 'aurelia-configuration';
import environment from './environment';

export function configure(aurelia) {
  // private urls are defined in the git-ignored aurelia_project/environments/<env>.local.js
  aurelia.container.get(AureliaConfiguration).set('api.address', environment.addressApiUrl);

  aurelia.use
    .standardConfiguration()
    // load the plugin ../src
    // The "resources" is mapped to "../src" in aurelia.json "paths"
    .feature('resources');

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');
  aurelia.use.plugin('aurelia-validation');
  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
