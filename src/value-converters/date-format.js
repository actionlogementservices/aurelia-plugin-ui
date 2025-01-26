import { dateFormat, isValidDate } from '../core/functions';

/** @typedef {import('types').SupportedFormat} SupportedFormat */

/**
 * Implements a **`dateFormat`value converter** to transform a date to DD/MM/YYYY format.
 * @category valueconverter
 */

export class DateFormatValueConverter {
  /**
   * Converts the value of the html view to the javascript model.
   * @param {string} value value from html view in the specified format
   * @param {SupportedFormat} [format] display format, by default french: `DD/MM/YYYY`
   * @returns {string | undefined} the date in ISO 8601 format
   */
  fromView(value, format = 'DD/MM/YYYY') {
    const { valid, date } = isValidDate(value, format);
    if (!valid) return value;
    return date.toISOString();
  }
  /**
   * Converts the value of the javascript model to the html view.
   * @param {string} value value from javascript model, expected to be in ISO 8601 format
   * @param {SupportedFormat} [displayFormat] display format, by default french: `DD/MM/YYYY`
   * @returns {string | undefined} the date in the specified display format
   */
  toView(value, displayFormat = 'DD/MM/YYYY') {
    const { valid, date } = isValidDate(value, 'YYYY-MM-DD');
    if (!valid) return value;
    const outputFormat = dateFormat[displayFormat]?.output;
    return new Intl.DateTimeFormat(outputFormat?.culture, outputFormat?.options).format(date);
  }
}
