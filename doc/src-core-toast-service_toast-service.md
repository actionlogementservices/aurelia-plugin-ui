# Module `core/toast-service/toast-service`

![category:toast](https://img.shields.io/badge/category-toast-blue.svg?style=flat-square)



[Source file](..\src\core\toast-service\toast-service.js)

# Class `ToastService`

Implements the toast service.

## Constructors


### `ToastService(compositionEngine, container, renderer)`

Creates an instance of the ToastService class.

Parameters | Type | Description
--- | --- | ---
__compositionEngine__ | `CompositionEngine` | *aurelia composition engine*
__container__ | `Container` | *aurelia container*
__renderer__ | [ToastRenderer](src-core-toast-service_toast-renderer.md) | *toast renderer*

---

## Methods

### `info(message, delay)`

![modifier: public](images/badges/modifier-public.png)

Displays a toast info message.

Parameters | Type | Description
--- | --- | ---
__message__ | `string` | *toast message*
__delay__ | `number` | *delay before hiding toast, default value is &#x60;defaultHideDelay&#x60;*

---

### `error(message, delay)`

![modifier: public](images/badges/modifier-public.png)

Displays a toast error message.

Parameters | Type | Description
--- | --- | ---
__message__ | `string` | *toast message*
__delay__ | `number` | *delay before hiding toast, default value is &#x60;defaultHideDelay&#x60;*

---

### `warning(message, delay)`

![modifier: public](images/badges/modifier-public.png)

Displays a toast warning message.

Parameters | Type | Description
--- | --- | ---
__message__ | `string` | *toast message*
__delay__ | `number` | *delay before hiding toast, default value is &#x60;defaultHideDelay&#x60;*

---

### `success(message, delay)`

![modifier: public](images/badges/modifier-public.png)

Displays a toast success message.

Parameters | Type | Description
--- | --- | ---
__message__ | `string` | *toast message*
__delay__ | `number` | *delay before hiding toast, default value is &#x60;defaultHideDelay&#x60;*

---

### `_show(message, color, delay)`

![modifier: private](images/badges/modifier-private.png)

Displays the toast.

Parameters | Type | Description
--- | --- | ---
__message__ | `string` | *toast message*
__color__ | `ThemeColor` | *color of toast*
__delay__ | `number` | *delay before hiding toast*

---
