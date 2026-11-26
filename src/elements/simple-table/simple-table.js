import { DOM, inject, bindable, bindingMode, TaskQueue, children, computedFrom } from 'aurelia-framework';
import { Tooltip } from 'bootstrap';

import { generateUniqueId, isNil } from '../../core/functions';
import { sortPerKey } from '../../core/sorting';

/** @typedef {import('./column').Column} Column */

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
  selectedItems = [];

  /** Property key used to identify item. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  valueKey = 'name';

  /** Data source @type {T[] | { items: T[], totalCount: number }} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  datasource;

  /** Meta Data @type { any } */
  @bindable({ defaultBindingMode: bindingMode.toView })
  metadata;

  /** Parent memory reference @type { any }} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  parentRef;

  /** Enable/Disable the custom element to prevent user modification. @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  disabled = false;

  /**
   * Maximal number of displayed rows, the page size when paginated (defaults: 50, 10 when paginated).
   * Two-way: with a `{ items, totalCount }` datasource, the parent reloads the page when the user changes it.
   * @type {number | undefined}
   */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  maxRows;

  /** CSS max height of the table. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  maxHeight = '500px';

  /** Selection mode. @type {'none' | 'single' | 'multiple'} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  selectionMode = 'none';

  /** Hides the detail bar above the table: row count, selection count and warning. @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  noRowCountHeader = false;

  /** Enable/Disable the fixed row height feature. @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  fixedRowHeight = true;

  /** Text corresponding to 'no result'. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  noResultText = 'Aucun résultat';

  /** Text corresponding to 'result(s)'. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  resultText = 'résultat(s).';

  /** Text displayed after the number of selected items. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  selectedText = 'sélectionné(s)';

  /**
   * Text of the button selecting the rows of every page, shown once the rows of the page are all selected. The
   * `{count}` token is replaced by the number of selectable rows.
   * @type {string}
   */
  @bindable({ defaultBindingMode: bindingMode.toView })
  selectAllText = 'Sélectionner les {count} résultats';

  /** Text of the button clearing a selection that goes beyond the displayed page. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  clearSelectionText = 'Effacer la sélection';

  /** Text corresponding to 'only first %s items displayed' warning. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  warningTemplateText = `Seuls les {maxRows} premiers résultats sont affichés.`;

  /** Text corresponding to 'items per page'. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  pageSizeText = 'éléments par page';

  /** Whether we can disable some rows or not. @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  disableableRows = false;

  /** Property name to check to disable a row. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  disablePropName = 'disabled';

  /** Enable/Disable pagination, `maxRows` being the page size. @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  paginated = false;

  /**
   * Current page (1-based).
   * With a `{ items, totalCount }` datasource, the parent loads the page itself when it changes.
   * @type {number}
   */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  page = 1;

  /** Unique id to identify the custom element instance. @type {string} */ uniqueId = generateUniqueId();
  /** Html container of the custom element. @type {HTMLTemplateElement} */ _container;
  /** Displayed items. @type {(T & {selected?: boolean})[]} */ items = [];
  /** The total count of items including not displayed one. @type {number} */ totalCount = 0;
  /** Cells tooltips @type {Tooltip[]} */ _tooltips;
  /** Count of selectable displayed items @type {number} */ selectableItemCount = this.items.length;
  /** Count of selected and selectable displayed items @type {number} */ pageSelectedCount = 0;
  /** Count of selectable items of an array datasource, every page included @type {number} */ totalSelectableCount = 0;
  /** Sort applied to the whole array datasource when paginated @type {(a: T, b: T) => number} */ _sortComparer;

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
   * Defines the logic triggered when the custom element is added to the DOM.
   */
  attached() {
    this.setDisplayedItems();
  }

  /**
   * Defines the logic triggered when the custom element is removed from the DOM.
   */
  detached() {
    for (const tooltip of this._tooltips ?? []) tooltip?.dispose();
  }

  /**
   * Sets the displayed items.
   */
  setDisplayedItems() {
    this.totalCount = 0;
    this.items = [];
    this.removeSelectionTooltips();
    if (!this.datasource) return; // the datasource is empty
    if (Array.isArray(this.datasource)) {
      // the datasource is a simple array of items
      this.totalCount = this.datasource.length;
      const source = this._sortComparer ? [...this.datasource].sort(this._sortComparer) : this.datasource;
      const page = this.paginated ? this.page : 1;
      this.items = source.slice((page - 1) * this.pageSize, page * this.pageSize);
      this.totalSelectableCount = this.datasource.filter(item => !this.isRowDisabled(item)).length;
      this.calculateSelectableItemCount();
      this.synchronizeSelection();
      this.addSelectionTooltips();
      return;
    }
    const { items, totalCount } = this.datasource;
    if (items && totalCount) {
      // the datasource is a { items, totalCount } object
      this.totalCount = totalCount;
      this.items = items.slice(0, this.pageSize);
      // the other pages are not loaded: their rows can't be selected at once
      this.totalSelectableCount = 0;
      this.calculateSelectableItemCount();
      this.synchronizeSelection();
      this.addSelectionTooltips();
    }
  }

  /**
   * Is the row of the item disabled?
   * @param {T} item item of the row
   * @returns {boolean} true when the row can't be selected
   */
  isRowDisabled(item) {
    return this.disableableRows && item[this.disablePropName] === true;
  }

  /**
   * Calculate the number of selectable displayed items.
   */
  calculateSelectableItemCount() {
    this.selectableItemCount = this.items.filter(item => !this.isRowDisabled(item)).length;
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
    const comparer = sortPerKey(sortOrder, columnToSort.sortType, columnToSort.cellKey);
    if (this.paginated && Array.isArray(this.datasource)) {
      // sort the whole datasource, not only the displayed page
      this._sortComparer = comparer;
      this.goToPage(1);
      this.setDisplayedItems();
      return;
    }
    // A paginated { items, totalCount } datasource is only sorted per page, emit a sort event if server sort is needed
    this.removeSelectionTooltips();
    // order items
    this.items.sort(comparer);
    this.addSelectionTooltips();
  }

  /**
   * Displays the specified page.
   * @param {number} page page number (1-based)
   */
  goToPage(page) {
    this.page = Math.min(Math.max(1, page), this.pageCount);
  }

  /**
   * Changes the page size and restarts from the first page.
   * @param {number | string} size new page size
   */
  changePageSize(size) {
    this.maxRows = Number(size);
    this.goToPage(1);
    this.setDisplayedItems();
  }

  /**
   * Toggles the selection of the clicked row, unless the click targets a control of a cell (link, button, input...),
   * the row checkbox included.
   * @param {T & {selected: boolean}} item item of the clicked row
   * @param {Event} event click event
   * @returns {boolean} always true: aurelia prevents the default action (links, inputs in cells) otherwise
   */
  toggleItemSelection(item, event) {
    const target = /** @type {HTMLElement} */ (event.target);
    if (!target?.closest('a, button, input, select, textarea')) {
      this.toggleSelection(item);
    }
    return true;
  }

  /**
   * Toggles the selection of an item, unless the selection is off or the row is disabled.
   * @param {T & {selected: boolean}} item item to select or unselect
   */
  toggleSelection(item) {
    if (!this.valueKey || this.selectionMode === 'none' || this.isRowDisabled(item)) return;
    // by key: a page reloaded by the parent holds new objects
    const key = item[this.valueKey];
    const others = this.selectedItems.filter(selected => selected?.[this.valueKey] !== key);
    if (others.length < this.selectedItems.length) {
      this.selectedItems = others;
    } else {
      this.selectedItems = this.selectionMode === 'multiple' ? [...this.selectedItems, item] : [item];
    }
    this.notifySelection();
  }

  /**
   * Defines the logic triggered when the "select all" checkbox is changed: selects the selectable rows of the displayed
   * page, or unselects them when they are all selected, keeping the selection of the other pages.
   * @param {boolean} notify should we dispatch custom element events?
   * @returns {boolean} let event propagates
   */
  toggleAllSelection(notify = true) {
    if (this.selectionMode === 'none') return false;
    if (this.selectionMode === 'single') {
      this.selectedItems = [];
    } else {
      const page = this.items.filter(item => !this.isRowDisabled(item));
      const pageKeys = new Set(page.map(item => item[this.valueKey]));
      const others = this.selectedItems.filter(item => !pageKeys.has(item?.[this.valueKey]));
      this.selectedItems =
        this.pageSelectedCount === this.selectableItemCount ? others : [...others, ...page];
    }
    if (notify) {
      this.notifySelection();
    } else {
      this.synchronizeSelection();
    }
    return true;
  }

  /**
   * Selects the selectable rows of every page of an array datasource. The focus goes to the button clearing the
   * selection, which replaces the clicked one.
   */
  selectAllResults() {
    this.selectedItems = /** @type {T[]} */ (this.datasource).filter(item => !this.isRowDisabled(item));
    this.notifySelection();
    this._taskqueue.queueTask(() => this._container.querySelector('.clear-selection')?.focus());
  }

  /**
   * Clears the selection of every page. The focus goes to the "select all" checkbox, the clicked button being removed.
   */
  clearSelection() {
    this.selectedItems = [];
    this.notifySelection();
    this._taskqueue.queueTask(() => this._container.querySelector('th.selection input')?.focus());
  }

  /**
   * Synchronizes the displayed rows with the selection, and emits the `change` and `blur` events.
   */
  notifySelection() {
    this.synchronizeSelection();
    this.triggerChangeEvent(this.selectedItems);
    this.triggerBlurEvent(this.selectedItems);
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
    const selectedKeys = new Set(
      (this.selectedItems ?? []).filter(v => !isNil(v)).map(v => v[this.valueKey])
    );
    for (const item of this.items) {
      item.selected = selectedKeys.has(item[this.valueKey]);
    }
    this.pageSelectedCount = this.items.filter(item => item.selected && !this.isRowDisabled(item)).length;
  }

  /**
   * Removes bootstrap tooltips on cells.
   */
  removeSelectionTooltips() {
    this._taskqueue.queueTask(() => {
      if (this._tooltips) {
        for (const tooltip of this._tooltips) {
          try {
            tooltip.dispose();
          } catch {
            /* empty */
          }
        }
        this._tooltips = undefined;
      }
    });
  }

  /**
   * Adds bootstrap tooltips on cells.
   */
  addSelectionTooltips() {
    this._taskqueue.queueTask(() => {
      // elements with data-bs-toggle tooltip attributes
      const withBsTooltipsElements = this._container.querySelectorAll('[data-bs-toggle="tooltip"]');
      const withBsTooltips = [...withBsTooltipsElements].map(element => new Tooltip(element));
      // td with ellipsis
      const tdElements = this._container.querySelectorAll('td.fixed-height');
      const tdEllipsisTooltips = [...tdElements]
        .filter(td => td.scrollWidth > td.clientWidth)
        .map(
          td =>
            new Tooltip(td, {
              title: td.textContent,
              placement: 'right',
              fallbackPlacements: ['left', 'top']
            })
        );
      this._tooltips = [...withBsTooltips, ...tdEllipsisTooltips];
    });
  }

  /**
   * Defines the logic triggered when `datasource` attribute is databound.
   */
  datasourceChanged() {
    // a new array datasource restarts from the first page (a { items, totalCount } one is already the requested page)
    if (Array.isArray(this.datasource)) this.goToPage(1);
    this.setDisplayedItems();
  }

  /**
   * Defines the logic triggered when `page` attribute is databound.
   */
  pageChanged() {
    this.setDisplayedItems();
  }

  /**
   * Defines the logic triggered when `values` attribute is databound.
   */
  selectedItemsChanged() {
    this._taskqueue.queueTask(() => {
      if (!this.valueKey) return;
      if (!this.selectedItems) {
        this.selectedItems = [];
        return;
      }
      if (this.selectedItems.length > 1 && this.selectionMode !== 'multiple') {
        throw new Error(
          `simple-table: cannot bind multiple values with selection mode ${this.selectionMode}`
        );
      }
      this.synchronizeSelection();
    });
  }

  /**
   * Are all items displayed?
   * @returns {boolean} true if all items from the datasource are displayed
   */
  @computedFrom('items', 'maxRows', 'paginated')
  get allItemsDisplayed() {
    return this.paginated || this.totalCount <= this.pageSize;
  }

  /**
   * Effective `maxRows`, a number even when set as a plain attribute.
   * @returns {number} page size
   */
  @computedFrom('maxRows', 'paginated')
  get pageSize() {
    return Number(this.maxRows ?? (this.paginated ? 10 : 50));
  }

  /**
   * Number of pages.
   * @returns {number} page count (at least 1)
   */
  @computedFrom('totalCount', 'maxRows', 'paginated')
  get pageCount() {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }

  /**
   * Page numbers to display: first, last and current ±1, `undefined` standing for an ellipsis.
   * @returns {(number | undefined)[]} page numbers
   */
  @computedFrom('page', 'pageCount')
  get pages() {
    const pages = [];
    for (let page = 1; page <= this.pageCount; page++) {
      if (page === 1 || page === this.pageCount || Math.abs(page - this.page) <= 1) pages.push(page);
      else if (pages.at(-1) !== undefined) pages.push(undefined);
    }
    return pages;
  }

  /**
   * Row count of the detail bar, with the range of the displayed rows when paginated (e.g. `11–20 sur 120 résultat(s).`).
   * @returns {string} row count text
   */
  @computedFrom('items', 'totalCount', 'page', 'maxRows', 'paginated', 'resultText')
  get countText() {
    if (!this.paginated) return `${this.totalCount} ${this.resultText}`;
    const first = (this.page - 1) * this.pageSize + 1;
    return `${first}–${first + this.items.length - 1} sur ${this.totalCount} ${this.resultText}`;
  }

  /**
   * Text of the button selecting the rows of every page.
   * @returns {string} button text
   */
  @computedFrom('totalSelectableCount', 'selectAllText')
  get selectAllButtonText() {
    return this.selectAllText.replace('{count}', this.totalSelectableCount.toString());
  }

  /**
   * Warning text regarding items not displayed.
   * @returns {string} warning message
   */
  @computedFrom('maxRows', 'paginated', 'warningTemplateText')
  get notDisplayedWarningText() {
    return this.warningTemplateText.replace('{maxRows}', this.pageSize.toString());
  }
}
