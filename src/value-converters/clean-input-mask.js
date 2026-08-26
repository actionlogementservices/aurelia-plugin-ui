import { valueConverter } from 'aurelia-framework';

/**
 * Implements a **`cleanInputMask` value converter** to remove the input mask.
 * This converter works together with the `input-mask` attribute and the `numberFormat` value converter.
 * @category valueconverter
 * @example
 * <input
 *     type="text"
 *     input-mask="currency"
 *     value.one-time="montant | numberFormat"
 *     value.from-view="montant | cleanInputMask" />
 */
@valueConverter('cleanInputMask')
export class CleanInputMaskValueConverter {
  /**
   * Converts the value of the html view to the javascript model.
   * @param {string} value value from html view including the mask
   * @param {number} minimumFractionDigits number of fraction digits
   * @returns {number | undefined} number or undefined in case of failure
   */
  fromView(value, minimumFractionDigits = 2) {
    const cleanValue = value
      .replaceAll(/\s?_?€?/g, '')
      .replaceAll(',', '.')
      .trim();

    const parsedValue = Number.parseFloat(cleanValue);
    if (Number.isNaN(parsedValue)) {
      return;
    }

    return parsedValue;
  }
}
