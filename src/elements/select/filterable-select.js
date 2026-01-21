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
 * Implements the **`filterable-select` custom element** that provides a dropdown list based on a datasource with on the fly filtering and single selection.
 * @template T type of items of the data source
 * @template K type of selected item value
 * @category select
 */
@inject(DOM.Element, BindingEngine, TaskQueue)
export class FilterableSelect {
  /** Selected value @type {K} */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  selectedValue;

  /** Selected item @type {T} */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  selectedItem;

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

  /** Text corresponding to 'clear the selection'. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  clearSelectionText = 'Effacer la sélection';

  /** List of items filtered by the user input. @type {T[]} */ filteredItems;
  /** The last key code used. @type {string} */ _keyCode;

  /** Unique id to identify the custom element instance. @type {string} */ uniqueId = generateUniqueId();
  /** Html container of the custom element. @type {HTMLTemplateElement} */ _container;
  /** Html input element. @type {HTMLInputElement} */ _input;
  /** Html dropdown host element. @type {HTMLDivElement} */ _dropdownList;
  /** Bootstrap dropdown. @type {Dropdown} */ _dropdown;
  /** Prevents reentrancy @type {boolean} */ _guard;
  /** Prevents the input field to be reset when click outside dropdown? @type {Boolean} */ ignoringReset = false;

  /**
   * Creates an instance of the `filterable-select` custom element.
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
    if (!this._input) {
      // input field is not yet loaded but datasource is ok so queue task
      this._taskqueue.queueTask(() => this.selectItem(item, notify));
      return;
    }
    // synchronizes selection
    this.synchronizeSelection(item);
    // sets the html input element content with the label
    this.setHtmlInputContent(item);
    if (item) {
      this.hideDropdown();
      this.filteredItems = [item];
      this._input.blur();
    } else {
      this.resetDropdownItems();
    }
    // triggers events if applicable
    if (notify) {
      this.triggerChangeEvent();
      this.triggerBlurEvent();
    }
  }

  /**
   * Synchronizes custom element selection.
   * @param {T} item item to select
   */
  synchronizeSelection(item) {
    this._guard = true;
    this.selectedItem = item;
    if (!this.isInvalidValueKey()) this.selectedValue = item ? item[this.valueKey] : undefined;
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
    const eventToSend = DOM.createCustomEvent('change', { bubbles: true, detail: this.selectedItem });
    this._taskqueue.queueMicroTask(() => this._container.dispatchEvent(eventToSend));
  }

  /**
   * Triggers the 'blur' event of the custom element.
   * Required to participate in aurelia validation system.
   */
  triggerBlurEvent() {
    const eventToSend = DOM.createCustomEvent('blur', { bubbles: true, detail: this.selectedItem });
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
      this._dropdownList?.children?.length > 0 &&
      (keyCode === 'ArrowUp' || keyCode === 'ArrowDown' || keyCode === 'Tab')
    ) {
      this.ignoringReset = true;
      this._dropdownList.querySelectorAll('button').item(0).focus();
      this.ignoringReset = false;
    } else {
      this._input.focus();
    }
    return true;
  }

  /**
   * Sets the html input element content.
   * @param {T} item item
   */
  setHtmlInputContent(item) {
    // eslint-disable-next-line unicorn/no-null
    this._input.value = item ? (item[this.labelKey] ?? null) : null;
  }

  /**
   * Filters the items list to those that contain the given input value and are not already selected.
   * @param {string} [inputValue] input value
   */
  filterDropdownItems(inputValue) {
    const filteredItems = inputValue
      ? this.datasource.filter(item => item[this.labelKey]?.toUpperCase().includes(inputValue.toUpperCase()))
      : this.datasource;
    this.filteredItems = filteredItems;
  }

  /**
   * Reset the items list to the original databound list
   */
  resetDropdownItems() {
    this.filteredItems = this.datasource;
  }

  /**
   * Count of items.
   * @type {number} items count
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
   * Resets the html input.
   */
  onInputBlur() {
    if (!this.ignoringReset) {
      this.hideDropdown();
      this.selectItem(this.selectedItem, false);
    }
  }

  /**
   * Defines the logic triggered when user types data in the input field.
   * @param {string} inputValue user input
   */
  onInputChange(inputValue) {
    if (inputValue === '') {
      this.selectedItem = undefined;
      this.selectedValue = undefined;
      this.resetDropdownItems();
      this.showDropdown();
      return;
    }
    this.filterDropdownItems(inputValue);
    if (this.filteredItemsCount === 1 && this._keyCode !== 'Backspace') {
      // for auto-completion
      this.selectItem(this.filteredItems[0]);
      return;
    }
    this.showDropdown();
  }

  /**
   * Defines the logic triggered when `selected-item` attribute is databound.
   */
  selectedItemChanged() {
    if (this._guard) return;
    this.selectItem(this.selectedItem, false);
  }

  /**
   * Defines the logic triggered when `select-value` attribute is databound.
   */
  selectedValueChanged() {
    if (this._guard) return;
    if (this.isInvalidDatasource() || this.isInvalidValueKey()) return;
    const selectedItem = this.datasource.find(item => item[this.valueKey] === this.selectedValue);
    this.selectItem(selectedItem, false);
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
    // if value was first databound before datasource re-trigger value change
    if (this.selectedItem) this.selectedItemChanged();
    else if (this.selectedValue) this.selectedValueChanged();
  }
}
