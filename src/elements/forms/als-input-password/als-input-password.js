import { bindable, bindingMode, useView } from 'aurelia-framework';
import { FormInput } from '../forms-input';

/**
 * @augments FormInput<string>
 */
@useView('./als-input-password.html')
export class AlsInputPassword extends FormInput {
  /** Type @type {'password' | 'text'} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  type = 'password';

  /** Autocomplete @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  autocomplete = 'current-password';

  constructor() {
    super();
  }

  /**
   * Validate password-specific rules.
   * @param {string} value Value to validate
   * @returns {boolean} true if valid, false otherwise
   */
  validateValue(value) {
    return true;
  }

  /**
   * Toggle between masking and revealing the password value.
   * @returns {void}
   */
  togglePasswordVisibility() {
    this.type = this.type === 'password' ? 'text' : 'password';
  }

  /**
   * Handle keyboard events.
   * @param {KeyboardEvent} event The keyboard event
   * @returns {boolean} true to continue processing, false to cancel
   */
  handleKeyDown(event) {
    this.pristine = false;

    if (event.key === 'Enter') {
      this.validate(this.value);
      return true;
    }

    return true;
  }
}
