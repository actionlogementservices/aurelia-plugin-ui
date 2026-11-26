# Module `core/combobox`

![category:core](https://img.shields.io/badge/category-core-blue.svg?style=flat-square)

Keyboard of the select and auto-complete custom elements, after the WAI-ARIA combobox pattern with a listbox popup
(https://www.w3.org/WAI/ARIA/apg/patterns/combobox/): the focus stays on the input, the arrows move the active
option (&#x60;aria-activedescendant&#x60;) from the selected one, Enter (and Space on a read-only input) picks it, Escape
closes the listbox and Tab leaves the field.

[Source file](../src/core/combobox.js)

## Functions

### `bindCombobox(input, listbox)`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Clears the active option when the listbox closes, and when the text changes the options (typed, pasted, dictated...).

Parameters | Type | Description
--- | --- | ---
__input__ | `HTMLInputElement` | *combobox input, the toggle of the bootstrap dropdown*
__listbox__ | `HTMLElement` | *listbox of the options*

---

### `handleComboboxKey(event, listbox, dropdown) ► boolean`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Handles a key pressed in the input of a combobox.

Parameters | Type | Description
--- | --- | ---
__event__ | `KeyboardEvent` | *keydown event of the input*
__listbox__ | `HTMLElement` | *listbox of the options (the bootstrap dropdown menu)*
__dropdown__ | `import('bootstrap').Dropdown` | *bootstrap dropdown showing the listbox*
__*return*__ | `boolean` | *true to let the browser handle the key, false when the key has been handled*

---

### `clearActiveOption(input, listbox)`

![modifier: private](images/badges/modifier-private.png)

Clears the active option of a combobox.

Parameters | Type | Description
--- | --- | ---
__input__ | `HTMLInputElement` | *combobox input*
__listbox__ | `HTMLElement` | *listbox of the options*

---

### `activateOption(input, listbox, option)`

![modifier: private](images/badges/modifier-private.png)

Makes the specified option the active one.

Parameters | Type | Description
--- | --- | ---
__input__ | `HTMLInputElement` | *combobox input*
__listbox__ | `HTMLElement` | *listbox of the options*
__option__ | `HTMLElement` | *option to activate*

---

### `moveActiveOption(input, listbox, active, down)`

![modifier: private](images/badges/modifier-private.png)

Moves the active option with the arrows, the first move starting from the selected option if any.

Parameters | Type | Description
--- | --- | ---
__input__ | `HTMLInputElement` | *combobox input*
__listbox__ | `HTMLElement` | *listbox of the options*
__active__ | `Element` | *current active option*
__down__ | `boolean` | *true to move down, false to move up*

---

### `pickOrOpen(input, listbox, dropdown, active) ► boolean`

![modifier: private](images/badges/modifier-private.png)

Picks the active option with Enter (and Space on a read-only input), or opens a read-only combobox like a native
select, on its selected option.

Parameters | Type | Description
--- | --- | ---
__input__ | `HTMLInputElement` | *combobox input*
__listbox__ | `HTMLElement` | *listbox of the options*
__dropdown__ | `import('bootstrap').Dropdown` | *bootstrap dropdown showing the listbox*
__active__ | `Element` | *current active option*
__*return*__ | `boolean` | *true to let the browser handle the key, false when the key has been handled*

---

## Constants

### `ACTIVE_OPTION`

![modifier: private](images/badges/modifier-private.png)

Class of the active option, which shows the focus ring while the focus stays on the input.

#### Value

```javascript
'active-option'
```

---
