# Module `elements/input-datepicker/input-datepicker`

![category:element](https://img.shields.io/badge/category-element-3b631b.svg?style=flat-square)



[Source file](../src/elements/input-datepicker/input-datepicker.js)

# Class `InputDatepicker`

Implements the **&#x60;input-datepicker&#x60; custom element** that provides a dropdown calendar to select a single date.

## Constructors


### `InputDatepicker(element, taskqueue)`

Creates an instance of the &#x60;input-datepicker&#x60; custom element.

Parameters | Type | Description
--- | --- | ---
__element__ | `HTMLTemplateElement` | *html template element*
__taskqueue__ | `TaskQueue` | *aurelia asynchronous task queue*

---

## Methods

### `attached()`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when the custom element is added to the DOM.

---

### `detached()`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when the custom element is removed from the DOM.

---

### `setCustomElementDate(date)`

![modifier: public](images/badges/modifier-public.png)

Set the &#x60;date&#x60; attribute of the custom element.

Parameters | Type | Description
--- | --- | ---
__date__ | `Date` | *date to apply*

---

### `getComponentDateLimit(calendarDate) ► Date`

![modifier: public](images/badges/modifier-public.png)

Converts a date bindable (calendar date) into a limit usable by the underlying vanillajs component.
The underlying component enforces the limit for both calendar selection and manual keyboard input.

Parameters | Type | Description
--- | --- | ---
__calendarDate__ | `string` | *calendar date &#x60;YYYY-MM-DD&#x60;, empty when no limit is set*
__*return*__ | `Date` | *the corresponding Date instance, or null when no limit applies*

---

### `getComponentDates(calendarDates) ► Array.<Date>`

![modifier: public](images/badges/modifier-public.png)

Converts the dates to disable (calendar dates) into dates usable by the underlying vanillajs component.

Parameters | Type | Description
--- | --- | ---
__calendarDates__ | `Array.<string>` | *calendar dates &#x60;YYYY-MM-DD&#x60;*
__*return*__ | `Array.<Date>` | *the valid dates*

---

### `setInternalComponentDate(calendarDate)`

![modifier: public](images/badges/modifier-public.png)

Set the date of the internal vanillajs component.

Parameters | Type | Description
--- | --- | ---
__calendarDate__ | `string` | *calendar date &#x60;YYYY-MM-DD&#x60;*

---

### `triggerChangeEvent(date)`

![modifier: public](images/badges/modifier-public.png)

Triggers the &#x27;change&#x27; event of the custom element.
Required to participate in aurelia validation system.

Parameters | Type | Description
--- | --- | ---
__date__ | `Date` | *selected date*

---

### `triggerBlurEvent(date)`

![modifier: public](images/badges/modifier-public.png)

Triggers the &#x27;blur&#x27; event of the custom element.
Required to participate in aurelia validation system.

Parameters | Type | Description
--- | --- | ---
__date__ | `Date` | *selected date*

---

### `internalComponentDateChanged(event)`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when a date is selected in the underlying vanillajs component.

Parameters | Type | Description
--- | --- | ---
__event__ | `CustomEvent` | *event triggered by the underlying vanillajs component*

---

### `dateChanged(date)`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when &#x60;date&#x60; attribute is databound.

Parameters | Type | Description
--- | --- | ---
__date__ | `string` | *calendar date &#x60;YYYY-MM-DD&#x60;*

---

### `disabledDatesChanged(disabledDates)`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when &#x60;disabledDates&#x60; attribute is databound.

Parameters | Type | Description
--- | --- | ---
__disabledDates__ | `Array.<string>` | *dates to disable, calendar dates &#x60;YYYY-MM-DD&#x60;*

---

### `minDateChanged(minDate)`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when &#x60;minDate&#x60; attribute is databound.

Parameters | Type | Description
--- | --- | ---
__minDate__ | `string` | *minimum selectable date, calendar date &#x60;YYYY-MM-DD&#x60;, empty for no limit*

---

### `maxDateChanged(maxDate)`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when &#x60;maxDate&#x60; attribute is databound.

Parameters | Type | Description
--- | --- | ---
__maxDate__ | `string` | *maximum selectable date, calendar date &#x60;YYYY-MM-DD&#x60;, empty for no limit*

---

## Members

Name | Type | Description
--- | --- | ---
__date__ | `string` | *Selected date, calendar date &#x60;YYYY-MM-DD&#x60; (an ISO date time is also accepted). @type {string}*
__placeholder__ | `string` | *The place holder text. @type {string}*
__disabled__ | `boolean` | *Enable/Disable the custom element to prevent user modification. @type {boolean}*
__readonly__ | `boolean` | *Marks the custom element as read-only. @type {boolean}*
__autohide__ | `boolean` | *Auto-hide dropdown after selection. @type {boolean}*
__disabledDays__ | `number[]` | *Days of week to disable. @type {number[]}*
__disabledDates__ | `string[]` | *Dates to disable, calendar dates &#x60;YYYY-MM-DD&#x60;. @type {string[]}*
__minDate__ | `string` | *Minimum selectable date, calendar date &#x60;YYYY-MM-DD&#x60;, empty for no limit. @type {string}*
__maxDate__ | `string` | *Maximum selectable date, calendar date &#x60;YYYY-MM-DD&#x60;, empty for no limit. @type {string}*
__uniqueId__ | `string` | *Unique id to identify the custom element instance. @type {string}*
__value__ | `string` | *Value in the input field. @type {string}*
___container__ | `HTMLTemplateElement` | *Html container of the custom element. @type {HTMLTemplateElement}*
___input__ | `HTMLInputElement` | *Html input element. @type {HTMLInputElement}*
___propagation__ | `'up' \| 'down' \| undefined` | *Lock to prevent loop. @type {&#x27;up&#x27; | &#x27;down&#x27; | undefined}*
