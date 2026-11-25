# Module `elements/als-gtag/als-gtag`

![category:element](https://img.shields.io/badge/category-element-3b631b.svg?style=flat-square)



[Source file](../src/elements/als-gtag/als-gtag.js)

# Class `AlsGtag`

Implements the **&#x60;als-gtag&#x60; custom element** that injects the Google Tag Manager script and noscript fallback.
Use a single instance near the root of the application.

## Methods

### `attached()`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when the custom element is added to the DOM.

---

### `addGoogleTag(window, document, s, l, tagId)`

![modifier: public](images/badges/modifier-public.png)

Injects the Google Tag Manager script and its noscript iframe fallback.

Parameters | Type | Description
--- | --- | ---
__window__ | `Window \| typeof globalThis` | *browser global object*
__document__ | `Document` | *browser document*
__s__ | `string` | *script element tag name*
__l__ | `string` | *data layer tag name*
__tagId__ | `string` | *Google Tag Manager container identifier*

---

## Members

Name | Type | Description
--- | --- | ---
__tagId__ | `string` | *Google Tag Manager Id. @type {string}*
