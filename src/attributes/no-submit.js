import { inject, DOM } from 'aurelia-framework';

/**
 * Implements the **`no-submit` custom attribute** that prevents submitting when `enter` is pressed.
 * @category attribute
 */
@inject(DOM.Element)
export class NoSubmitCustomAttribute {
  /** Html form element using this custom attribute. @type {HTMLFormElement} */ element;

  /**
   * Creates an instance of the `no-submit` custom attribute.
   * @param {HTMLFormElement} element html form element using this custom attribute
   */
  constructor(element) {
    this.element = element;
  }

  /**
   * Defines the logic triggered when the component is added to the DOM.
   */
  attached() {
    this.element.addEventListener('submit', event => event.preventDefault());
  }
}
