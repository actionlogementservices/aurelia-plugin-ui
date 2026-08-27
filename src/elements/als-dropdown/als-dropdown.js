import { DOM, inject, bindable, bindingMode, useView } from 'aurelia-framework';
import { Dropdown } from 'bootstrap';

import { generateUniqueId } from '../../core/functions';

/**
 * Implements the **`als-dropdown` custom element** that instantiates a generic bootstrap dropdown.
 * Any content placed inside the element is projected into the dropdown menu, and content placed inside
 * a `[slot="toggle"]` element is projected into the toggle button, letting the caller fully control the markup.
 * @category dropdown
 */
@useView('./als-dropdown.html')
@inject(DOM.Element)
export class AlsDropdown {
  /** Disable/Enable the toggle button. @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  disabled = false;

  /** Autosize the dropdown to the parent's width. @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  autosize = false;

  /** Bootstrap `autoClose` option (`true`, `false`, `'inside'` or `'outside'`). @type {boolean|'inside'|'outside'} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  autoClose = true;

  /** Css class(es) applied to the toggle button. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  toggleClass = '';

  /** Css class(es) applied to the dropdown menu. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  menuClass = '';

  /** Label displayed in the toggle button when no `toggle` slot content is provided. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  label = '';

  /** Accessible name applied to the toggle button, overriding its visible content. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  ariaLabel;

  /** Id(s) of the element(s) describing the toggle button, e.g. an error message. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  ariaDescribedby;

  /** Accessible name applied to the dropdown menu, e.g. to group a set of checkboxes. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  menuAriaLabel;

  /** Whether the dropdown menu is currently open, reflected in `aria-expanded`. @type {boolean} */
  expanded = false;

  /** Unique id to identify the custom element instance. @type {string} */ uniqueId = generateUniqueId();
  /** Html container of the custom element. @type {HTMLTemplateElement} */ _container;
  /** Html toggle button element. @type {HTMLButtonElement} */ _toggle;
  /** Html dropdown menu element. @type {HTMLUListElement} */ _menu;
  /** Bootstrap dropdown. @type {Dropdown} */ _dropdown;
  /** Bound handler used to track the dropdown open state. @type {() => void} */ _handleShow = () => {
    this.expanded = true;
  };
  /** Bound handler used to track the dropdown closed state. @type {() => void} */ _handleHide = () => {
    this.expanded = false;
  };

  /** onFocus @type {(event: FocusEvent) => void} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  onFocus;

  /** onBlur @type {(event: FocusEvent) => void} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  onBlur;

  /**
   * Creates an instance of the `als-dropdown` custom element.
   * @param {HTMLTemplateElement} element html template element
   */
  constructor(element) {
    this._container = element;
  }

  /**
   * Defines the logic triggered when the custom element is added to the DOM.
   */
  attached() {
    this._toggle = this._container.querySelector(`#toggle-${this.uniqueId}`);
    this._menu = this._container.querySelector(`#menu-${this.uniqueId}`);
    this.wrapChildren();
    this._dropdown = Dropdown.getOrCreateInstance(this._toggle, { autoClose: this.autoClose });
    this._toggle.addEventListener('show.bs.dropdown', this._handleShow);
    this._toggle.addEventListener('hide.bs.dropdown', this._handleHide);
  }

  /**
   * Wraps the children of the dropdown menu in `<li class="dropdown-item">` elements, as required by bootstrap.
   */
  wrapChildren() {
    const children = Array.from(this._menu.children).filter(
      child => child.nodeType === Node.ELEMENT_NODE && !/dropdown-/g.test(child.className)
    );

    for (const child of children) {
      const item = document.createElement('li');
      item.className = 'dropdown-item';
      child.replaceWith(item);
      item.append(child);
    }
  }

  /**
   * Defines the logic triggered when the custom element is removed from the DOM.
   */
  detached() {
    this._toggle.removeEventListener('show.bs.dropdown', this._handleShow);
    this._toggle.removeEventListener('hide.bs.dropdown', this._handleHide);
    this._dropdown?.dispose();
  }

  /**
   * Custom handler to handle focus event and call onFocus callback if provided.
   * @param {FocusEvent} event The focus event
   * @returns {boolean} true to continue processing, false to cancel
   */
  handleFocus(event) {
    if (this.onFocus) {
      this.onFocus(event);
    }

    return true;
  }

  /**
   * Custom handler to handle blur event and call onBlur callback if provided.
   * @param {FocusEvent} event The blur event
   * @returns {boolean} true to continue processing, false to cancel
   */
  handleBlur(event) {
    if (this.onBlur) {
      this.onBlur(event);
    }

    return true;
  }

  /**
   * Shows the dropdown menu.
   */
  show() {
    this._dropdown?.show();
  }

  /**
   * Hides the dropdown menu.
   */
  hide() {
    this._dropdown?.hide();
  }

  /**
   * Toggles the dropdown menu.
   */
  toggle() {
    this._dropdown?.toggle();
  }
}
