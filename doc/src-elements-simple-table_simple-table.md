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

Defines the logic triggered when the component is added to the DOM.

---

### `detached()`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when the component is removed from the DOM.

---

### `setDisplayedItems()`

![modifier: public](images/badges/modifier-public.png)

Sets the displayed items.

---

### `sortDisplayedItems(columnToSort)`

![modifier: public](images/badges/modifier-public.png)

Sorts the displayed items by the specified column.

Parameters | Type | Description
--- | --- | ---
__columnToSort__ | [Column](src-elements-simple-table_column.md) | *the column that will define the order of the items*

---

### `toggleItemSelection(item, notify) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when item is clicked.

Parameters | Type | Description
--- | --- | ---
__item__ | `T & {selected: boolean}` | *item clicked or selected*
__notify__ | `boolean` | *should we dispatch custom element events?*
__*return*__ | `boolean` | *let event propagates*

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
__maxRows__ | `number` | *Maximal number of displayed rows. @type {number}*
__maxHeight__ | `string` | *CSS max height of the table. @type {string}*
__selectionMode__ | `'none' \| 'single' \| 'multiple'` | *Selection mode. @type {&#x27;none&#x27; | &#x27;single&#x27; | &#x27;multiple&#x27;}*
__noRowCountHeader__ | `boolean` | *Enable/Disable the row count header. @type {boolean}*
__fixedRowHeight__ | `boolean` | *Enable/Disable the fixed row height feature. @type {boolean}*
__noResultText__ | `string` | *Text corresponding to &#x27;no result&#x27;. @type {string}*
__resultText__ | `string` | *Text corresponding to &#x27;result(s)&#x27;. @type {string}*
__warningTemplateText__ | `string` | *Text corresponding to &#x27;only first %s items displayed&#x27; warning. @type {string}*
__uniqueId__ | `string` | *Unique id to identify the custom element instance. @type {string}*
__items__ | `(T & {selected?: boolean})[]` | *Displayed items. @type {(T &amp; {selected?: boolean})[]}*
__totalCount__ | `number` | *The total count of items including not displayed one. @type {number}*
__allItemsDisplayed__ | `undefined` | *Are all items displayed?*
__notDisplayedWarningText__ | `undefined` | *Warning text regarding items not displayed.*
___container__ | `HTMLTemplateElement` | *Html container of the custom element. @type {HTMLTemplateElement}*
___tooltips__ | `Tooltip[]` | *Cells tooltips @type {Tooltip[]}*
