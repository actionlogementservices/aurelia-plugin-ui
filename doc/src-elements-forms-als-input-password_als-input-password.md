# Module `elements/forms/als-input-password/als-input-password`

![category:other](https://img.shields.io/badge/category-other-9f9f9f.svg?style=flat-square)



[Source file](../src/elements/forms/als-input-password/als-input-password.js)

# Class `AlsInputPassword`


_Extends:_ FormInput<string>


## Methods

### `validateValue(value) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Validate password-specific rules.

Parameters | Type | Description
--- | --- | ---
__value__ | `string` | *Value to validate*
__*return*__ | `boolean` | *true if valid, false otherwise*

---

### `togglePasswordVisibility() ► void`

![modifier: public](images/badges/modifier-public.png)

Toggle between masking and revealing the password value.

Parameters | Type | Description
--- | --- | ---
__*return*__ | `void` | **

---

### `handleKeyDown(event) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Handle keyboard events.

Parameters | Type | Description
--- | --- | ---
__event__ | `KeyboardEvent` | *The keyboard event*
__*return*__ | `boolean` | *true to continue processing, false to cancel*

---

## Members

Name | Type | Description
--- | --- | ---
__type__ | `'password' \| 'text'` | *Type @type {&#x27;password&#x27; | &#x27;text&#x27;}*
__autocomplete__ | `string` | *Autocomplete @type {string}*
__ariaDescribedby__ | `string` | *Id of the element describing the error, exposed via &#x60;aria-describedby&#x60; once the field is invalid.*
