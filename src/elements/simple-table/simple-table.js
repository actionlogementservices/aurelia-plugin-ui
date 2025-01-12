import { DOM, inject, bindable, bindingMode, TaskQueue, children, computedFrom } from 'aurelia-framework';
import { Tooltip } from 'bootstrap';

import { generateUniqueId, isNil } from '../../core/functions';
import { sortPerKey } from '../../core/sorting';

/** @typedef {import('./column').Column} Column */

/**
 * Sets the tooltip on fixed-height td if applicable.
 * @param {MouseEvent} event mouse enter event
 */
function setTooltipsIfApplicable(event) {
  const td = /** @type {HTMLTableCellElement} */ (event.target);
  if (!td.classList?.contains('fixed-height')) return;
  if (td.offsetWidth < td.scrollWidth) {
    Tooltip.getOrCreateInstance(td, { title: td.textContent });
    return;
  }
  Tooltip.getInstance(td)?.dispose();
}

/**
 * Implements the **`simple-table` custom element** that provides a simple grid with customizable columns.
 * @template T type of items of the data source
 * @category table
 */
@inject(DOM.Element, TaskQueue)
export class SimpleTable {
  /** Columns description @type {Column[]} */
  @children('column') columns = [];

  /** Selected items @type {T[]} */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  values = [];

  /** Property key used to identify item. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  valueKey = 'name';

  /** Data source @type {T[] | { items: T[], totalCount: number }} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  datasource;

  /** Maximal number of displayed rows. @type {number} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  maxRows = 50;

  /** CSS max height of the table. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  maxHeight = '500px';

  /** Selection mode. @type {'none' | 'single' | 'multiple'} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  selectionMode = 'none';

  /** Enable/Disable the fixed row height feature. @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  fixedRowHeight = true;

  /** Text corresponding to 'no result'. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  noResultText = 'Aucun résultat';

  /** Text corresponding to 'result(s)'. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  resultText = 'résultat(s).';

  /** Text corresponding to 'only first %s items displayed' warning. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  warningTemplateText = `Seuls les {maxRows} premiers résultats sont affichés.`;

  /** Unique id to identify the custom element instance. @type {string} */ uniqueId = generateUniqueId();
  /** Html container of the custom element. @type {HTMLTemplateElement} */ _container;
  /** Displayed items. @type {(T & {selected?: boolean})[]} */ items = [];
  /** The total count of items including not displayed one. @type {number} */ totalCount = 0;

  /**
   * Creates an instance of the `simple-table` custom element.
   * @param {HTMLTemplateElement} element html template element
   * @param {TaskQueue} taskqueue aurelia asynchronous task queue
   */
  constructor(element, taskqueue) {
    this._container = element;
    this._taskqueue = taskqueue;
  }

  /**
   * Defines the logic triggered when the component is added to the DOM.
   */
  attached() {
    this.setDisplayedItems();
    if (this.fixedRowHeight) this._container.addEventListener('mouseenter', setTooltipsIfApplicable, true);
  }

  /**
   * Defines the logic triggered when the component is removed from the DOM.
   */
  detached() {
    if (this.fixedRowHeight) this._container.removeEventListener('mouseenter', setTooltipsIfApplicable);
  }

  /**
   * Sets the displayed items.
   */
  setDisplayedItems() {
    this.totalCount = 0;
    this.items = [];
    if (!this.datasource) return; // the datasource is empty
    if (Array.isArray(this.datasource)) {
      // the datasource is a simple array of items
      this.totalCount = this.datasource.length;
      this.items = this.datasource.slice(0, this.maxRows);
      return;
    }
    const { items, totalCount } = this.datasource;
    if (items && totalCount) {
      // the datasource is a { items, totalCount } object
      this.totalCount = totalCount;
      this.items = items.slice(0, this.maxRows);
    }
  }

