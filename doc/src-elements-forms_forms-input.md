# Module `elements/forms/forms-input`

![category:other](https://img.shields.io/badge/category-other-9f9f9f.svg?style=flat-square)



[Source file](../src/elements/forms/forms-input.js)

# Class `FormInput`

Generic base for form inputs.

## Methods

### `handleFocus(event) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Handle focus event.

Parameters | Type | Description
--- | --- | ---
__event__ | `FocusEvent` | *The focus event*
__*return*__ | `boolean` | *true to continue processing*

---

### `handleChange(event) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Handle change event and run validation.

Parameters | Type | Description
--- | --- | ---
__event__ | `Event` | *The change event*
__*return*__ | `boolean` | *true to continue processing*

---

### `handleBlur(event) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Handle blur event and run validation.

Parameters | Type | Description
--- | --- | ---
__event__ | `FocusEvent` | *The blur event*
__*return*__ | `boolean` | *true to continue processing*

---

### `validate(value, defaultRequiredMessage) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Validate common field rules.

Parameters | Type | Description
--- | --- | ---
__value__ | `T` | *Value to validate*
__defaultRequiredMessage__ | `string` | *Default message to use when required validation fails*
__*return*__ | `boolean` | *true if valid, false otherwise*

---

### `isValueEmpty(value) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Generic emptiness check that works for strings and nullable values.

Parameters | Type | Description
--- | --- | ---
__value__ | `T` | *Value to inspect*
__*return*__ | `boolean` | *true when value should be considered empty*

---

### `validateValue(value) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Type-specific validation hook.
Subclasses should override this.

Parameters | Type | Description
--- | --- | ---
__value__ | `T` | *Value to validate*
__*return*__ | `boolean` | *true if valid, false otherwise*

---

## Members

Name | Type | Description
--- | --- | ---
__type__ | `string` | *Type @type {string}*
__required__ | `boolean` | *required @type {boolean}*
__placeholder__ | `string` | *Placeholder text @type {string}*
__readonly__ | `boolean` | *Readonly @type {boolean}*
__disabled__ | `boolean` | *Disabled @type {boolean}*
__fieldOnly__ | `boolean` | *Field only @type {boolean}*
__isError__ | `boolean` | *Error @type {boolean}*
__errorMessage__ | `string` | *Error message @type {string}*
__pristine__ | `boolean` | *Pristine @type {boolean}*
__onFocus__ | `(event: FocusEvent) => void` | *onFocus @type {(event: FocusEvent) &#x3D;&gt; void}*
__onChange__ | `(event: Event) => void` | *onChange @type {(event: Event) &#x3D;&gt; void}*
__onBlur__ | `(event: FocusEvent) => void` | *onBlur @type {(event: FocusEvent) &#x3D;&gt; void}*
