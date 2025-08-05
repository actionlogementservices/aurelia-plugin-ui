import { DOM } from 'aurelia-framework';
import { Modal, Offcanvas } from 'bootstrap';

/** @typedef {import('types').DialogRendererOptions} DialogRendererOptions */

/**
 * Renders the modal dialog in bootstrap 5.
 * @category dialog
 */
export class DialogRenderer {
  /** @type {HTMLDivElement} */
  _hostDiv;

  /** @type {Offcanvas | Modal} */
  _modal;

  /**
   * Creates the div container of the modal dialog
   * @param {DialogRendererOptions} options prevents close when clicked outside
   * @returns {HTMLDivElement} div element
   */
  createHost(options) {
    const { mode = 'modal', position = 'start' } = options;
    if (!['modal', 'offcanvas'].includes(mode))
      throw new Error(`DialogService: invalid mode specified: only 'modal' and 'offcanvas' are supported!`);
    if (mode === 'offcanvas' && !['start', 'end', 'bottom', 'top'].includes(position))
      throw new Error(
        `DialogService: invalid position specified for offcanvas mode: only 'start', 'end', 'top' and 'bottom' are supported!`
      );
    // @ts-ignore
    this._hostDiv = DOM.createElement('div');
    const css = mode === 'modal' ? 'modal fade' : `offcanvas offcanvas-${position}`;
    this._hostDiv.setAttribute('class', css);
    document.body.insertBefore(this._hostDiv, null);
    return this._hostDiv;
  }

  /**
   * Opens the modal dialog.
   * @param {DialogRendererOptions} options prevents close when clicked outside
   * @returns {Promise<void>} await closing
   */
  async open(options) {
    const { mode = 'modal', locked, fullscreen } = options;
    this._modal =
      mode === 'offcanvas'
        ? new Offcanvas(this._hostDiv, { backdrop: locked ? 'static' : true })
        : new Modal(this._hostDiv, { backdrop: locked ? 'static' : true });
    if (mode === 'modal' && fullscreen)
      this._hostDiv.querySelector('.modal-dialog').classList.add('modal-fullscreen');
    this._modal.show();
    return new Promise((resolve, _reject) => {
      const eventName = mode === 'modal' ? 'hidden.bs.modal' : 'hidden.bs.offcanvas';
      this._hostDiv.addEventListener(eventName, () => {
        this.destroy();
        resolve();
      });
    });
  }

  /**
   * Hides the modal dialog.
   */
  hide() {
    this._modal.hide();
  }

  /**
   * Destroy the modal dialog and associated resources.
   */
  destroy() {
    this._modal.dispose();
    this._hostDiv.remove();
  }
}
