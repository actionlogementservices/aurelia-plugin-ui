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
   * @returns {undefined | string} the string representation of the number or undefined in case of failure
   */
  toView(value, options) {
    const { locale, digits, suffix } = { digits: 2, suffix: '', locale: 'fr-FR', ...options };
    if (!value || Number.isNaN(value)) return;
    const numberValue = Number(value);
    return `${numberValue.toLocaleString(locale, { minimumFractionDigits: digits })}${suffix}`;
  }
}
