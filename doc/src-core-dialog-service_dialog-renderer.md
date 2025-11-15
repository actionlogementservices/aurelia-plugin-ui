# Module `core/dialog-service/dialog-renderer`

![category:dialog](https://img.shields.io/badge/category-dialog-009663.svg?style=flat-square)



[Source file](../src/core/dialog-service/dialog-renderer.js)

# Class `DialogRenderer`

Renders the  modal or offcanvas dialog in bootstrap 5.

## Methods

### `createHost(options) ► HTMLDivElement`

![modifier: public](images/badges/modifier-public.png)

Creates the div container of the dialog instance.

Parameters | Type | Description
--- | --- | ---
__options__ | `DialogRendererOptions` | *dialog rendering options*
__*return*__ | `HTMLDivElement` | *html div element*

---

### `open(options) ► Promise.<void>`

![modifier: public](images/badges/modifier-public.png)

Opens the dialog instance.

Parameters | Type | Description
--- | --- | ---
__options__ | `DialogRendererOptions` | *dialog rendering options*
__*return*__ | `Promise.<void>` | *await closing*

---

### `hide()`

![modifier: public](images/badges/modifier-public.png)

Closes the dialog instance.

---

### `destroy()`

![modifier: public](images/badges/modifier-public.png)

Destroys the dialog instance and associated resources.

---

### `getHost() ► HTMLDivElement`

![modifier: public](images/badges/modifier-public.png)

Get the html div element that hosts the dialog instance.

Parameters | Type | Description
--- | --- | ---
__*return*__ | `HTMLDivElement` | *html div element*

---

## Members

Name | Type | Description
--- | --- | ---
___hostDiv__ | `HTMLDivElement` | *html div element used as host of the dialog @type {HTMLDivElement}*
___modal__ | `Offcanvas \| Modal` | *javascript bs object @type {Offcanvas | Modal}*
