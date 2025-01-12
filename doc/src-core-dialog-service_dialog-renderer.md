# Module `core/dialog-service/dialog-renderer`

![category:dialog](https://img.shields.io/badge/category-dialog-blue.svg?style=flat-square)



[Source file](..\src\core\dialog-service\dialog-renderer.js)

# Class `DialogRenderer`

Renders the modal dialog in bootstrap 5.

## Methods

### `createHost() ► HTMLDivElement`

![modifier: public](images/badges/modifier-public.png)

Creates the div container of the modal dialog

Parameters | Type | Description
--- | --- | ---
__*return*__ | `HTMLDivElement` | *div element*

---

### `open(locked) ► Promise.<void>`

![modifier: public](images/badges/modifier-public.png)

Opens the modal dialog.

Parameters | Type | Description
--- | --- | ---
__locked__ | `boolean` | *prevents close when clicked outside*
__*return*__ | `Promise.<void>` | *await closing*

---

### `hide()`

![modifier: public](images/badges/modifier-public.png)

Hides the modal dialog.

---

### `destroy()`

![modifier: public](images/badges/modifier-public.png)

Destroy the modal dialog and associated resources.

---

## Members

Name | Type | Description
--- | --- | ---
___hostDiv__ | `HTMLDivElement` | **
