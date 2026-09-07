import { bindable, bindingMode, computedFrom, useView } from 'aurelia-framework';
import { FormInput } from '../forms-input';

/**
 * @augments FormInput<Array<any>>
 */
@useView('./als-multi-select.html')
export class AlsMultiSelect extends FormInput {
  /** Items @type {Array<{label: string, value: any}>} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  // @ts-ignore
  items;

  /** Value @type {Array<any>} */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  value = [];

  /** Checked items @type {Array<boolean>} */
  checkedItems = [];

  /**
   * Accessible name for the dropdown toggle, reflecting the current selection count so assistive
   * technology users know how many items are selected without opening the menu.
   * @type {string}
   */
  @computedFrom('label', 'placeholder', 'value.length')
  get toggleAriaLabel() {
    const base = this.label || this.placeholder || 'Sélectionner';
    const count = this.value?.length || 0;

    return `${base} (${count} sélectionné${count > 1 ? 's' : ''})`;
  }

  /**
   * Comma-separated labels of the selected items, shown in the toggle button in place of the
   * placeholder once at least one item is selected. Truncated visually via CSS, not here.
   * @type {string}
   */
  @computedFrom('value.length', 'items.length')
  get selectedLabelsText() {
    return this.items
      .filter(item => this.value.includes(item.value))
      .map(item => item.label)
      .join(', ');
  }

  /**
   * Whether every item is currently selected.
   * @type {boolean}
   */
  @computedFrom('value.length', 'items.length')
  get allSelected() {
    return this.items.length > 0 && this.value.length === this.items.length;
  }

  /**
   * Whether some, but not all, items are currently selected.
   * @type {boolean}
   */
  @computedFrom('value.length', 'items.length')
  get isIndeterminate() {
    return this.value.length > 0 && this.value.length < this.items.length;
  }

  attached() {
    this.checkedItems = this.items.map(item => this.value.includes(item.value));
  }

  /**
   * Custom handler to handle button focus event.
   * @param {FocusEvent} event The event
   * @returns {boolean} true to continue processing, false to cancel
   */
  handleButtonFocus = event => {
    return this.handleFocus(event);
  };

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

    this.pristine = false;

    if (this.onChange) {
      this.onChange(event);
    }

    this.validate(this.value);

    return true;
  }

  /**
   * Handles the change event on the select-all checkbox, selecting or deselecting every item.
   * @param {Event} event The change event
   * @returns {boolean} true to continue processing, false to cancel
   */
  handleToggleAll(event) {
    if (this.allSelected) {
      this.value = [];
      this.checkedItems = this.items.map(() => false);
    } else {
      this.value = this.items.map(item => item.value);
      this.checkedItems = this.items.map(() => true);
    }

    this.pristine = false;

    if (this.onChange) {
      this.onChange(event);
    }

    this.validate(this.value);

    return true;
  }

  /**
   * Override base class method to provide a custom emptiness check for multi-select.
   * @param {Array<any>} value Value to inspect
   * @returns {boolean} true when value should be considered empty
   */
  isValueEmpty(value) {
    return !Array.isArray(value) || value.length === 0;
  }

  /**
   * Validate the current selection.
   * @param {Array<any>} value Value to validate
   * @returns {boolean} true if valid, false otherwise
   */
  validateValue(value) {
    return true;
  }

  /**
   * Validate the selection, using a selection-specific required message.
   * @param {Array<any>} value Value to validate
   * @returns {boolean} true if valid, false otherwise
   */
  validate(value) {
    return super.validate(value, 'Veuillez sélectionner au moins un élément.');
  }
}
