# Module `attributes/input-filter`

![category:attribute](https://img.shields.io/badge/category-attribute-b16502.svg?style=flat-square)



[Source file](../src/attributes/input-filter.js)

# Class `InputFilterCustomAttribute`

Implements the **&#x60;input-filter&#x60; custom attribute** that removes the forbidden characters as soon as they are
typed, pasted or autofilled in an input html element.
The attribute value is either a predefined filter name (&#x60;email&#x60;) or a regular expression matching the
forbidden characters.

## Examples

```javascript
<input type="email" input-filter="email" value.bind="email" />
<input input-filter="[^0-9]" value.bind="code" />
```

## Constructors


### `InputFilterCustomAttribute(element)`

Creates an instance of the &#x60;input-filter&#x60; custom attribute.

Parameters | Type | Description
--- | --- | ---
__element__ | `HTMLInputElement` | *html input element using this custom attribute*

---

## Methods

### `attached()`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when the custom element is added to the DOM.

---

### `detached()`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when the custom element is removed from the DOM.

---

## Members

Name | Type | Description
--- | --- | ---
__element__ | `HTMLInputElement` | *Html input element using this custom attribute. @type {HTMLInputElement}*
__value__ | `'email' \| string` | *Value of the custom attribute. @type {&#x27;email&#x27; | string}*
__filter__ | `undefined` | *Removes the forbidden characters from the input value, keeping the caret in place when the input type
exposes it (&#x60;selectionStart&#x60; is null for &#x60;email&#x60; inputs, whose caret then moves to the end).*
