import { bindable, bindingMode, useView } from 'aurelia-framework';
import { FormInput } from '../forms-input';

/**
 * @augments FormInput<string>
 */
@useView('./als-input-text.html')
export class AlsInputText extends FormInput {
  /** Type @type {'text' | 'email'} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  type = 'text';

  constructor() {
    super();
  }

  /**
   * Validate text-specific rules.
   * @param {string} value Value to validate
   * @returns {boolean} true if valid, false otherwise
   */
  validateValue(value) {
    if (this.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      this.isError = true;
      this.errorMessage = "L'adresse email n'est pas valide.";
      return false;
    }

    return true;
  }

  /**
   * Custom handler to prevent typing anything other than a number or to edit the field.
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
