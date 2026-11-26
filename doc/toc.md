# Code documentation

## Table of contents

* ![category:core](https://img.shields.io/badge/category-core-blue.svg?style=flat-square)
  * [core/combobox](src-core_combobox.md) - _Keyboard of the select and auto-complete custom elements, after the WAI-ARIA combobox pattern with a listbox popup
(https://www.w3.org/WAI/ARIA/apg/patterns/combobox/): the focus stays on the input, the arrows move the active
option (&#x60;aria-activedescendant&#x60;) from the selected one, Enter (and Space on a read-only input) picks it, Escape
closes the listbox and Tab leaves the field._

* ![category:internal](https://img.shields.io/badge/category-internal-6b6b6b.svg?style=flat-square)
  * [core/decorators](src-core_decorators.md) - _Defines common decorators._
  * [core/functions](src-core_functions.md) - _Defines common functions._
  * [core/sorting](src-core_sorting.md) - _Defines the common sorting functions._

* ![category:forms](https://img.shields.io/badge/category-forms-blue.svg?style=flat-square)
  * [core/validation-messages](src-core_validation-messages.md) - _French messages of the standard aurelia-validation rules. The field label is displayed above the control,
so the messages do not repeat the property display name._
  * [elements/forms/als-datepicker/als-datepicker](src-elements-forms-als-datepicker_als-datepicker.md) - _Implements the **&#x60;als-datepicker&#x60; custom element**: an &#x60;input-datepicker&#x60; with the calendar icon.
Place it inside an &#x60;als-field&#x60; to get the label and the validation errors, e.g.
&#x60;&lt;als-field label&#x3D;&quot;Date&quot;&gt;&lt;als-datepicker value.bind&#x3D;&quot;model.date &amp; validate&quot;&gt;&lt;/als-datepicker&gt;&lt;/als-field&gt;&#x60;.

Like a native control, the element fires a &#x60;blur&#x60; event when the focus leaves it, so the default
&#x60;&amp; validate&#x60; trigger works._
  * [elements/forms/als-field/als-field](src-elements-forms-als-field_als-field.md) - _Implements the **&#x60;als-field&#x60; custom element** that lays out a form control with the standard label, required
marker and error message. The control is projected as is, so every native attribute and Aurelia binding
(value converters, &#x60;&amp; validate&#x60;, events...) keeps working.

When a &#x60;ValidationController&#x60; is available in the current scope, the field registers itself as a validation
renderer: the errors of the bindings targeting an element inside the field are displayed below the control,
which receives the bootstrap &#x60;is-invalid&#x60; class and the matching aria attributes.

With &#x60;group&#x3D;&quot;true&quot;&#x60;, the field lays out a group of controls answering a single question (radio buttons,
checkboxes, composite inputs): the label names the whole group (&#x60;role&#x3D;&quot;group&quot;&#x60; + &#x60;aria-labelledby&#x60;) instead of
pointing to the first control, and the hint and the error message describe the group._
  * [elements/forms/als-multi-select/als-multi-select](src-elements-forms-als-multi-select_als-multi-select.md) - _Implements the **&#x60;als-multi-select&#x60; custom element**: a dropdown of checkboxes selecting several values.
Place it inside an &#x60;als-field&#x60; to get the label and the validation errors, e.g.
&#x60;&lt;als-field label&#x3D;&quot;Années&quot;&gt;&lt;als-multi-select items.bind&#x3D;&quot;items&quot; value.bind&#x3D;&quot;model.years &amp; validate&quot;&gt;&lt;/als-multi-select&gt;&lt;/als-field&gt;&#x60;.

Like a native control, the element fires a &#x60;blur&#x60; event when the focus leaves it, so the default
&#x60;&amp; validate&#x60; trigger works._
  * [elements/forms/als-password-toggle/als-password-toggle](src-elements-forms-als-password-toggle_als-password-toggle.md) - _Implements the **&#x60;als-password-toggle&#x60; custom element**: a button masking or revealing the password input
located in the same parent, typically placed after the input inside an &#x60;als-field&#x60;._

* ![category:public](https://img.shields.io/badge/category-public-FF5000.svg?style=flat-square)
  * [index](src_index.md) - _Defines the Aurelia plugin entry point._

* ![category:attribute](https://img.shields.io/badge/category-attribute-b16502.svg?style=flat-square)
  * [attributes/input-filter](src-attributes_input-filter.md) - _Implements the **&#x60;input-filter&#x60; custom attribute** that removes the forbidden characters as soon as they are
typed, pasted or autofilled in an input html element.
The attribute value is either a predefined filter name (&#x60;email&#x60;) or a regular expression matching the
forbidden characters._
  * [attributes/input-mask](src-attributes_input-mask.md) - _Implements the **&#x60;input-mask&#x60; custom attribute** that provides mask on an input html element.
This attribute works together with the &#x60;numberFormat&#x60; and the &#x60;cleanInputMask&#x60; value converters._
  * [attributes/no-submit](src-attributes_no-submit.md) - _Implements the **&#x60;no-submit&#x60; custom attribute** that prevents submitting when &#x60;enter&#x60; is pressed._

* ![category:other](https://img.shields.io/badge/category-other-9f9f9f.svg?style=flat-square)
  * [core/debug-tracer](src-core_debug-tracer.md) - _Module core/debug-tracer_
  * [elements/forms/als-input-number/als-input-number](src-elements-forms-als-input-number_als-input-number.md) - _Module elements/forms/als-input-number/als-input-number_
  * [elements/forms/als-input-password/als-input-password](src-elements-forms-als-input-password_als-input-password.md) - _Module elements/forms/als-input-password/als-input-password_
  * [elements/forms/als-input-text/als-input-text](src-elements-forms-als-input-text_als-input-text.md) - _Module elements/forms/als-input-text/als-input-text_
  * [elements/forms/als-select/als-select](src-elements-forms-als-select_als-select.md) - _Module elements/forms/als-select/als-select_
  * [elements/forms/forms-input](src-elements-forms_forms-input.md) - _Generic base for form inputs._
  * [layouts/als-pre-login/als-pre-login](src-layouts-als-pre-login_als-pre-login.md) - _Module layouts/als-pre-login/als-pre-login_

* ![category:dialog](https://img.shields.io/badge/category-dialog-009663.svg?style=flat-square)
  * [core/dialog-service/dialog-controller](src-core-dialog-service_dialog-controller.md) - _Controls the dialog system._
  * [core/dialog-service/dialog-renderer](src-core-dialog-service_dialog-renderer.md) - _Renders the  modal or offcanvas dialog in bootstrap 5._
  * [core/dialog-service/dialog-result](src-core-dialog-service_dialog-result.md) - _Defines the output of the modal dialog._
  * [core/dialog-service/dialog-service](src-core-dialog-service_dialog-service.md) - _Implements the dialog service._

* ![category:lock](https://img.shields.io/badge/category-lock-009663.svg?style=flat-square)
  * [core/lock-service/lock-service](src-core-lock-service_lock-service.md) - _Implements the lock service._

* ![category:toast](https://img.shields.io/badge/category-toast-009663.svg?style=flat-square)
  * [core/toast-service/toast-renderer](src-core-toast-service_toast-renderer.md) - _Renders the toast in bootstrap 5._
  * [core/toast-service/toast-service](src-core-toast-service_toast-service.md) - _Implements the toast service._
  * [core/toast-service/toast](src-core-toast-service_toast.md) - _Implements the viewmodel of the toast view._

* ![category:dropdown](https://img.shields.io/badge/category-dropdown-blue.svg?style=flat-square)
  * [elements/als-dropdown/als-dropdown](src-elements-als-dropdown_als-dropdown.md) - _Implements the **&#x60;als-dropdown&#x60; custom element** that instantiates a generic bootstrap dropdown.
Any content placed inside the element is projected into the dropdown menu, and content placed inside
a &#x60;[slot&#x3D;&quot;toggle&quot;]&#x60; element is projected into the toggle button, letting the caller fully control the markup._

* ![category:element](https://img.shields.io/badge/category-element-3b631b.svg?style=flat-square)
  * [elements/als-footer/als-footer](src-elements-als-footer_als-footer.md) - _Implements the **&#x60;als-footer&#x60; custom element** that displays a generic footer with a list of links._
  * [elements/als-gtag/als-gtag](src-elements-als-gtag_als-gtag.md) - _Implements the **&#x60;als-gtag&#x60; custom element** that injects the Google Tag Manager script and noscript fallback.
Use a single instance near the root of the application._
  * [elements/als-user-menu/als-user-menu](src-elements-als-user-menu_als-user-menu.md) - _Implements the **&#x60;als-user-menu&#x60; custom element** that displays the user&#x27;s initials and a dropdown of account actions.
Each item is a link when &#x60;href&#x60; is set, otherwise &#x60;click&#x60; is called._
  * [elements/breadcrumbs/breadcrumbs](src-elements-breadcrumbs_breadcrumbs.md) - _Implements the **&#x60;breadcrumbs&#x60; custom element** that displays the current route._
  * [elements/environment-ribbon/environment-ribbon](src-elements-environment-ribbon_environment-ribbon.md) - _Implements the **&#x60;environment-ribbon&#x60; custom element** that displays the current environment._
  * [elements/input-datepicker/input-datepicker](src-elements-input-datepicker_input-datepicker.md) - _Implements the **&#x60;input-datepicker&#x60; custom element** that provides a dropdown calendar to select a single date._
  * [elements/loading-indicator/loading-indicator](src-elements-loading-indicator_loading-indicator.md) - _Implements the **&#x60;loading-indicator&#x60; custom element** that tracks api calls._
  * [elements/lock/lock](src-elements-lock_lock.md) - _Implements the **&#x60;lock&#x60; custom element** that displays a logic lock preventing user from interaction._

* ![category:select](https://img.shields.io/badge/category-select-3b631b.svg?style=flat-square)
  * [elements/select/badges-select](src-elements-select_badges-select.md) - _Implements the **&#x60;badges-select&#x60; custom element** that provides a dropdown list based on a datasource with on the fly filtering and a multiple selection with badge rendering._
  * [elements/select/filterable-select](src-elements-select_filterable-select.md) - _Implements the **&#x60;filterable-select&#x60; custom element** that provides a dropdown list based on a datasource with on the fly filtering and single selection._
  * [elements/select/simple-select](src-elements-select_simple-select.md) - _Implements the **&#x60;simple-select&#x60; custom element** that provides a dropdown list based on a datasource and single selection._

* ![category:autocomplete](https://img.shields.io/badge/category-autocomplete-3b631b.svg?style=flat-square)
  * [elements/auto-complete/address-auto-complete](src-elements-auto-complete_address-auto-complete.md) - _Implements the **&#x60;address-auto-complete&#x60; custom element** that provides auto completion upon the BAN (*Base Adresse Nationale*) api._
  * [elements/auto-complete/adresse](src-elements-auto-complete_adresse.md) - _Implements the BAN (Base Adresse Nationale) model._
  * [elements/auto-complete/auto-complete-controller](src-elements-auto-complete_auto-complete-controller.md) - _Imlements a controller that retrieves data on the fly for an &#x27;auto-complete&#x27; custom element._
  * [elements/auto-complete/auto-complete](src-elements-auto-complete_auto-complete.md) - _Implements the **&#x60;auto-complete&#x60; custom element** that provides auto completion upon a controller to be specified and single selection._
  * [elements/auto-complete/badges-auto-complete](src-elements-auto-complete_badges-auto-complete.md) - _Implements the **&#x60;badges-auto-complete&#x60; custom element** that provides auto completion upon a controller to be specified and a multiple selection with badge rendering._

* ![category:table](https://img.shields.io/badge/category-table-3b631b.svg?style=flat-square)
  * [elements/simple-table/column](src-elements-simple-table_column.md) - _Implements the **&#x60;column&#x60; custom element** that provides the definition of the grid column._
  * [elements/simple-table/simple-table](src-elements-simple-table_simple-table.md) - _Implements the **&#x60;simple-table&#x60; custom element** that provides a simple grid with customizable columns._

* ![category:valueconverter](https://img.shields.io/badge/category-valueconverter-085a8a.svg?style=flat-square)
  * [value-converters/clean-input-mask](src-value-converters_clean-input-mask.md) - _Implements a **&#x60;cleanInputMask&#x60; value converter** to remove the input mask.
This converter works together with the &#x60;input-mask&#x60; attribute and the &#x60;numberFormat&#x60; value converter._
  * [value-converters/date-format](src-value-converters_date-format.md) - _Implements a **&#x60;dateFormat&#x60;value converter** to transform a date to DD/MM/YYYY format._
  * [value-converters/form-input-number-format](src-value-converters_form-input-number-format.md) - _Implements a **&#x60;formInputNumberFormat&#x60; value converter** that formats a number for a masked input and parses
the masked input back to a number. It works together with the &#x60;input-mask&#x60; attribute, using the same type._
  * [value-converters/number-format](src-value-converters_number-format.md) - _Implements a **&#x60;numberFormat&#x60;value converter** to transform a number to a string representation.
This converter works together with the &#x60;input-mask&#x60; attribute and the &#x60;cleanInputMask&#x60; value converter._

