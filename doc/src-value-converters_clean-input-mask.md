# Module `value-converters/clean-input-mask`

![category:valueconverter](https://img.shields.io/badge/category-valueconverter-085a8a.svg?style=flat-square)



[Source file](..\src\value-converters\clean-input-mask.js)

# Class `CleanInputMaskValueConverter`

Implements a **&#x60;cleanInputMask&#x60; value converter** to remove the input mask.
This converter works together with the &#x60;input-mask&#x60; attribute and the &#x60;numberFormat&#x60; value converter.

## Examples

```javascript
<input
    type="text"
    input-mask="currency"
    value.one-time="montant | numberFormat"
    value.from-view="montant | cleanInputMask" />
```

## Methods

### `fromView(value, minimumFractionDigits) ► number`

![modifier: public](images/badges/modifier-public.png)

Converts the value of the html view to the javascript model.

Parameters | Type | Description
--- | --- | ---
__value__ | `string` | *value from html view including the mask*
__minimumFractionDigits__ | `number` | *number of fraction digits*
__*return*__ | `number` | *number or undefined in case of failure*

---
