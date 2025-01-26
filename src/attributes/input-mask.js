import { inject, DOM } from 'aurelia-framework';
import Inputmask from 'inputmask';

/**
 * Default configuration for input mask.
 * @type {Inputmask.Options}
 */
const defaultMaskConfiguration = {
  rightAlign: false,
  radixPoint: ',',
  groupSeparator: ' ',
  positionCaretOnClick: 'radixFocus',
  jitMasking: true
};

/**
 * Map of input mask configurations.
 * @type {Record<string, Inputmask.Options>}
 */
const maskConfiguration = {
  currency: {
    radixPoint: ',',
    groupSeparator: ' ',
    digits: 2,
    jitMasking: true,
    positionCaretOnClick: 'radixFocus'
  },
  percentage: {
    min: 0,
    max: 100,
    radixPoint: ',',
    groupSeparator: ' ',
    digits: 1,
    jitMasking: true,
    suffix: ''
  }
};

/**
 * Implements the **`input-mask` custom attribute** that provides mask on an input html element.
 * This attribute works together with the `numberFormat` and the `cleanInputMask` value converters.
 * @category attribute
 * @example
 * <input
 *     type="text"
 *     input-mask="currency"
 *     value.one-time="montant | numberFormat"
 *     value.from-view="montant | cleanInputMask" />
 */
@inject(DOM.Element)
export class InputMaskCustomAttribute {
  /** Html input element using this custom attribute. @type {HTMLInputElement} */ element;
  /** Value of the custom attribute. @type {'currency' | 'percentage'} */ value;

  /**
   * Creates an instance of the `input-mask` custom attribute.
   * @param {HTMLInputElement} element html input element using this custom attribute
   */
  constructor(element) {
    this.element = element;
  }

  /**
   * Defines the logic triggered when the component is added to the DOM.
   */
  attached() {
    const inputMask = new Inputmask(this.value, maskConfiguration[this.value] || defaultMaskConfiguration);
    inputMask.mask(this.element);
  }
}
