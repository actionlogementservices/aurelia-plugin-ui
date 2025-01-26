# Module `value-converters/number-format`

![category:valueconverter](https://img.shields.io/badge/category-valueconverter-085a8a.svg?style=flat-square)



[Source file](..\src\value-converters\number-format.js)

# Class `NumberFormatValueConverter`

Implements a **&#x60;numberFormat&#x60;value converter** to transform a number to a string representation.
This converter works together with the &#x60;input-mask&#x60; attribute and the &#x60;cleanInputMask&#x60; value converter.

## Examples

```javascript
<input
    type="text"
    input-mask="currency"
    value.one-time="montant | numberFormat"
    value.from-view="montant | cleanInputMask" />
```

## Methods

### `toView(value, options) ► undefined`

![modifier: public](images/badges/modifier-public.png)

Converts the value of the javascript model to the html view.

Parameters | Type | Description
--- | --- | ---
__value__ | `string` | *value from javascript model*
__options__ | `{ locale?: string, digits?: number, suffix?: string }` | *formating options*
__*return*__ | `undefined` | *the string representation of the number or undefined in case of failure*

---
