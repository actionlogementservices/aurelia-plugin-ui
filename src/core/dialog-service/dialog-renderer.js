import { DOM } from 'aurelia-framework';
import { Modal } from 'bootstrap';

/**
 * Renders the modal dialog in bootstrap 5.
 * @category dialog
 */
export class DialogRenderer {
  /** @type {HTMLDivElement} */
  _hostDiv;

  /**
   * Creates the div container of the modal dialog
   * @returns {HTMLDivElement} div element
   */
  createHost() {
    // @ts-ignore
    this._hostDiv = DOM.createElement('div');
    this._hostDiv.setAttribute('class', 'modal fade');
    return this._hostDiv;
  }

  /**
   * Opens the modal dialog.
   * @param {boolean} locked prevents close when clicked outside
   * @returns {Promise<void>} await closing
   */
  async open(locked = false) {
    this._modal = new Modal(this._hostDiv, { backdrop: locked ? 'static' : true });
    this._modal.show();
    return new Promise((resolve, _reject) => {
      this._hostDiv.addEventListener('hidden.bs.modal', () => {
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
