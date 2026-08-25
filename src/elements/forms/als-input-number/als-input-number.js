import { bindable, bindingMode, computedFrom, useView } from 'aurelia-framework';

const authorizedKeyList = new Set([
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'Shift',
  'Meta',
  'ArrowLeft',
  'ArrowRight',
  'Backspace',
  'Delete',
  'Enter',
  'Tab',
  'Home',
  'End',
  'Escape'
]);

@useView('./als-input-number.html')
export class AlsInputNumber {
  /** Id @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  // @ts-ignore
  id;

  /** Name @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  // @ts-ignore
  name;

  /** Type @type {'integer' | 'decimal' | 'currency'} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  type = 'integer';

  /** Label @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  // @ts-ignore
  label;

  /** required @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  required = true;

  /** Value @type {number} */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  // @ts-ignore
  value;

  /** Min value @type {number} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  min = 0;

  /** Max value @type {number} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  // @ts-ignore
  max;

  /** Step @type {number} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  step = 1;

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

  /** onFocus @type {(event: FocusEvent) => void} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  onFocus;

  /** onChange @type {(event: Event) => void} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  onChange;

  /** onBlur @type {(event: FocusEvent) => void} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  onBlur;

  /**
   * Ids of the element(s) describing the input, exposed via `aria-describedby`: the always-present
   * range hint, plus the error message once the field is invalid.
   * @type {string}
   */
  @computedFrom('id', 'isError')
  get ariaDescribedby() {
    const ids = [`${this.id}-hint`];

    if (this.isError) {
      ids.push(`${this.id}-error`);
    }

    return ids.join(' ');
  }

  /**
   * Visually hidden hint describing the accepted value range, since `min`/`max` have no native
   * effect or accessible exposure on a `type="text"` input.
   * @type {string}
   */
  @computedFrom('min', 'max')
  get rangeHint() {
    if (this.max !== undefined && this.max !== null) {
      return `Valeur comprise entre ${this.min} et ${this.max}.`;
    }

    return `Valeur minimum : ${this.min}.`;
  }

  constructor() {}

  /**
   * Marks the field as touched so live validation can start, and forwards the focus event.
   * @param {FocusEvent} event The focus event
   * @returns {boolean} true to continue processing, false to cancel
   */
  handleFocus(event) {
    this.pristine = false;

    if (this.onFocus) {
      this.onFocus(event);
    }

    return true;
  }

  /**
   * Custom handler to prevent typing anything other than a number or to edit the field.
   * @param {KeyboardEvent} event The keyboard event
   * @returns {boolean} true to continue processing, false to cancel
   */
  handleKeyDown(event) {
    if (
      this.type === 'decimal' &&
      ((event.shiftKey && event.key === '.') || event.key === '.' || event.key === ',')
    ) {
      // Allow decimal separator for decimal and currency types
      return true;
    }

    if ((event.ctrlKey || event.metaKey) && (event.key === 'a' || event.key === 'c' || event.key === 'v')) {
      // Allow Select all, Copy, Paste
      return true;
    }

    if (event.key === 'Enter') {
      this.validate(this.value);
      return true;
    }

    if (!authorizedKeyList.has(event.key)) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  /**
   * Handle blur event to validate the value and forward the event to the parent component.
   * @param {FocusEvent} event The blur event
   * @returns {boolean} true to continue processing, false to cancel
   */
  handleBlur(event) {
    this.validate(this.value);

    return true;
  }

  /**
   * Validate number value against basic rules
   * @param {number} value Value to validate
   * @returns {boolean} true if value is valid
   */
  validate(value) {
    if ((value === undefined || value === null) && this.required) {
      this.isError = true;
      this.errorMessage = `Ce champ est obligatoire.`;
      return false;
    }

    if (!isFinite(value)) {
      this.isError = true;
      this.errorMessage = `La valeur n'est pas un nombre valide.`;
      return false;
    } else if (value < this.min) {
      this.isError = true;
      this.errorMessage = `La valeur minimum est ${this.min}.`;
      return false;
    } else if (this.max && this.max !== null && value > this.max) {
      this.isError = true;
      this.errorMessage = `La valeur maximum est ${this.max}.`;
      return false;
    }

    this.isError = false;
    this.errorMessage = '';
    return true;
  }
}
