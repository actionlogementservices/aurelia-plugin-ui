import { bindable, bindingMode } from 'aurelia-framework';

/**
 * Implements the **`lock` custom element** that displays a logic lock preventing user from interaction.
 * @category element
 */
export class LockCustomElement {
  /**
   * Is the lock active?
   * @type {boolean}
   */
  @bindable({ defaultBindingMode: bindingMode.toView })
  locked = false;
}
