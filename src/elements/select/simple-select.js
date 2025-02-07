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

import { generateUniqueId, preventEventPropagation } from '../../core/functions';

/**
 * Implements the **`simple-select` custom element** that provides a dropdown list based on a datasource and single selection.
 * @template T type of items of the data source
 * @category select
 */
@inject(DOM.Element, BindingEngine, TaskQueue)
export class SimpleSelect {
  /** Selected value @type {string} */
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
    if (!this.datasource || !this._input) return;
    this.selectedItem = item;
    if (this.valueKey && this.selectedItem) this.selectedValue = this.selectedItem[this.valueKey];
    // eslint-disable-next-line unicorn/no-null
    this._input.value = item ? item[this.labelKey] : null;
    this.hideDropdown();
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
      this._dropdownList.querySelectorAll('button').item(0).focus();
    } else {
      this._input.focus();
    }
    return true;
  }

  /**
   * Defines the logic triggered when `selected-item` attribute is databound.
   */
  selectedItemChanged() {
    this._taskqueue.queueTask(() => this.selectItem(this.selectedItem, false));
  }

  /**
   * Defines the logic triggered when `select-value` attribute is databound.
   */
  selectedValueChanged() {
    this._taskqueue.queueTask(() => {
      if (!this.valueKey || !this.datasource) return;
      const selectedItem = this.datasource.find(item => item[this.valueKey] === this.selectedValue);
      this.selectItem(selectedItem, false);
    });
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
