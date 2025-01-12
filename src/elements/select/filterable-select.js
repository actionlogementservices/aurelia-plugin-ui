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

import { generateUniqueId } from '../../core/functions';

/**
 * Implements the **`filterable-select` custom element** that provides a dropdown list based on a datasource with on the fly filtering and single selection.
 * @template T type of items of the data source
 * @category select
 */
@inject(DOM.Element, BindingEngine, TaskQueue)
export class FilterableSelect {
  /** Selected item @type {T} */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  value;

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

  /** Prevents the input field to be reset when click outside dropdown? @type {Boolean} */ ignoringReset = false;
  /** Is input field updated internally? @type {Boolean} */ updatingInput = false;

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
  }

  /**
   * Defines the logic triggered when the component is added to the DOM.
   */
  attached() {
    this.itemView = new InlineViewStrategy(`<template>\${${this.labelKey}}</template>`);
    this._input = this._container.querySelector(`#searchText-${this.uniqueId}`);
    this._dropdownList = this._container.querySelector(`#dropDown-${this.uniqueId}`);
    this._dropdown = Dropdown.getOrCreateInstance(this._input, { offset: [0, 4] });
    this._dropdownList.style.width = `${this._input.clientWidth}px`;
  }

  /**
   * Defines the logic triggered when the component is removed from the DOM.
   */
  detached() {
    this._dropdown?.dispose();
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
   * Defines the logic triggered when item is clicked or selected with 'Enter' key.
   * @param {T} item item clicked or selected
   * @param {boolean} notify should we dispatch custom element events?
   */
  selectItem(item, notify = true) {
    if (!this.datasource || !this.valueKey || !this._input) return;
    this.value = item;
    this.updatingInput = true;
    // eslint-disable-next-line unicorn/no-null
    this._input.value = item ? (item[this.labelKey] ?? null) : null;
    this.updatingInput = false;
    if (item) {
      this.hideDropdown();
      this.filteredItems = [item];
      this._input.blur();
    } else {
      this.resetItems();
    }
    if (notify) {
      const event = DOM.createCustomEvent('change', { bubbles: true, detail: item });
      this._taskqueue.queueMicroTask(() => this._container.dispatchEvent(event));
      const event2 = DOM.createCustomEvent('blur', { bubbles: true, detail: item });
      this._taskqueue.queueMicroTask(() => this._container.dispatchEvent(event2));
    }
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
    } else {
      this._input.focus();
    }
    return true;
  }

  /**
   * Filters the items list to those that contain the given input value and are not already selected.
   * @param {string} [inputValue] input value
   */
  filterItems(inputValue) {
    const filteredItems = inputValue
      ? this.datasource.filter(item => item[this.labelKey]?.toUpperCase().includes(inputValue.toUpperCase()))
      : this.datasource;
    this.filteredItems = filteredItems;
  }

  /**
   * Reset the items list to the original databound list
   */
  resetItems() {
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
   * Defines the logic triggered when user clicks outside the component.
   */
  resetInputValue() {
    if (!this.ignoringReset) {
      this.hideDropdown();
      this.selectItem(this.value, false);
    }
  }

  /**
   * Defines the logic triggered when user types data in the input field.
   * @param {string} inputValue user input
   */
  inputValueChanged(inputValue) {
    if (this.updatingInput) return;
    if (inputValue === '') {
      this.value = undefined;
      this.resetItems();
      this.showDropdown();
      return;
    }
    this.filterItems(inputValue);
    if (this.filteredItemsCount === 1 && this._keyCode !== 'Backspace') {
      // for auto-completion
      this.selectItem(this.filteredItems[0]);
      return;
    }
    this.showDropdown();
  }

  /**
   * Defines the logic triggered when `value` attribute is databound.
   */
  valueChanged() {
    if (!this.valueKey || this.updatingInput) return;
    this.selectItem(this.value, false);
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
    this.resetItems();
    // if value was first databound before datasource re-trigger value change
    if (this.value) this.valueChanged();
  }
}
