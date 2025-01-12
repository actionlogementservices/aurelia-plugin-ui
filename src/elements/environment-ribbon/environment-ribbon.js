import { bindable, bindingMode, computedFrom } from 'aurelia-framework';

/** @typedef {import('types').EnvironmentDescriptor} EnvironmentDescriptor */
/** @typedef {import('types').RibbonPosition} RibbonPosition */

/**
 * Implements the **`environment-ribbon` custom element** that displays the current environment.
 * @category element
 */
export class EnvironmentRibbonCustomElement {
  /**
   * Environment descriptor.
   * @type {EnvironmentDescriptor}
   */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  environment;

  /**
   * Ribbon position.
   * @type {RibbonPosition}
   */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  position = 'top-left';

  /**
   * Css classes defining the position.
   * @type {string}
   */
  @computedFrom('position')
  get cssPosition() {
    return this.position
      .split('-')
      .map(part => `er-${part}`)
      .join(' ');
  }

  /**
   * Css classes defining the color.
   * @type {string}
   */
  @computedFrom('environment')
  get cssColor() {
    return `er-${this.environment.type.toLowerCase()}`;
  }
}
