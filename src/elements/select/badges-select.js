import {
  DOM,
  inject,
  bindable,
  bindingMode,
  computedFrom,
  TaskQueue,
  BindingEngine,
  InlineViewStrategy
} from 'aurelia-framework';
import { Dropdown } from 'bootstrap';

import { generateUniqueId, isNilOrEmpty, preventEventPropagation } from '../../core/functions';
// import { setTraceDebugger } from '../../core/debug-tracer';

/**
 * Implements the **`badges-select` custom element** that provides a dropdown list based on a datasource with on the fly filtering and a multiple selection with badge rendering.
 * @template T type of items of the data source
 * @template K type of selected item value
 * @category select
 */
@inject(DOM.Element, BindingEngine, TaskQueue)
export class BadgesSelect {
  /** Selected values @type {K[]} */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  selectedValues;

  /** Selected items @type {T[]} */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  selectedItems = [];

  /** Data source @type {T[]} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  datasource;

  /** The place holder text. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  placeholder;

  /** Property key used to identify item. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  valueKey = 'name';

  /** Property key used to display item. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  labelKey = 'description';

  /** Enable/Disable the custom element to prevent user modification. @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  disabled = false;

  /** Autosize width of the dropdown to the parent's width. @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  autosize = true;

  /** Text corresponding to 'no result'. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  noResultText = 'Aucun résultat';

  /** List of items filtered by the user input. @type {T[]} */ filteredItems;
  /** The last key code used. @type {string} */ _keyCode;

  /** Unique id to identify the custom element instance. @type {string} */ uniqueId = generateUniqueId();
  /** Html container of the custom element. @type {HTMLTemplateElement} */ _container;
  /** Html input element. @type {HTMLInputElement} */ _input;
  /** Html dropdown host element. @type {HTMLDivElement} */ _dropdownList;
  /** Bootstrap dropdown. @type {Dropdown} */ _dropdown;
  /** Prevents reentrancy. @type {boolean} */ _guard;
  /** Prevents the input field to be reset when click outside dropdown? @type {Boolean} */ ignoringReset = false;

  /**
   * Creates an instance of the `badges-select` custom element.
   * @param {HTMLTemplateElement} element html template element
   * @param {BindingEngine} bindingEngine aurelia binding engine
   * @param {TaskQueue} taskqueue aurelia asynchronous task queue
   */
  constructor(element, bindingEngine, taskqueue) {
    this._container = element;
    this.bindingEngine = bindingEngine;
    this._taskqueue = taskqueue;
    // setTraceDebugger(this);
  }

  /**
   * Defines the logic triggered when the custom element is added to the DOM.
   */
  attached() {
    this.itemView = new InlineViewStrategy(`<template>\${${this.labelKey}}</template>`);
    this._input = this._container.querySelector(`#searchText-${this.uniqueId}`);
    this._input.addEventListener('change', preventEventPropagation);
    this._dropdownList = this._container.querySelector(`#dropDown-${this.uniqueId}`);
    this._dropdown = Dropdown.getOrCreateInstance(this._input, { offset: [0, 4] });
  }

  /**
   * Defines the logic triggered when the custom element is removed from the DOM.
   */
  detached() {
    this._dropdown?.dispose();
    this._input.removeEventListener('change', preventEventPropagation);
  }

  /**
   * Shows the dropdown containing items.
   */
  showDropdown() {
    this._dropdown?.show();
  }

  /**
   * Hides the dropdown.
   */
  hideDropdown() {
    this._dropdown?.hide();
  }

  /**
   * Selects the specified item.
   * @param {T} item item clicked or selected
   * @param {boolean} notify should we dispatch custom element events?
   */
  selectItem(item, notify = true) {
    if (this.isInvalidDatasource()) return;
    // adds a new badge if applicable and synchronizes selection
    if (this.isItemNotSelected(item)) {
      this.synchronizeSelection([...this.selectedItems, item]);
    }
    // clears the html input element
    this.clearHtmlInput();
    // hides the dropdown
    this.hideDropdown();
    // triggers events if applicable
    if (notify) {
      this.triggerChangeEvent();
      this.triggerBlurEvent();
    }
  }

  /**
   * Removes the item with the specified value from selected items.
   * @param {T} itemToRemove item to remove
   */
  removeItem(itemToRemove) {
    const items = (this.selectedItems || []).filter(item => item !== itemToRemove);
    this.synchronizeSelection(items);
    this.triggerChangeEvent();
    this.triggerBlurEvent();
  }

  /**
   * Synchronizes custom element selection.
   * @param {T[]} items items to select
   */
  synchronizeSelection(items) {
    this._guard = true;
    this.selectedItems = Array.isArray(items) ? [...items] : [];
    if (!this.isInvalidValueKey()) this.selectedValues = this.selectedItems.map(item => item[this.valueKey]);
    this.filterDropdownItems();
    // ensures the _guard stays 'true' until after the change has been processed by the observer system
    this._taskqueue.queueMicroTask(() => {
      this._guard = false;
    });
  }

  /**
   * Triggers the 'change' event of the custom element.
   * Required to participate in aurelia validation system.
   */
  triggerChangeEvent() {
    const eventToSend = DOM.createCustomEvent('change', { bubbles: true, detail: this.selectedItems });
    this._taskqueue.queueMicroTask(() => this._container.dispatchEvent(eventToSend));
  }

