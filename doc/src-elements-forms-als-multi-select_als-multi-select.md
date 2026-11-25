# Module `elements/forms/als-multi-select/als-multi-select`

![category:forms](https://img.shields.io/badge/category-forms-blue.svg?style=flat-square)



[Source file](../src/elements/forms/als-multi-select/als-multi-select.js)

# Class `AlsMultiSelect`

Implements the **&#x60;als-multi-select&#x60; custom element**: a dropdown of checkboxes selecting several values.
Place it inside an &#x60;als-field&#x60; to get the label and the validation errors, e.g.
&#x60;&lt;als-field label&#x3D;&quot;Années&quot;&gt;&lt;als-multi-select items.bind&#x3D;&quot;items&quot; value.bind&#x3D;&quot;model.years &amp; validate&quot;&gt;&lt;/als-multi-select&gt;&lt;/als-field&gt;&#x60;.

Like a native control, the element fires a &#x60;blur&#x60; event when the focus leaves it, so the default
&#x60;&amp; validate&#x60; trigger works.

## Constructors


### `AlsMultiSelect(element)`

Creates an instance of AlsMultiSelect.

Parameters | Type | Description
--- | --- | ---
__element__ | `Element` | *the custom element*

---

## Methods

### `handleFocusout(event) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Fires &#x60;blur&#x60; on the custom element once the focus leaves it, as &#x60;&amp; validate&#x60; listens to the target element.

Parameters | Type | Description
--- | --- | ---
__event__ | `FocusEvent` | *the focusout event of an inner element*
__*return*__ | `boolean` | *true to continue processing*

---

### `toggleItem(item)`

![modifier: public](images/badges/modifier-public.png)

Selects or deselects an item.

Parameters | Type | Description
--- | --- | ---
__item__ | `Object` | *the item*

---

### `toggleAll()`

![modifier: public](images/badges/modifier-public.png)

Selects every item, or none when they are all selected.

---

## Members

Name | Type | Description
--- | --- | ---
__items__ | `Array<{label: string, value: any}>` | *Items @type {Array&lt;{label: string, value: any}&gt;}*
__value__ | `Array<any>` | *Selected values, always replaced by a new array so the binding (and &#x60;&amp; validate&#x60;) sees the change. @type {Array&lt;any&gt;}*
__placeholder__ | `string` | *Text displayed in the toggle button when nothing is selected. @type {string}*
__disabled__ | `boolean` | *Disabled @type {boolean}*
__uniqueId__ | `string` | *Prefix of the inner element ids. @type {string}*
__selected__ | `Array.<any>` | *Selected values, &#x60;value&#x60; may be null or undefined when bound to an empty model.*
__selectedLabelsText__ | `string` | *Comma-separated labels of the selected items, shown in the toggle button. Truncated visually via CSS.*
__allSelected__ | `boolean` | **
__isIndeterminate__ | `boolean` | **
