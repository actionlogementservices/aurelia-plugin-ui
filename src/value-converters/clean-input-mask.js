import { valueConverter } from 'aurelia-framework';

import { cleanInputMask } from '../core/functions';

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
   * @returns {number | undefined} number or undefined in case of failure
   */
  fromView(value) {
    return cleanInputMask(value);
  }
}
