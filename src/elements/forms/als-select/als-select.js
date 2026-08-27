import { bindable, bindingMode, useView } from 'aurelia-framework';
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

  constructor() {
    super();
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
