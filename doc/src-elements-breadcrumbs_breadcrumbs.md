# Module `elements/breadcrumbs/breadcrumbs`

![category:element](https://img.shields.io/badge/category-element-3b631b.svg?style=flat-square)



[Source file](../src/elements/breadcrumbs/breadcrumbs.js)

# Class `Breadcrumbs`

Implements the **&#x60;breadcrumbs&#x60; custom element** that displays the current route.

## Constructors


### `Breadcrumbs(router)`

Creates an instance of the &#x60;breadcrumbs&#x60; custom element.

Parameters | Type | Description
--- | --- | ---
__router__ | `Router` | *aurelia router*

---

## Methods

### `steps(currentInstruction) ► Array.<NavigationInstruction>`

![modifier: public](images/badges/modifier-public.png)

Steps displayed after the home link: the instructions of the current route that have a title, except the default
route (&#x60;&#x27;&#x27;&#x60;), already represented by the home link.

Parameters | Type | Description
--- | --- | ---
__currentInstruction__ | `NavigationInstruction` | *current navigation instruction of the root router*
__*return*__ | `Array.<NavigationInstruction>` | *displayed steps*

---

### `navigate(navigationInstruction)`

![modifier: public](images/badges/modifier-public.png)

Navigates to the specified route.

Parameters | Type | Description
--- | --- | ---
__navigationInstruction__ | `NavigationInstruction` | *navigration instruction to apply on click*

---
