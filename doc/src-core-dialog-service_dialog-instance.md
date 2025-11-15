# Module `core/dialog-service/dialog-instance`

![category:dialog](https://img.shields.io/badge/category-dialog-009663.svg?style=flat-square)



[Source file](../src/core/dialog-service/dialog-instance.js)

# Class `DialogInstance`

Represents an instance of the modal or offcanvas dialog.

## Constructors


### `DialogInstance(hostDiv, options)`

Creates a new DialogInstance.

Parameters | Type | Description
--- | --- | ---
__hostDiv__ | `HTMLDivElement` | *edialog instanc*
__options__ | `DialogRendererOptions` | *prevents close when clicked outside*

---

## Methods

### `open() ► Promise.<void>`

![modifier: public](images/badges/modifier-public.png)

Opens the dialog instance.

Parameters | Type | Description
--- | --- | ---
__*return*__ | `Promise.<void>` | **

---

### `hide()`

![modifier: public](images/badges/modifier-public.png)

Closes the dialog instance.

---

### `destroy()`

![modifier: public](images/badges/modifier-public.png)

Destroys the dialog instance resource.

---

### `getHost() ► HTMLDivElement`

![modifier: public](images/badges/modifier-public.png)

Get the html div element that hosts the dialog instance.

Parameters | Type | Description
--- | --- | ---
__*return*__ | `HTMLDivElement` | *html div element*

---
