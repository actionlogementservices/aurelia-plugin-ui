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

/** @template T,U @typedef {import('./auto-complete-controller').AutoCompleteController<T,U>} AutoCompleteController<T,U> */
/** @typedef {import('aurelia-framework').BehaviorInstruction} BehaviorInstruction */

/**
 * Implements the **`auto-complete` custom element** that provides auto completion upon a controller to be specified and single selection.
 * @template T type of items that are retrieved with the controller
 * @template U type of items that are displayed
 * @template K type of selected item value
 * @category autocomplete
 */
@inject(DOM.Element, BindingEngine, TaskQueue)
export class AutoComplete {
  /** The controller used to retrieve data. @type {AutoCompleteController<T,U>} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  controller;

  /** Selected value @type {K} */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  selectedValue;

  /** Selected item @type {U | T} */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  selectedItem;

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

  /** Unique id to identify the custom element instance. @type {string} */ uniqueId = generateUniqueId();
  /** Html container of the custom element. @type {HTMLTemplateElement} */ _container;
  /** Html input element. @type {HTMLInputElement} */ _input;
  /** Html dropdown host element. @type {HTMLDivElement} */ _dropdownList;
  /** Bootstrap dropdown. @type {Dropdown} */ _dropdown;

  /** List of retrieved items. @type {(U | T)[]} */ items = [];
  /** Prevents reentrancy @type {boolean} */ _guard;
  /** Prevents the input field to be reset when click outside dropdown? @type {Boolean} */ ignoringReset = false;

  /**
   * Creates an instance of the `auto-complete` custom element.
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

  // bind() {
  //   /** @type {BehaviorInstruction} */
  //   const behaviorInstruction = this._container?.au?.controller?.instruction;
  //   console.log(Object.keys(behaviorInstruction.attributes));
  // }

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
   * @param {U | T} item item clicked or selected
   * @param {boolean} notify should we dispatch custom element events?
   */
  selectItem(item, notify = true) {
    if (!this.controller) return;
    // input field is not yet loaded but controller is ok so queue task
    if (!this._input) {
      this._taskqueue.queueTask(() => this.selectItem(item, notify));
      return;
    }
    // synchronizes selection
    this.synchronizeSelection(item);
    // sets the html input element content with the label
    this.setHtmlInputContent(item);
    if (item) {
      this.hideDropdown();
      this._input?.blur();
    }
    // triggers events if applicable
    if (notify) {
      this.triggerChangeEvent();
      this.triggerBlurEvent();
    }
  }

  /**
   * Synchronizes custom element selection.
   * @param {U | T} item item to select
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
   * Loads the items from the controller's result.
   * @param {string} inputValue input value
   */
  async loadItems(inputValue) {
    const results = await this.controller.search(inputValue);
    this.items = results;
  }

  /**
   * Sets the html input element content.
   * @param {T | U} item item
   */
  setHtmlInputContent(item) {
    // eslint-disable-next-line unicorn/no-null
    this._input.value = item ? (item[this.labelKey] ?? null) : null;
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
    if (!this.ignoringReset) this.selectItem(this.selectedItem, false);
  }

  /**
   * Defines the logic triggered when user types data in the input field.
   * @param {string} inputValue user input
   */
  onInputChange(inputValue) {
    if (inputValue === '') {
      // @ts-ignore
      this.selectedItem = undefined;
      this.selectedValue = undefined;
      this.hideDropdown();
      return;
    }
    this.loadItems(inputValue);
    this.showDropdown();
  }

  /**
   * Defines the logic triggered when `select-value` attribute is databound.
   * @param {K} value databound value
   */
  async selectedValueChanged(value) {
    if (this._guard) return;
    if (!this.controller) return;
    const itemsToSelect = await this.controller.getItems([value]);
    this.selectItem(itemsToSelect[0], false);
  }

  /**
   * Defines the logic triggered when `selected-item` attribute is databound.
   * @param {T} value databound value
   */
  selectedItemChanged(value) {
    if (this._guard) return;
    if (!this.controller) return;
    const selectedItem = this.controller.buildItemModel(value);
    this.selectItem(selectedItem, false);
  }

  /**
   * Defines the logic triggered when `label-key` attribute is databound.
   * @param {string} labelKey databound value
   */
  labelKeyChanged(labelKey) {
    this.itemView = new InlineViewStrategy(`<template>\${${labelKey}}</template>`);
  }
}
