# Module `core/toast-service/toast-renderer`

![category:toast](https://img.shields.io/badge/category-toast-009663.svg?style=flat-square)



[Source file](../src/core/toast-service/toast-renderer.js)

# Class `ToastRenderer`

Renders the toast in bootstrap 5.

## Methods

### `createOrGetRootHost() ► HTMLElement`

![modifier: public](images/badges/modifier-public.png)

Creates or gets the div container that hosts toasts.

Parameters | Type | Description
--- | --- | ---
__*return*__ | `HTMLElement` | *html element*

---

### `show(toastHost, delay) ► Promise.<void>`

![modifier: public](images/badges/modifier-public.png)

Displays the toast.

Parameters | Type | Description
--- | --- | ---
__toastHost__ | `HTMLDivElement` | *the div container that hosts toasts*
__delay__ | `number` | *delay before hiding toast*
__*return*__ | `Promise.<void>` | *await closing*

---

## Members

Name | Type | Description
--- | --- | ---
___rootContainer__ | `HTMLElement` | **
___bsToast__ | [Toast](src-core-toast-service_toast.md) | **
