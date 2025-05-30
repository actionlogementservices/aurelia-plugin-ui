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

import { generateUniqueId, preventEventPropagation } from '../../core/functions';

/** @template T,U @typedef {import('./auto-complete-controller').AutoCompleteController<T,U>} AutoCompleteController<T,U> */

/**
 * Implements the **`badges-auto-complete` custom element** that provides auto completion upon a controller to be specified and a multiple selection with badge rendering.
 * @template T type of items that are retrieved with the controller
 * @template U type of items that are displayed
 * @category autocomplete
 */
@inject(DOM.Element, BindingEngine, TaskQueue)
export class BadgesAutoComplete {
  /** The controller used to retrieve data. @type {AutoCompleteController<T,U>} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  controller;

  /** Selected values @type {string} */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  selectedValues;

  /** Selected items @type {(U | T)[]} */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  selectedItems = [];

  /** The place holder text. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  placeholder;

  /** Property key used to identify item. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  valueKey = 'name';

  /** Property key used to display item. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  labelKey = 'description';

  /** Throttling delay in ms before requesting data (default 700). @type {number} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  delay = 700;

  /** Enable/Disable the custom element to prevent user modification. @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  disabled = false;

  /** Autosize width of the dropdown to the parent's width. @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  autosize = true;

  /** Text corresponding to 'no result'. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  noResultText = 'Aucun résultat';

  /** The last key code used. @type {string} */ _keyCode;

  /** Unique id to identify the custom element instance. @type {string} */ uniqueId = generateUniqueId();
  /** Html container of the custom element. @type {HTMLTemplateElement} */ _container;
  /** Html input element. @type {HTMLInputElement} */ _input;
  /** Html dropdown host element. @type {HTMLDivElement} */ _dropdownList;
  /** Bootstrap dropdown. @type {Dropdown} */ _dropdown;

  /** List of retrieved items. @type {(U | T)[]} */ items = [];
  /** Prevents the input field to be reset when click outside dropdown? @type {Boolean} */ ignoringReset = false;
  /** Is input field updated internally? @type {Boolean} */ updatingInput = false;

  /**
   * Creates an instance of the `badges-auto-complete` custom element.
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
    this._input.addEventListener('change', preventEventPropagation);
    this._dropdownList = this._container.querySelector(`#dropDown-${this.uniqueId}`);
    this._dropdown = Dropdown.getOrCreateInstance(this._input, { offset: [0, 4] });
  }

  /**
   * Defines the logic triggered when the component is removed from the DOM.
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
    this.items = [];
  }

  /**
   * Defines the logic triggered when item is clicked or selected with 'Enter' key.
   * @param {U | T} item item clicked or selected
   * @param {boolean} notify should we dispatch custom element events?
   */
  selectItem(item, notify = true) {
    if (!this.controller || !this.valueKey || !this._input) return;
    if (this.isItemNotSelected(item)) {
      this.selectedItems = [...this.selectedItems, item];
    }
    this.updatingInput = true;
    this.clearInputField();
    this.updatingInput = false;
    this.hideDropdown();
    if (notify) {
      this.triggerChangeEvent(this.selectedItems);
      this.triggerBlurEvent(this.selectedItems);
    }
  }

  /**
   * Triggers the 'change' event of the custom element.
   * Required to participate in aurelia validation system.
   * @param {(U | T)[]} values selected values
   */
  triggerChangeEvent(values) {
    const eventToSend = DOM.createCustomEvent('change', { bubbles: true, detail: values });
    this._taskqueue.queueMicroTask(() => this._container.dispatchEvent(eventToSend));
  }

  /**
   * Triggers the 'blur' event of the custom element.
   * Required to participate in aurelia validation system.
   * @param {(U | T)[]} values selected values
   */
  triggerBlurEvent(values) {
    const eventToSend = DOM.createCustomEvent('blur', { bubbles: true, detail: values });
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
    }
    return true;
  }

  /**
   * Loads the items from the controller's result.
   * @param {string} inputValue input value
   */
  async loadItems(inputValue) {
    const results = await this.controller.search(inputValue);
    this.items = results.filter(item => this.isItemNotSelected(item));
  }

  /**
   * Count of items.
   * @type {number} items count
   */
  @computedFrom('items')
  get itemsCount() {
    return this.items?.length;
  }

  /**
   * Defines the logic triggered when user clicks outside the component.
   */
  resetInputValue() {
    if (!this.ignoringReset) this.clearInputField();
  }

  /**
   * Clears the input field.
   */
  clearInputField() {
    // eslint-disable-next-line unicorn/no-null
    this._input.value = null;
  }

  /**
   * Checks if the speified item is already selected?
   * @param {U | T} item item to check
   * @returns {boolean | undefined} true if already selected, false otherwise
   */
  isItemNotSelected(item) {
    if (!item) return;
    const alreadySelectedKeys = new Set(this.selectedItems.map(v => v[this.valueKey]));
    return !alreadySelectedKeys.has(item[this.valueKey]);
  }

  /**
   * Removes the specifed item from selected items.
   * @param {U | T} item item to remove
   */
  removeItem(item) {
    const index = this.selectedItems.indexOf(item);
    if (index !== -1) {
      this.selectedItems.splice(index, 1);
      this.selectedItems = [...this.selectedItems];
    }
    this.triggerChangeEvent(this.selectedItems);
    this.triggerBlurEvent(this.selectedItems);
  }

  /**
   * Defines the logic triggered when user types data in the input field.
   * @param {string} inputValue user input
   */
  async inputValueChanged(inputValue) {
    if (this.updatingInput) return;
    if (inputValue === '') {
      this.value = undefined;
      this.hideDropdown();
      return;
    }
    await this.loadItems(inputValue);
    const itemsCount = this.items ? this.items.length : 0;
    if (itemsCount === 1 && this._keyCode !== 'Backspace') {
      // for auto-completion
      this.selectItem(this.items[0]);
      return;
    }
    this.showDropdown();
  }

  /**
   * Defines the logic triggered when `selected-items` attribute is databound.
   */
  selectedItemsChanged() {
    this._taskqueue.queueTask(() => {
      if (!this.controller || !this.valueKey || this.updatingInput) return;
      if (!this.selectedItems) this.selectedItems = [];
    });
  }

  /**
   * Defines the logic triggered when `label-key` attribute is databound.
   * @param {string} labelKey databound value
   */
  labelKeyChanged(labelKey) {
    this.itemView = new InlineViewStrategy(`<template>\${${labelKey}}</template>`);
  }
}
