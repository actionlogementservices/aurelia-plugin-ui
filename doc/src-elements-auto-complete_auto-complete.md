# Module `elements/auto-complete/auto-complete`

![category:autocomplete](https://img.shields.io/badge/category-autocomplete-3b631b.svg?style=flat-square)



[Source file](..\src\elements\auto-complete\auto-complete.js)

# Class `AutoComplete`

Implements the **&#x60;auto-complete&#x60; custom element** that provides auto completion upon a controller to be specified and single selection.

## Constructors


### `AutoComplete(element, bindingEngine, taskqueue)`

Creates an instance of the &#x60;auto-complete&#x60; custom element.

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
__item__ | `U` | *item clicked or selected*
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

### `loadItems(inputValue)`

![modifier: public](images/badges/modifier-public.png)

Loads the items from the controller&#x27;s result.

Parameters | Type | Description
--- | --- | ---
__inputValue__ | `string` | *input value*

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

### `selectedItemChanged(value)`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when &#x60;selected-item&#x60; attribute is databound.

Parameters | Type | Description
--- | --- | ---
__value__ | `T` | *databound value*

---

### `labelKeyChanged(labelKey)`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when &#x60;label-key&#x60; attribute is databound.

Parameters | Type | Description
--- | --- | ---
__labelKey__ | `string` | *databound value*

---

## Members

Name | Type | Description
--- | --- | ---
__controller__ | `AutoCompleteController<T,U>` | *The controller used to retrieve data. @type {AutoCompleteController&lt;T,U&gt;}*
__selectedValue__ | `string` | *Selected value @type {string}*
__selectedItem__ | `U \| T` | *Selected item @type {U | T}*
__placeholder__ | `string` | *The place holder text. @type {string}*
__valueKey__ | `string` | *Property key used to identify item. @type {string}*
__labelKey__ | `string` | *Property key used to display item. @type {string}*
__delay__ | `number` | *Throttling delay in ms before requesting data (default 700). @type {number}*
__disabled__ | `boolean` | *Enable/Disable the custom element to prevent user modification. @type {boolean}*
__autosize__ | `boolean` | *Autosize width of the dropdown to the parent&#x27;s width. @type {boolean}*
__noResultText__ | `string` | *Text corresponding to &#x27;no result&#x27;. @type {string}*
__uniqueId__ | `string` | *Unique id to identify the custom element instance. @type {string}*
__items__ | `(U \| T)[]` | *List of retrieved items. @type {(U | T)[]}*
__ignoringReset__ | `Boolean` | *Prevents the input field to be reset when click outside dropdown? @type {Boolean}*
__updatingInput__ | `Boolean` | *Is input field updated internally? @type {Boolean}*
__itemsCount__ | `number` | *Count of items.*
___container__ | `HTMLTemplateElement` | *Html container of the custom element. @type {HTMLTemplateElement}*
___input__ | `HTMLInputElement` | *Html input element. @type {HTMLInputElement}*
___dropdownList__ | `HTMLDivElement` | *Html dropdown host element. @type {HTMLDivElement}*
___dropdown__ | `Dropdown` | *Bootstrap dropdown. @type {Dropdown}*
