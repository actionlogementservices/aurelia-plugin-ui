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

### `detached()`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when the custom element is removed from the DOM.

---

### `setDisplayedItems()`

![modifier: public](images/badges/modifier-public.png)

Sets the displayed items.

---

### `calculateSelectableItemCount()`

![modifier: public](images/badges/modifier-public.png)

Calculate the number of selectable items.

---

### `sortDisplayedItems(columnToSort)`

![modifier: public](images/badges/modifier-public.png)

Sorts the displayed items by the specified column.

Parameters | Type | Description
--- | --- | ---
__columnToSort__ | [Column](src-elements-simple-table_column.md) | *the column that will define the order of the items*

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

Defines the logic triggered when item is clicked.

Parameters | Type | Description
--- | --- | ---
__item__ | `T & {selected: boolean}` | *item clicked or selected*
__event__ | `Event` | *click event*
__*return*__ | `boolean` | *always true: aurelia prevents the default action (links, inputs in cells) otherwise*

---

### `toggleAllSelection(notify) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when the check all button is clicked.

Parameters | Type | Description
--- | --- | ---
__notify__ | `boolean` | *should we dispatch custom element events?*
__*return*__ | `boolean` | *let event propagates*

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

Synchronizes selection from the &#x60;values&#x60; attribute.

---

### `removeSelectionTooltips()`

![modifier: public](images/badges/modifier-public.png)

Removes bootstrap tooltips on cells.

---

### `addSelectionTooltips()`

![modifier: public](images/badges/modifier-public.png)

Adds bootstrap tooltips on cells.

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
__maxHeight__ | `string` | *CSS max height of the table. @type {string}*
__selectionMode__ | `'none' \| 'single' \| 'multiple'` | *Selection mode. @type {&#x27;none&#x27; | &#x27;single&#x27; | &#x27;multiple&#x27;}*
__noRowCountHeader__ | `boolean` | *Enable/Disable the row count header. @type {boolean}*
__fixedRowHeight__ | `boolean` | *Enable/Disable the fixed row height feature. @type {boolean}*
__noResultText__ | `string` | *Text corresponding to &#x27;no result&#x27;. @type {string}*
__resultText__ | `string` | *Text corresponding to &#x27;result(s)&#x27;. @type {string}*
__warningTemplateText__ | `string` | *Text corresponding to &#x27;only first %s items displayed&#x27; warning. @type {string}*
__pageSizeText__ | `string` | *Text corresponding to &#x27;items per page&#x27;. @type {string}*
__disableableRows__ | `boolean` | *Whether we can disable some rows or not. @type {boolean}*
__disablePropName__ | `string` | *Property name to check to disable a row. @type {string}*
__paginated__ | `boolean` | *Enable/Disable pagination, &#x60;maxRows&#x60; being the page size. @type {boolean}*
__page__ | `number` | *Current page (1-based).
With a &#x60;{ items, totalCount }&#x60; datasource, the parent loads the page itself when it changes.*
__uniqueId__ | `string` | *Unique id to identify the custom element instance. @type {string}*
__items__ | `(T & {selected?: boolean})[]` | *Displayed items. @type {(T &amp; {selected?: boolean})[]}*
__totalCount__ | `number` | *The total count of items including not displayed one. @type {number}*
__selectableItemCount__ | `number` | *Count of selectable items @type {number}*
__allItemsDisplayed__ | `undefined` | *Are all items displayed?*
__pageSize__ | `undefined` | *Effective &#x60;maxRows&#x60;, a number even when set as a plain attribute.*
__pageCount__ | `undefined` | *Number of pages.*
__pages__ | `undefined` | *Page numbers to display: first, last and current ±1, &#x60;undefined&#x60; standing for an ellipsis.*
__notDisplayedWarningText__ | `undefined` | *Warning text regarding items not displayed.*
___container__ | `HTMLTemplateElement` | *Html container of the custom element. @type {HTMLTemplateElement}*
___tooltips__ | `Tooltip[]` | *Cells tooltips @type {Tooltip[]}*
___sortComparer__ | `(a: T, b: T) => number` | *Sort applied to the whole array datasource when paginated @type {(a: T, b: T) &#x3D;&gt; number}*
