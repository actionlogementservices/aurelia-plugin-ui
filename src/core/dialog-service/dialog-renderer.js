import { DOM } from 'aurelia-framework';
import { Modal, Offcanvas } from 'bootstrap';

/** @typedef {import('types').DialogRendererOptions} DialogRendererOptions */

/**
 * Renders the  modal or offcanvas dialog in bootstrap 5.
 * @category dialog
 */
export class DialogRenderer {
  /** html div element used as host of the dialog @type {HTMLDivElement} */
  _hostDiv;

  /** javascript bs object @type {Offcanvas | Modal} */
  _modal;

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
    document.body.insertBefore(this._hostDiv, null);
    return this._hostDiv;
  }

  /**
   * Opens the dialog instance.
   * @param {DialogRendererOptions} options dialog rendering options
   * @returns {Promise<void>} await closing
   */
  async open(options) {
    const { mode = 'modal', locked, fullscreen } = options;
    this._modal =
      mode === 'offcanvas'
        ? new Offcanvas(this._hostDiv, { backdrop: locked ? 'static' : true })
        : new Modal(this._hostDiv, { backdrop: locked ? 'static' : true });
    if (mode === 'modal' && fullscreen)
      this._hostDiv.querySelector('.modal-dialog')?.classList.add('modal-fullscreen');
    this._modal.show();
    return new Promise(resolve => {
      const eventName = mode === 'modal' ? 'hidden.bs.modal' : 'hidden.bs.offcanvas';
      this._hostDiv.addEventListener(eventName, () => {
        this.destroy();
        resolve();
      });
    });
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
