import { DOM, inject, bindable, bindingMode, TaskQueue } from 'aurelia-framework';

// @ts-ignore
import { Datepicker } from 'vanillajs-datepicker';

import localeFr from './locale-fr.js';

import {
  generateUniqueId,
  parseCalendarDate,
  preventEventPropagation,
  toCalendarDate
} from '../../core/functions';

/**
 * Implements the **`input-datepicker` custom element** that provides a dropdown calendar to select a single date.
 * @category element
 */
@inject(DOM.Element, TaskQueue)
export class InputDatepicker {
  /** Selected date, calendar date `YYYY-MM-DD` (an ISO date time is also accepted). @type {string} */
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

  /** Dates to disable, calendar dates `YYYY-MM-DD`. @type {string[]} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  disabledDates = [];

  /** Minimum selectable date, calendar date `YYYY-MM-DD`, empty for no limit. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  minDate = '';

  /** Maximum selectable date, calendar date `YYYY-MM-DD`, empty for no limit. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  maxDate = '';

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
   * Defines the logic triggered when the custom element is added to the DOM.
   */
  attached() {
    this._input = this._container.querySelector(`input[name="dp_${this.uniqueId}"]`);
    if (!this._input) throw new Error('Template html datepicker invalide !');
    // attach an event handler to detect when date is changed in the underlying vanillajs component
    this._input.addEventListener('changeDate', this.internalComponentDateChanged.bind(this));
    this._input.addEventListener('change', preventEventPropagation);
    // Enter selects the date of the open calendar, it must not also submit the form: registered before the vanillajs
    // component, whose listener closes the calendar and ignores `defaultPrevented`
    this._preventSubmitOnPick = event => {
      if (event.key === 'Enter' && this._datepicker?.active) event.preventDefault();
    };
    this._input.addEventListener('keydown', this._preventSubmitOnPick);
    // create the underlying vanillajs component
    this._datepicker = new Datepicker(this._input, {
      buttonClass: 'btn btn-secondary',
      updateOnBlur: true,
      autohide: this.autohide,
      language: 'fr',
      todayHighlight: true,
      // the `today` class is visual only: also expose today to screen readers (WAI-ARIA date picker pattern)
      beforeShowDay: date =>
        date.toDateString() === new Date().toDateString()
          ? { content: `<span aria-current="date">${date.getDate()}</span>` }
          : undefined,
      daysOfWeekDisabled: this.disabledDays,
      // @ts-ignore
      datesDisabled: this.getComponentDates(this.disabledDates),
      // @ts-ignore null is accepted at runtime to mean "no limit"
      minDate: this.getComponentDateLimit(this.minDate),
      // @ts-ignore null is accepted at runtime to mean "no limit"
      maxDate: this.getComponentDateLimit(this.maxDate)
    });

    // it may happen that the databound date is already defined,
    // so dateChanged may not be called
    // in such case set the date of the underlying vanillajs component
    if (!this.date) return;
    this.setInternalComponentDate(this.date);
  }

  /**
   * Defines the logic triggered when the custom element is removed from the DOM.
   */
  detached() {
    this._input?.removeEventListener('changeDate', this.internalComponentDateChanged);
    this._input.removeEventListener('change', preventEventPropagation);
    this._input.removeEventListener('keydown', this._preventSubmitOnPick);
    this._datepicker?.destroy();
  }

  /**
   * Set the `date` attribute of the custom element.
   * @param {Date} date date to apply
   */
  setCustomElementDate(date) {
    this.date = date ? toCalendarDate(date) : undefined;
    this._taskqueue.queueMicroTask(() => {
      this._propagation = undefined;
    });
  }

  /**
   * Converts a date bindable (calendar date) into a limit usable by the underlying vanillajs component.
   * The underlying component enforces the limit for both calendar selection and manual keyboard input.
   * @param {string} calendarDate calendar date `YYYY-MM-DD`, empty when no limit is set
   * @returns {Date | null} the corresponding Date instance, or null when no limit applies
   */
  getComponentDateLimit(calendarDate) {
    // eslint-disable-next-line unicorn/no-null
    return parseCalendarDate(calendarDate) ?? null;
  }

  /**
   * Converts the dates to disable (calendar dates) into dates usable by the underlying vanillajs component.
   * @param {string[]} calendarDates calendar dates `YYYY-MM-DD`
   * @returns {Date[]} the valid dates
   */
  getComponentDates(calendarDates) {
    return (calendarDates ?? []).map(date => parseCalendarDate(date)).filter(Boolean);
  }

  /**
   * Set the date of the internal vanillajs component.
   * @param {string} calendarDate calendar date `YYYY-MM-DD`
   */
  setInternalComponentDate(calendarDate) {
    const date = parseCalendarDate(calendarDate);
    if (date) {
      this._datepicker?.setDate(date);
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
    // if the date change is caused by user interaction, trigger change/blur event to run validation
    // (the focus stays on the input, as in the WAI-ARIA date picker pattern: keyboard users keep their position)
    const { detail } = event;
    if (detail?.datepicker?.picker?.active) {
      this.triggerChangeEvent(date);
      this.triggerBlurEvent(date);
    }
  }

  /**
   * Defines the logic triggered when `date` attribute is databound.
   * @param {string} date calendar date `YYYY-MM-DD`
   */
  dateChanged(date) {
    if (this._propagation === 'up') return;
    this._propagation = 'down';
    this.setInternalComponentDate(this.date);
  }

  /**
   * Defines the logic triggered when `disabledDates` attribute is databound.
   * @param {string[]} disabledDates dates to disable, calendar dates `YYYY-MM-DD`
   */
  disabledDatesChanged(disabledDates) {
    if (!this._datepicker) return;
    this._datepicker.setOptions({ datesDisabled: this.getComponentDates(disabledDates) });
  }

  /**
   * Defines the logic triggered when `minDate` attribute is databound.
   * @param {string} minDate minimum selectable date, calendar date `YYYY-MM-DD`, empty for no limit
   */
  minDateChanged(minDate) {
    if (!this._datepicker) return;
    // @ts-ignore null is accepted at runtime to mean "no limit"
    this._datepicker.setOptions({ minDate: this.getComponentDateLimit(minDate) });
  }

  /**
   * Defines the logic triggered when `maxDate` attribute is databound.
   * @param {string} maxDate maximum selectable date, calendar date `YYYY-MM-DD`, empty for no limit
   */
  maxDateChanged(maxDate) {
    if (!this._datepicker) return;
    // @ts-ignore null is accepted at runtime to mean "no limit"
    this._datepicker.setOptions({ maxDate: this.getComponentDateLimit(maxDate) });
  }
}
