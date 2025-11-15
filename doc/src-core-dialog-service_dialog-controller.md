# Module `core/dialog-service/dialog-controller`

![category:dialog](https://img.shields.io/badge/category-dialog-009663.svg?style=flat-square)



[Source file](../src/core/dialog-service/dialog-controller.js)

# Class `DialogController`

Controls the dialog system.

## Constructors


### `DialogController(renderer, result)`

Creates an instance of the DialogController class.

Parameters | Type | Description
--- | --- | ---
__renderer__ | [DialogRenderer](src-core-dialog-service_dialog-renderer.md) | *dialog renderer*
__result__ | [DialogResult](src-core-dialog-service_dialog-result.md) | *dialog result*

---

## Methods

### `ok(output)`

![modifier: public](images/badges/modifier-public.png)

Confirms input and closes the dialog.

Parameters | Type | Description
--- | --- | ---
__output__ | `any` | *output of the dialog*

---

### `cancel(output)`

![modifier: public](images/badges/modifier-public.png)

Cancels input and closes the dialog.

Parameters | Type | Description
--- | --- | ---
__output__ | `any` | *output of the dialog*

---
