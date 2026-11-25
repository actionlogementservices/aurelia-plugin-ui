# Module `elements/forms/als-field/als-field`

![category:forms](https://img.shields.io/badge/category-forms-blue.svg?style=flat-square)



[Source file](../src/elements/forms/als-field/als-field.js)

## Functions

### `toggleToken(element, attribute, token, force)`

![modifier: private](images/badges/modifier-private.png)

Adds or removes a token from a space-separated attribute, keeping the other tokens intact.

Parameters | Type | Description
--- | --- | ---
__element__ | `Element` | *the element to update*
__attribute__ | `string` | *the attribute name*
__token__ | `string` | *the token to add or remove*
__force__ | `boolean` | *true to add the token, false to remove it*

---

# Class `AlsField`

Implements the **&#x60;als-field&#x60; custom element** that lays out a form control with the standard label, required
marker and error message. The control is projected as is, so every native attribute and Aurelia binding
(value converters, &#x60;&amp; validate&#x60;, events...) keeps working.

When a &#x60;ValidationController&#x60; is available in the current scope, the field registers itself as a validation
renderer: the errors of the bindings targeting an element inside the field are displayed below the control,
which receives the bootstrap &#x60;is-invalid&#x60; class and the matching aria attributes.

With &#x60;group&#x3D;&quot;true&quot;&#x60;, the field lays out a group of controls answering a single question (radio buttons,
checkboxes, composite inputs): the label names the whole group (&#x60;role&#x3D;&quot;group&quot;&#x60; + &#x60;aria-labelledby&#x60;) instead of
pointing to the first control, and the hint and the error message describe the group.

## Constructors


### `AlsField(element, controller)`

Creates an instance of AlsField.

Parameters | Type | Description
--- | --- | ---
__element__ | `Element` | *the custom element*
__controller__ | `ValidationController` | *the validation controller of the current scope, if any*

---

## Methods

### `render(instruction)`

![modifier: public](images/badges/modifier-public.png)

Renders the validation results of the elements inside the field (&#x60;ValidationRenderer&#x60; implementation).

Parameters | Type | Description
--- | --- | ---
__instruction__ | `RenderInstruction` | *the render instruction sent by the validation controller*

---

### `inside(elements) ► Array.<Element>`

![modifier: public](images/badges/modifier-public.png)

Keeps the elements located inside the field.

Parameters | Type | Description
--- | --- | ---
__elements__ | `Array.<Element>` | *the elements to filter*
__*return*__ | `Array.<Element>` | *the elements inside the field*

---

## Members

Name | Type | Description
--- | --- | ---
__label__ | `string` | *Label displayed above the control. @type {string}*
__required__ | `boolean` | *Displays the required marker next to the label. @type {boolean}*
__hint__ | `string` | *Help text displayed below the control, e.g. the accepted range of values. @type {string}*
__group__ | `boolean` | *Lays out a group of controls (radio buttons, checkboxes, composite inputs) instead of a single control.*
__control__ | `HTMLInputElement \| HTMLSelectElement \| HTMLTextAreaElement \| null` | *Projected control. @type {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null}*
__controlId__ | `string` | *Id of the projected control: the control&#x27;s own id, or a generated one. @type {string}*
__errors__ | `Array<{result: ValidateResult, element: Element}>` | *Validation errors of the elements inside the field. @type {Array&lt;{result: ValidateResult, element: Element}&gt;}*
__errorMessage__ | `string` | *Message of the first error, displayed below the control.*
__errorId__ | `string` | *Id of the error message element, referenced by &#x60;aria-describedby&#x60; on invalid controls.*
__hintId__ | `string` | *Id of the hint element, referenced by &#x60;aria-describedby&#x60; on the control.*
__labelId__ | `string` | *Id of the group label, referenced by &#x60;aria-labelledby&#x60; on the group.*
__groupDescribedBy__ | `string` | *Ids of the hint and error message describing the group, or undefined when there are none.*
