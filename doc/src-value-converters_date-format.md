# Module `value-converters/date-format`

![category:valueconverter](https://img.shields.io/badge/category-valueconverter-blue.svg?style=flat-square)



[Source file](..\src\value-converters\date-format.js)

# Class `DateFormatValueConverter`

Implements a **value converter** to transform a date to DD/MM/YYYY format.

## Methods

### `fromView(value, format) ► string`

![modifier: public](images/badges/modifier-public.png)

Converts the value of the html view to the javascript model.

Parameters | Type | Description
--- | --- | ---
__value__ | `string` | *value from html view in the specified format*
__format__ | `SupportedFormat` | *display format, by default french: &#x60;DD/MM/YYYY&#x60;*
__*return*__ | `string` | *the date in ISO 8601 format*

---

### `toView(value, displayFormat) ► string`

![modifier: public](images/badges/modifier-public.png)

Converts the value of the javascript model to the html view.

Parameters | Type | Description
--- | --- | ---
__value__ | `string` | *value from javascript model, expected to be in ISO 8601 format*
__displayFormat__ | `SupportedFormat` | *display format, by default french: &#x60;DD/MM/YYYY&#x60;*
__*return*__ | `string` | *the date in the specified display format*

---
