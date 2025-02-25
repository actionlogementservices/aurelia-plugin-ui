/**
 * Defines the Aurelia plugin entry point.
 * @module
 * @category public
 */

import { PLATFORM } from 'aurelia-pal';
export { ToastService } from './core/toast-service/toast-service';
export { LockService } from './core/lock-service/lock-service';
export { DialogService } from './core/dialog-service/dialog-service';
export { DialogController } from './core/dialog-service/dialog-controller';
export { AutoCompleteController } from './elements/auto-complete/auto-complete-controller';
export { Adresse } from './elements/auto-complete/adresse';

/** @typedef {import('aurelia-framework').FrameworkConfiguration} FrameworkConfiguration */

/**
 * Configures the plugin.
 * @param {FrameworkConfiguration} aurelia aurelia framework
 */
function configure(aurelia) {
  aurelia.globalResources([
    PLATFORM.moduleName('./elements/auto-complete/auto-complete'),
    PLATFORM.moduleName('./elements/auto-complete/badges-auto-complete'),
    PLATFORM.moduleName('./elements/auto-complete/address-auto-complete'),

    PLATFORM.moduleName('./elements/select/simple-select'),
    PLATFORM.moduleName('./elements/select/filterable-select'),
    PLATFORM.moduleName('./elements/select/badges-select'),

    PLATFORM.moduleName('./elements/simple-table/simple-table'),
    PLATFORM.moduleName('./elements/simple-table/column'),

    PLATFORM.moduleName('./elements/breadcrumbs/breadcrumbs'),
    PLATFORM.moduleName('./elements/environment-ribbon/environment-ribbon'),
    PLATFORM.moduleName('./elements/loading-indicator/loading-indicator'),
    PLATFORM.moduleName('./elements/lock/lock'),
    PLATFORM.moduleName('./elements/input-datepicker/input-datepicker'),

    PLATFORM.moduleName('./attributes/input-mask'),
    PLATFORM.moduleName('./attributes/no-submit'),

    PLATFORM.moduleName('./value-converters/date-format'),
    PLATFORM.moduleName('./value-converters/clean-input-mask'),
    PLATFORM.moduleName('./value-converters/number-format')
  ]);
}

export { configure };
