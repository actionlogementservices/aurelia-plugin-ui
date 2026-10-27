import { inject, DOM } from 'aurelia-framework';

/**
 * Map of the predefined filters, matching the forbidden characters.
 * @type {Record<string, RegExp>}
 */
const filters = {
  email: /[^\w.@+-]/g
};

/**
 * Implements the **`input-filter` custom attribute** that removes the forbidden characters as soon as they are
 * typed, pasted or autofilled in an input html element.
 * The attribute value is either a predefined filter name (`email`) or a regular expression matching the
 * forbidden characters.
 * @category attribute
 * @example
 * <input type="email" input-filter="email" value.bind="email" />
 * <input input-filter="[^0-9]" value.bind="code" />
 */
@inject(DOM.Element)
export class InputFilterCustomAttribute {
  /** Html input element using this custom attribute. @type {HTMLInputElement} */ element;
  /** Value of the custom attribute. @type {'email' | string} */ value;

  /**
   * Creates an instance of the `input-filter` custom attribute.
   * @param {HTMLInputElement} element html input element using this custom attribute
   */
  constructor(element) {
    this.element = element;
  }

  /**
   * Defines the logic triggered when the custom element is added to the DOM.
   */
  attached() {
    // capture phase: runs before the Aurelia value binding listener registered on the same element
    this.element.addEventListener('input', this.filter, true);
  }

  /**
   * Defines the logic triggered when the custom element is removed from the DOM.
   */
  detached() {
    this.element.removeEventListener('input', this.filter, true);
  }

  /**
   * Removes the forbidden characters from the input value, keeping the caret in place when the input type
   * exposes it (`selectionStart` is null for `email` inputs, whose caret then moves to the end).
   */
  filter = () => {
    const pattern = filters[this.value] ?? new RegExp(this.value, 'g');
    const { value, selectionStart } = this.element;
    const filtered = value.replace(pattern, '');
    if (filtered === value) {
      return;
    }

    this.element.value = filtered;
    if (selectionStart !== null) {
      const caret = value.slice(0, selectionStart).replace(pattern, '').length;
      this.element.setSelectionRange(caret, caret);
    }
  };
}
