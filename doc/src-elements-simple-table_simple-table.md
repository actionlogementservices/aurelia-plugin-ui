# Module `elements/simple-table/simple-table`

![category:table](https://img.shields.io/badge/category-table-3b631b.svg?style=flat-square)



[Source file](../src/elements/simple-table/simple-table.js)

# Class `SimpleTable`

Implements the **&#x60;simple-table&#x60; custom element** that provides a simple grid with customizable columns.

## Constructors


### `SimpleTable(element, taskqueue)`

Creates an instance of the &#x60;simple-table&#x60; custom element.

Parameters | Type | Description
--- | --- | ---
__element__ | `HTMLTemplateElement` | *html template element*
__taskqueue__ | `TaskQueue` | *aurelia asynchronous task queue*

---

## Methods

### `attached()`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when the custom element is added to the DOM.

---

### `columnsChanged()`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when the columns are known: the &#x60;sort-order&#x60; of a column is the initial sort, unless
the parent binds one.

---

### `detached()`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when the custom element is removed from the DOM.

---

### `setDisplayedItems()`

![modifier: public](images/badges/modifier-public.png)

Sets the displayed items.

---

### `isRowDisabled(item) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Is the row of the item disabled?

Parameters | Type | Description
--- | --- | ---
__item__ | `T` | *item of the row*
__*return*__ | `boolean` | *true when the row can&#x27;t be selected*

---

### `calculateSelectableItemCount()`

![modifier: public](images/badges/modifier-public.png)

Calculate the number of selectable displayed items.

---

### `sortComparer() ► `

![modifier: public](images/badges/modifier-public.png)

Comparer of the current sort, using the &#x60;sort-type&#x60; of the sorted column.

Parameters | Type | Description
--- | --- | ---
__*return*__ | `undefined` | **

---

### `sortDisplayedItems(columnToSort)`

![modifier: public](images/badges/modifier-public.png)

Sorts the rows by the specified column, ascending first, then descending, from the first page.

Parameters | Type | Description
--- | --- | ---
__columnToSort__ | [Column](src-elements-simple-table_column.md) | *the column that will define the order of the items*

---

### `sortChanged()`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when &#x60;sort&#x60; attribute is databound: shows the sort on the column headers and sorts the
rows.

---

### `goToPage(page)`

![modifier: public](images/badges/modifier-public.png)

Displays the specified page.

Parameters | Type | Description
--- | --- | ---
__page__ | `number` | *page number (1-based)*

---

### `changePageSize(size)`

![modifier: public](images/badges/modifier-public.png)

Changes the page size and restarts from the first page.

Parameters | Type | Description
--- | --- | ---
__size__ | `number` | *new page size*

---

### `toggleItemSelection(item, event) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Toggles the selection of the clicked row, unless the click targets a control of a cell (link, button, input...),
the row checkbox included.

Parameters | Type | Description
--- | --- | ---
__item__ | `T` | *item of the clicked row*
__event__ | `Event` | *click event*
__*return*__ | `boolean` | *always true: aurelia prevents the default action (links, inputs in cells) otherwise*

---

### `toggleSelection(item)`

![modifier: public](images/badges/modifier-public.png)

Toggles the selection of an item, unless the selection is off or the row is disabled.

Parameters | Type | Description
--- | --- | ---
__item__ | `T` | *item to select or unselect*

---

### `toggleAllSelection(notify) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when the &quot;select all&quot; checkbox is changed: selects the selectable rows of the displayed
page, or unselects them when they are all selected, keeping the selection of the other pages.

Parameters | Type | Description
--- | --- | ---
__notify__ | `boolean` | *should we dispatch custom element events?*
__*return*__ | `boolean` | *let event propagates*

---

### `selectAllResults()`

![modifier: public](images/badges/modifier-public.png)

Selects the selectable rows of every page of an array datasource. The focus goes to the button clearing the
selection, which replaces the clicked one.

---

### `clearSelection()`

![modifier: public](images/badges/modifier-public.png)

Clears the selection of every page. The focus goes to the &quot;select all&quot; checkbox, the clicked button being removed.

---

### `notifySelection()`

![modifier: public](images/badges/modifier-public.png)

Synchronizes the displayed rows with the selection, and emits the &#x60;change&#x60; and &#x60;blur&#x60; events.

---

### `triggerChangeEvent(values)`

![modifier: public](images/badges/modifier-public.png)

Triggers the &#x27;change&#x27; event of the custom element.
Required to participate in aurelia validation system.

Parameters | Type | Description
--- | --- | ---
__values__ | `Array.<T>` | *selected values*

---

### `triggerBlurEvent(values)`

![modifier: public](images/badges/modifier-public.png)

Triggers the &#x27;blur&#x27; event of the custom element.
Required to participate in aurelia validation system.

Parameters | Type | Description
--- | --- | ---
__values__ | `Array.<T>` | *selected values*

---

### `synchronizeSelection()`

![modifier: public](images/badges/modifier-public.png)

Synchronizes the keys of the selected items, and the selection count of the page, with &#x60;selected-items&#x60;.

---

### `removeCellTooltips()`

![modifier: public](images/badges/modifier-public.png)

Removes the bootstrap tooltips of the cells.

---

### `addCellTooltips()`

![modifier: public](images/badges/modifier-public.png)

Adds the bootstrap tooltips of the cells: on the elements of the column templates with &#x60;data-bs-toggle&#x3D;&quot;tooltip&quot;&#x60;,
and on the cells whose content is truncated (ellipsis).

---

### `datasourceChanged()`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when &#x60;datasource&#x60; attribute is databound.

---

### `pageChanged()`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when &#x60;page&#x60; attribute is databound.

---

### `selectedItemsChanged()`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when &#x60;values&#x60; attribute is databound.

---

## Members

Name | Type | Description
--- | --- | ---
__columns__ | `Column[]` | *Columns description @type {Column[]}*
__selectedItems__ | `T[]` | *Selected items @type {T[]}*
__valueKey__ | `string` | *Property key used to identify item. @type {string}*
__datasource__ | `T[] \| { items: T[], totalCount: number }` | *Data source @type {T[] | { items: T[], totalCount: number }}*
__metadata__ | `any` | *Meta Data @type { any }*
__parentRef__ | `any` | *Parent memory reference @type { any }}*
__disabled__ | `boolean` | *Enable/Disable the custom element to prevent user modification. @type {boolean}*
__maxRows__ | `number` | *Maximal number of displayed rows, the page size when paginated (defaults: 50, 10 when paginated).
Two-way: with a &#x60;{ items, totalCount }&#x60; datasource, the parent reloads the page when the user changes it.*
__caption__ | `string` | *Title of the table, displayed above it and naming it for the screen readers (&#x60;aria-labelledby&#x60;).*
__hideCaption__ | `boolean` | *Hides the &#x60;caption&#x60;, which still names the table (&#x60;aria-label&#x60;), e.g. when a visible heading already titles it.*
__loading__ | `boolean` | *The parent loads the rows (a page, a sort...): the table is busy (&#x60;aria-busy&#x60;), dimmed and out of reach of the
mouse, and the detail bar tells the wait. The controls keep the keyboard focus.*
__loadingText__ | `string` | *Text of the detail bar while loading, announced by the screen readers. @type {string}*
__pageSizes__ | `number[]` | *Page sizes offered by the page size selector. @type {number[]}*
__maxHeight__ | `string` | *CSS max height of the table. @type {string}*
__selectionMode__ | `'none' \| 'single' \| 'multiple'` | *Selection mode. @type {&#x27;none&#x27; | &#x27;single&#x27; | &#x27;multiple&#x27;}*
__noRowCountHeader__ | `boolean` | *Hides the detail bar above the table: row count, selection count and warning. @type {boolean}*
__fixedRowHeight__ | `boolean` | *Enable/Disable the fixed row height feature. @type {boolean}*
__noResultText__ | `string` | *Text corresponding to &#x27;no result&#x27;. @type {string}*
__resultText__ | `string` | *Text corresponding to &#x27;result(s)&#x27;. @type {string}*
__selectedText__ | `string` | *Text displayed after the number of selected items. @type {string}*
__selectAllText__ | `string` | *Text of the button selecting the rows of every page, shown once the rows of the page are all selected. The
&#x60;{count}&#x60; token is replaced by the number of selectable rows.*
__selectAllSelectableText__ | `string` | *Text of the button selecting the rows of every page when some rows are disabled. The &#x60;{count}&#x60; token is replaced
by the number of selectable rows.*
__clearSelectionText__ | `string` | *Text of the button clearing a selection that goes beyond the displayed page. @type {string}*
__selectPageText__ | `string` | *Accessible name of the checkbox selecting the rows of the page. @type {string}*
__selectRowText__ | `string` | *Accessible name of the checkbox of a row. The &#x60;{row}&#x60; token is replaced by the number of the row in the page.*
__selectAllHintText__ | `string` | *Announced to the screen readers when the button selecting the rows of every page appears. The &#x60;{button}&#x60; token is
replaced by the text of the button.*
__warningTemplateText__ | `string` | *Text corresponding to &#x27;only first %s items displayed&#x27; warning. @type {string}*
__pageSizeText__ | `string` | *Text corresponding to &#x27;items per page&#x27;. @type {string}*
__disableableRows__ | `boolean` | *Whether we can disable some rows or not. @type {boolean}*
__disablePropName__ | `string` | *Property name to check to disable a row. @type {string}*
__paginated__ | `boolean` | *Enable/Disable pagination, &#x60;maxRows&#x60; being the page size. @type {boolean}*
__page__ | `number` | *Current page (1-based).
With a &#x60;{ items, totalCount }&#x60; datasource, the parent loads the page itself when it changes.*
__sort__ | `TableSort` | *Sort of the rows: the &#x60;cell-key&#x60; of the sorted column and the order (two-way), initialized from the &#x60;sort-order&#x60;
of a column. An array datasource is sorted as a whole; with a &#x60;{ items, totalCount }&#x60; datasource, the parent
reloads the page sorted when it changes (the displayed page being sorted in memory meanwhile).*
__uniqueId__ | `string` | *Unique id to identify the custom element instance. @type {string}*
__items__ | `T[]` | *Displayed items. @type {T[]}*
__totalCount__ | `number` | *The total count of items including not displayed one. @type {number}*
__selectableItemCount__ | `number` | *Count of selectable displayed items @type {number}*
__selectedKeys__ | `Set<any>` | *Keys (&#x60;value-key&#x60;) of the selected items, the data of the application being left untouched @type {Set&lt;any&gt;}*
__pageSelectedCount__ | `number` | *Count of selected and selectable displayed items @type {number}*
__totalSelectableCount__ | `number` | *Count of selectable items of an array datasource, every page included @type {number}*
__allItemsDisplayed__ | `undefined` | *Are all items displayed?*
__pageSize__ | `undefined` | *Effective &#x60;maxRows&#x60;, a number even when set as a plain attribute.*
__pageCount__ | `undefined` | *Number of pages.*
__pages__ | `undefined` | *Page numbers to display: first, last and current ±1, &#x60;undefined&#x60; standing for an ellipsis.*
__countText__ | `undefined` | *Row count of the detail bar, with the range of the displayed rows when paginated (e.g. &#x60;11–20 sur 120 résultat(s).&#x60;).*
__canSelectAllResults__ | `undefined` | *Can the rows of every page be selected at once? Once the selectable rows of the page are all selected, with an
array datasource whose other pages hold selectable rows not selected yet.*
__selectAllButtonText__ | `undefined` | *Text of the button selecting the rows of every page, telling that the disabled rows are left out.*
__notDisplayedWarningText__ | `undefined` | *Warning text regarding items not displayed.*
___container__ | `HTMLTemplateElement` | *Html container of the custom element. @type {HTMLTemplateElement}*
___tooltips__ | `Tooltip[]` | *Cells tooltips @type {Tooltip[]}*
