import { valueConverter } from 'aurelia-framework';

import { cleanInputMask } from '../core/functions';

// Define the options for different number formats, to be synchronized with input-mask.js mask configurations.
/** @type {Intl.NumberFormatOptions} */
const integerOptions = {
  style: 'decimal',
  maximumFractionDigits: 0,
  roundingMode: 'floor'
};

/** @type {Intl.NumberFormatOptions} */
const decimalOptions = {
  style: 'decimal',
  maximumFractionDigits: 2,
  roundingMode: 'floor'
};

/** @type {Intl.NumberFormatOptions} */
const currencyOptions = {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
  roundingMode: 'floor'
};

/**
 * Implements a **`formInputNumberFormat` value converter** that formats a number for a masked input and parses
 * the masked input back to a number. It works together with the `input-mask` attribute, using the same type.
 * @category valueconverter
 * @example
 * <input
 *     class="form-control"
 *     input-mask="currency"
 *     value.bind="montant | formInputNumberFormat:'currency' & validate" />
 */
@valueConverter('formInputNumberFormat')
export class FormInputNumberFormatValueConverter {
  /**
   * Converts the value of the javascript model to the html view.
   * @param {string} value value from javascript model
   * @param {'integer' | 'decimal' | 'currency'} [type] type of the input field
   * @param {string} [locale] locale format
   * @returns {string} the string representation
   */
  toView(value, type = 'integer', locale = 'fr-FR') {
    if (value === null || value === undefined || value === '' || !isFinite(parseFloat(value))) return '';
    const numberValue = Number(value);

    /** @type {Intl.NumberFormatOptions} */
    let options;
    switch (type) {
      case 'decimal': {
        options = decimalOptions;
        break;
      }
      case 'currency': {
        options = currencyOptions;
        break;
      }
      default: {
        options = integerOptions;
      }
    }

    return new Intl.NumberFormat(locale, options).format(numberValue);
  }

  /**
   * Converts the value of the html view to the javascript model.
   * @param {string} value value from html view including the mask
   * @returns {number | undefined} number or undefined in case of failure
   */
  fromView(value) {
    return cleanInputMask(value);
  }
}
