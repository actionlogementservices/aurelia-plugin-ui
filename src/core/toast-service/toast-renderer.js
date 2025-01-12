import { DOM } from 'aurelia-framework';
import { Toast } from 'bootstrap';

/**
 * Renders the toast in bootstrap 5.
 * @category toast
 */
export class ToastRenderer {
  /** @type {HTMLElement} */ static _rootContainer;
  /** @type {Toast} */ _bsToast;

  /**
   * Creates or gets the div container that hosts toasts.
   * @returns {HTMLElement} html element
   */
  createOrGetRootHost() {
    if (!ToastRenderer._rootContainer) {
      // @ts-ignore
      ToastRenderer._rootContainer = DOM.createElement('div');
      ToastRenderer._rootContainer.setAttribute('class', 'toast-container position-fixed bottom-0 end-0 p-3');
      ToastRenderer._rootContainer.setAttribute('id', 'toastContainer');
      DOM.querySelector('body').append(ToastRenderer._rootContainer);
    }
    return ToastRenderer._rootContainer;
  }

  /**
   * Displays the toast.
   * @param {HTMLDivElement} toastHost the div container that hosts toasts
   * @param {number} [delay] delay before hiding toast
   * @returns {Promise<void>} await closing
   */
  async show(toastHost, delay) {
    this._bsToast = new Toast(toastHost, { delay });
    this._bsToast.show();
    return new Promise((resolve, _reject) => {
      toastHost.addEventListener('hidden.bs.toast', () => {
        toastHost.remove();
        resolve();
      });
    });
  }
}