  /**
   * Triggers the 'blur' event of the custom element.
   * Required to participate in aurelia validation system.
   */
  triggerBlurEvent() {
    const eventToSend = DOM.createCustomEvent('blur', { bubbles: true, detail: this.selectedItems });
    this._taskqueue.queueMicroTask(() => this._container.dispatchEvent(eventToSend));
  }

  /**
   * Defines the logic triggered when user uses keyboard.
   * @param {string} keyCode key code
   * @returns {boolean} true
   */
  manageKey(keyCode) {
    this._keyCode = keyCode;
    // pass focus to first listitem when up/down/tab keys are pressed
    if (
      this._dropdownList?.children?.length &&
      (keyCode === 'ArrowUp' || keyCode === 'ArrowDown' || keyCode === 'Tab')
    ) {
      this.ignoringReset = true;
      this._dropdownList.querySelectorAll('button').item(0).focus();
      this.ignoringReset = false;
    }
    // do nothing (=return false) if input field is empty and enter is pressed to avoid remove selected items
    return !(keyCode === 'Enter' && !this._input?.value?.length);
  }

  /**
   * Filters the dropdown items list to those that contain the given input value and are not already selected.
   * @param {string} [text] input text
   */
  filterDropdownItems(text) {
    if (this.isInvalidDatasource()) return;
    // retrieve items that matches the input text
    const itemsToFilter =
      text && !this.isInvalidLabelKey()
        ? this.datasource.filter(item =>
            item[this.labelKey]?.toLocaleUpperCase().includes(text.toLocaleUpperCase())
          )
        : this.datasource;
    // filter them to those not already selected
    this.filteredItems = itemsToFilter.filter(item => this.isItemNotSelected(item));
  }

  /**
   * Resets the dropdown items list to the original databound list.
   */
  resetDropdownItems() {
    this.filteredItems = this.datasource;
  }

  /**
   * Clears the html input element.
   */
  clearHtmlInput() {
    // eslint-disable-next-line unicorn/no-null
    this._input.value = null;
  }

  /**
   * Count of items.
   * @type {number}
   */
  @computedFrom('filteredItems')
  get filteredItemsCount() {
    return this.filteredItems?.length;
  }

  /**
   * Is the datasource invalid?
   * @returns {boolean} true if invalid, false otherwise
   */
  isInvalidDatasource() {
    return !this.datasource || !Array.isArray(this.datasource);
  }

  /**
   * Is the labelKey invalid?
   * @returns {boolean} true if invalid, false otherwise
   */
  isInvalidLabelKey() {
    return isNilOrEmpty(this.labelKey);
  }

  /**
   * Is the valueKey invalid?
   * @returns {boolean} true if invalid, false otherwise
   */
  isInvalidValueKey() {
    return isNilOrEmpty(this.valueKey);
  }

  /**
   * Checks if the speified item is already selected?
   * @param {T} item item to check
   * @returns {boolean | undefined} true if already selected, false otherwise
   */
  isItemNotSelected(item) {
    if (!item) return;
    const alreadySelectedKeys = new Set(this.selectedItems.map(v => v[this.valueKey]));
    return !alreadySelectedKeys.has(item[this.valueKey]);
  }

  /**
   * Defines the logic triggered when user clicks outside of the html input element.
   */
  onInputBlur() {
    if (!this.ignoringReset) this.clearHtmlInput();
  }

  /**
   * Defines the logic triggered when user types data in the html input element.
   * @param {string} inputValue user input
   */
  onInputChange(inputValue) {
    this.filterDropdownItems(inputValue);
    if (this.filteredItemsCount === 1 && this._keyCode !== 'Backspace') {
      // for auto-completion
      this.selectItem(this.filteredItems[0]);
      return;
    }
    this.showDropdown();
  }

  /**
   * Defines the logic triggered when `selected-items` attribute is databound.
   * @param {undefined | T[]} newItems new `selected-items` value
   */
  selectedItemsChanged(newItems) {
    if (this._guard) return;
    this.synchronizeSelection(newItems);
    this.filterDropdownItems();
  }

  /**
   * Defines the logic triggered when `selected-values` attribute is databound.
   * @param {undefined | K[]} newValues new `selected-values` value
   */
  selectedValuesChanged(newValues) {
    if (this._guard) return;
    if (this.isInvalidDatasource() || this.isInvalidValueKey()) return;
    const newItems =
      newValues?.length > 0
        ? this.datasource.filter(item => newValues.includes(item && item[this.valueKey]))
        : [];
    this.synchronizeSelection(newItems);
  }

  /**
   * Defines the logic triggered when `label-key` attribute is databound.
   * @param {string} labelKey databound value
   */
  labelKeyChanged(labelKey) {
    this.itemView = new InlineViewStrategy(`<template>\${${labelKey}}</template>`);
  }

  /**
   * Defines the logic triggered when `datasource` attribute is databound.
   */
  datasourceChanged() {
    this.resetDropdownItems();
    // if values was first databound before datasource re-trigger values change
    if (Array.isArray(this.selectedValues)) {
      this.selectedValuesChanged(this.selectedValues);
    } else {
      this.filterDropdownItems();
    }
  }
}
