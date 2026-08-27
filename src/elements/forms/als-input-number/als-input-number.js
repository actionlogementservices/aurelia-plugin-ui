import { bindable, bindingMode, computedFrom, useView } from 'aurelia-framework';
import { FormInput } from '../forms-input';

const authorizedKeyList = new Set([
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'Shift',
  'Meta',
  'ArrowLeft',
  'ArrowRight',
  'Backspace',
  'Delete',
  'Enter',
  'Tab',
  'Home',
  'End',
  'Escape'
]);

/**
 * @augments FormInput<number>
 */
@useView('./als-input-number.html')
export class AlsInputNumber extends FormInput {
  /** Type @type {'integer' | 'decimal' | 'currency'} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  type = 'integer';

  /** Min value @type {number} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  min = 0;

  /** Max value @type {number} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  // @ts-ignore
  max;

  /** Step @type {number} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  step = 1;

  /**
   * Ids of the element(s) describing the input, exposed via `aria-describedby`: the always-present
   * range hint, plus the error message once the field is invalid.
   * @type {string}
   */
  @computedFrom('id', 'isError')
  get ariaDescribedby() {
    const ids = [`${this.id}-hint`];

    if (this.isError) {
      ids.push(`${this.id}-error`);
    }

    return ids.join(' ');
  }

  /**
   * Visually hidden hint describing the accepted value range, since `min`/`max` have no native
   * effect or accessible exposure on a `type="text"` input.
   * @type {string}
   */
  @computedFrom('min', 'max')
  get rangeHint() {
    if (this.max !== undefined && this.max !== null) {
      return `Valeur comprise entre ${this.min} et ${this.max}.`;
    }

    return `Valeur minimum : ${this.min}.`;
  }

  constructor() {
    super();
  }

  /**
   * Custom handler to prevent typing anything other than a number or to edit the field.
   * @param {KeyboardEvent} event The keyboard event
   * @returns {boolean} true to continue processing, false to cancel
   */
  handleKeyDown(event) {
    this.pristine = false;

    if (
      this.type === 'decimal' &&
      ((event.shiftKey && event.key === '.') || event.key === '.' || event.key === ',')
    ) {
      // Allow decimal separator for decimal and currency types
      return true;
    }

    if ((event.ctrlKey || event.metaKey) && (event.key === 'a' || event.key === 'c' || event.key === 'v')) {
      // Allow Select all, Copy, Paste
      return true;
    }

    if (event.key === 'Enter') {
      this.validate(this.value);
      return true;
    }

    if (!authorizedKeyList.has(event.key)) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  /**
   * Validate number-specific rules.
   * @param {number} value Value to validate
   * @returns {boolean} true if valid, false otherwise
   */
  validateValue(value) {
    if (this.isValueEmpty(value)) {
      return true;
    }

    if (!isFinite(value)) {
      this.isError = true;
      this.errorMessage = `La valeur n'est pas un nombre valide.`;
      return false;
    }

    if (value < this.min) {
      this.isError = true;
      this.errorMessage = `La valeur minimum est ${this.min}.`;
      return false;
    }

    if (this.max !== undefined && this.max !== null && value > this.max) {
      this.isError = true;
      this.errorMessage = `La valeur maximum est ${this.max}.`;
      return false;
    }

    return true;
  }
}
