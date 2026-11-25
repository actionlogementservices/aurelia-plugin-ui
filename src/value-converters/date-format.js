import { dateFormat, isValidDate, parseCalendarDate, toCalendarDate } from '../core/functions';

/** @typedef {import('types').SupportedFormat} SupportedFormat */

/**
 * Implements a **`dateFormat`value converter** to transform a date to DD/MM/YYYY format.
 * @category valueconverter
 */

export class DateFormatValueConverter {
  /**
   * Converts the value of the html view to the javascript model.
   * @param {string} value value from html view in the specified format
   * @param {SupportedFormat} [formatToUse] display format, by default french: `DD/MM/YYYY`
   * @returns {string | undefined} the calendar date `YYYY-MM-DD`, or the value itself when it is not a valid date
   */
  fromView(value, formatToUse = 'DD/MM/YYYY') {
    if (!value) return;
    const { valid, date } = isValidDate(value, formatToUse);
    if (!valid || !date) return value;
    return toCalendarDate(date);
  }

  /**
   * Converts the value of the javascript model to the html view.
   * @param {string | Date} value value from javascript model: calendar date `YYYY-MM-DD`, ISO date time or `Date`
   * @param {SupportedFormat} [displayFormat] display format, by default french: `DD/MM/YYYY`
   * @returns {string | undefined} the date in the specified display format
   */
  toView(value, displayFormat) {
    if (!value) return;
    const date = parseCalendarDate(value);
    if (!date) return /** @type {string} */ (value);
    const formatToUse = displayFormat || 'DD/MM/YYYY';
    if (formatToUse === 'YYYY-MM-DD') return toCalendarDate(date);
    const outputFormat = dateFormat[formatToUse]?.output;
    if (!outputFormat) return /** @type {string} */ (value);
    try {
      const formatter = new Intl.DateTimeFormat(outputFormat.culture, { ...outputFormat.options });
      return formatter.format(date);
    } catch {
      return /** @type {string} */ (value);
    }
  }
}
