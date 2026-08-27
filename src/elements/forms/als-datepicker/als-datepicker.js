import { bindable, bindingMode, computedFrom, useView } from 'aurelia-framework';
import { FormInput } from '../forms-input';

/**
 * @augments FormInput<string> The date value is represented as an string.
 */
@useView('./als-datepicker.html')
export class AlsDatepicker extends FormInput {
  /** Auto-hide dropdown after selection @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  autohide = true;

  /** Days of week to disable @type {number[]} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  disabledDays = [];

  /** Dates to disable @type {string[]} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  disabledDates = [];

  /** Minimum selectable date in ISO string format, empty for no limit @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  minDate;

  /** Maximum selectable date in ISO string format, empty for no limit @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  maxDate;

  /**
   * Id of the element describing the error, exposed via `aria-describedby` once the field is invalid.
   * @type {string}
   */
  @computedFrom('id', 'isError')
  get ariaDescribedby() {
    return this.isError ? `${this.id}-error` : '';
  }

  constructor() {
    super();
  }

  /**
   * Validate date-specific rules.
   * @param {string} value date value to validate
   * @returns {boolean} true if valid, false otherwise
   */
  validateValue(value) {
    const convertedValue = new Date(value);
    if (this.minDate && convertedValue < new Date(this.minDate)) {
      this.isError = true;
      this.errorMessage = 'La date est antérieure à la date minimale.';
      return false;
    }

    if (this.maxDate && convertedValue > new Date(this.maxDate)) {
      this.isError = true;
      this.errorMessage = 'La date est postérieure à la date maximale.';
      return false;
    }

    return true;
  }
}
