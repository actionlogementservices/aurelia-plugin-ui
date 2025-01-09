import { bindable } from 'aurelia-framework';

/**
 * Defines a HelloWorld custom element for demonstration purpose.
 * @category public
 */
export class HelloWorld {
  /** @type {string} The bindable message */
  @bindable message;
}
