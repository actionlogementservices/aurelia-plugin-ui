import {
  DOM,
  inject,
  bindable,
  bindingMode,
  TaskQueue,
  BindingEngine,
  InlineViewStrategy
} from 'aurelia-framework';
import { Dropdown } from 'bootstrap';

import { generateUniqueId, isNilOrEmpty, preventEventPropagation } from '../../core/functions';
// import { setTraceDebugger } from '../../core/debug-tracer';

/**
 * Implements the **`simple-select` custom element** that provides a dropdown list based on a datasource and single selection.
 * @template T type of items of the data source
 * @template K type of selected item value
 * @category select
 */
@inject(DOM.Element, BindingEngine, TaskQueue)
export class SimpleSelect {
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

  /** Text corresponding to 'clear the selection'. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  clearSelectionText = 'Effacer la sélection';

  /** Unique id to identify the custom element instance. @type {string} */ uniqueId = generateUniqueId();
  /** Html container of the custom element. @type {HTMLTemplateElement} */ _container;
  /** Html input element. @type {HTMLInputElement} */ _input;
  /** Html dropdown host element. @type {HTMLDivElement} */ _dropdownList;
  /** Bootstrap dropdown. @type {Dropdown} */ _dropdown;
  /** Prevents reentrancy. @type {boolean} */ _guard;

  /**
   * Creates an instance of the `simple-select` custom element.
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
    // input field is not yet loaded but datasource is ok so queue task
    if (!this._input) {
      this._taskqueue.queueTask(() => this.selectItem(item, notify));
      return;
    }
    // synchronizes selection
    this.synchronizeSelection(item);
    // sets the html input element content with the label
    this.setHtmlInputContent(item);
    // hides the dropdown
    this.hideDropdown();
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
      this._dropdownList?.children?.length &&
      (keyCode === 'ArrowUp' || keyCode === 'ArrowDown' || keyCode === 'Tab')
    ) {
      this._dropdownList.querySelectorAll('button').item(0).focus();
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
    // if value was first databound before datasource re-trigger value change
    if (this.selectedItem) this.selectedItemChanged();
    else if (this.selectedValue) this.selectedValueChanged();
  }
}
