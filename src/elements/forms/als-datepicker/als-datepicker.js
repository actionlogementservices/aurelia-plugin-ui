import { DOM, inject, bindable, bindingMode, useView } from 'aurelia-framework';

/**
 * Implements the **`als-datepicker` custom element**: an `input-datepicker` with the calendar icon.
 * Place it inside an `als-field` to get the label and the validation errors, e.g.
 * `<als-field label="Date"><als-datepicker value.bind="model.date & validate"></als-datepicker></als-field>`.
 *
 * Like a native control, the element fires a `blur` event when the focus leaves it, so the default
 * `& validate` trigger works.
 * @category forms
 */
@useView('./als-datepicker.html')
@inject(DOM.Element)
export class AlsDatepicker {
  /** Selected date in ISO string format. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  value;

  /** Placeholder text @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  placeholder = '';

  /** Disabled @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  disabled = false;

  /** Readonly @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  readonly = false;

  /** Auto-hide dropdown after selection @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  autohide = true;

  /** Days of week to disable @type {number[]} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  disabledDays = [];

  /** Dates to disable @type {string[]} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  disabledDates = [];

  /** Minimum selectable date in ISO string format, empty for no limit @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  minDate = '';

  /** Maximum selectable date in ISO string format, empty for no limit @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  maxDate = '';

  /**
   * Creates an instance of AlsDatepicker.
   * @param {Element} element the custom element
   */
  constructor(element) {
    this.element = element;
  }

  /**
   * Fires `blur` on the custom element once the focus leaves it, as `& validate` listens to the target element.
   * @param {FocusEvent} event the focusout event of an inner element
   * @returns {boolean} true to continue processing
   */
  handleFocusout(event) {
    if (!this.element.contains(/** @type {Node} */ (event.relatedTarget))) {
      this.element.dispatchEvent(new FocusEvent('blur'));
    }

    return true;
  }
}
