# Module `core/dialog-service/dialog-service`

![category:dialog](https://img.shields.io/badge/category-dialog-blue.svg?style=flat-square)



[Source file](..\src\core\dialog-service\dialog-service.js)

# Class `DialogService`

Implements the modal dialog service.

## Constructors


### `DialogService(compositionEngine, container, renderer, result)`

Creates an instance of the DialogService class.

Parameters | Type | Description
--- | --- | ---
__compositionEngine__ | `CompositionEngine` | *aurelia composition engine*
__container__ | `Container` | *aurelia container*
__renderer__ | [DialogRenderer](src-core-dialog-service_dialog-renderer.md) | *modal dialog renderer*
__result__ | [DialogResult](src-core-dialog-service_dialog-result.md) | *modal dialog result*

---

## Methods

### `open(parameter) ► Promise.<DialogResult>`

![modifier: public](images/badges/modifier-public.png)

Opens the modal dialog.

Parameters | Type | Description
--- | --- | ---
__parameter__ | `DialogServiceParameter` | *input parameters*
__*return*__ | `Promise.<DialogResult>` | *modal dialog result*

---
