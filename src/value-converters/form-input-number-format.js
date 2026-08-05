import { valueConverter } from 'aurelia-framework';

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
   *
   * @param {string} value
   * @param {'integer' | 'decimal' | 'currency'} type
   * @param {string} locale
   * @returns {string}
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

  /**
   *
   * @param {string} value
   * @param {'integer' | 'decimal' | 'currency'} type
   * @param {string} locale
   * @returns {string}
   */
  fromView(value, type = 'integer', locale = 'fr-FR') {
    const cleanValue = value.replaceAll(/\s?€?/g, '').replaceAll(',', '.');
    const parsedValue = parseFloat(cleanValue);
    if (!isFinite(parsedValue)) {
      return '';
    }

    return parsedValue.toFixed(type === 'decimal' || type === 'currency' ? 2 : 0);
  }
}
