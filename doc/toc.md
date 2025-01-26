# Code documentation

## Table of contents

* ![category:public](https://img.shields.io/badge/category-public-FF5000.svg?style=flat-square)
  * [index](src_index.md) - _Defines the Aurelia plugin entry point._

* ![category:dialog](https://img.shields.io/badge/category-dialog-009663.svg?style=flat-square)
  * [core/dialog-service/dialog-controller](src-core-dialog-service_dialog-controller.md) - _Controls the modal dialog system._
  * [core/dialog-service/dialog-renderer](src-core-dialog-service_dialog-renderer.md) - _Renders the modal dialog in bootstrap 5._
  * [core/dialog-service/dialog-result](src-core-dialog-service_dialog-result.md) - _Defines the output of the modal dialog._
  * [core/dialog-service/dialog-service](src-core-dialog-service_dialog-service.md) - _Implements the modal dialog service._

* ![category:lock](https://img.shields.io/badge/category-lock-009663.svg?style=flat-square)
  * [core/lock-service/lock-service](src-core-lock-service_lock-service.md) - _Implements the lock service._

* ![category:toast](https://img.shields.io/badge/category-toast-009663.svg?style=flat-square)
  * [core/toast-service/toast-renderer](src-core-toast-service_toast-renderer.md) - _Renders the toast in bootstrap 5._
  * [core/toast-service/toast-service](src-core-toast-service_toast-service.md) - _Implements the toast service._
  * [core/toast-service/toast](src-core-toast-service_toast.md) - _Implements the viewmodel of the toast view._

* ![category:element](https://img.shields.io/badge/category-element-3b631b.svg?style=flat-square)
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

* ![category:attribute](https://img.shields.io/badge/category-attribute-b16502.svg?style=flat-square)
  * [attributes/input-mask](src-attributes_input-mask.md) - _Implements the **&#x60;input-mask&#x60; custom attribute** that provides mask on an input html element.
This attribute works together with the &#x60;numberFormat&#x60; and the &#x60;cleanInputMask&#x60; value converters._
  * [attributes/no-submit](src-attributes_no-submit.md) - _Implements the **&#x60;no-submit&#x60; custom attribute** that prevents submitting when &#x60;enter&#x60; is pressed._

* ![category:valueconverter](https://img.shields.io/badge/category-valueconverter-085a8a.svg?style=flat-square)
  * [value-converters/clean-input-mask](src-value-converters_clean-input-mask.md) - _Implements a **&#x60;cleanInputMask&#x60; value converter** to remove the input mask.
This converter works together with the &#x60;input-mask&#x60; attribute and the &#x60;numberFormat&#x60; value converter._
  * [value-converters/date-format](src-value-converters_date-format.md) - _Implements a **&#x60;dateFormat&#x60;value converter** to transform a date to DD/MM/YYYY format._
  * [value-converters/number-format](src-value-converters_number-format.md) - _Implements a **&#x60;numberFormat&#x60;value converter** to transform a number to a string representation.
This converter works together with the &#x60;input-mask&#x60; attribute and the &#x60;cleanInputMask&#x60; value converter._

* ![category:internal](https://img.shields.io/badge/category-internal-6b6b6b.svg?style=flat-square)
  * [core/decorators](src-core_decorators.md) - _Defines common decorators._
  * [core/functions](src-core_functions.md) - _Defines common functions._
  * [core/sorting](src-core_sorting.md) - _Defines the common sorting functions._

