import { DOM, inject, bindable, bindingMode, TaskQueue } from 'aurelia-framework';

// @ts-ignore
import { Datepicker } from 'vanillajs-datepicker';

import localeFr from './locale-fr.js';

import { generateUniqueId, isValidDateTimeISOString, preventEventPropagation } from '../../core/functions';

/**
 * Implements the **`input-datepicker` custom element** that provides a dropdown calendar to select a single date.
 * @category element
 */
@inject(DOM.Element, TaskQueue)
export class InputDatepicker {
  /** Selected date in ISO string format. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  date;

  /** The place holder text. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  placeholder;

  /** Enable/Disable the custom element to prevent user modification. @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  disabled = false;

  /** Marks the custom element as read-only. @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  readonly = false;

  /** Auto-hide dropdown after selection. @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  autohide = true;

  /** Days of week to disable. @type {number[]} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  disabledDays = [];

  /** Dates to disable. @type {string[]} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  disabledDates = [];

  /** Unique id to identify the custom element instance. @type {string} */ uniqueId = generateUniqueId();
  /** Html container of the custom element. @type {HTMLTemplateElement} */ _container;
  /** Html input element. @type {HTMLInputElement} */ _input;
  /** Value in the input field. @type {string} */ value;
  /** Lock to prevent loop. @type {'up' | 'down' | undefined} */ _propagation;

  /**
   * Creates an instance of the `input-datepicker` custom element.
   * @param {HTMLTemplateElement} element html template element
   * @param {TaskQueue} taskqueue aurelia asynchronous task queue
   */
  constructor(element, taskqueue) {
    this._container = element;
    this._taskqueue = taskqueue;
    Object.assign(Datepicker.locales, localeFr);
  }

  /**
   * Defines the logic triggered when the component is added to the DOM.
   */
  attached() {
    this._input = this._container.querySelector(`input[name="dp_${this.uniqueId}"]`);
    if (!this._input) throw new Error('Template html datepicker invalide !');
    // attach an event handler to detect when date is changed in the underlying vanillajs component
    this._input.addEventListener('changeDate', this.internalComponentDateChanged.bind(this));
    this._input.addEventListener('change', preventEventPropagation);
    // create the underlying vanillajs component
    this._datepicker = new Datepicker(this._input, {
      buttonClass: 'btn btn-secondary',
      updateOnBlur: true,
      autohide: this.autohide,
      language: 'fr',
      todayHighlight: true,
      daysOfWeekDisabled: this.disabledDays,
      // @ts-ignore
      datesDisabled: this.disabledDates?.map(d => new Date(d))
    });
    // it may happen that the databound date is already defined,
    // so dateChanged may not be called
    // in such case set the date of the underlying vanillajs component
    if (!this.date) return;
    this.setInternalComponentDate(this.date);
  }

  /**
   * Defines the logic triggered when the component is removed from the DOM.
   */
  detached() {
    this._input?.removeEventListener('changeDate', this.internalComponentDateChanged);
    this._input.removeEventListener('change', preventEventPropagation);
    this._datepicker?.destroy();
  }

  /**
   * Set the `date` attribute of the custom element.
   * @param {Date} date date to apply
   */
  setCustomElementDate(date) {
    this.date = date?.toISOString();
    this._taskqueue.queueMicroTask(() => {
      this._propagation = undefined;
    });
  }

  /**
   * Set the date of the internal vanillajs component.
   * @param {string} dateISOstring date specified as ISO string
   */
  setInternalComponentDate(dateISOstring) {
    if (isValidDateTimeISOString(dateISOstring)) {
      this._datepicker?.setDate(new Date(dateISOstring));
    } else {
      // eslint-disable-next-line unicorn/no-null
      this.value = null; // clear the input field
      this._datepicker?.setDate({ clear: true });
    }
    this._taskqueue.queueMicroTask(() => {
      this._propagation = undefined;
    });
  }

  /**
   * Triggers the 'change' event of the custom element.
   * Required to participate in aurelia validation system.
   * @param {Date} date selected date
   */
  triggerChangeEvent(date) {
    const eventToSend = DOM.createCustomEvent('change', { bubbles: true, detail: date });
    this._taskqueue.queueMicroTask(() => this._container.dispatchEvent(eventToSend));
  }

  /**
   * Triggers the 'blur' event of the custom element.
   * Required to participate in aurelia validation system.
   * @param {Date} date selected date
   */
  triggerBlurEvent(date) {
    const eventToSend = DOM.createCustomEvent('blur', { bubbles: true, detail: date });
    this._taskqueue.queueMicroTask(() => this._container.dispatchEvent(eventToSend));
  }

  /**
   * Defines the logic triggered when a date is selected in the underlying vanillajs component.
   * @param {CustomEvent} event event triggered by the underlying vanillajs component
   */
  internalComponentDateChanged(event) {
    if (this._propagation === 'down') return;
    this._propagation = 'up';
    /** @type {{date: Date}} */ const { date } = event.detail;
    this.setCustomElementDate(date);
    this._input.blur();
    // if the date change is caused by user interaction, trigger change/blur event to run validation
    const { detail } = event;
    if (detail?.datepicker?.picker?.active) {
      this.triggerChangeEvent(date);
      this.triggerBlurEvent(date);
    }
  }

  /**
   * Defines the logic triggered when `date` attribute is databound.
   * @param {string} date date in ISO string format
   */
  dateChanged(date) {
    if (this._propagation === 'up') return;
    this._propagation = 'down';
    this.setInternalComponentDate(this.date);
  }

  /**
   * Defines the logic triggered when `disabledDates` attribute is databound.
   * @param {string[]} disabledDates dates to disable in ISO string format
   */
  disabledDatesChanged(disabledDates) {
    if (!this._datepicker) return;
    const datesDisabled = disabledDates?.map(d => new Date(d));
    this._datepicker.setOptions({ datesDisabled });
  }
}
