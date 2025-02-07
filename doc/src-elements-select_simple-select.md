# Module `elements/select/simple-select`

![category:select](https://img.shields.io/badge/category-select-3b631b.svg?style=flat-square)



[Source file](..\src\elements\select\simple-select.js)

# Class `SimpleSelect`

Implements the **&#x60;simple-select&#x60; custom element** that provides a dropdown list based on a datasource and single selection.

## Constructors


### `SimpleSelect(element, bindingEngine, taskqueue)`

Creates an instance of the &#x60;simple-select&#x60; custom element.

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

### `selectedItemChanged()`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when &#x60;selected-item&#x60; attribute is databound.

---

### `selectedValueChanged()`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when &#x60;select-value&#x60; attribute is databound.

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
__selectedValue__ | `string` | *Selected value @type {string}*
__selectedItem__ | `T` | *Selected item @type {T}*
__datasource__ | `T[]` | *Data source @type {T[]}*
__placeholder__ | `string` | *The place holder text. @type {string}*
__valueKey__ | `string` | *Property key used to identify item. @type {string}*
__labelKey__ | `string` | *Property key used to display item. @type {string}*
__disabled__ | `boolean` | *Enable/Disable the custom element to prevent user modification. @type {boolean}*
__autosize__ | `boolean` | *Autosize width of the dropdown to the parent&#x27;s width. @type {boolean}*
__clearSelectionText__ | `string` | *Text corresponding to &#x27;clear the selection&#x27;. @type {string}*
__uniqueId__ | `string` | *Unique id to identify the custom element instance. @type {string}*
___container__ | `HTMLTemplateElement` | *Html container of the custom element. @type {HTMLTemplateElement}*
___input__ | `HTMLInputElement` | *Html input element. @type {HTMLInputElement}*
___dropdownList__ | `HTMLDivElement` | *Html dropdown host element. @type {HTMLDivElement}*
___dropdown__ | `Dropdown` | *Bootstrap dropdown. @type {Dropdown}*
