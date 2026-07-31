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
  toView(value, type, locale = 'fr-FR') {
    if (!value || !isFinite(parseInt(value))) return '';
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
   * @returns {string}
   */
  fromView(value, type = 'integer') {
    const plainValue = value.replaceAll(/\s/g, '');
    if (!isFinite(parseInt(plainValue))) {
      return '';
    }
    // TODO : limiter les decimales a 2 apres la virgule pour les types decimal et currency
    return plainValue;
  }
}
