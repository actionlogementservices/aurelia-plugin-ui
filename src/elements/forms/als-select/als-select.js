import { bindable, bindingMode, computedFrom, useView } from 'aurelia-framework';
import { FormInput } from '../forms-input';

/**
 * @template T
 * @augments FormInput<T>
 */
@useView('./als-select.html')
export class AlsSelect extends FormInput {
  /** Value @type {Array<{label: string, value: T}>} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  // @ts-ignore
  items;

  /**
   * Id of the element describing the error, exposed via `aria-describedby` once the field is invalid.
   * @type {string}
   */
  @computedFrom('id', 'isError')
  get ariaDescribedby() {
    return this.isError ? `${this.id}-error` : '';
  }

  /**
   * Select-specific validation hook.
   * @param {T} value Value to validate
   * @returns {boolean} true if valid, false otherwise
   */
  validateValue(value) {
    return true;
  }
}
