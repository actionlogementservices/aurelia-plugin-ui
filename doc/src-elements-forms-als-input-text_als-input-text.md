# Module `elements/forms/als-input-text/als-input-text`

![category:other](https://img.shields.io/badge/category-other-9f9f9f.svg?style=flat-square)



[Source file](../src/elements/forms/als-input-text/als-input-text.js)

# Class `AlsInputText`


_Extends:_ FormInput<string>


## Methods

### `validateValue(value) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Validate text-specific rules.

Parameters | Type | Description
--- | --- | ---
__value__ | `string` | *Value to validate*
__*return*__ | `boolean` | *true if valid, false otherwise*

---

### `handleKeyDown(event) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Custom handler to prevent typing anything other than a number or to edit the field.

Parameters | Type | Description
--- | --- | ---
__event__ | `KeyboardEvent` | *The keyboard event*
__*return*__ | `boolean` | *true to continue processing, false to cancel*

---

## Members

Name | Type | Description
--- | --- | ---
__type__ | `'text' \| 'email'` | *Type @type {&#x27;text&#x27; | &#x27;email&#x27;}*
__ariaDescribedby__ | `string` | *Id of the element describing the error, exposed via &#x60;aria-describedby&#x60; once the field is invalid.*
