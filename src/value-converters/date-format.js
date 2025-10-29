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
  fromView(value, format) {
    if (!value) return undefined;
    const formatToUse = format || 'DD/MM/YYYY';
    const { valid, date } = isValidDate(value, formatToUse);
    if (!valid || !date) return value;
    return date.toISOString();
  }

  /**
   * Converts the value of the javascript model to the html view.
   * @param {string} value value from javascript model, expected to be in ISO 8601 format
   * @param {SupportedFormat} [displayFormat] display format, by default french: `DD/MM/YYYY`
   * @returns {string | undefined} the date in the specified display format
   */
  toView(value, displayFormat) {
    if (!value) return undefined;
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    const formatToUse = displayFormat || 'DD/MM/YYYY';
    const outputFormat = dateFormat[formatToUse]?.output;
    if (!outputFormat) return value;
    try {
      const formatter = new Intl.DateTimeFormat(outputFormat.culture, { ...outputFormat.options });
      return formatter.format(date);
    } catch {
      return value;
    }
  }
}
