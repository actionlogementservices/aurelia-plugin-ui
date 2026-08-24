import { bindable, bindingMode, useView } from 'aurelia-framework';

@useView('./als-multi-select.html')
export class AlsMultiSelect {
  /** Bootstrap dropdown. @type {Dropdown} */ _dropdown;

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
  required = true;

  /** Value @type {Array<{label: string, value: any}>} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  // @ts-ignore
  items;

  /** Value @type {Array<any>} */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  // @ts-ignore
  value;

  /** Checked items @type {Array<boolean>} */
  checkedItems = [];

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

  /** onBlur @type {(event: FocusEvent) => void} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  onBlur;

  constructor() {}

  attached() {
    this.checkedItems = this.items.map(item => this.value.includes(item.value));
  }

  /**
   * Custom handler to handle button focus event.
   * @param {FocusEvent} event The event
   * @returns {boolean} true to continue processing, false to cancel
   */
  handleButtonFocus(event) {
    if (this.pristine) {
      this.pristine = false;
    }

    return true;
  }

  /**
   * Handles the change event when an item is selected or deselected.
   * @param {Event} event The change event
   * @param {{label: string, value: any}} item The item that was selected or deselected
   * @param {number} index The index of the item that was selected or deselected
   * @returns {boolean} true to continue processing, false to cancel
   */
  handleChange(event, item, index) {
    if (this.value.includes(item.value)) {
      this.value = this.value.filter(v => v !== item.value);
      this.checkedItems[index] = false;
    } else {
      this.value.push(item.value);
      this.checkedItems[index] = true;
    }

    this.validate();

    return true;
  }

  /**
   * Validates the current selection and sets the error state accordingly.
   * @returns {void}
   */
  validate() {
    if (this.required && this.value.length === 0) {
      this.isError = true;
      this.errorMessage = 'Veuillez sélectionner au moins un élément.';
    } else {
      this.isError = false;
      this.errorMessage = '';
    }
  }
}
