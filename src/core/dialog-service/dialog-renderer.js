import { DOM } from 'aurelia-framework';
import { Modal, Offcanvas } from 'bootstrap';

import { generateUniqueId } from '../functions';

/** @typedef {import('types').DialogRendererOptions} DialogRendererOptions */

/** dialogs currently open, the last one on top @type {DialogRenderer[]} */
const openDialogs = [];

/**
 * Renders the  modal or offcanvas dialog in bootstrap 5.
 * @category dialog
 */
export class DialogRenderer {
  /** html div element used as host of the dialog @type {HTMLDivElement} */
  _hostDiv;

  /** javascript bs object @type {Offcanvas | Modal} */
  _modal;

  /** element focused before the dialog opened, focused again when it closes @type {Element} */
  _opener;

  /**
   * Creates the div container of the dialog instance.
   * @param {DialogRendererOptions} options dialog rendering options
   * @returns {HTMLDivElement} html div element
   */
  createHost(options) {
    const { mode = 'modal', position = 'start' } = options;
    if (!['modal', 'offcanvas'].includes(mode))
      throw new Error(
        `DialogService usage: invalid mode specified: only 'modal' and 'offcanvas' are supported!`
      );
    if (mode === 'offcanvas' && !['start', 'end', 'bottom', 'top'].includes(position))
      throw new Error(
        `DialogService usage: invalid position specified for offcanvas mode: only 'start', 'end', 'top' and 'bottom' are supported!`
      );
    this._hostDiv = /** @type {HTMLDivElement} */ (DOM.createElement('div'));
    const css = mode === 'modal' ? 'modal fade' : `offcanvas offcanvas-${position}`;
    this._hostDiv.setAttribute('class', css);
    // focusable, so that bootstrap moves the focus into the dialog when it opens
    this._hostDiv.setAttribute('tabindex', '-1');
    document.body.insertBefore(this._hostDiv, null);
    return this._hostDiv;
  }

  /**
   * Opens the dialog instance, above the dialogs already open.
   * @param {DialogRendererOptions} options dialog rendering options
   * @returns {Promise<void>} await closing
   */
  async open(options) {
    const { mode = 'modal', locked, fullscreen } = options;
    this.nameByTitle();
    this._opener = document.activeElement;
    this._modal =
      mode === 'offcanvas'
        ? new Offcanvas(this._hostDiv, { backdrop: locked ? 'static' : true })
        : new Modal(this._hostDiv, { backdrop: locked ? 'static' : true });
    if (mode === 'modal' && fullscreen)
      this._hostDiv.querySelector('.modal-dialog')?.classList.add('modal-fullscreen');
    // the focus trap of the dialog below would pull back the focus that bootstrap moves into this dialog
    openDialogs.at(-1)?._focusTrap?.deactivate();
    const level = openDialogs.push(this) - 1;
    this._modal.show();
    if (level) {
      // bootstrap gives the same z-index to every modal (1055) and backdrop (1050): raise this pair above the dialog below
      const zIndex = 1055 + 10 * level;
      this._hostDiv.style.zIndex = `${zIndex}`;
      const backdrop = [...document.querySelectorAll('.modal-backdrop, .offcanvas-backdrop')].at(-1);
      /** @type {HTMLElement} */ (backdrop).style.zIndex = `${zIndex - 1}`;
    }
    return new Promise(resolve => {
      const eventName = mode === 'modal' ? 'hidden.bs.modal' : 'hidden.bs.offcanvas';
      this._hostDiv.addEventListener(eventName, () => {
        const wasOnTop = openDialogs.at(-1) === this;
        openDialogs.splice(openDialogs.indexOf(this), 1);
        this.destroy();
        openDialogs.at(-1)?._restoreFocusTrap();
        if (wasOnTop && this._opener?.isConnected) /** @type {HTMLElement} */ (this._opener).focus();
        resolve();
      });
    });
  }

  /**
   * Names the dialog with its title (`.modal-title` or `.offcanvas-title`) through `aria-labelledby`, as the WAI-ARIA
   * dialog pattern requires, unless the view names it itself.
   */
  nameByTitle() {
    const title = this._hostDiv.querySelector('.modal-title, .offcanvas-title');
    if (!title || this._hostDiv.hasAttribute('aria-labelledby') || this._hostDiv.hasAttribute('aria-label'))
      return;
    title.id ||= `dialog-title-${generateUniqueId()}`;
    this._hostDiv.setAttribute('aria-labelledby', title.id);
  }

  /**
   * Focus trap of the dialog (private bootstrap member, shared by Modal and Offcanvas).
   * @returns {{ activate: () => void, deactivate: () => void } | undefined} focus trap
   */
  get _focusTrap() {
    // @ts-ignore
    return this._modal?._focustrap;
  }

  /**
   * Re-arms the focus trap of the dialog: bootstrap's focus traps share one document listener,
   * so closing a stacked dialog also disarms the trap of the dialog below.
   */
  _restoreFocusTrap() {
    const trap = this._focusTrap;
    if (!trap) return;
    const focused = document.activeElement;
    trap.deactivate();
    trap.activate(); // focuses the dialog
    if (this._hostDiv.contains(focused)) /** @type {HTMLElement} */ (focused).focus();
  }

  /**
   * Closes the dialog instance.
   */
  hide() {
    if (this._modal && this._hostDiv?.isConnected) {
      try {
        this._modal.hide();
      } catch {
        /* empty */
      }
    }
  }

  /**
   * Destroys the dialog instance and associated resources.
   */

  destroy() {
    if (this._modal) {
      this._modal.dispose();
      this._modal = undefined;
    }
    if (this._hostDiv?.parentNode) {
      this._hostDiv.remove();
      this._hostDiv = undefined;
    }
  }

  /**
   * Get the html div element that hosts the dialog instance.
   * @returns {HTMLDivElement} html div element
   */
  getHost() {
    return this._hostDiv;
  }
}
