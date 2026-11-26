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

  /** Applied to the toggle button to expose invalid state to assistive technology. @type {boolean|'true'|'false'} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  ariaInvalid;

  /** Accessible name of the dropdown menu (a list), instead of the content of the toggle button. @type {string} */
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
  /**
   * Keydown listener of the window, in the capture phase: it runs before bootstrap's one, which listens to the
   * document in the capture phase too and stops the arrows of the toggle button and of the menu.
   * @type {(event: KeyboardEvent) => void}
   */
  _handleKeydown = event => {
    if (this._container.contains(/** @type {Node} */ (event.target)) && !this.handleKeydown(event)) {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  /**
   * Observes the menu for projected content added after `attached()`, e.g. from async-bound `repeat.for` items.
   * @type {MutationObserver}
   */
  _menuObserver;

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
    // Projected content bound to async-populated data (e.g. `repeat.for` over items loaded after `attached()`)
    // can be inserted into the menu after this initial pass, so keep wrapping as it arrives.
    this._menuObserver = new MutationObserver(() => this.wrapChildren());
    this._menuObserver.observe(this._menu, { childList: true });
    this._dropdown = Dropdown.getOrCreateInstance(this._toggle, { autoClose: this.autoClose });
    this._toggle.addEventListener('show.bs.dropdown', this._handleShow);
    this._toggle.addEventListener('hide.bs.dropdown', this._handleHide);
    this._container.ownerDocument.defaultView.addEventListener('keydown', this._handleKeydown, true);
  }

  /**
   * Wraps the children of the dropdown menu in `<li>` elements, the only children allowed in a list: a
   * `<li class="dropdown-item">` for the content, a plain `<li>` for a bootstrap element such as a `dropdown-divider`.
   */
  wrapChildren() {
    const children = Array.from(this._menu.children).filter(child => child.tagName !== 'LI');

    for (const child of children) {
      const item = document.createElement('li');
      if (!child.className.startsWith('dropdown-')) item.className = 'dropdown-item';
      child.replaceWith(item);
      item.append(child);
    }
  }

  /**
   * Moves the focus between the controls of the menu with the arrows, `Home` and `End` (cycling), the arrows of the
   * toggle button opening the menu on the first or last control. Bootstrap moves the focus between `.dropdown-item`
   * elements, which are not focusable here (the `<li>` wrapping the content), and ignores the arrows on an input;
   * `Escape` is left to bootstrap, which closes the menu and focuses the toggle button.
   * @param {KeyboardEvent} event keydown event of the toggle button or the menu
   * @returns {boolean} false when the key has been handled
   */
  handleKeydown(event) {
    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
    const onToggle = event.target === this._toggle;
    if (!keys.includes(event.key) || (onToggle && !event.key.startsWith('Arrow'))) return true;
    if (onToggle) this.show();
    /** @type {HTMLElement[]} */
    const controls = Array.from(
      this._menu.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter(control => !control.matches(':disabled'));
    if (controls.length === 0) return false;
    const index = controls.indexOf(/** @type {HTMLElement} */ (event.target));
    const last = controls.length - 1;
    const next = {
      Home: 0,
      End: last,
      ArrowDown: index === last ? 0 : index + 1,
      ArrowUp: index <= 0 ? last : index - 1
    }[event.key];
    controls[next].focus();
    return false;
  }

  /**
   * Defines the logic triggered when the custom element is removed from the DOM.
   */
  detached() {
    this._menuObserver?.disconnect();
    this._container.ownerDocument.defaultView.removeEventListener('keydown', this._handleKeydown, true);
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
