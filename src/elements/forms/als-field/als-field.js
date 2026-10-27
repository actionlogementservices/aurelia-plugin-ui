import { DOM, Optional, inject, bindable, bindingMode, computedFrom, useView } from 'aurelia-framework';
import { ValidationController } from 'aurelia-validation';

import { generateUniqueId } from '../../../core/functions';

/** @typedef {import('aurelia-validation').RenderInstruction} RenderInstruction */
/** @typedef {import('aurelia-validation').ValidateResult} ValidateResult */

/**
 * Adds or removes a token from a space-separated attribute, keeping the other tokens intact.
 * @param {Element} element the element to update
 * @param {string} attribute the attribute name
 * @param {string} token the token to add or remove
 * @param {boolean} force true to add the token, false to remove it
 */
function toggleToken(element, attribute, token, force) {
  const tokens = new Set((element.getAttribute(attribute) || '').split(' ').filter(Boolean));
  if (force) {
    tokens.add(token);
  } else {
    tokens.delete(token);
  }

  if (tokens.size > 0) {
    element.setAttribute(attribute, [...tokens].join(' '));
  } else {
    element.removeAttribute(attribute);
  }
}

/**
 * Implements the **`als-field` custom element** that lays out a form control with the standard label, required
 * marker and error message. The control is projected as is, so every native attribute and Aurelia binding
 * (value converters, `& validate`, events...) keeps working.
 *
 * When a `ValidationController` is available in the current scope, the field registers itself as a validation
 * renderer: the errors of the bindings targeting an element inside the field are displayed below the control,
 * which receives the bootstrap `is-invalid` class and the matching aria attributes.
 * @category forms
 */
@useView('./als-field.html')
@inject(DOM.Element, Optional.of(ValidationController))
export class AlsField {
  /** Label displayed above the control. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  label = '';

  /** Displays the required marker next to the label. @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  required = false;

  /** Help text displayed below the control, e.g. the accepted range of values. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  hint = '';

  /** Projected control. @type {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null} */
  control;

  /** Id of the projected control: the control's own id, or a generated one. @type {string} */
  controlId = `als-field-${generateUniqueId()}`;

  /** Validation errors of the elements inside the field. @type {Array<{result: ValidateResult, element: Element}>} */
  errors = [];

  /**
   * Creates an instance of AlsField.
   * @param {Element} element the custom element
   * @param {ValidationController | null} controller the validation controller of the current scope, if any
   */
  constructor(element, controller) {
    this.element = element;
    this.controller = controller;
  }

  /**
   * Message of the first error, displayed below the control.
   * @type {string}
   */
  @computedFrom('errors')
  get errorMessage() {
    return this.errors.length > 0 ? this.errors[0].result.message : '';
  }

  /**
   * Id of the error message element, referenced by `aria-describedby` on invalid controls.
   * @type {string}
   */
  @computedFrom('controlId')
  get errorId() {
    return `${this.controlId}-error`;
  }

  /**
   * Id of the hint element, referenced by `aria-describedby` on the control.
   * @type {string}
   */
  @computedFrom('controlId')
  get hintId() {
    return `${this.controlId}-hint`;
  }

  bind() {
    this.controller?.addRenderer(this);
  }

  attached() {
    this.control = this.element.querySelector('input, select, textarea');
    if (this.control) {
      if (this.control.id) {
        this.controlId = this.control.id;
      } else {
        this.control.id = this.controlId;
      }
    }

    this.hintChanged();
  }

  hintChanged() {
    if (this.control) {
      toggleToken(this.control, 'aria-describedby', this.hintId, Boolean(this.hint));
    }
  }

  unbind() {
    this.controller?.removeRenderer(this);
  }

  /**
   * Renders the validation results of the elements inside the field (`ValidationRenderer` implementation).
   * @param {RenderInstruction} instruction the render instruction sent by the validation controller
   */
  render(instruction) {
    const unrendered = new Set(instruction.unrender.map(({ result }) => result));
    const errors = this.errors.filter(error => !unrendered.has(error.result));
    /** @type {Set<Element>} */
    const elements = new Set();

    for (const { elements: targets } of instruction.unrender) {
      for (const target of this.inside(targets)) {
        elements.add(target);
      }
    }

    for (const { result, elements: targets } of instruction.render) {
      for (const target of this.inside(targets)) {
        elements.add(target);
        if (!result.valid) {
          errors.push({ result, element: target });
        }
      }
    }

    for (const element of elements) {
      const invalid = errors.some(error => error.element === element);
      element.classList.toggle('is-invalid', invalid);
      element.setAttribute('aria-invalid', String(invalid));
      toggleToken(element, 'aria-describedby', this.errorId, invalid);
    }

    this.errors = errors;
  }

  /**
   * Keeps the elements located inside the field.
   * @param {Element[]} elements the elements to filter
   * @returns {Element[]} the elements inside the field
   */
  inside(elements) {
    return elements.filter(element => this.element.contains(element));
  }
}
