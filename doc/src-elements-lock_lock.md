# Module `elements/lock/lock`

![category:element](https://img.shields.io/badge/category-element-3b631b.svg?style=flat-square)



[Source file](../src/elements/lock/lock.js)

# Class `LockCustomElement`

Implements the **&#x60;lock&#x60; custom element** that displays a logic lock preventing user from interaction.

While locked, the rest of the page is &#x60;inert&#x60; (out of the tab order and of the accessibility tree, like behind a
modal dialog), screen readers announce the wait, and the focus goes back to the element that had it on unlock.

## Constructors


### `LockCustomElement(element)`

Creates an instance of LockCustomElement.

Parameters | Type | Description
--- | --- | ---
__element__ | `Element` | *the custom element*

---

## Methods

### `release()`

![modifier: public](images/badges/modifier-public.png)

Releases the elements made inert by the lock, and gives the focus back to the element that had it.

---

## Members

Name | Type | Description
--- | --- | ---
__locked__ | `boolean` | *Is the lock active?*
__inertElements__ | `Element[]` | *Elements made inert by the lock. @type {Element[]}*
__focusedElement__ | `HTMLElement \| undefined` | *Element focused when the lock was activated. @type {HTMLElement | undefined}*
