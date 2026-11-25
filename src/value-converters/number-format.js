/**
 * Implements a **`numberFormat`value converter** to transform a number to a string representation.
 * This converter works together with the `input-mask` attribute and the `cleanInputMask` value converter.
 * @category valueconverter
 * @example
 * <input
 *     type="text"
 *     input-mask="currency"
 *     value.one-time="montant | numberFormat"
 *     value.from-view="montant | cleanInputMask" />
 */
export class NumberFormatValueConverter {
  /**
   * Converts the value of the javascript model to the html view.
   * @param {string} value value from javascript model
   * @param {{ locale?: string, digits?: number, suffix?: string }} options formating options
   * @returns {undefined | string} the formatted number (0 included), undefined for an empty or non numeric value
   */
  toView(value, options) {
    const { locale, digits, suffix } = { digits: 2, suffix: '', locale: 'fr-FR', ...options };
    const numberValue = Number(value);
    if (value === null || value === undefined || value === '' || Number.isNaN(numberValue)) return;
    return `${numberValue.toLocaleString(locale, { minimumFractionDigits: digits })}${suffix}`;
  }
}
