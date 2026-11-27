# Module `core/sorting`

![category:internal](https://img.shields.io/badge/category-internal-6b6b6b.svg?style=flat-square)

Defines the common sorting functions.

[Source file](../src/core/sorting.js)

## Constants

### `safeString`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Gets the value of an object scalar property as a string.

Parameters | Type | Description
--- | --- | ---
__object__ | `Record.<string, any>` | *object*
__key__ | `string` | *property of the object*
__*return*__ | `string` | *value of the property as string or the empty string*

#### Value

```javascript
(object, key) =>
  String(object && Object.hasOwn(object, key) ? (object[key] ?? '') : '')
```

---

### `ascendantPerKey`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Sorts objects ascendantly by the specified key.

Parameters | Type | Description
--- | --- | ---
__key__ | `string` | *property of the object*
__sortingOptions__ | `Intl.CollatorOptions` | *sorting options*
__*return*__ | `(a: Record<string, any>, b: Record<string, any>) => number` | *sorting function*

#### Value

```javascript
(key, sortingOptions) => {
  // one collator for the whole sort: localeCompare with options builds one per comparison
  const { compare } = new Intl.Collator(undefined, sortingOptions);
  return (a, b) => compare(safeString(a, key), safeString(b, key));
}
```

---

### `descendantPerKey`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Sorts objects descendantly by the specified key.

Parameters | Type | Description
--- | --- | ---
__key__ | `string` | *property of the object*
__sortingOptions__ | `Intl.CollatorOptions` | *sorting options*
__*return*__ | `(a: Record<string, any>, b: Record<string, any>) => number` | *sorting function*

#### Value

```javascript
(key, sortingOptions) => {
  const { compare } = new Intl.Collator(undefined, sortingOptions);
  return (a, b) => compare(safeString(b, key), safeString(a, key));
}
```

---

### `sortPerKey`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Sorts objects by the specified key and sorting options.

Parameters | Type | Description
--- | --- | ---
__sortOrder__ | `SortOrder` | *sorting order*
__sortType__ | `SortType` | *sorting type*
__key__ | `string` | *property of the object*
__*return*__ | `(a: Record<string, any>, b: Record<string, any>) => number` | *sorting function*

#### Value

```javascript
(sortOrder, sortType, key) => {
  /** @type {Intl.CollatorOptions} */ const sortOptions =
    sortType === 'numeric' ? { numeric: true } : { sensitivity: 'base', ignorePunctuation: true };
  return sortOrder === 'asc' ? ascendantPerKey(key, sortOptions) : descendantPerKey(key, sortOptions);
}
```

---
