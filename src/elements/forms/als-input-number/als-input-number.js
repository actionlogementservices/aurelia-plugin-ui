import { bindable, bindingMode, useView } from 'aurelia-framework';

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
  'ArrowLeft',
  'ArrowRight',
  'Backspace',
  'Tab'
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

  /** Label @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  // @ts-ignore
  label;

  /** required @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  required = false;

  /** Value @type {string} */
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
  @bindable({ defaultBindingMode: bindingMode.toView })
  step = 1;

  /** Placeholder text @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  placeholder = '';

  /** Readonly @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
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
   * @returns {boolean}
   */
  handleKeyDown(event) {
    if (event.ctrlKey && (event.key === 'a' || event.key === 'c' || event.key === 'v')) {
      // select all/copy/paste enabled
      return true;
    }

    if (!authorizedKeyList.has(event.key)) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  handleFocus() {
    if (!this.pristine) {
      this.validate(parseInt(this.value));
    }

    return true;
  }

  handleBlur() {
    if (this.pristine) {
      this.pristine = false;
    }

    this.validate(parseInt(this.value));

    return true;
  }

  /**
   * Reverse format a number string to a plain number string (remove spaces, etc.)
   * @param {string} value Value to reverse format
   * @returns {string} Reverse formatted value
   */
  reverseFormatValue(value) {
    const plainValue = value.replaceAll(/\s/g, '');
    if (!isFinite(parseInt(plainValue))) {
      return '';
    }
    return plainValue;
  }

  /**
   * Validate number value against basic rules
   * @param {number} value Value to validate
   */
  validate(value) {
    if (isNaN(value)) {
      this.isError = true;
      this.errorMessage = `La valeur n'est pas un nombre`;
    } else if (value < this.min) {
      this.isError = true;
      this.errorMessage = `La valeur minimum est ${this.min}`;
    } else if (this.max && this.max !== null && value > this.max) {
      this.isError = true;
      this.errorMessage = `La valeur maximum est ${this.max}`;
    } else {
      this.isError = false;
      this.errorMessage = '';
    }
  }
}
