# Module `core/functions`

![category:internal](https://img.shields.io/badge/category-internal-6b6b6b.svg?style=flat-square)

Defines common functions.

[Source file](../src/core/functions.js)

## Functions

### `toCalendarDate(date) ► string`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Converts a date into a calendar date &#x60;YYYY-MM-DD&#x60;: the day of the date in the local time, without time nor time
zone. The dates of the datepickers and of the &#x60;dateFormat&#x60; value converter use this format.

Parameters | Type | Description
--- | --- | ---
__date__ | `Date` | *date*
__*return*__ | `string` | *calendar date, e.g. &#x60;2026-11-25&#x60;*

---

### `parseCalendarDate(value) ► Date`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Parses a calendar date &#x60;YYYY-MM-DD&#x60; into the local midnight of this day, whatever the time zone. A date time (ISO
string with a time, or &#x60;Date&#x60;) is also accepted, its day being the one of the local time.

Parameters | Type | Description
--- | --- | ---
__value__ | `string` | *calendar date, date time or date*
__*return*__ | `Date` | *local midnight of the day, undefined for an empty or invalid value*

---

### `preventEventPropagation(event)`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Prevents a DOM event to be propagated.

Parameters | Type | Description
--- | --- | ---
__event__ | `Event` | *event*

---

### `cleanInputMask(value) ► number`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Removes the input mask from a value of the html view.

Parameters | Type | Description
--- | --- | ---
__value__ | `string` | *value from html view including the mask*
__*return*__ | `number` | *number or undefined in case of failure*

---

### `sanitizeHtml(html) ► string`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Sanitizes an html fragment against XSS: only the formatting tags (b, strong, i, em, br, p, ul, ol, li) are kept,
without any attribute; the other elements are replaced by their content and the comments are removed. The fragment
is parsed in an inert template, where no script runs and no resource loads.

Parameters | Type | Description
--- | --- | ---
__html__ | `string` | *html fragment, e.g. a message mixing text and formatting*
__*return*__ | `string` | *sanitized html*

---

### `padDatePart(value) ► string`

![modifier: private](images/badges/modifier-private.png)

Pads a day or a month on two digits.

Parameters | Type | Description
--- | --- | ---
__value__ | `number` | *day or month*
__*return*__ | `string` | *padded value*

---

### `sanitizeNode(node)`

![modifier: private](images/badges/modifier-private.png)

Removes the attributes, the comments and the elements other than the formatting tags from a node, keeping the text.

Parameters | Type | Description
--- | --- | ---
__node__ | `Node` | *node to clean*

---

## Constants

### `isNil`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Checks if the provided value is a null or undefined?

Parameters | Type | Description
--- | --- | ---
__value__ | `any` | *value to check*
__*return*__ | `boolean` | *true if the specified value is null or empty?*

#### Value

```javascript
value => value === undefined || value === null
```

---

### `isNilOrEmpty`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Checks if the provided value is a null, undefined or empty?

Parameters | Type | Description
--- | --- | ---
__value__ | `any` | *value to check*
__*return*__ | `boolean` | *true if the specified value is null, undefined or empty?*

#### Value

```javascript
value =>
  value === undefined ||
  value === null ||
  value.length === 0 ||
  Object.getOwnPropertyNames(value).length === 0
```

---

### `generateUniqueId`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Generates an unique identifier string of the form &#x27;m5y6ckpexb01gvv02s&#x27;.

Parameters | Type | Description
--- | --- | ---
__*return*__ | `string` | *unique identifier*

#### Value

```javascript
() => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).slice(2);
  return timestamp + randomPart;
}
```

---

### `dateFormat`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Supported date formats.

#### Value

```javascript
{
  'YYYY-MM-DD': {
    regexp: /^(\d{4})-(\d{2})-(\d{2})$/,
    matches: { day: 3, month: 2, year: 1 }
  },
  'DD/MM/YYYY': {
    regexp: /^(\d{2})\/(\d{2})\/(\d{4})$/,
    matches: { day: 1, month: 2, year: 3 },
    output: { culture: 'fr-FR', options: { day: '2-digit', month: '2-digit', year: 'numeric' } }
  },
  'MM/DD/YYYY': {
    regexp: /^(\d{2})\/(\d{2})\/(\d{4})$/,
    matches: { day: 2, month: 1, year: 3 },
    output: { culture: 'en-US', options: { day: '2-digit', month: '2-digit', year: 'numeric' } }
  }
}
```

---

### `isValidDate`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Checks if the provided value is a date with the specified format?
Time part is truncated.

Parameters | Type | Description
--- | --- | ---
__value__ | `string` | *value to check*
__format__ | `SupportedFormat` | *format to check, by default ISO string: &#x60;YYYY-MM-DD&#x60;*
__*return*__ | `{valid: boolean, date?: Date}` | *indicates if the date is valid and then provides the Date instance.*

#### Value

```javascript
(value, format = 'YYYY-MM-DD') => {
  const options = dateFormat[format];
  if (isNilOrEmpty(value)) return { valid: false };
  const match = options.regexp.exec(value.slice(0, 10));
  if (!match) return { valid: false };
  const day = Number.parseInt(match[options.matches.day], 10);
  const month = Number.parseInt(match[options.matches.month], 10) - 1; // Months are zero-based in JavaScript Date
  const year = Number.parseInt(match[options.matches.year], 10);
  const date = new Date(year, month, day);
  return { valid: date.getFullYear() === year && date.getMonth() === month && date.getDate() === day, date };
}
```

---

### `allowedHtmlTags`

![modifier: private](images/badges/modifier-private.png)

Formatting tags kept by sanitizeHtml, without their attributes.

#### Value

```javascript
new Set(['B', 'STRONG', 'I', 'EM', 'BR', 'P', 'UL', 'OL', 'LI'])
```

---
