import { valueConverter } from 'aurelia-framework';

@valueConverter('formIntInputFormat')
export class formIntInputFormatValueConverter {
  /**
   *
   * @param {string} value
   * @param {any} options
   * @returns {string}
   */
  toView(value, options) {
    const { locale } = { locale: 'fr-FR', ...options };
    if (!value || !isFinite(parseInt(value))) return '';
    const numberValue = Number(value);

    return new Intl.NumberFormat(locale).format(numberValue);
  }

  /**
   *
   * @param {string} value
   * @returns
   */
  fromView(value) {
    const plainValue = value.replaceAll(/\s/g, '');
    if (!isFinite(parseInt(plainValue))) {
      return '';
    }

    return plainValue;
  }
}
