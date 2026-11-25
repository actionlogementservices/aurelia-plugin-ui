# Module `elements/forms/als-input-number/als-input-number`

![category:other](https://img.shields.io/badge/category-other-9f9f9f.svg?style=flat-square)



[Source file](../src/elements/forms/als-input-number/als-input-number.js)

# Class `AlsInputNumber`


_Extends:_ FormInput<number>


## Methods

### `handleKeyDown(event) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Custom handler to prevent typing anything other than a number or to edit the field.

Parameters | Type | Description
--- | --- | ---
__event__ | `KeyboardEvent` | *The keyboard event*
__*return*__ | `boolean` | *true to continue processing, false to cancel*

---

### `validateValue(value) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Validate number-specific rules.

Parameters | Type | Description
--- | --- | ---
__value__ | `number` | *Value to validate*
__*return*__ | `boolean` | *true if valid, false otherwise*

---

## Members

Name | Type | Description
--- | --- | ---
__type__ | `'integer' \| 'decimal' \| 'currency'` | *Type @type {&#x27;integer&#x27; | &#x27;decimal&#x27; | &#x27;currency&#x27;}*
__min__ | `number` | *Min value @type {number}*
__step__ | `number` | *Step @type {number}*
__ariaDescribedby__ | `string` | *Ids of the element(s) describing the input, exposed via &#x60;aria-describedby&#x60;: the always-present
range hint, plus the error message once the field is invalid.*
__rangeHint__ | `string` | *Visually hidden hint describing the accepted value range, since &#x60;min&#x60;/&#x60;max&#x60; have no native
effect or accessible exposure on a &#x60;type&#x3D;&quot;text&quot;&#x60; input.*
