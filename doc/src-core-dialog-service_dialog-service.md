# Module `core/dialog-service/dialog-service`

![category:dialog](https://img.shields.io/badge/category-dialog-009663.svg?style=flat-square)



[Source file](../src/core/dialog-service/dialog-service.js)

# Class `DialogService`

Implements the dialog service.

## Constructors


### `DialogService(compositionEngine, container, rendererFactory)`

Creates an instance of the DialogService class.

Parameters | Type | Description
--- | --- | ---
__compositionEngine__ | `CompositionEngine` | *aurelia composition engine*
__container__ | `Container` | *aurelia container*
__rendererFactory__ | `undefined` | **

---

## Methods

### `open(parameters) ► Promise.<DialogResult>`

![modifier: public](images/badges/modifier-public.png)

Opens the dialog. A dialog opened while another one is open is stacked above it.

Parameters | Type | Description
--- | --- | ---
__parameters__ | `DialogServiceParameters` | *input parameters*
__*return*__ | `Promise.<DialogResult>` | *result of this dialog*

---
