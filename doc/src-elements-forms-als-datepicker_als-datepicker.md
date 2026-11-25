# Module `elements/forms/als-datepicker/als-datepicker`

![category:forms](https://img.shields.io/badge/category-forms-blue.svg?style=flat-square)



[Source file](../src/elements/forms/als-datepicker/als-datepicker.js)

# Class `AlsDatepicker`

Implements the **&#x60;als-datepicker&#x60; custom element**: an &#x60;input-datepicker&#x60; with the calendar icon.
Place it inside an &#x60;als-field&#x60; to get the label and the validation errors, e.g.
&#x60;&lt;als-field label&#x3D;&quot;Date&quot;&gt;&lt;als-datepicker value.bind&#x3D;&quot;model.date &amp; validate&quot;&gt;&lt;/als-datepicker&gt;&lt;/als-field&gt;&#x60;.

Like a native control, the element fires a &#x60;blur&#x60; event when the focus leaves it, so the default
&#x60;&amp; validate&#x60; trigger works.

## Constructors


### `AlsDatepicker(element)`

Creates an instance of AlsDatepicker.

Parameters | Type | Description
--- | --- | ---
__element__ | `Element` | *the custom element*

---

## Methods

### `handleFocusout(event) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Fires &#x60;blur&#x60; on the custom element once the focus leaves it, as &#x60;&amp; validate&#x60; listens to the target element.

Parameters | Type | Description
--- | --- | ---
__event__ | `FocusEvent` | *the focusout event of an inner element*
__*return*__ | `boolean` | *true to continue processing*

---

## Members

Name | Type | Description
--- | --- | ---
__value__ | `string` | *Selected date in ISO string format. @type {string}*
__placeholder__ | `string` | *Placeholder text @type {string}*
__disabled__ | `boolean` | *Disabled @type {boolean}*
__readonly__ | `boolean` | *Readonly @type {boolean}*
__autohide__ | `boolean` | *Auto-hide dropdown after selection @type {boolean}*
__disabledDays__ | `number[]` | *Days of week to disable @type {number[]}*
__disabledDates__ | `string[]` | *Dates to disable @type {string[]}*
__minDate__ | `string` | *Minimum selectable date in ISO string format, empty for no limit @type {string}*
__maxDate__ | `string` | *Maximum selectable date in ISO string format, empty for no limit @type {string}*
