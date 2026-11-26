import { DOM, bindable, bindingMode, inject } from 'aurelia-framework';

/**
 * Implements the **`lock` custom element** that displays a logic lock preventing user from interaction.
 *
 * While locked, the rest of the page is `inert` (out of the tab order and of the accessibility tree, like behind a
 * modal dialog), screen readers announce the wait, and the focus goes back to the element that had it on unlock.
 * @category element
 */
@inject(DOM.Element)
export class LockCustomElement {
  /**
   * Is the lock active?
   * @type {boolean}
   */
  @bindable({ defaultBindingMode: bindingMode.toView })
  locked = false;

  /** Elements made inert by the lock. @type {Element[]} */
  inertElements = [];

  /** Element focused when the lock was activated. @type {HTMLElement | undefined} */
  focusedElement;

  /**
   * Creates an instance of LockCustomElement.
   * @param {Element} element the custom element
   */
  constructor(element) {
    this.element = element;
  }

  attached() {
    this.lockedChanged();
  }

  detached() {
    this.release();
  }

  lockedChanged() {
    if (!this.locked) {
      this.release();
    } else if (this.element.isConnected && this.inertElements.length === 0) {
      this.focusedElement = /** @type {HTMLElement} */ (document.activeElement);
      // every element of the page but the lock and its ancestors
      for (let node = this.element; node.parentElement && node !== document.body; node = node.parentElement) {
        for (const sibling of node.parentElement.children) {
          if (sibling !== node && !sibling.hasAttribute('inert')) {
            sibling.toggleAttribute('inert', true);
            this.inertElements.push(sibling);
          }
        }
      }
    }
  }

  /**
   * Releases the elements made inert by the lock, and gives the focus back to the element that had it.
   */
  release() {
    for (const element of this.inertElements) {
      element.removeAttribute('inert');
    }
    this.inertElements = [];
    if (this.focusedElement?.isConnected && document.activeElement === document.body) {
      this.focusedElement.focus();
    }
    this.focusedElement = undefined;
  }
}
