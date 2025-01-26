# Module `attributes/input-mask`

![category:attribute](https://img.shields.io/badge/category-attribute-b16502.svg?style=flat-square)



[Source file](..\src\attributes\input-mask.js)

# Class `InputMaskCustomAttribute`

Implements the **&#x60;input-mask&#x60; custom attribute** that provides mask on an input html element.
This attribute works together with the &#x60;numberFormat&#x60; and the &#x60;cleanInputMask&#x60; value converters.

## Examples

```javascript
<input
    type="text"
    input-mask="currency"
    value.one-time="montant | numberFormat"
    value.from-view="montant | cleanInputMask" />
```

## Constructors


### `InputMaskCustomAttribute(element)`

Creates an instance of the &#x60;input-mask&#x60; custom attribute.

Parameters | Type | Description
--- | --- | ---
__element__ | `HTMLInputElement` | *html input element using this custom attribute*

---

## Methods

### `attached()`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when the component is added to the DOM.

---

## Members

Name | Type | Description
--- | --- | ---
__element__ | `HTMLInputElement` | *Html input element using this custom attribute. @type {HTMLInputElement}*
__value__ | `'currency' \| 'percentage'` | *Value of the custom attribute. @type {&#x27;currency&#x27; | &#x27;percentage&#x27;}*
