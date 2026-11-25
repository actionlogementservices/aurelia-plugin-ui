# Module `elements/forms/als-password-toggle/als-password-toggle`

![category:forms](https://img.shields.io/badge/category-forms-blue.svg?style=flat-square)



[Source file](../src/elements/forms/als-password-toggle/als-password-toggle.js)

# Class `AlsPasswordToggle`

Implements the **&#x60;als-password-toggle&#x60; custom element**: a button masking or revealing the password input
located in the same parent, typically placed after the input inside an &#x60;als-field&#x60;.

## Examples

```javascript
<als-field label="Mot de passe">
  <input type="password" class="form-control" autocomplete="current-password" value.bind="password & validate" />
  <als-password-toggle></als-password-toggle>
</als-field>
```

## Methods

### `toggle()`

![modifier: public](images/badges/modifier-public.png)

Masks or reveals the password.

---

## Members

Name | Type | Description
--- | --- | ---
__visible__ | `boolean` | *Whether the password is currently revealed. @type {boolean}*
__button__ | `HTMLButtonElement` | *Html toggle button. @type {HTMLButtonElement}*
