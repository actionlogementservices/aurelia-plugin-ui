# Module `elements/select/filterable-select`

![category:select](https://img.shields.io/badge/category-select-blue.svg?style=flat-square)



[Source file](..\src\elements\select\filterable-select.js)

# Class `FilterableSelect`

Implements the **&#x60;filterable-select&#x60; custom element** that provides a dropdown list based on a datasource with on the fly filtering and single selection.

## Constructors


### `FilterableSelect(element, bindingEngine, taskqueue)`

Creates an instance of the &#x60;filterable-select&#x60; custom element.

Parameters | Type | Description
--- | --- | ---
__element__ | `HTMLTemplateElement` | *html template element*
__bindingEngine__ | `BindingEngine` | *aurelia binding engine*
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

### `showDropdown()`

![modifier: public](images/badges/modifier-public.png)

Shows the dropdown containing items.

---

### `hideDropdown()`

![modifier: public](images/badges/modifier-public.png)

Hides the dropdown.

---

### `selectItem(item, notify)`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when item is clicked or selected with &#x27;Enter&#x27; key.

Parameters | Type | Description
--- | --- | ---
__item__ | `T` | *item clicked or selected*
__notify__ | `boolean` | *should we dispatch custom element events?*

---

### `manageKey(keyCode) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when user uses keyboard.

Parameters | Type | Description
--- | --- | ---
__keyCode__ | `string` | *key code*
__*return*__ | `boolean` | *true*

---

### `filterItems(inputValue)`

![modifier: public](images/badges/modifier-public.png)

Filters the items list to those that contain the given input value and are not already selected.

Parameters | Type | Description
--- | --- | ---
__inputValue__ | `string` | *input value*

---

### `resetItems()`

![modifier: public](images/badges/modifier-public.png)

Reset the items list to the original databound list

---

### `resetInputValue()`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when user clicks outside the component.

---

### `inputValueChanged(inputValue)`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when user types data in the input field.

Parameters | Type | Description
--- | --- | ---
__inputValue__ | `string` | *user input*

---

### `valueChanged()`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when &#x60;value&#x60; attribute is databound.

---

### `labelKeyChanged(labelKey)`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when &#x60;label-key&#x60; attribute is databound.

Parameters | Type | Description
--- | --- | ---
__labelKey__ | `string` | *databound value*

---

### `datasourceChanged()`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when &#x60;datasource&#x60; attribute is databound.

---

## Members

Name | Type | Description
--- | --- | ---
__value__ | `T` | *Selected item @type {T}*
__datasource__ | `T[]` | *Data source @type {T[]}*
__placeholder__ | `string` | *The place holder text. @type {string}*
__valueKey__ | `string` | *Property key used to identify item. @type {string}*
__labelKey__ | `string` | *Property key used to display item. @type {string}*
__disabled__ | `boolean` | *Enable/Disable the custom element to prevent user modification. @type {boolean}*
__noResultText__ | `string` | *Text corresponding to &#x27;no result&#x27;. @type {string}*
__clearSelectionText__ | `string` | *Text corresponding to &#x27;clear the selection&#x27;. @type {string}*
__filteredItems__ | `T[]` | *List of items filtered by the user input. @type {T[]}*
__uniqueId__ | `string` | *Unique id to identify the custom element instance. @type {string}*
__ignoringReset__ | `Boolean` | *Prevents the input field to be reset when click outside dropdown? @type {Boolean}*
__updatingInput__ | `Boolean` | *Is input field updated internally? @type {Boolean}*
__filteredItemsCount__ | `number` | *Count of items.*
___keyCode__ | `string` | *The last key code used. @type {string}*
___container__ | `HTMLTemplateElement` | *Html container of the custom element. @type {HTMLTemplateElement}*
___input__ | `HTMLInputElement` | *Html input element. @type {HTMLInputElement}*
___dropdownList__ | `HTMLDivElement` | *Html dropdown host element. @type {HTMLDivElement}*
___dropdown__ | `Dropdown` | *Bootstrap dropdown. @type {Dropdown}*