  /**
   * Sorts the displayed items by the specified column.
   * @param {Column} columnToSort the column that will define the order of the items
   */
  sortDisplayedItems(columnToSort) {
    if (!columnToSort.cellKey || !columnToSort.sortable) return;
    // remove sort order from other columns
    for (const column of this.columns.filter(c => c.cellKey && c.sortable && c !== columnToSort)) {
      column.sortOrder = undefined;
    }
    // apply sort order to selected column.
    const sortOrder = isNil(columnToSort.sortOrder) || columnToSort.sortOrder === 'desc' ? 'asc' : 'desc';
    columnToSort.sortOrder = sortOrder;
    // order items
    this.items = this.items.sort(sortPerKey(sortOrder, columnToSort.sortType, columnToSort.cellKey));
  }

  /**
   * Defines the logic triggered when item is clicked.
   * @param {T & {selected: boolean}} item item clicked or selected
   * @param {boolean} notify should we dispatch custom element events?
   * @returns {boolean} let event propagates
   */
  toggleItemSelection(item, notify = true) {
    if (!this.valueKey || this.selectionMode === 'none') return true;
    const actualSelection = this.values;
    const index = actualSelection.indexOf(item);
    if (index === -1) {
      // not selected => select
      this.values = this.selectionMode === 'multiple' ? [...this.values, item] : [item];
    } else {
      // selected => unselect
      this.values.splice(index, 1);
      this.values = [...this.values];
    }
    this.synchronizeSelection();
    if (notify) {
      this.triggerChangeEvent(this.values);
      this.triggerBlurEvent(this.values);
    }
    return true;
  }

  /**
   * Defines the logic triggered when the check all button is clicked.
   * @param {boolean} notify should we dispatch custom element events?
   * @returns {boolean} let event propagates
   */
  toggleAllSelection(notify = true) {
    if (this.selectionMode === 'none') return false;
    const selectionCount = this.values.length;
    // all checked => uncheck all otherwise check all
    this.values =
      selectionCount === this.items.length || this.selectionMode === 'single' ? [] : [...this.items];
    this.synchronizeSelection();
    if (notify) {
      this.triggerChangeEvent(this.values);
      this.triggerBlurEvent(this.values);
    }
    return true;
  }

  /**
   * Triggers the 'change' event of the custom element.
   * Required to participate in aurelia validation system.
   * @param {T[]} values selected values
   */
  triggerChangeEvent(values) {
    const eventToSend = DOM.createCustomEvent('change', { bubbles: true, detail: values });
    this._taskqueue.queueMicroTask(() => this._container.dispatchEvent(eventToSend));
  }

  /**
   * Triggers the 'blur' event of the custom element.
   * Required to participate in aurelia validation system.
   * @param {T[]} values selected values
   */
  triggerBlurEvent(values) {
    const eventToSend = DOM.createCustomEvent('blur', { bubbles: true, detail: values });
    this._taskqueue.queueMicroTask(() => this._container.dispatchEvent(eventToSend));
  }

  /**
   * Synchronizes selection from the `values` attribute.
   */
  synchronizeSelection() {
    const selectedKeys = new Set(this.values.filter(v => !isNil(v)).map(v => v[this.valueKey]));
    for (const item of this.items) {
      item.selected = selectedKeys.has(item[this.valueKey]);
    }
  }

  /**
   * Defines the logic triggered when `datasource` attribute is databound.
   */
  datasourceChanged() {
    this.setDisplayedItems();
  }

  /**
   * Defines the logic triggered when `values` attribute is databound.
   */
  valuesChanged() {
    if (!this.valueKey) return;
    if (!this.values) {
      this.values = [];
      return;
    }
    if (this.values.length > 1 && this.selectionMode !== 'multiple') {
      throw new Error(`simple-table: cannot bind multiple values with selection mode ${this.selectionMode}`);
    }
    this.synchronizeSelection();
  }

  /**
   * Are all items displayed?
   * @returns {boolean} true if all items from the datasource are displayed
   */
  @computedFrom('items', 'maxRows')
  get allItemsDisplayed() {
    return this.totalCount <= this.maxRows;
  }

  /**
   * Warning text regarding items not displayed.
   * @returns {string} warning message
   */
  @computedFrom('maxRows', 'warningTemplateText')
  get notDisplayedWarningText() {
    return this.warningTemplateText.replace('{maxRows}', this.maxRows.toString());
  }
}
