# Module `value-converters/form-input-number-format`

![category:valueconverter](https://img.shields.io/badge/category-valueconverter-085a8a.svg?style=flat-square)



[Source file](../src/value-converters/form-input-number-format.js)

# Class `FormInputNumberFormatValueConverter`

Implements a **&#x60;formInputNumberFormat&#x60; value converter** that formats a number for a masked input and parses
the masked input back to a number. It works together with the &#x60;input-mask&#x60; attribute, using the same type.

## Examples

```javascript
<input
    class="form-control"
    input-mask="currency"
    value.bind="montant | formInputNumberFormat:'currency' & validate" />
```

## Methods

### `toView(value, type, locale) ► string`

![modifier: public](images/badges/modifier-public.png)

Converts the value of the javascript model to the html view.

Parameters | Type | Description
--- | --- | ---
__value__ | `number` | *value from javascript model*
__type__ | `'integer'` | *type of the input field*
__locale__ | `string` | *locale format*
__*return*__ | `string` | *the string representation*

---

### `fromView(value) ► number`

![modifier: public](images/badges/modifier-public.png)

Converts the value of the html view to the javascript model.

Parameters | Type | Description
--- | --- | ---
__value__ | `string` | *value from html view including the mask*
__*return*__ | `number` | *number or undefined in case of failure*

---
