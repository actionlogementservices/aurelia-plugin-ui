# Module `value-converters/date-format`

![category:valueconverter](https://img.shields.io/badge/category-valueconverter-085a8a.svg?style=flat-square)



[Source file](../src/value-converters/date-format.js)

# Class `DateFormatValueConverter`

Implements a **&#x60;dateFormat&#x60;value converter** to transform a date to DD/MM/YYYY format.

## Methods

### `fromView(value, formatToUse) ► string`

![modifier: public](images/badges/modifier-public.png)

Converts the value of the html view to the javascript model.

Parameters | Type | Description
--- | --- | ---
__value__ | `string` | *value from html view in the specified format*
__formatToUse__ | `SupportedFormat` | *display format, by default french: &#x60;DD/MM/YYYY&#x60;*
__*return*__ | `string` | *the calendar date &#x60;YYYY-MM-DD&#x60;, or the value itself when it is not a valid date*

---

### `toView(value, displayFormat) ► string`

![modifier: public](images/badges/modifier-public.png)

Converts the value of the javascript model to the html view.

Parameters | Type | Description
--- | --- | ---
__value__ | `string` | *value from javascript model: calendar date &#x60;YYYY-MM-DD&#x60;, ISO date time or &#x60;Date&#x60;*
__displayFormat__ | `SupportedFormat` | *display format, by default french: &#x60;DD/MM/YYYY&#x60;*
__*return*__ | `string` | *the date in the specified display format*

---
