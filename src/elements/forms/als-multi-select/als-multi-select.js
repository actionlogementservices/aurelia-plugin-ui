import { DOM, inject, bindable, bindingMode, computedFrom, useView } from 'aurelia-framework';

import { generateUniqueId } from '../../../core/functions';

/**
 * Implements the **`als-multi-select` custom element**: a dropdown of checkboxes selecting several values.
 * Place it inside an `als-field` to get the label and the validation errors, e.g.
 * `<als-field label="Années"><als-multi-select items.bind="items" value.bind="model.years & validate"></als-multi-select></als-field>`.
 *
 * Like a native control, the element fires a `blur` event when the focus leaves it, so the default
 * `& validate` trigger works.
 * @category forms
 */
@useView('./als-multi-select.html')
@inject(DOM.Element)
export class AlsMultiSelect {
  /** Items @type {Array<{label: string, value: any}>} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  items = [];

  /** Selected values, always replaced by a new array so the binding (and `& validate`) sees the change. @type {Array<any>} */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  value = [];

  /** Text displayed in the toggle button when nothing is selected. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  placeholder = 'Sélectionner';

  /** Disabled @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  disabled = false;

  /** Prefix of the inner element ids. @type {string} */
  uniqueId = `als-multi-select-${generateUniqueId()}`;

  /**
   * Creates an instance of AlsMultiSelect.
   * @param {Element} element the custom element
   */
  constructor(element) {
    this.element = element;
  }

  /**
   * Selected values, `value` may be null or undefined when bound to an empty model.
   * @type {Array<any>}
   */
  @computedFrom('value')
  get selected() {
    return this.value || [];
  }

  /**
   * Comma-separated labels of the selected items, shown in the toggle button. Truncated visually via CSS.
   * @type {string}
   */
  @computedFrom('selected', 'items')
  get selectedLabelsText() {
    return (this.items || [])
      .filter(item => this.selected.includes(item.value))
      .map(item => item.label)
      .join(', ');
  }

  /** @type {boolean} */
  @computedFrom('selected', 'items')
  get allSelected() {
    return this.items?.length > 0 && this.selected.length === this.items.length;
  }

  /** @type {boolean} */
  @computedFrom('selected', 'items')
  get isIndeterminate() {
    return this.selected.length > 0 && this.selected.length < (this.items?.length || 0);
  }

  /**
   * Fires `blur` on the custom element once the focus leaves it, as `& validate` listens to the target element.
   * @param {FocusEvent} event the focusout event of an inner element
   * @returns {boolean} true to continue processing
   */
  handleFocusout(event) {
    if (!this.element.contains(/** @type {Node} */ (event.relatedTarget))) {
      this.element.dispatchEvent(new FocusEvent('blur'));
    }

    return true;
  }

  /**
   * Selects or deselects an item.
   * @param {{label: string, value: any}} item the item
   */
  toggleItem(item) {
    this.value = this.selected.includes(item.value)
      ? this.selected.filter(value => value !== item.value)
      : [...this.selected, item.value];
  }

  /**
   * Selects every item, or none when they are all selected.
   */
  toggleAll() {
    this.value = this.allSelected ? [] : this.items.map(item => item.value);
  }
}
