import { valueConverter } from 'aurelia-framework';

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
  maximumFractionDigits: 2,
  roundingMode: 'floor'
};

@valueConverter('formInputNumberFormat')
export class formInputNumberFormatValueConverter {
  /**
   * Converts the value of the javascript model to the html view.
   * @param {string} value value from javascript model
   * @param {'integer' | 'decimal' | 'currency'} [type] type of the input field
   * @param {string} [locale] locale format
   * @returns {string} the string representation
   */
  toView(value, type = 'integer', locale = 'fr-FR') {
    if (!value || !isFinite(parseFloat(value))) return '';
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
}
