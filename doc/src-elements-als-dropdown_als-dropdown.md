# Module `elements/als-dropdown/als-dropdown`

![category:dropdown](https://img.shields.io/badge/category-dropdown-blue.svg?style=flat-square)



[Source file](../src/elements/als-dropdown/als-dropdown.js)

# Class `AlsDropdown`

Implements the **&#x60;als-dropdown&#x60; custom element** that instantiates a generic bootstrap dropdown.
Any content placed inside the element is projected into the dropdown menu, and content placed inside
a &#x60;[slot&#x3D;&quot;toggle&quot;]&#x60; element is projected into the toggle button, letting the caller fully control the markup.

## Constructors


### `AlsDropdown(element)`

Creates an instance of the &#x60;als-dropdown&#x60; custom element.

Parameters | Type | Description
--- | --- | ---
__element__ | `HTMLTemplateElement` | *html template element*

---

## Methods

### `attached()`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when the custom element is added to the DOM.

---

### `wrapChildren()`

![modifier: public](images/badges/modifier-public.png)

Wraps the children of the dropdown menu in &#x60;&lt;li class&#x3D;&quot;dropdown-item&quot;&gt;&#x60; elements, as required by bootstrap.

---

### `detached()`

![modifier: public](images/badges/modifier-public.png)

Defines the logic triggered when the custom element is removed from the DOM.

---

### `handleFocus(event) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Custom handler to handle focus event and call onFocus callback if provided.

Parameters | Type | Description
--- | --- | ---
__event__ | `FocusEvent` | *The focus event*
__*return*__ | `boolean` | *true to continue processing, false to cancel*

---

### `handleBlur(event) ► boolean`

![modifier: public](images/badges/modifier-public.png)

Custom handler to handle blur event and call onBlur callback if provided.

Parameters | Type | Description
--- | --- | ---
__event__ | `FocusEvent` | *The blur event*
__*return*__ | `boolean` | *true to continue processing, false to cancel*

---

### `show()`

![modifier: public](images/badges/modifier-public.png)

Shows the dropdown menu.

---

### `hide()`

![modifier: public](images/badges/modifier-public.png)

Hides the dropdown menu.

---

### `toggle()`

![modifier: public](images/badges/modifier-public.png)

Toggles the dropdown menu.

---

## Members

Name | Type | Description
--- | --- | ---
__disabled__ | `boolean` | *Disable/Enable the toggle button. @type {boolean}*
__autosize__ | `boolean` | *Autosize the dropdown to the parent&#x27;s width. @type {boolean}*
__autoClose__ | `boolean\|'inside'\|'outside'` | *Bootstrap &#x60;autoClose&#x60; option (&#x60;true&#x60;, &#x60;false&#x60;, &#x60;&#x27;inside&#x27;&#x60; or &#x60;&#x27;outside&#x27;&#x60;). @type {boolean|&#x27;inside&#x27;|&#x27;outside&#x27;}*
__toggleClass__ | `string` | *Css class(es) applied to the toggle button. @type {string}*
__menuClass__ | `string` | *Css class(es) applied to the dropdown menu. @type {string}*
__label__ | `string` | *Label displayed in the toggle button when no &#x60;toggle&#x60; slot content is provided. @type {string}*
__ariaLabel__ | `string` | *Accessible name applied to the toggle button, overriding its visible content. @type {string}*
__ariaDescribedby__ | `string` | *Id(s) of the element(s) describing the toggle button, e.g. an error message. @type {string}*
__ariaInvalid__ | `boolean\|'true'\|'false'` | *Applied to the toggle button to expose invalid state to assistive technology. @type {boolean|&#x27;true&#x27;|&#x27;false&#x27;}*
__menuAriaLabel__ | `string` | *Accessible name applied to the dropdown menu, e.g. to group a set of checkboxes. @type {string}*
__expanded__ | `boolean` | *Whether the dropdown menu is currently open, reflected in &#x60;aria-expanded&#x60;. @type {boolean}*
__uniqueId__ | `string` | *Unique id to identify the custom element instance. @type {string}*
__onFocus__ | `(event: FocusEvent) => void` | *onFocus @type {(event: FocusEvent) &#x3D;&gt; void}*
__onBlur__ | `(event: FocusEvent) => void` | *onBlur @type {(event: FocusEvent) &#x3D;&gt; void}*
___container__ | `HTMLTemplateElement` | *Html container of the custom element. @type {HTMLTemplateElement}*
___toggle__ | `HTMLButtonElement` | *Html toggle button element. @type {HTMLButtonElement}*
___menu__ | `HTMLUListElement` | *Html dropdown menu element. @type {HTMLUListElement}*
___dropdown__ | `Dropdown` | *Bootstrap dropdown. @type {Dropdown}*
___handleShow__ | `() => void` | *Bound handler used to track the dropdown open state. @type {() &#x3D;&gt; void}*
___handleHide__ | `() => void` | *Bound handler used to track the dropdown closed state. @type {() &#x3D;&gt; void}*
___menuObserver__ | `MutationObserver` | *Observes the menu for projected content added after &#x60;attached()&#x60;, e.g. from async-bound &#x60;repeat.for&#x60; items.*
