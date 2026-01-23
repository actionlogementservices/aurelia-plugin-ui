# Module `elements/select/badges-select`

![category:select](https://img.shields.io/badge/category-select-3b631b.svg?style=flat-square)



[Source file](../src/elements/select/badges-select.js)

# Class `BadgesSelect`

Implements the **&#x60;badges-select&#x60; custom element** that provides a dropdown list based on a datasource with on the fly filtering and a multiple selection with badge rendering.

## Constructors


### `BadgesSelect(element, bindingEngine, taskqueue)`

Creates an instance of the &#x60;badges-select&#x60; custom element.

Parameters | Type | Description
--- | --- | ---
__element__ | `HTMLTemplateElement` | *html template element*
__bindingEngine__ | `BindingEngine` | *aurelia binding engine*
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

Selects the specified item.

Parameters | Type | Description
--- | --- | ---
__item__ | `T` | *item clicked or selected*
__notify__ | `boolean` | *should we dispatch custom element events?*

---

### `removeItem(itemToRemove)`

![modifier: public](images/badges/modifier-public.png)

Removes the item with the specified value from selected items.

Parameters | Type | Description
--- | --- | ---
__itemToRemove__ | `T` | *item to remove*

---

### `synchronizeSelection(items)`

![modifier: public](images/badges/modifier-public.png)

Synchronizes custom element selection.

Parameters | Type | Description
--- | --- | ---
__items__ | `Array.<T>` | *items to select*

---

### `triggerChangeEvent()`

![modifier: public](images/badges/modifier-public.png)

Triggers the &#x27;change&#x27; event of the custom element.
Required to participate in aurelia validation system.

---

### `triggerBlurEvent()`

![modifier: public](images/badges/modifier-public.png)

Triggers the &#x27;blur&#x27; event of the custom element.
Required to participate in aurelia validation system.

---

### `manageKey(keyCode) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when user uses keyboard.

Parameters | Type | Description
--- | --- | ---
__keyCode__ | `string` | *key code*
__*return*__ | `boolean` | *true*

---

### `filterDropdownItems(text)`

![modifier: public](images/badges/modifier-public.png)

Filters the dropdown items list to those that contain the given input value and are not already selected.

Parameters | Type | Description
--- | --- | ---
__text__ | `string` | *input text*

---

### `resetDropdownItems()`

![modifier: public](images/badges/modifier-public.png)

Resets the dropdown items list to the original databound list.

---

### `clearHtmlInput()`

![modifier: public](images/badges/modifier-public.png)

Clears the html input element.

---

### `isInvalidDatasource() ► boolean`

![modifier: public](images/badges/modifier-public.png)

Is the datasource invalid?

Parameters | Type | Description
--- | --- | ---
__*return*__ | `boolean` | *true if invalid, false otherwise*

---

### `isInvalidLabelKey() ► boolean`

![modifier: public](images/badges/modifier-public.png)

Is the labelKey invalid?

Parameters | Type | Description
--- | --- | ---
__*return*__ | `boolean` | *true if invalid, false otherwise*

---

### `isInvalidValueKey() ► boolean`

![modifier: public](images/badges/modifier-public.png)

Is the valueKey invalid?

Parameters | Type | Description
--- | --- | ---
__*return*__ | `boolean` | *true if invalid, false otherwise*

---

### `isItemNotSelected(item) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Checks if the speified item is already selected?

Parameters | Type | Description
--- | --- | ---
__item__ | `T` | *item to check*
__*return*__ | `boolean` | *true if already selected, false otherwise*

---

### `onInputBlur()`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when user clicks outside of the html input element.

---

### `onInputChange(inputValue)`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when user types data in the html input element.

Parameters | Type | Description
--- | --- | ---
__inputValue__ | `string` | *user input*

---

### `selectedItemsChanged(newItems)`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when &#x60;selected-items&#x60; attribute is databound.

Parameters | Type | Description
--- | --- | ---
__newItems__ | `undefined` | *new &#x60;selected-items&#x60; value*

---

### `selectedValuesChanged(newValues)`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when &#x60;selected-values&#x60; attribute is databound.

Parameters | Type | Description
--- | --- | ---
__newValues__ | `undefined` | *new &#x60;selected-values&#x60; value*

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
__selectedValues__ | `K[]` | *Selected values @type {K[]}*
__selectedItems__ | `T[]` | *Selected items @type {T[]}*
__datasource__ | `T[]` | *Data source @type {T[]}*
__placeholder__ | `string` | *The place holder text. @type {string}*
__valueKey__ | `string` | *Property key used to identify item. @type {string}*
__labelKey__ | `string` | *Property key used to display item. @type {string}*
__disabled__ | `boolean` | *Enable/Disable the custom element to prevent user modification. @type {boolean}*
__autosize__ | `boolean` | *Autosize width of the dropdown to the parent&#x27;s width. @type {boolean}*
__noResultText__ | `string` | *Text corresponding to &#x27;no result&#x27;. @type {string}*
__filteredItems__ | `T[]` | *List of items filtered by the user input. @type {T[]}*
__uniqueId__ | `string` | *Unique id to identify the custom element instance. @type {string}*
__ignoringReset__ | `Boolean` | *Prevents the input field to be reset when click outside dropdown? @type {Boolean}*
__filteredItemsCount__ | `number` | *Count of items.*
___keyCode__ | `string` | *The last key code used. @type {string}*
___container__ | `HTMLTemplateElement` | *Html container of the custom element. @type {HTMLTemplateElement}*
___input__ | `HTMLInputElement` | *Html input element. @type {HTMLInputElement}*
___dropdownList__ | `HTMLDivElement` | *Html dropdown host element. @type {HTMLDivElement}*
___dropdown__ | `Dropdown` | *Bootstrap dropdown. @type {Dropdown}*
___guard__ | `boolean` | *Prevents reentrancy. @type {boolean}*
