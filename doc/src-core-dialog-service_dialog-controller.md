# Module `core/dialog-service/dialog-controller`

![category:dialog](https://img.shields.io/badge/category-dialog-009663.svg?style=flat-square)



[Source file](..\src\core\dialog-service\dialog-controller.js)

# Class `DialogController`

Controls the modal dialog system.

## Constructors


### `DialogController(renderer, result)`

Creates an instance of the DialogController class.

Parameters | Type | Description
--- | --- | ---
__renderer__ | [DialogRenderer](src-core-dialog-service_dialog-renderer.md) | *modal dialog renderer*
__result__ | [DialogResult](src-core-dialog-service_dialog-result.md) | *modal dialog result*

---

## Methods

### `ok(output)`

![modifier: public](images/badges/modifier-public.png)

Confirms input and closes the modal dialog.

Parameters | Type | Description
--- | --- | ---
__output__ | `any` | *output of the modal dialog*

---

### `cancel(output)`

![modifier: public](images/badges/modifier-public.png)

Cancels input and closes the modal dialog.

Parameters | Type | Description
--- | --- | ---
__output__ | `any` | *output of the modal dialog*

---
