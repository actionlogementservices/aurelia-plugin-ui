import { bindable, bindingMode, useView } from 'aurelia-framework';

@useView('./als-input-text.html')
export class AlsInputText {
  /** Id @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  // @ts-ignore
  id;

  /** Name @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  // @ts-ignore
  name;

  /** Type @type {'text' | 'email'} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  type = 'text';

  /** Label @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  // @ts-ignore
  label;

  /** required @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  required = true;

  /** Value @type {string} */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  // @ts-ignore
  value;

  /** Placeholder text @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  placeholder = '';

  /** Readonly @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  readonly = false;

  /** Disabled @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  disabled = false;

  /** Field only @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  fieldOnly = false;

  /** Error @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  isError = false;

  /** Error message @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  errorMessage = '';

  /** Pristine @type {boolean} */
  pristine = true;

  constructor() {}

  /**
   * Custom handler to prevent typing anything other than a number or to edit the field.
   * @param {KeyboardEvent} event The keyboard event
   * @returns {boolean} true to continue processing, false to cancel
   */
  handleKeyDown(event) {
    if (event.key === 'Enter') {
      this.validate(this.value);
      return true;
    }

    return true;
  }

  handleBlur() {
    this.validate(this.value);

    return true;
  }

  /**
   * Validate value against rules
   * @param {string} value Value to validate
   */
  validate(value) {
    if (!value && this.required) {
      this.isError = true;
      this.errorMessage = `Ce champ est obligatoire.`;
      return;
    }

    if (this.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      this.isError = true;
      this.errorMessage = `L'adresse email n'est pas valide.`;
    } else {
      this.isError = false;
      this.errorMessage = '';
    }
  }
}
