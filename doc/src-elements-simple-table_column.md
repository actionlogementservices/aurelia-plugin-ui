# Module `elements/simple-table/column`

![category:table](https://img.shields.io/badge/category-table-3b631b.svg?style=flat-square)



[Source file](../src/elements/simple-table/column.js)

## Functions

### `retrieveCellTemplate(_compile, _resources, element, instruction) ► boolean`

![modifier: private](images/badges/modifier-private.png)

Creates a template instruction

Parameters | Type | Description
--- | --- | ---
___compile__ | `ViewCompiler` | *unused*
___resources__ | `ViewResources` | *unused*
__element__ | `HTMLElement` | *the column inner element that defines the cell template*
__instruction__ | `ViewBehaviorInstruction` | *view instruction to enhance in order to provide a cell template*
__*return*__ | `boolean` | *true indicating that the compiler should also process the content*

---

# Class `Column`

Implements the **&#x60;column&#x60; custom element** that provides the definition of the grid column.

## Constructors


### `Column(targetInstruction)`

Creates an instance of the &#x60;column&#x60; custom element.

Parameters | Type | Description
--- | --- | ---
__targetInstruction__ | `TargetInstruction` | *instruction for how a target element should be enhanced inside of a view*

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

## Members

Name | Type | Description
--- | --- | ---
__header__ | `string` | *Header ot the column. @type {string}*
__cellKey__ | `string` | *Property key used on the row object to display as cell content. @type {string}*
__sortable__ | `boolean` | *Is the column sortable. @type {boolean}*
__sortOrder__ | `undefined \| 'asc' \| 'desc'` | *Sorting order of the column. @type {undefined | &#x27;asc&#x27; | &#x27;desc&#x27;}*
__sortType__ | `'text' \| 'numeric'` | *Sorting type of the column. @type {&#x27;text&#x27; | &#x27;numeric&#x27;}*
__width__ | `string` | *CSS width of the column. @type {string}*
__cellTemplate__ | `InlineViewStrategy` | *Cell template. @type {InlineViewStrategy}*
__sortIcon__ | `undefined` | *Icon representing the sort order.*
