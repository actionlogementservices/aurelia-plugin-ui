import { bindable, bindingMode } from 'aurelia-framework';

/**
 * Generic base for form inputs.
 * @template T
 */
export class FormInput {
  /** Id @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  // @ts-ignore
  id;

  /** Name @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  // @ts-ignore
  name;

  /** Type @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  type = 'text';

  /** Label @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  // @ts-ignore
  label;

  /** required @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  required = true;

  /** Value @type {T} */
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
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  pristine = true;

  /** onFocus @type {(event: FocusEvent) => void} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  onFocus;

  /** onChange @type {(event: Event) => void} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  onChange;

  /** onBlur @type {(event: FocusEvent) => void} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  onBlur;

  constructor() {}

  /**
   * Handle focus event.
   * @param {FocusEvent} event The focus event
   * @returns {boolean} true to continue processing
   */
  handleFocus(event) {
    if (this.onFocus) {
      this.onFocus(event);
    }

    return true;
  }

  /**
   * Handle change event and run validation.
   * @param {Event} event The change event
   * @returns {boolean} true to continue processing
   */
  handleChange(event) {
    this.pristine = false;

    if (this.onChange) {
      this.onChange(event);
    }

    return true;
  }

  /**
   * Handle blur event and run validation.
   * @param {FocusEvent} event The blur event
   * @returns {boolean} true to continue processing
   */
  handleBlur(event) {
    if (!this.pristine) {
      this.validate(this.value);
    }

    if (this.onBlur) {
      this.onBlur(event);
    }

    return true;
  }

  /**
   * Validate common field rules.
   * @param {T} value Value to validate
   * @param {string} defaultRequiredMessage Default message to use when required validation fails
   * @returns {boolean} true if valid, false otherwise
   */
  validate(value, defaultRequiredMessage = 'Ce champ est obligatoire.') {
    if (this.required && this.isValueEmpty(value)) {
      this.isError = true;
      this.errorMessage = defaultRequiredMessage;
      return false;
    }

    if (!this.validateValue(value)) {
      return false;
    }

    this.isError = false;
    this.errorMessage = '';
    return true;
  }

  /**
   * Generic emptiness check that works for strings and nullable values.
   * @param {T} value Value to inspect
   * @returns {boolean} true when value should be considered empty
   */
  isValueEmpty(value) {
    return value === undefined || value === null || value === '';
  }

  // eslint-disable-next-line jsdoc/require-returns-check
  /**
   * Type-specific validation hook.
   * Subclasses should override this.
   * @param {T} value Value to validate
   * @returns {boolean} true if valid, false otherwise
   */
  validateValue(value) {
    throw new Error('validateValue() must be implemented in the subclass');
  }
}
