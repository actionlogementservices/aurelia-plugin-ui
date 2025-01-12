# Module `core/functions`

![category:internal](https://img.shields.io/badge/category-internal-blue.svg?style=flat-square)

Defines common functions.

[Source file](..\src\core\functions.js)

## Constants

### `wait`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Waits for the specify delay.

Parameters | Type | Description
--- | --- | ---
__delay__ | `number` | *delay in milliseconds*
__*return*__ | `Promise.<void>` | *promise resolved after the delay*

#### Value

```javascript
delay => new Promise(resolve => setTimeout(resolve, delay))
```

---

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

### `isString`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Checks if the provided value is a string?

Parameters | Type | Description
--- | --- | ---
__value__ | `any` | *value to check*
__*return*__ | `boolean` | *true if the specified value is a string, false otherwise*

#### Value

```javascript
value => typeof value === 'string' || value instanceof String
```

---

### `isDate`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Checks if the provided value is a date?

Parameters | Type | Description
--- | --- | ---
__value__ | `any` | *value to check*
__*return*__ | `boolean` | *true if the specified value is a date, false otherwise*

#### Value

```javascript
value => value instanceof Date
```

---

### `isValidDateTimeISOString`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Checks if the provided value is a date time ISO string?

Parameters | Type | Description
--- | --- | ---
__value__ | `string` | *value to check*
__*return*__ | `boolean` | *true if the specified value is a date ISO string, false otherwise*

#### Value

```javascript
value => {
  if (!isString(value)) return false;
  const dateParsed = new Date(Date.parse(value));
  return (
    // @ts-ignore
    !isNaN(dateParsed) &&
    dateParsed.toISOString().slice(0, maxCommonLength) === value.slice(0, maxCommonLength)
  );
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
  const match = value.slice(0, 10).match(options.regexp);
  if (!match) return { valid: false };
  const day = parseInt(match[options.matches.day], 10);
  const month = parseInt(match[options.matches.month], 10) - 1; // Months are zero-based in JavaScript Date
  const year = parseInt(match[options.matches.year], 10);
  const date = new Date(year, month, day);
  return { valid: date.getFullYear() === year && date.getMonth() === month && date.getDate() === day, date };
}
```

---
